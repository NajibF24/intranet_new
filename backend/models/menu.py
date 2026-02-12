from pydantic import BaseModel, ConfigDict
from typing import List, Optional


class MenuItemCreate(BaseModel):
    label: str
    path: Optional[str] = None
    page_id: Optional[str] = None
    icon: Optional[str] = None
    parent_id: Optional[str] = None
    order: int = 0
    is_visible: bool = True
    open_in_new_tab: bool = False


class MenuItemUpdate(BaseModel):
    label: Optional[str] = None
    path: Optional[str] = None
    page_id: Optional[str] = None
    icon: Optional[str] = None
    parent_id: Optional[str] = None
    order: Optional[int] = None
    is_visible: Optional[bool] = None
    open_in_new_tab: Optional[bool] = None


class MenuItemResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    label: str
    path: Optional[str] = None
    page_id: Optional[str] = None
    icon: Optional[str] = None
    parent_id: Optional[str] = None
    order: int = 0
    is_visible: bool = True
    open_in_new_tab: bool = False
    children: List[dict] = []


class ReorderRequest(BaseModel):
    items: List[dict]
