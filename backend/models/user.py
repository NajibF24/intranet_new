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
    can_edit: Optional[bool] = None   # Admin bisa override akses edit untuk LDAP user


class UserLogin(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    email: str
    name: str
    role: str                          # "admin" | "editor" | "viewer"
    permissions: List[str] = []
    auth_type: str = "local"           # "local" | "ldap"
    can_edit: bool = False             # True jika admin grant akses edit ke LDAP viewer
    ldap_ous: List[str] = []           # OU list dari AD (info only)
