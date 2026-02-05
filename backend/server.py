from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import hashlib
import jwt
import base64

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Secret
JWT_SECRET = os.environ.get('JWT_SECRET', 'gys-intranet-secret-key-2024')
JWT_ALGORITHM = "HS256"

# Create the main app
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

security = HTTPBearer(auto_error=False)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ===================== MODELS =====================

# User/Admin Model
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

# Photo Album Model
class AlbumCreate(BaseModel):
    title: str
    description: Optional[str] = None
    cover_image_url: Optional[str] = None

class AlbumUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    cover_image_url: Optional[str] = None

class AlbumResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    title: str
    description: Optional[str] = None
    cover_image_url: Optional[str] = None
    photo_count: int = 0
    created_at: str

# News Model
class NewsCreate(BaseModel):
    title: str
    summary: str
    content: str
    image_url: Optional[str] = None
    category: str = "general"
    is_featured: bool = False

class NewsUpdate(BaseModel):
    title: Optional[str] = None
    summary: Optional[str] = None
    content: Optional[str] = None
    image_url: Optional[str] = None
    category: Optional[str] = None
    is_featured: Optional[bool] = None

class NewsResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    title: str
    summary: str
    content: str
    image_url: Optional[str] = None
    category: str
    is_featured: bool
    created_at: str
    updated_at: str

# Event Model
class EventCreate(BaseModel):
    title: str
    description: str
    event_date: str
    event_type: str = "event"  # event, holiday, birthday
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

# Photo Model
class PhotoCreate(BaseModel):
    title: str
    description: Optional[str] = None
    image_url: str
    album_id: Optional[str] = None

class PhotoUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    album_id: Optional[str] = None

class PhotoResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    title: str
    description: Optional[str] = None
    image_url: str
    album_id: Optional[str] = None
    album_title: Optional[str] = None
    created_at: str

# Employee Model
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

# ===================== AUTH HELPERS =====================

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password: str, hashed: str) -> bool:
    return hash_password(password) == hashed

