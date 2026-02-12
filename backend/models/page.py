from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
from datetime import datetime
import uuid


class PageBlock(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    type: str
    content: dict = {}
    order: int = 0


class PageCreate(BaseModel):
    title: str
    slug: str
    description: Optional[str] = None
    template: Optional[str] = None
    blocks: List[dict] = []
    is_published: bool = True
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None


class PageUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    blocks: Optional[List[dict]] = None
    is_published: Optional[bool] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None


class PageResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    title: str
    slug: str
    description: Optional[str] = None
    template: Optional[str] = None
    blocks: List[dict] = []
    is_published: bool = True
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    created_at: datetime
    updated_at: datetime
