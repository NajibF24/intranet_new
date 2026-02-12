from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from models.news import NewsCreate, NewsUpdate, NewsResponse
from auth import get_current_user
from database import db
import uuid
from datetime import datetime, timezone

router = APIRouter(prefix="/news", tags=["News"])


@router.get("", response_model=List[NewsResponse])
async def get_news(featured: Optional[bool] = None, limit: int = 20):
    query = {}
    if featured is not None:
        query["is_featured"] = featured
    news_list = await db.news.find(query, {"_id": 0}).sort("created_at", -1).limit(limit).to_list(limit)
    return news_list


@router.get("/{news_id}", response_model=NewsResponse)
async def get_news_by_id(news_id: str):
    news = await db.news.find_one({"id": news_id}, {"_id": 0})
    if not news:
        raise HTTPException(status_code=404, detail="News not found")
    return news


@router.post("", response_model=NewsResponse)
async def create_news(news: NewsCreate, current_user: dict = Depends(get_current_user)):
    news_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    news_doc = {
        "id": news_id,
        **news.model_dump(),
        "created_at": now,
        "updated_at": now
    }
    await db.news.insert_one(news_doc)
    return NewsResponse(**news_doc)


@router.put("/{news_id}", response_model=NewsResponse)
async def update_news(news_id: str, news: NewsUpdate, current_user: dict = Depends(get_current_user)):
    update_data = {k: v for k, v in news.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    result = await db.news.update_one({"id": news_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="News not found")
    updated = await db.news.find_one({"id": news_id}, {"_id": 0})
    return NewsResponse(**updated)


@router.delete("/{news_id}")
async def delete_news(news_id: str, current_user: dict = Depends(get_current_user)):
    result = await db.news.delete_one({"id": news_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="News not found")
    return {"message": "News deleted successfully"}