def create_token(user_id: str, email: str, role: str) -> str:
    payload = {
        "user_id": user_id,
        "email": email,
        "role": role,
        "exp": datetime.now(timezone.utc).timestamp() + 86400  # 24 hours
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ===================== AUTH ROUTES =====================

@api_router.post("/auth/register", response_model=UserResponse)
async def register(user: UserCreate):
    existing = await db.users.find_one({"email": user.email}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_id = str(uuid.uuid4())
    user_doc = {
        "id": user_id,
        "email": user.email,
        "password": hash_password(user.password),
        "name": user.name,
        "role": user.role,
        "permissions": user.permissions,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.users.insert_one(user_doc)
    return UserResponse(id=user_id, email=user.email, name=user.name, role=user.role, permissions=user.permissions)

@api_router.post("/auth/login")
async def login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email}, {"_id": 0})
    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_token(user["id"], user["email"], user["role"])
    return {
        "token": token,
        "user": UserResponse(id=user["id"], email=user["email"], name=user["name"], role=user["role"])
    }

@api_router.get("/auth/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    user = await db.users.find_one({"id": current_user["user_id"]}, {"_id": 0, "password": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserResponse(**user)

# ===================== USER MANAGEMENT ROUTES =====================

@api_router.get("/users", response_model=List[UserResponse])
async def get_users(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    users = await db.users.find({}, {"_id": 0, "password": 0}).to_list(100)
    return [UserResponse(**u) for u in users]

@api_router.get("/users/{user_id}", response_model=UserResponse)
async def get_user_by_id(user_id: str, current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    user = await db.users.find_one({"id": user_id}, {"_id": 0, "password": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserResponse(**user)

@api_router.post("/users", response_model=UserResponse)
async def create_user(user: UserCreate, current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    existing = await db.users.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_id = str(uuid.uuid4())
    user_doc = {
        "id": user_id,
        "email": user.email,
        "password": hash_password(user.password),
        "name": user.name,
        "role": user.role,
        "permissions": user.permissions,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.users.insert_one(user_doc)
    return UserResponse(id=user_id, email=user.email, name=user.name, role=user.role, permissions=user.permissions)

@api_router.put("/users/{user_id}", response_model=UserResponse)
async def update_user(user_id: str, user: UserUpdate, current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    update_data = {k: v for k, v in user.model_dump().items() if v is not None}
    if "password" in update_data:
        update_data["password"] = hash_password(update_data["password"])
    
    result = await db.users.update_one({"id": user_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    updated = await db.users.find_one({"id": user_id}, {"_id": 0, "password": 0})
    return UserResponse(**updated)

@api_router.delete("/users/{user_id}")
async def delete_user(user_id: str, current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    result = await db.users.delete_one({"id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted successfully"}

# ===================== NEWS ROUTES =====================

@api_router.get("/news", response_model=List[NewsResponse])
async def get_news(featured: Optional[bool] = None, limit: int = 20):
    query = {}
    if featured is not None:
        query["is_featured"] = featured
    news_list = await db.news.find(query, {"_id": 0}).sort("created_at", -1).limit(limit).to_list(limit)
    return news_list

@api_router.get("/news/{news_id}", response_model=NewsResponse)
async def get_news_by_id(news_id: str):
    news = await db.news.find_one({"id": news_id}, {"_id": 0})
    if not news:
        raise HTTPException(status_code=404, detail="News not found")
    return news

@api_router.post("/news", response_model=NewsResponse)
async def create_news(news: NewsCreate, current_user: dict = Depends(get_current_user)):
    news_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    news_doc = {
        "id": news_id,
        **news.model_dump(),
        "created_at": now,
        "updated_at": now
    }
    await db.news.insert_one(news_doc)
    return NewsResponse(**news_doc)

@api_router.put("/news/{news_id}", response_model=NewsResponse)
async def update_news(news_id: str, news: NewsUpdate, current_user: dict = Depends(get_current_user)):
    update_data = {k: v for k, v in news.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    result = await db.news.update_one({"id": news_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="News not found")
    
    updated = await db.news.find_one({"id": news_id}, {"_id": 0})
    return NewsResponse(**updated)

@api_router.delete("/news/{news_id}")
async def delete_news(news_id: str, current_user: dict = Depends(get_current_user)):
    result = await db.news.delete_one({"id": news_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="News not found")
    return {"message": "News deleted successfully"}

# ===================== EVENTS ROUTES =====================

@api_router.get("/events", response_model=List[EventResponse])
async def get_events(event_type: Optional[str] = None, limit: int = 50):
    query = {}
    if event_type:
        query["event_type"] = event_type
    events = await db.events.find(query, {"_id": 0}).sort("event_date", 1).to_list(limit)
    return events

@api_router.get("/events/{event_id}", response_model=EventResponse)
async def get_event_by_id(event_id: str):
    event = await db.events.find_one({"id": event_id}, {"_id": 0})
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

@api_router.post("/events", response_model=EventResponse)
async def create_event(event: EventCreate, current_user: dict = Depends(get_current_user)):
    event_id = str(uuid.uuid4())
    event_doc = {
        "id": event_id,
        **event.model_dump(),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.events.insert_one(event_doc)
    return EventResponse(**event_doc)

@api_router.put("/events/{event_id}", response_model=EventResponse)
async def update_event(event_id: str, event: EventUpdate, current_user: dict = Depends(get_current_user)):
    update_data = {k: v for k, v in event.model_dump().items() if v is not None}
    
    result = await db.events.update_one({"id": event_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")
    
    updated = await db.events.find_one({"id": event_id}, {"_id": 0})
    return EventResponse(**updated)

@api_router.delete("/events/{event_id}")
async def delete_event(event_id: str, current_user: dict = Depends(get_current_user)):
    result = await db.events.delete_one({"id": event_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")
    return {"message": "Event deleted successfully"}

# ===================== PHOTO ALBUMS ROUTES =====================

@api_router.get("/albums", response_model=List[AlbumResponse])
async def get_albums(limit: int = 50):
    albums = await db.albums.find({}, {"_id": 0}).sort("created_at", -1).to_list(limit)
    # Add photo count for each album
    result = []
    for album in albums:
        photo_count = await db.photos.count_documents({"album_id": album["id"]})
        album["photo_count"] = photo_count
        result.append(AlbumResponse(**album))
    return result

@api_router.get("/albums/{album_id}", response_model=AlbumResponse)
async def get_album_by_id(album_id: str):
    album = await db.albums.find_one({"id": album_id}, {"_id": 0})
    if not album:
        raise HTTPException(status_code=404, detail="Album not found")
    photo_count = await db.photos.count_documents({"album_id": album_id})
    album["photo_count"] = photo_count
    return AlbumResponse(**album)

@api_router.get("/albums/{album_id}/photos", response_model=List[PhotoResponse])
async def get_album_photos(album_id: str):
    photos = await db.photos.find({"album_id": album_id}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return photos

@api_router.post("/albums", response_model=AlbumResponse)
async def create_album(album: AlbumCreate, current_user: dict = Depends(get_current_user)):
    album_id = str(uuid.uuid4())
    album_doc = {
        "id": album_id,
        **album.model_dump(),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.albums.insert_one(album_doc)
    return AlbumResponse(**album_doc, photo_count=0)

@api_router.put("/albums/{album_id}", response_model=AlbumResponse)
async def update_album(album_id: str, album: AlbumUpdate, current_user: dict = Depends(get_current_user)):
    update_data = {k: v for k, v in album.model_dump().items() if v is not None}
    result = await db.albums.update_one({"id": album_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Album not found")
    updated = await db.albums.find_one({"id": album_id}, {"_id": 0})
    photo_count = await db.photos.count_documents({"album_id": album_id})
    updated["photo_count"] = photo_count
    return AlbumResponse(**updated)

@api_router.delete("/albums/{album_id}")
async def delete_album(album_id: str, current_user: dict = Depends(get_current_user)):
    result = await db.albums.delete_one({"id": album_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Album not found")
    # Also remove album_id from all photos in this album
    await db.photos.update_many({"album_id": album_id}, {"$set": {"album_id": None}})
    return {"message": "Album deleted successfully"}

# ===================== PHOTOS ROUTES =====================

@api_router.get("/photos", response_model=List[PhotoResponse])
async def get_photos(album_id: Optional[str] = None, limit: int = 50):
    query = {}
    if album_id:
        query["album_id"] = album_id
    photos = await db.photos.find(query, {"_id": 0}).sort("created_at", -1).to_list(limit)
    # Add album title to each photo
    result = []
    for photo in photos:
        if photo.get("album_id"):
            album = await db.albums.find_one({"id": photo["album_id"]}, {"_id": 0})
            photo["album_title"] = album.get("title") if album else None
        result.append(PhotoResponse(**photo))
    return result

@api_router.get("/photos/{photo_id}", response_model=PhotoResponse)
async def get_photo_by_id(photo_id: str):
    photo = await db.photos.find_one({"id": photo_id}, {"_id": 0})
    if not photo:
        raise HTTPException(status_code=404, detail="Photo not found")
    if photo.get("album_id"):
        album = await db.albums.find_one({"id": photo["album_id"]}, {"_id": 0})
        photo["album_title"] = album.get("title") if album else None
    return PhotoResponse(**photo)

@api_router.post("/photos", response_model=PhotoResponse)
async def create_photo(photo: PhotoCreate, current_user: dict = Depends(get_current_user)):
    photo_id = str(uuid.uuid4())
    photo_doc = {
        "id": photo_id,
        **photo.model_dump(),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.photos.insert_one(photo_doc)
    
    # Add album title if exists
    album_title = None
    if photo.album_id:
        album = await db.albums.find_one({"id": photo.album_id}, {"_id": 0})
        album_title = album.get("title") if album else None
    
    return PhotoResponse(**photo_doc, album_title=album_title)

@api_router.post("/photos/upload")
async def upload_photo(file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    contents = await file.read()
    base64_data = base64.b64encode(contents).decode('utf-8')
    content_type = file.content_type or "image/jpeg"
    data_url = f"data:{content_type};base64,{base64_data}"
    return {"image_url": data_url, "filename": file.filename}

@api_router.put("/photos/{photo_id}", response_model=PhotoResponse)
async def update_photo(photo_id: str, photo: PhotoUpdate, current_user: dict = Depends(get_current_user)):
    update_data = {k: v for k, v in photo.model_dump().items() if v is not None}
    
    result = await db.photos.update_one({"id": photo_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Photo not found")
    
    updated = await db.photos.find_one({"id": photo_id}, {"_id": 0})
    return PhotoResponse(**updated)

@api_router.delete("/photos/{photo_id}")
async def delete_photo(photo_id: str, current_user: dict = Depends(get_current_user)):
    result = await db.photos.delete_one({"id": photo_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Photo not found")
    return {"message": "Photo deleted successfully"}

# ===================== EMPLOYEES ROUTES =====================

@api_router.get("/employees", response_model=List[EmployeeResponse])
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

@api_router.get("/employees/{employee_id}", response_model=EmployeeResponse)
async def get_employee_by_id(employee_id: str):
    employee = await db.employees.find_one({"id": employee_id}, {"_id": 0})
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee

@api_router.post("/employees", response_model=EmployeeResponse)
async def create_employee(employee: EmployeeCreate, current_user: dict = Depends(get_current_user)):
    employee_id = str(uuid.uuid4())
    employee_doc = {
        "id": employee_id,
        **employee.model_dump()
    }
    await db.employees.insert_one(employee_doc)
    return EmployeeResponse(**employee_doc)

@api_router.put("/employees/{employee_id}", response_model=EmployeeResponse)
async def update_employee(employee_id: str, employee: EmployeeUpdate, current_user: dict = Depends(get_current_user)):
    update_data = {k: v for k, v in employee.model_dump().items() if v is not None}
    
    result = await db.employees.update_one({"id": employee_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    updated = await db.employees.find_one({"id": employee_id}, {"_id": 0})
    return EmployeeResponse(**updated)

@api_router.delete("/employees/{employee_id}")
async def delete_employee(employee_id: str, current_user: dict = Depends(get_current_user)):
    result = await db.employees.delete_one({"id": employee_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Employee not found")
    return {"message": "Employee deleted successfully"}

# ===================== HERO SETTINGS =====================

class HeroSettingsUpdate(BaseModel):
    hero_image_url: Optional[str] = None
    hero_title_line1: Optional[str] = None
    hero_title_line2: Optional[str] = None
    hero_subtitle: Optional[str] = None
    hero_cta1_text: Optional[str] = None
    hero_cta1_link: Optional[str] = None
    hero_cta2_text: Optional[str] = None
    hero_cta2_link: Optional[str] = None
    show_particles: Optional[bool] = None
    show_gradient_overlay: Optional[bool] = None
    show_floating_cards: Optional[bool] = None

class HeroSettingsResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    hero_image_url: str
    hero_title_line1: str
    hero_title_line2: str
    hero_subtitle: str
    hero_cta1_text: str
    hero_cta1_link: str
    hero_cta2_text: str
    hero_cta2_link: str
    show_particles: bool = True
    show_gradient_overlay: bool = True
    show_floating_cards: bool = True

# Ticker Settings Model
class TickerSettingsUpdate(BaseModel):
    mode: Optional[str] = None  # 'default' or 'manual'
    manual_text: Optional[str] = None
    icon: Optional[str] = None  # icon name from lucide-react
    badge_text: Optional[str] = None
    is_enabled: Optional[bool] = None

class TickerSettingsResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    mode: str = "default"
    manual_text: str = ""
    icon: str = "sparkles"
    badge_text: str = "Latest News"
    is_enabled: bool = True

@api_router.get("/settings/hero", response_model=HeroSettingsResponse)
async def get_hero_settings():
    settings = await db.settings.find_one({"type": "hero"}, {"_id": 0})
    if not settings:
        # Return defaults
        return HeroSettingsResponse(
            id="hero-settings",
            hero_image_url="https://images.unsplash.com/photo-1721745250213-c3e1a2f4eeeb?w=1920&q=80",
            hero_title_line1="Building Indonesia's",
            hero_title_line2="Steel Future",
            hero_subtitle="PT Garuda Yamato Steel is committed to excellence in steel manufacturing, delivering premium quality products while prioritizing safety and sustainability.",
            hero_cta1_text="Latest News",
            hero_cta1_link="#news",
            hero_cta2_text="Employee Directory",
            hero_cta2_link="#directory",
            show_particles=True,
            show_gradient_overlay=True,
            show_floating_cards=True
        )
    return HeroSettingsResponse(**settings)

@api_router.put("/settings/hero", response_model=HeroSettingsResponse)
async def update_hero_settings(settings: HeroSettingsUpdate, current_user: dict = Depends(get_current_user)):
    update_data = {k: v for k, v in settings.model_dump().items() if v is not None}
    
    existing = await db.settings.find_one({"type": "hero"})
    if existing:
        await db.settings.update_one({"type": "hero"}, {"$set": update_data})
    else:
        default_settings = {
            "id": "hero-settings",
            "type": "hero",
            "hero_image_url": "https://images.unsplash.com/photo-1721745250213-c3e1a2f4eeeb?w=1920&q=80",
            "hero_title_line1": "Building Indonesia's",
            "hero_title_line2": "Steel Future",
            "hero_subtitle": "PT Garuda Yamato Steel is committed to excellence in steel manufacturing, delivering premium quality products while prioritizing safety and sustainability.",
            "hero_cta1_text": "Latest News",
            "hero_cta1_link": "#news",
            "hero_cta2_text": "Employee Directory",
            "hero_cta2_link": "#directory",
            "show_particles": True,
            "show_gradient_overlay": True,
            "show_floating_cards": True
        }
        default_settings.update(update_data)
        await db.settings.insert_one(default_settings)
    
    updated = await db.settings.find_one({"type": "hero"}, {"_id": 0})
    return HeroSettingsResponse(**updated)

# ===================== SEED DATA =====================

@api_router.post("/seed")
async def seed_data():
    """Seed initial data for demo purposes"""
    
    # Check if already seeded
    news_count = await db.news.count_documents({})
    if news_count > 0:
        return {"message": "Data already seeded"}
    
    # Create default admin user
    admin_exists = await db.users.find_one({"email": "admin@gys.co.id"})
    if not admin_exists:
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "email": "admin@gys.co.id",
            "password": hash_password("admin123"),
            "name": "Administrator",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat()
        })
    
    # Seed News
    news_items = [
        {
            "id": str(uuid.uuid4()),
            "title": "PT GYS Achieves Record Production of 500,000 Metric Tons",
            "summary": "Our steel manufacturing plant has reached a historic milestone with record-breaking production figures in Q4 2025.",
            "content": "PT Garuda Yamato Steel proudly announces that our manufacturing facilities have achieved a record production of 500,000 metric tons of high-quality steel products in Q4 2025. This remarkable achievement demonstrates our commitment to excellence and positions us as the leading steel manufacturer in the region. Our state-of-the-art facilities, combined with our skilled workforce, have made this accomplishment possible.",
            "image_url": "https://images.unsplash.com/photo-1721745250213-c3e1a2f4eeeb?w=800",
            "category": "production",
            "is_featured": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Safety First: 1000 Days Without Lost Time Incident",
            "summary": "GYS celebrates an outstanding safety milestone, reflecting our unwavering commitment to employee wellbeing.",
            "content": "We are proud to announce that PT Garuda Yamato Steel has achieved 1000 consecutive days without a lost time incident. This remarkable safety record is a testament to our comprehensive safety protocols, regular training programs, and the dedication of every team member to maintain a safe working environment.",
            "image_url": "https://images.unsplash.com/photo-1735494032948-14ef288fc9d3?w=800",
            "category": "safety",
            "is_featured": False,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "New Environmental Initiative: Carbon Neutral by 2030",
            "summary": "PT GYS announces ambitious sustainability goals with new green technology investments.",
            "content": "In line with our commitment to environmental sustainability, PT Garuda Yamato Steel has unveiled a comprehensive plan to achieve carbon neutrality by 2030. This initiative includes significant investments in renewable energy, advanced emission control systems, and sustainable manufacturing practices.",
            "image_url": "https://images.unsplash.com/photo-1720036236694-d0a231c52563?w=800",
            "category": "sustainability",
            "is_featured": False,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Employee Excellence Awards 2025 Winners Announced",
            "summary": "Recognizing outstanding contributions from our dedicated team members across all departments.",
            "content": "The annual Employee Excellence Awards ceremony celebrated the remarkable achievements of our team members. Categories included Innovation Excellence, Safety Champion, Customer Service Star, and Leadership Award. Congratulations to all winners and nominees!",
            "image_url": "https://images.unsplash.com/photo-1727504172743-08f14448fab8?w=800",
            "category": "hr",
            "is_featured": False,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Strategic Partnership with Japanese Steel Giant",
            "summary": "PT GYS signs collaboration agreement with Nippon Steel for technology transfer and market expansion.",
            "content": "PT Garuda Yamato Steel has entered into a strategic partnership with Nippon Steel Corporation, one of the world's largest steel producers. This collaboration will facilitate technology transfer, joint research and development, and access to new international markets.",
            "image_url": "https://images.unsplash.com/photo-1697281679290-ad7be1b10682?w=800",
            "category": "business",
            "is_featured": False,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    await db.news.insert_many(news_items)
    
    # Seed Events
    events = [
        {
            "id": str(uuid.uuid4()),
            "title": "Annual General Meeting 2026",
            "description": "Join us for the AGM to discuss company performance and future strategies.",
            "event_date": "2026-02-15",
            "event_type": "event",
            "location": "Main Conference Hall",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Chinese New Year Celebration",
            "description": "Company-wide celebration with traditional performances and lucky draw.",
            "event_date": "2026-01-29",
            "event_type": "holiday",
            "location": "Company Grounds",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Safety Training Workshop",
            "description": "Mandatory safety training for all production floor employees.",
            "event_date": "2026-01-20",
            "event_type": "event",
            "location": "Training Center",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Ahmad Wijaya - Birthday",
            "description": "Happy Birthday to our Production Manager!",
            "event_date": "2026-01-18",
            "event_type": "birthday",
            "location": "",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Independence Day Ceremony",
            "description": "National flag-raising ceremony followed by team building activities.",
            "event_date": "2026-08-17",
            "event_type": "holiday",
            "location": "Company Plaza",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    await db.events.insert_many(events)
    
    # Seed Photos
    photos = [
        {
            "id": str(uuid.uuid4()),
            "title": "Steel Production Line",
            "description": "Our state-of-the-art hot rolling mill in action",
            "image_url": "https://images.unsplash.com/photo-1721745250213-c3e1a2f4eeeb?w=800",
            "category": "production",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Quality Control Team",
            "description": "Our QC team ensuring the highest standards",
            "image_url": "https://images.unsplash.com/photo-1735494032948-14ef288fc9d3?w=800",
            "category": "team",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Factory Interior",
            "description": "Modern machinery in our main production facility",
            "image_url": "https://images.unsplash.com/photo-1727504172743-08f14448fab8?w=800",
            "category": "facility",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Steel Processing",
            "description": "High-temperature steel processing",
            "image_url": "https://images.unsplash.com/photo-1697281679290-ad7be1b10682?w=800",
            "category": "production",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Annual Company Gathering",
            "description": "Team bonding event 2025",
            "image_url": "https://images.unsplash.com/photo-1720036236694-d0a231c52563?w=800",
            "category": "events",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Warehouse Operations",
            "description": "Finished products ready for distribution",
            "image_url": "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800",
            "category": "logistics",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Safety First Initiative",
            "description": "Our dedicated safety team",
            "image_url": "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800",
            "category": "safety",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Board Meeting",
            "description": "Executive leadership quarterly review",
            "image_url": "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800",
            "category": "corporate",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    await db.photos.insert_many(photos)
    
    # Seed Employees
    employees = [
        {
            "id": str(uuid.uuid4()),
            "name": "Budi Santoso",
            "email": "budi.santoso@gys.co.id",
            "department": "Production",
            "position": "Plant Director",
            "phone": "+62 812-3456-7890",
            "avatar_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Siti Rahayu",
            "email": "siti.rahayu@gys.co.id",
            "department": "Human Resources",
            "position": "HR Director",
            "phone": "+62 812-3456-7891",
            "avatar_url": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Ahmad Wijaya",
            "email": "ahmad.wijaya@gys.co.id",
            "department": "Production",
            "position": "Production Manager",
            "phone": "+62 812-3456-7892",
            "avatar_url": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Dewi Lestari",
            "email": "dewi.lestari@gys.co.id",
            "department": "Finance",
            "position": "Finance Manager",
            "phone": "+62 812-3456-7893",
            "avatar_url": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150"
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Rudi Hartono",
            "email": "rudi.hartono@gys.co.id",
            "department": "IT",
            "position": "IT Manager",
            "phone": "+62 812-3456-7894",
            "avatar_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150"
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Maya Sari",
            "email": "maya.sari@gys.co.id",
            "department": "Quality Control",
            "position": "QC Supervisor",
            "phone": "+62 812-3456-7895",
            "avatar_url": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150"
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Eko Prasetyo",
            "email": "eko.prasetyo@gys.co.id",
            "department": "Safety",
            "position": "Safety Officer",
            "phone": "+62 812-3456-7896",
            "avatar_url": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150"
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Linda Kusuma",
            "email": "linda.kusuma@gys.co.id",
            "department": "Marketing",
            "position": "Marketing Manager",
            "phone": "+62 812-3456-7897",
            "avatar_url": "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150"
        }
    ]
    await db.employees.insert_many(employees)
    
    return {"message": "Data seeded successfully"}

# Root endpoint
@api_router.get("/")
async def root():
    return {"message": "GYS Intranet API", "version": "1.0.0"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
