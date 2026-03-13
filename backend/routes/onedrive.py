"""
Microsoft Graph API — OneDrive document listing + upload
Simpan di: backend/routes/onedrive.py
"""

from fastapi import APIRouter, HTTPException, UploadFile, File
import httpx, os, time

router = APIRouter(prefix="/onedrive", tags=["OneDrive"])

TENANT_ID     = os.environ.get("MS_TENANT_ID", "")
CLIENT_ID     = os.environ.get("MS_CLIENT_ID", "")
CLIENT_SECRET = os.environ.get("MS_CLIENT_SECRET", "")
ONEDRIVE_USER = os.environ.get("MS_ONEDRIVE_USER_ID", "")
ROOT_FOLDER   = os.environ.get("MS_ONEDRIVE_ROOT_FOLDER", "GYS Procedures")
SP_SITE_ID    = os.environ.get("MS_SHAREPOINT_SITE_ID", "")

GRAPH_BASE = "https://graph.microsoft.com/v1.0"
TOKEN_URL  = f"https://login.microsoftonline.com/{TENANT_ID}/oauth2/v2.0/token"

MAX_FILE_SIZE    = 50 * 1024 * 1024   # 50MB
SMALL_FILE_LIMIT =  4 * 1024 * 1024   # 4MB
ALLOWED_EXT      = {".pdf"}

_cache: dict = {"token": None, "exp": 0}


async def get_token() -> str:
    now = time.time()
    if _cache["token"] and now < _cache["exp"] - 60:
        return _cache["token"]
    if not all([TENANT_ID, CLIENT_ID, CLIENT_SECRET]):
        raise HTTPException(503, "MS Graph credentials not configured.")
    async with httpx.AsyncClient() as c:
        r = await c.post(TOKEN_URL, data={
            "grant_type":    "client_credentials",
            "client_id":     CLIENT_ID,
            "client_secret": CLIENT_SECRET,
            "scope":         "https://graph.microsoft.com/.default",
        })
    if r.status_code != 200:
        raise HTTPException(502, f"Token error: {r.text}")
    data = r.json()
    _cache["token"] = data["access_token"]
    _cache["exp"]   = time.time() + data.get("expires_in", 3600)
    return _cache["token"]


def _h(token: str) -> dict:
    return {"Authorization": f"Bearer {token}"}


def _enc(path: str) -> str:
    return path.replace(" ", "%20").replace("&", "%26").replace("(", "%28").replace(")", "%29")


def _children_by_path(path: str) -> str:
    e = _enc(path)
    if SP_SITE_ID:
        return f"{GRAPH_BASE}/sites/{SP_SITE_ID}/drive/root:/{e}:/children"
    return f"{GRAPH_BASE}/users/{ONEDRIVE_USER}/drive/root:/{e}:/children"


def _children_by_id(item_id: str) -> str:
    if SP_SITE_ID:
        return f"{GRAPH_BASE}/sites/{SP_SITE_ID}/drive/items/{item_id}/children"
    return f"{GRAPH_BASE}/users/{ONEDRIVE_USER}/drive/items/{item_id}/children"


def _item_url(item_id: str) -> str:
    if SP_SITE_ID:
        return f"{GRAPH_BASE}/sites/{SP_SITE_ID}/drive/items/{item_id}"
    return f"{GRAPH_BASE}/users/{ONEDRIVE_USER}/drive/items/{item_id}"


def _upload_url(folder_path: str, filename: str) -> str:
    """PUT upload URL untuk file <= 4MB."""
    e_path = _enc(folder_path)
    e_name = _enc(filename)
    if SP_SITE_ID:
        return f"{GRAPH_BASE}/sites/{SP_SITE_ID}/drive/root:/{e_path}/{e_name}:/content"
    return f"{GRAPH_BASE}/users/{ONEDRIVE_USER}/drive/root:/{e_path}/{e_name}:/content"


def _session_url(folder_path: str, filename: str) -> str:
    """Upload session URL untuk file > 4MB."""
    e_path = _enc(folder_path)
    e_name = _enc(filename)
    if SP_SITE_ID:
        return f"{GRAPH_BASE}/sites/{SP_SITE_ID}/drive/root:/{e_path}/{e_name}:/createUploadSession"
    return f"{GRAPH_BASE}/users/{ONEDRIVE_USER}/drive/root:/{e_path}/{e_name}:/createUploadSession"


