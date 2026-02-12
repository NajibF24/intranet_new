from fastapi import APIRouter, Depends, HTTPException
from typing import List
from models.album import AlbumCreate, AlbumUpdate, AlbumResponse, PhotoResponse
from auth import get_current_user
from database import db
import uuid
from datetime import datetime, timezone

router = APIRouter(prefix="/albums", tags=["Albums"])


@router.get("", response_model=List[AlbumResponse])
async def get_albums(limit: int = 50):
    albums = await db.albums.find({}, {"_id": 0}).sort("created_at", -1).to_list(limit)
    result = []
    for album in albums:
        photo_count = await db.photos.count_documents({"album_id": album["id"]})
        album["photo_count"] = photo_count
        result.append(AlbumResponse(**album))
    return result


@router.get("/{album_id}", response_model=AlbumResponse)
async def get_album_by_id(album_id: str):
    album = await db.albums.find_one({"id": album_id}, {"_id": 0})
    if not album:
        raise HTTPException(status_code=404, detail="Album not found")
    photo_count = await db.photos.count_documents({"album_id": album_id})
    album["photo_count"] = photo_count
    return AlbumResponse(**album)


@router.get("/{album_id}/photos", response_model=List[PhotoResponse])
async def get_album_photos(album_id: str):
    photos = await db.photos.find({"album_id": album_id}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return photos


@router.post("", response_model=AlbumResponse)
async def create_album(album: AlbumCreate, current_user: dict = Depends(get_current_user)):
    album_id = str(uuid.uuid4())
    album_doc = {
        "id": album_id,
        **album.model_dump(),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.albums.insert_one(album_doc)
    return AlbumResponse(**album_doc, photo_count=0)


@router.put("/{album_id}", response_model=AlbumResponse)
async def update_album(album_id: str, album: AlbumUpdate, current_user: dict = Depends(get_current_user)):
    update_data = {k: v for k, v in album.model_dump().items() if v is not None}
    result = await db.albums.update_one({"id": album_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Album not found")
    updated = await db.albums.find_one({"id": album_id}, {"_id": 0})
    photo_count = await db.photos.count_documents({"album_id": album_id})
    updated["photo_count"] = photo_count
    return AlbumResponse(**updated)


@router.delete("/{album_id}")
async def delete_album(album_id: str, current_user: dict = Depends(get_current_user)):
    result = await db.albums.delete_one({"id": album_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Album not found")
    await db.photos.update_many({"album_id": album_id}, {"$set": {"album_id": None}})
    return {"message": "Album deleted successfully"}
