from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from models.event import EventCreate, EventUpdate, EventResponse
from auth import get_current_user
from database import db
import uuid
from datetime import datetime, timezone

router = APIRouter(prefix="/events", tags=["Events"])


@router.get("", response_model=List[EventResponse])
async def get_events(event_type: Optional[str] = None, limit: int = 50):
    query = {}
    if event_type:
        query["event_type"] = event_type
    events = await db.events.find(query, {"_id": 0}).sort("event_date", 1).to_list(limit)
    return events


@router.get("/{event_id}", response_model=EventResponse)
async def get_event_by_id(event_id: str):
    event = await db.events.find_one({"id": event_id}, {"_id": 0})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event


@router.post("", response_model=EventResponse)
async def create_event(event: EventCreate, current_user: dict = Depends(get_current_user)):
    event_id = str(uuid.uuid4())
    event_doc = {
        "id": event_id,
        **event.model_dump(),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.events.insert_one(event_doc)
    return EventResponse(**event_doc)


@router.put("/{event_id}", response_model=EventResponse)
async def update_event(event_id: str, event: EventUpdate, current_user: dict = Depends(get_current_user)):
    update_data = {k: v for k, v in event.model_dump().items() if v is not None}
    result = await db.events.update_one({"id": event_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")
    updated = await db.events.find_one({"id": event_id}, {"_id": 0})
    return EventResponse(**updated)


@router.delete("/{event_id}")
async def delete_event(event_id: str, current_user: dict = Depends(get_current_user)):
    result = await db.events.delete_one({"id": event_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")
    return {"message": "Event deleted successfully"}
