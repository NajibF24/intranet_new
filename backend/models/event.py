from pydantic import BaseModel, ConfigDict
from typing import Optional


class EventCreate(BaseModel):
    title: str
    description: str
    event_date: str
    event_type: str = "event"
    location: Optional[str] = None


class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    event_date: Optional[str] = None
    event_type: Optional[str] = None
    location: Optional[str] = None


class EventResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    title: str
    description: str
    event_date: str
    event_type: str
    location: Optional[str] = None
    created_at: str
