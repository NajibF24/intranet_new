from fastapi import APIRouter, Depends, HTTPException
from models.user import UserCreate, UserLogin, UserResponse, UserUpdate
from auth import hash_password, verify_password, create_token, get_current_user
from auth_ldap import ldap_authenticate, LDAP_ENABLED
from database import db
from routes.logs import create_log
import uuid
from datetime import datetime, timezone

router = APIRouter(prefix="/auth", tags=["Auth"])


# ── Helper: upsert LDAP user ke MongoDB ──────────────────────
async def _upsert_ldap_user(ldap_info: dict) -> dict:
    """
    Simpan atau update user LDAP di MongoDB.
    - OU=MIS            → role "admin"
    - LDAP lain         → role "viewer" (kecuali sudah di-grant can_edit oleh admin)
    """
    email = ldap_info["email"]

    # Cek apakah user sudah ada di DB
    existing = await db.users.find_one({"email": email}, {"_id": 0})

    # Tentukan role berdasarkan OU
    auto_role = "admin" if ldap_info["is_mis"] else "viewer"

    if existing:
        # User sudah ada — update info AD, tapi jangan override role kalau sudah di-set manual
        # Kalau is_mis → selalu admin
        # Kalau bukan MIS → pertahankan role yang sudah ada (mungkin sudah di-grant editor oleh admin)
        final_role = "admin" if ldap_info["is_mis"] else existing.get("role", "viewer")
        update = {
            "name":      ldap_info["name"],
            "auth_type": "ldap",
            "ldap_ous":  ldap_info["ous"],
            "role":      final_role,
            "last_login": datetime.now(timezone.utc).isoformat(),
        }
        await db.users.update_one({"email": email}, {"$set": update})
        updated = await db.users.find_one({"email": email}, {"_id": 0, "password": 0})
        return updated
    else:
        # User baru dari LDAP — buat record di DB
        user_id = str(uuid.uuid4())
        user_doc = {
            "id":         user_id,
            "email":      email,
            "name":       ldap_info["name"],
            "role":       auto_role,
            "auth_type":  "ldap",
            "ldap_ous":   ldap_info["ous"],
            "can_edit":   ldap_info["is_mis"],  # MIS langsung dapat can_edit
            "permissions": [],
            "password":   "",  # LDAP user tidak punya password lokal
            "created_at": datetime.now(timezone.utc).isoformat(),
            "last_login": datetime.now(timezone.utc).isoformat(),
        }
        await db.users.insert_one(user_doc)
        return user_doc


# ── Register (local user) ─────────────────────────────────────
@router.post("/register", response_model=UserResponse)
async def register(user: UserCreate):
    existing = await db.users.find_one({"email": user.email}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user_id = str(uuid.uuid4())
    user_doc = {
        "id":          user_id,
        "email":       user.email,
        "password":    hash_password(user.password),
        "name":        user.name,
        "role":        user.role,
        "permissions": user.permissions,
        "auth_type":   "local",
        "can_edit":    user.role in ["admin", "editor"],
        "ldap_ous":    [],
        "created_at":  datetime.now(timezone.utc).isoformat()
    }
    await db.users.insert_one(user_doc)
    return UserResponse(**user_doc)


# ── Login (local + LDAP) ──────────────────────────────────────
@router.post("/login")
async def login(credentials: UserLogin):
    """
    Flow login:
    1. Coba cari di MongoDB dulu
       a. Kalau ketemu & auth_type=local → verify password lokal
       b. Kalau ketemu & auth_type=ldap  → auth via LDAP
    2. Kalau tidak ketemu di DB → coba LDAP langsung
    3. Kalau LDAP disabled & tidak ada di DB → 401
    """

    # Ekstrak username dari email (untuk LDAP)
    # Support: user@gyssteel.com → "user", atau langsung "user"
    username = credentials.email.split("@")[0] if "@" in credentials.email else credentials.email

    # Cek DB dulu
    db_user = await db.users.find_one(
        {"$or": [{"email": credentials.email}, {"email": f"{username}@gyssteel.com"}]},
        {"_id": 0}
    )

    # ── Case 1: User lokal di DB ──────────────────────────────
    if db_user and db_user.get("auth_type", "local") == "local":
        if not verify_password(credentials.password, db_user.get("password", "")):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        token = create_token(db_user["id"], db_user["email"], db_user["role"])
        await db.users.update_one({"id": db_user["id"]}, {"$set": {"last_login": datetime.now(timezone.utc).isoformat()}})
        await create_log(db_user["email"], db_user.get("name", ""), "login", "auth", "Local login")
        return _build_login_response(token, db_user)

    # ── Case 2 & 3: Coba LDAP ────────────────────────────────
    if LDAP_ENABLED:
        ldap_info = ldap_authenticate(username, credentials.password)
        if ldap_info:
            user_doc = await _upsert_ldap_user(ldap_info)
            token = create_token(user_doc["id"], user_doc["email"], user_doc["role"])
            await create_log(user_doc["email"], user_doc.get("name", ""), "login", "auth",
                             f"LDAP login | OU: {','.join(ldap_info['ous'])} | MIS: {ldap_info['is_mis']}")
            return _build_login_response(token, user_doc)

    raise HTTPException(status_code=401, detail="Invalid credentials")


def _build_login_response(token: str, user: dict) -> dict:
    """Build response login yang konsisten."""
    return {
        "token": token,
        "user": UserResponse(
            id=user["id"],
            email=user["email"],
            name=user["name"],
            role=user["role"],
            permissions=user.get("permissions", []),
            auth_type=user.get("auth_type", "local"),
            can_edit=user.get("can_edit", user.get("role") in ["admin", "editor"]),
            ldap_ous=user.get("ldap_ous", []),
        )
    }


# ── Get current user ──────────────────────────────────────────
@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    user = await db.users.find_one({"id": current_user["user_id"]}, {"_id": 0, "password": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserResponse(**user)


# ── Grant / Revoke edit access (admin only) ───────────────────
@router.patch("/users/{user_id}/grant-edit")
async def grant_edit_access(user_id: str, current_user: dict = Depends(get_current_user)):
    """Admin grant akses edit ke LDAP viewer."""
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

    target = await db.users.find_one({"id": user_id}, {"_id": 0})
    if not target:
        raise HTTPException(status_code=404, detail="User not found")

    await db.users.update_one(
        {"id": user_id},
        {"$set": {"can_edit": True, "role": "editor"}}
    )
    await create_log(
        current_user["email"], current_user.get("user_id", ""),
        "grant_edit", "admin", f"Granted edit access to: {target['email']}"
    )
    return {"message": f"Edit access granted to {target['email']}"}


@router.patch("/users/{user_id}/revoke-edit")
async def revoke_edit_access(user_id: str, current_user: dict = Depends(get_current_user)):
    """Admin revoke akses edit dari user."""
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

    target = await db.users.find_one({"id": user_id}, {"_id": 0})
    if not target:
        raise HTTPException(status_code=404, detail="User not found")

    # Jangan revoke MIS user
    if target.get("auth_type") == "ldap" and "MIS" in " ".join(target.get("ldap_ous", [])).upper():
        raise HTTPException(status_code=400, detail="Cannot revoke MIS member admin access")

    await db.users.update_one(
        {"id": user_id},
        {"$set": {"can_edit": False, "role": "viewer"}}
    )
    await create_log(
        current_user["email"], current_user.get("user_id", ""),
        "revoke_edit", "admin", f"Revoked edit access from: {target['email']}"
    )
    return {"message": f"Edit access revoked from {target['email']}"}
