from pydantic import BaseModel, ConfigDict
from typing import List, Optional


class UserCreate(BaseModel):
    email: str
    password: str
    name: str
    role: str = "editor"
    permissions: List[str] = []


class UserUpdate(BaseModel):
    email: Optional[str] = None
    password: Optional[str] = None
    name: Optional[str] = None
    role: Optional[str] = None
    permissions: Optional[List[str]] = None


class UserLogin(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    email: str
    name: str
    role: str
    permissions: List[str] = []
