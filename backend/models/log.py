from pydantic import BaseModel
from typing import Optional


class LogEntry(BaseModel):
    id: str
    timestamp: str
    user_email: str
    user_name: Optional[str] = None
    action: str
    category: str
    details: Optional[str] = None


class LogResponse(BaseModel):
    id: str
    timestamp: str
    user_email: str
    user_name: Optional[str] = None
    action: str
    category: str
    details: Optional[str] = None
