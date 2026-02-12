from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from typing import List, Optional
from models.album import PhotoCreate, PhotoUpdate, PhotoResponse
from auth import get_current_user
from database import db
import uuid
import base64
from datetime import datetime, timezone

router = APIRouter(prefix="/photos", tags=["Photos"])


@router.get("", response_model=List[PhotoResponse])
async def get_photos(album_id: Optional[str] = None, limit: int = 50):
    query = {}
    if album_id:
        query["album_id"] = album_id
    photos = await db.photos.find(query, {"_id": 0}).sort("created_at", -1).to_list(limit)
    result = []
    for photo in photos:
        if photo.get("album_id"):
            album = await db.albums.find_one({"id": photo["album_id"]}, {"_id": 0})
            photo["album_title"] = album.get("title") if album else None
        result.append(PhotoResponse(**photo))
    return result


@router.get("/{photo_id}", response_model=PhotoResponse)
async def get_photo_by_id(photo_id: str):
    photo = await db.photos.find_one({"id": photo_id}, {"_id": 0})
    if not photo:
        raise HTTPException(status_code=404, detail="Photo not found")
    if photo.get("album_id"):
        album = await db.albums.find_one({"id": photo["album_id"]}, {"_id": 0})
        photo["album_title"] = album.get("title") if album else None
    return PhotoResponse(**photo)


@router.post("", response_model=PhotoResponse)
async def create_photo(photo: PhotoCreate, current_user: dict = Depends(get_current_user)):
    photo_id = str(uuid.uuid4())
    photo_doc = {
        "id": photo_id,
        **photo.model_dump(),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.photos.insert_one(photo_doc)
    album_title = None
    if photo.album_id:
        album = await db.albums.find_one({"id": photo.album_id}, {"_id": 0})
        album_title = album.get("title") if album else None
    return PhotoResponse(**photo_doc, album_title=album_title)


@router.post("/upload")
async def upload_photo(file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    contents = await file.read()
    base64_data = base64.b64encode(contents).decode('utf-8')
    content_type = file.content_type or "image/jpeg"
    data_url = f"data:{content_type};base64,{base64_data}"
    return {"image_url": data_url, "filename": file.filename}


@router.put("/{photo_id}", response_model=PhotoResponse)
async def update_photo(photo_id: str, photo: PhotoUpdate, current_user: dict = Depends(get_current_user)):
    update_data = {k: v for k, v in photo.model_dump().items() if v is not None}
    result = await db.photos.update_one({"id": photo_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Photo not found")
    updated = await db.photos.find_one({"id": photo_id}, {"_id": 0})
    return PhotoResponse(**updated)


@router.delete("/{photo_id}")
async def delete_photo(photo_id: str, current_user: dict = Depends(get_current_user)):
    result = await db.photos.delete_one({"id": photo_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Photo not found")
    return {"message": "Photo deleted successfully"}
