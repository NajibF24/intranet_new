from pydantic import BaseModel, ConfigDict
from typing import Optional


class EmployeeCreate(BaseModel):
    name: str
    email: str
    department: str
    position: str
    phone: Optional[str] = None
    avatar_url: Optional[str] = None


class EmployeeUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    department: Optional[str] = None
    position: Optional[str] = None
    phone: Optional[str] = None
    avatar_url: Optional[str] = None


class EmployeeResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    email: str
    department: str
    position: str
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
