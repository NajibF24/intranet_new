from fastapi import APIRouter, Depends, HTTPException
from typing import List
from models.page import PageCreate, PageUpdate, PageResponse
from auth import get_current_user
from database import db
import uuid
from datetime import datetime, timezone

router = APIRouter(prefix="/pages", tags=["Pages"])


@router.get("", response_model=List[PageResponse])
async def get_pages(published_only: bool = False):
    query = {"is_published": True} if published_only else {}
    pages = await db.pages.find(query, {"_id": 0}).sort("title", 1).to_list(100)
    return [PageResponse(**page) for page in pages]


@router.get("/{page_id}", response_model=PageResponse)
async def get_page(page_id: str):
    page = await db.pages.find_one({"id": page_id}, {"_id": 0})
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")
    return PageResponse(**page)


@router.get("/slug/{slug}", response_model=PageResponse)
async def get_page_by_slug(slug: str):
    page = await db.pages.find_one({"slug": slug, "is_published": True}, {"_id": 0})
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")
    return PageResponse(**page)


@router.post("", response_model=PageResponse)
async def create_page(page: PageCreate, current_user: dict = Depends(get_current_user)):
    existing = await db.pages.find_one({"slug": page.slug})
    if existing:
        raise HTTPException(status_code=400, detail="Page with this slug already exists")
    now = datetime.now(timezone.utc)
    page_data = {
        "id": str(uuid.uuid4()),
        **page.model_dump(),
        "created_at": now,
        "updated_at": now
    }
    await db.pages.insert_one(page_data)
    return PageResponse(**page_data)


@router.put("/{page_id}", response_model=PageResponse)
async def update_page(page_id: str, page: PageUpdate, current_user: dict = Depends(get_current_user)):
    existing = await db.pages.find_one({"id": page_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Page not found")
    update_data = {k: v for k, v in page.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.now(timezone.utc)
    await db.pages.update_one({"id": page_id}, {"$set": update_data})
    updated = await db.pages.find_one({"id": page_id}, {"_id": 0})
    return PageResponse(**updated)


@router.delete("/{page_id}")
async def delete_page(page_id: str, current_user: dict = Depends(get_current_user)):
    result = await db.pages.delete_one({"id": page_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Page not found")
    return {"message": "Page deleted successfully"}
