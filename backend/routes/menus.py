from fastapi import APIRouter, Depends, HTTPException
from typing import List
from models.menu import MenuItemCreate, MenuItemUpdate, MenuItemResponse, ReorderRequest
from auth import get_current_user
from database import db
import uuid

router = APIRouter(prefix="/menus", tags=["Menus"])


@router.get("", response_model=List[MenuItemResponse])
async def get_menus(visible_only: bool = False):
    query = {"is_visible": True} if visible_only else {}
    items = await db.menus.find(query, {"_id": 0}).sort("order", 1).to_list(200)

    # Build 3-level tree: root -> children -> grandchildren
    items_map = {item["id"]: {**item, "children": []} for item in items}
    root_items = []

    for item in items:
        pid = item.get("parent_id")
        if not pid:
            root_items.append(items_map[item["id"]])
        elif pid in items_map:
            items_map[pid]["children"].append(items_map[item["id"]])

    # Sort children at every level
    for item_id, item in items_map.items():
        item["children"].sort(key=lambda x: x.get("order", 0))
    root_items.sort(key=lambda x: x.get("order", 0))

    return [MenuItemResponse(**item) for item in root_items]


@router.get("/flat", response_model=List[MenuItemResponse])
async def get_menus_flat():
    items = await db.menus.find({}, {"_id": 0}).sort("order", 1).to_list(100)
    return [MenuItemResponse(**item) for item in items]


@router.post("", response_model=MenuItemResponse)
async def create_menu_item(item: MenuItemCreate, current_user: dict = Depends(get_current_user)):
    menu_data = {
        "id": str(uuid.uuid4()),
        **item.model_dump()
    }
    await db.menus.insert_one(menu_data)
    menu_data["children"] = []
    return MenuItemResponse(**menu_data)


@router.put("/reorder")
async def reorder_menus(request: ReorderRequest, current_user: dict = Depends(get_current_user)):
    for item in request.items:
        await db.menus.update_one(
            {"id": item["id"]},
            {"$set": {"order": item["order"], "parent_id": item.get("parent_id")}}
        )
    return {"message": "Menu reordered successfully"}


@router.put("/{menu_id}", response_model=MenuItemResponse)
async def update_menu_item(menu_id: str, item: MenuItemUpdate, current_user: dict = Depends(get_current_user)):
    existing = await db.menus.find_one({"id": menu_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Menu item not found")
    update_data = {k: v for k, v in item.model_dump().items() if v is not None}
    await db.menus.update_one({"id": menu_id}, {"$set": update_data})
    updated = await db.menus.find_one({"id": menu_id}, {"_id": 0})
    updated["children"] = []
    return MenuItemResponse(**updated)


@router.delete("/{menu_id}")
async def delete_menu_item(menu_id: str, current_user: dict = Depends(get_current_user)):
    await db.menus.delete_many({"parent_id": menu_id})
    result = await db.menus.delete_one({"id": menu_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Menu item not found")
    return {"message": "Menu item deleted successfully"}
