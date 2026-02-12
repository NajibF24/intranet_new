import os
import sys

# Add backend directory to Python path for imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from database import client

from routes.auth import router as auth_router
from routes.users import router as users_router
from routes.news import router as news_router
from routes.events import router as events_router
from routes.albums import router as albums_router
from routes.photos import router as photos_router
from routes.employees import router as employees_router
from routes.settings import router as settings_router
from routes.pages import router as pages_router
from routes.menus import router as menus_router
from routes.seed import router as seed_router

app = FastAPI(title="GYS Intranet API")

api_router = APIRouter(prefix="/api")


@api_router.get("/")
async def root():
    return {"message": "GYS Intranet API", "version": "1.0.0"}


# Include all route modules
api_router.include_router(auth_router)
api_router.include_router(users_router)
api_router.include_router(news_router)
api_router.include_router(events_router)
api_router.include_router(albums_router)
api_router.include_router(photos_router)
api_router.include_router(employees_router)
api_router.include_router(settings_router)
api_router.include_router(pages_router)
api_router.include_router(menus_router)
api_router.include_router(seed_router)

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
