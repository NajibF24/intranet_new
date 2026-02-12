from fastapi import APIRouter, Depends
from models.settings import HeroSettingsUpdate, HeroSettingsResponse, TickerSettingsUpdate, TickerSettingsResponse
from auth import get_current_user
from database import db

router = APIRouter(prefix="/settings", tags=["Settings"])

HERO_DEFAULTS = {
    "id": "hero-settings",
    "type": "hero",
    "hero_image_url": "https://images.unsplash.com/photo-1721745250213-c3e1a2f4eeeb?w=1920&q=80",
    "hero_video_url": "",
    "background_type": "image",
    "video_muted": True,
    "hero_title_line1": "Building Indonesia's",
    "hero_title_line2": "Steel Future",
    "hero_subtitle": "PT Garuda Yamato Steel is committed to excellence in steel manufacturing, delivering premium quality products while prioritizing safety and sustainability.",
    "hero_cta1_text": "Latest News",
    "hero_cta1_link": "#news",
    "hero_cta2_text": "Employee Directory",
    "hero_cta2_link": "#directory",
    "show_title": True,
    "show_subtitle": True,
    "show_cta_buttons": True,
    "show_particles": True,
    "show_gradient_overlay": True,
    "show_floating_cards": True,
    "show_welcome_badge": True,
}

TICKER_DEFAULTS = {
    "id": "ticker-settings",
    "type": "ticker",
    "mode": "default",
    "manual_text": "",
    "icon": "sparkles",
    "badge_text": "Latest News",
    "is_enabled": True,
}


@router.get("/hero", response_model=HeroSettingsResponse)
async def get_hero_settings():
    settings = await db.settings.find_one({"type": "hero"}, {"_id": 0})
    if not settings:
        return HeroSettingsResponse(**HERO_DEFAULTS)
    return HeroSettingsResponse(**settings)


@router.put("/hero", response_model=HeroSettingsResponse)
async def update_hero_settings(settings: HeroSettingsUpdate, current_user: dict = Depends(get_current_user)):
    update_data = {k: v for k, v in settings.model_dump().items() if v is not None}
    existing = await db.settings.find_one({"type": "hero"})
    if existing:
        await db.settings.update_one({"type": "hero"}, {"$set": update_data})
    else:
        default_settings = {**HERO_DEFAULTS}
        default_settings.update(update_data)
        await db.settings.insert_one(default_settings)
    updated = await db.settings.find_one({"type": "hero"}, {"_id": 0})
    return HeroSettingsResponse(**updated)


@router.get("/ticker", response_model=TickerSettingsResponse)
async def get_ticker_settings():
    settings = await db.settings.find_one({"type": "ticker"}, {"_id": 0})
    if not settings:
        return TickerSettingsResponse(**TICKER_DEFAULTS)
    return TickerSettingsResponse(**settings)


@router.put("/ticker", response_model=TickerSettingsResponse)
async def update_ticker_settings(settings: TickerSettingsUpdate, current_user: dict = Depends(get_current_user)):
    update_data = {k: v for k, v in settings.model_dump().items() if v is not None}
    existing = await db.settings.find_one({"type": "ticker"})
    if existing:
        await db.settings.update_one({"type": "ticker"}, {"$set": update_data})
    else:
        default_settings = {**TICKER_DEFAULTS}
        default_settings.update(update_data)
        await db.settings.insert_one(default_settings)
    updated = await db.settings.find_one({"type": "ticker"}, {"_id": 0})
    return TickerSettingsResponse(**updated)
