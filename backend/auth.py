from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from datetime import datetime, timezone
import hashlib
import jwt
import os

JWT_SECRET = os.environ.get('JWT_SECRET', 'gys-intranet-secret-key-2024')
JWT_ALGORITHM = "HS256"

security = HTTPBearer(auto_error=False)


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def verify_password(password: str, hashed: str) -> bool:
    return hash_password(password) == hashed


def create_token(user_id: str, email: str, role: str) -> str:
    payload = {
        "user_id": user_id,
        "email": email,
        "role": role,
        "exp": datetime.now(timezone.utc).timestamp() + 86400
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


def require_permission(section: str):
    """Dependency factory: checks user has write access to a CMS section.
    Admin always passes. Viewer always blocked. Editor needs the section in permissions."""
    async def checker(current_user: dict = Depends(get_current_user)):
        if current_user.get("role") == "admin":
            return current_user
        from database import db
        user = await db.users.find_one({"id": current_user["user_id"]}, {"_id": 0, "password": 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        if user.get("role") == "viewer":
            raise HTTPException(status_code=403, detail="Viewers have read-only access")
        if section not in user.get("permissions", []):
            raise HTTPException(status_code=403, detail=f"No permission for {section}")
        return current_user
    return checker
