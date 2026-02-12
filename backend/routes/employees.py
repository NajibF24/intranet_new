from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from models.employee import EmployeeCreate, EmployeeUpdate, EmployeeResponse
from auth import get_current_user
from database import db
import uuid

router = APIRouter(prefix="/employees", tags=["Employees"])


@router.get("", response_model=List[EmployeeResponse])
async def get_employees(search: Optional[str] = None, department: Optional[str] = None, limit: int = 100):
    query = {}
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"email": {"$regex": search, "$options": "i"}},
            {"position": {"$regex": search, "$options": "i"}},
            {"department": {"$regex": search, "$options": "i"}}
        ]
    if department:
        query["department"] = department
    employees = await db.employees.find(query, {"_id": 0}).sort("name", 1).to_list(limit)
    return employees


@router.get("/{employee_id}", response_model=EmployeeResponse)
async def get_employee_by_id(employee_id: str):
    employee = await db.employees.find_one({"id": employee_id}, {"_id": 0})
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee


@router.post("", response_model=EmployeeResponse)
async def create_employee(employee: EmployeeCreate, current_user: dict = Depends(get_current_user)):
    employee_id = str(uuid.uuid4())
    employee_doc = {"id": employee_id, **employee.model_dump()}
    await db.employees.insert_one(employee_doc)
    return EmployeeResponse(**employee_doc)


@router.put("/{employee_id}", response_model=EmployeeResponse)
async def update_employee(employee_id: str, employee: EmployeeUpdate, current_user: dict = Depends(get_current_user)):
    update_data = {k: v for k, v in employee.model_dump().items() if v is not None}
    result = await db.employees.update_one({"id": employee_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Employee not found")
    updated = await db.employees.find_one({"id": employee_id}, {"_id": 0})
    return EmployeeResponse(**updated)


@router.delete("/{employee_id}")
async def delete_employee(employee_id: str, current_user: dict = Depends(get_current_user)):
    result = await db.employees.delete_one({"id": employee_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Employee not found")
    return {"message": "Employee deleted successfully"}
