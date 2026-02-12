from pydantic import BaseModel, ConfigDict
from typing import Optional


class AlbumCreate(BaseModel):
    title: str
    description: Optional[str] = None
    cover_image_url: Optional[str] = None


class AlbumUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    cover_image_url: Optional[str] = None


class AlbumResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    title: str
    description: Optional[str] = None
    cover_image_url: Optional[str] = None
    photo_count: int = 0
    created_at: str


class PhotoCreate(BaseModel):
    title: str
    description: Optional[str] = None
    image_url: str
    album_id: Optional[str] = None


class PhotoUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    album_id: Optional[str] = None


class PhotoResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    title: str
    description: Optional[str] = None
    image_url: str
    album_id: Optional[str] = None
    album_title: Optional[str] = None
    created_at: str
