from pydantic import BaseModel, ConfigDict
from typing import Optional


class HeroSettingsUpdate(BaseModel):
    hero_image_url: Optional[str] = None
    hero_video_url: Optional[str] = None
    background_type: Optional[str] = None
    video_muted: Optional[bool] = None
    hero_title_line1: Optional[str] = None
    hero_title_line2: Optional[str] = None
    hero_subtitle: Optional[str] = None
    hero_cta1_text: Optional[str] = None
    hero_cta1_link: Optional[str] = None
    hero_cta2_text: Optional[str] = None
    hero_cta2_link: Optional[str] = None
    show_title: Optional[bool] = None
    show_subtitle: Optional[bool] = None
    show_cta_buttons: Optional[bool] = None
    show_particles: Optional[bool] = None
    show_gradient_overlay: Optional[bool] = None
    show_floating_cards: Optional[bool] = None
    show_welcome_badge: Optional[bool] = None


class HeroSettingsResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    hero_image_url: str
    hero_video_url: str = ""
    background_type: str = "image"
    video_muted: bool = True
    hero_title_line1: str
    hero_title_line2: str
    hero_subtitle: str
    hero_cta1_text: str
    hero_cta1_link: str
    hero_cta2_text: str
    hero_cta2_link: str
    show_title: bool = True
    show_subtitle: bool = True
    show_cta_buttons: bool = True
    show_particles: bool = True
    show_gradient_overlay: bool = True
    show_floating_cards: bool = True
    show_welcome_badge: bool = True


class TickerSettingsUpdate(BaseModel):
    mode: Optional[str] = None
    manual_text: Optional[str] = None
    icon: Optional[str] = None
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
