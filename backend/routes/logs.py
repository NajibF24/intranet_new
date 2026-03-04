from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from models.log import LogResponse
from auth import get_current_user
from database import db
import uuid
from datetime import datetime, timezone

router = APIRouter(prefix="/logs", tags=["Logs"])


async def create_log(user_email: str, user_name: str, action: str, category: str, details: str = None):
    log_doc = {
        "id": str(uuid.uuid4()),
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "user_email": user_email,
        "user_name": user_name or user_email,
        "action": action,
        "category": category,
        "details": details,
    }
    await db.logs.insert_one(log_doc)


@router.get("", response_model=List[LogResponse])
async def get_logs(
    category: Optional[str] = None,
    limit: int = Query(default=100, le=500),
    skip: int = 0,
    current_user: dict = Depends(get_current_user),
):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    query = {}
    if category:
        query["category"] = category
    logs = (
        await db.logs.find(query, {"_id": 0})
        .sort("timestamp", -1)
        .skip(skip)
        .limit(limit)
        .to_list(limit)
    )
    return logs


@router.get("/count")
async def get_logs_count(
    category: Optional[str] = None,
    current_user: dict = Depends(get_current_user),
):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    query = {}
    if category:
        query["category"] = category
    count = await db.logs.count_documents(query)
    return {"count": count}