def _categorize(name: str) -> str:
    n = name.lower()
    if any(k in n for k in ["policy", "kebijakan", "pol_", "_pol"]):
        return "policy"
    if any(k in n for k in ["form", "template", "formulir", "frm_", "_frm"]):
        return "form"
    return "procedure"


def _make_doc(item: dict, subfolder: str = "") -> dict:
    return {
        "id":            item["id"],
        "name":          item["name"],
        "size":          item.get("size", 0),
        "category":      _categorize(item["name"]),
        "last_modified": item.get("lastModifiedDateTime"),
        "web_url":       item.get("webUrl"),
        "mime_type":     item.get("file", {}).get("mimeType", ""),
        "subfolder":     subfolder,
    }


async def _fetch_children(url: str, token: str) -> list:
    items, next_url = [], url
    async with httpx.AsyncClient(timeout=20) as c:
        while next_url:
            r = await c.get(next_url, headers=_h(token))
            if r.status_code == 404:
                return []
            if r.status_code != 200:
                raise HTTPException(502, f"Graph API {r.status_code}: {r.text}")
            data = r.json()
            items.extend(data.get("value", []))
            next_url = data.get("@odata.nextLink")
    return items


async def _list_recursive(path: str, token: str) -> list:
    docs = []
    root_items = await _fetch_children(_children_by_path(path), token)
    for item in root_items:
        if "file" in item:
            docs.append(_make_doc(item, subfolder=""))
        elif "folder" in item:
            sub_items = await _fetch_children(_children_by_id(item["id"]), token)
            for sub in sub_items:
                if "file" in sub:
                    docs.append(_make_doc(sub, subfolder=item["name"]))
    return docs


async def _do_upload_small(content: bytes, url: str, token: str) -> dict:
    async with httpx.AsyncClient(timeout=60) as c:
        r = await c.put(url, content=content, headers={
            "Authorization": f"Bearer {token}",
            "Content-Type":  "application/pdf",
        })
    if r.status_code not in (200, 201):
        raise HTTPException(502, f"Upload failed: {r.text}")
    return r.json()


async def _do_upload_large(content: bytes, session_url: str, token: str, filename: str) -> dict:
    # Create session
    async with httpx.AsyncClient(timeout=30) as c:
        r = await c.post(session_url, json={
            "item": {"@microsoft.graph.conflictBehavior": "rename", "name": filename}
        }, headers={**_h(token), "Content-Type": "application/json"})
    if r.status_code != 200:
        raise HTTPException(502, f"Cannot create upload session: {r.text}")

    upload_url = r.json().get("uploadUrl")
    if not upload_url:
        raise HTTPException(502, "No uploadUrl in session response")

    # Upload in 5MB chunks
    chunk_size = 5 * 1024 * 1024
    total      = len(content)
    offset     = 0

    async with httpx.AsyncClient(timeout=120) as c:
        while offset < total:
            chunk = content[offset: offset + chunk_size]
            end   = offset + len(chunk) - 1
            r = await c.put(upload_url, content=chunk, headers={
                "Content-Range":  f"bytes {offset}-{end}/{total}",
                "Content-Length": str(len(chunk)),
            })
            if r.status_code == 202:
                offset += len(chunk)
                continue
            if r.status_code in (200, 201):
                return r.json()
            raise HTTPException(502, f"Chunk upload failed at byte {offset}: {r.text}")

    raise HTTPException(502, "Upload incomplete")


# ── Endpoints ─────────────────────────────────────────────────

@router.get("/health")
async def health():
    return {
        "configured": all([TENANT_ID, CLIENT_ID, CLIENT_SECRET]),
        "mode":        "sharepoint" if SP_SITE_ID else "onedrive_user",
        "root_folder": ROOT_FOLDER,
    }


