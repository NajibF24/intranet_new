from pydantic import BaseModel, ConfigDict
from typing import Optional


class NewsCreate(BaseModel):
    title: str
    summary: str
    content: str
    image_url: Optional[str] = None
    category: str = "general"
    is_featured: bool = False


class NewsUpdate(BaseModel):
    title: Optional[str] = None
    summary: Optional[str] = None
    content: Optional[str] = None
    image_url: Optional[str] = None
    category: Optional[str] = None
    is_featured: Optional[bool] = None


class NewsResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    title: str
    summary: str
    content: str
    image_url: Optional[str] = None
    category: str
    is_featured: bool
    created_at: str
    updated_at: str