@router.get("/documents/{dept_folder:path}")
async def list_documents(dept_folder: str):
    token = await get_token()
    full  = f"{ROOT_FOLDER}/{dept_folder}"
    try:
        docs = await _list_recursive(full, token)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Error: {str(e)}")
    return {"dept_folder": dept_folder, "documents": docs, "total": len(docs)}


@router.post("/upload/{dept_folder:path}")
async def upload_document(dept_folder: str, file: UploadFile = File(...)):
    """Upload PDF ke folder departemen di OneDrive."""
    filename = file.filename or "document.pdf"
    ext      = os.path.splitext(filename)[1].lower()

    if ext not in ALLOWED_EXT:
        raise HTTPException(400, f"Hanya file PDF yang diizinkan. File: {filename}")

    content = await file.read()

    if not content:
        raise HTTPException(400, "File kosong")
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(400, f"File terlalu besar: {len(content)/(1024*1024):.1f}MB. Maksimal 50MB")

    token     = await get_token()
    full_path = f"{ROOT_FOLDER}/{dept_folder}"

    try:
        if len(content) <= SMALL_FILE_LIMIT:
            result = await _do_upload_small(content, _upload_url(full_path, filename), token)
        else:
            result = await _do_upload_large(content, _session_url(full_path, filename), token, filename)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Upload error: {str(e)}")

    return {
        "message":  "File berhasil diupload",
        "filename": result.get("name", filename),
        "size":     result.get("size", len(content)),
        "web_url":  result.get("webUrl", ""),
        "id":       result.get("id", ""),
    }


@router.get("/subfolders/{dept_folder:path}")
async def list_subfolders(dept_folder: str):
    """List semua subfolder di dalam folder departemen."""
    token = await get_token()
    full  = f"{ROOT_FOLDER}/{dept_folder}"
    items = await _fetch_children(_children_by_path(full), token)
    folders = [
        {"id": i["id"], "name": i["name"]}
        for i in items if "folder" in i
    ]
    return {"dept_folder": dept_folder, "subfolders": folders}


@router.get("/stream/{item_id}")
async def stream_file(item_id: str):
    """Stream file content from OneDrive to frontend (bypasses iframe CORS block)."""
    from fastapi.responses import StreamingResponse
    import re as _re

    token = await get_token()

    # 1. Get file metadata + download URL
    meta_url = (
        f"https://graph.microsoft.com/v1.0/users/{ONEDRIVE_USER}"
        f"/drive/items/{item_id}?select=id,name,size,file"
    )
    async with httpx.AsyncClient() as client:
        meta = await client.get(meta_url, headers={"Authorization": f"Bearer {token}"})
    if meta.status_code != 200:
        raise HTTPException(status_code=404, detail="File not found")
    meta_data = meta.json()
    name = meta_data.get("name", "file")
    mime = meta_data.get("file", {}).get("mimeType", "application/octet-stream")

    # 2. Get direct download URL (no redirect auth issues)
    dl_url = (
        f"https://graph.microsoft.com/v1.0/users/{ONEDRIVE_USER}"
        f"/drive/items/{item_id}/content"
    )

    # 3. Stream response
    async def file_stream():
        async with httpx.AsyncClient(follow_redirects=True) as client:
            async with client.stream(
                "GET", dl_url,
                headers={"Authorization": f"Bearer {token}"}
            ) as response:
                async for chunk in response.aiter_bytes(chunk_size=65536):
                    yield chunk

    safe_name = _re.sub(r'[^\w\s\-.]', '_', name)
    return StreamingResponse(
        file_stream(),
        media_type=mime,
        headers={
            "Content-Disposition": f'inline; filename="{safe_name}"',
            "Cache-Control": "private, max-age=300",
            "X-Frame-Options": "SAMEORIGIN",
        }
    )


@router.get("/download-url/{item_id}")
async def download_url(item_id: str):
    token = await get_token()
    async with httpx.AsyncClient(timeout=10) as c:
        r = await c.get(_item_url(item_id), headers=_h(token))
    if r.status_code != 200:
        raise HTTPException(502, f"Cannot get item: {r.text}")
    data = r.json()
    url  = data.get("@microsoft.graph.downloadUrl") or data.get("webUrl", "")
    return {"download_url": url}
