from fastapi import APIRouter
from auth import hash_password
from database import db
import uuid
from datetime import datetime, timezone

router = APIRouter(tags=["Seed & Templates"])


@router.get("/templates")
async def get_templates():
    """Return 7 available page templates + blank option"""
    return [
        {
            "id": "blank",
            "name": "Blank Page",
            "description": "Start from scratch, add blocks manually",
            "category": "basic",
            "thumbnail": "blank",
            "blocks": []
        },
        {
            "id": "corporate",
            "name": "Corporate Page",
            "description": "Professional company page with hero, about section, and values",
            "category": "business",
            "thumbnail": "corporate",
            "blocks": [
                {"type": "hero_banner", "content": {"title": "Company Name", "subtitle": "Your tagline here", "image_url": "https://images.unsplash.com/photo-1624027492684-327af1fb7559?w=1920&q=80", "overlay": True}, "order": 0},
                {"type": "text", "content": {"heading": "About Us", "body": "Tell your company story here..."}, "order": 1},
                {"type": "stats", "content": {"items": [{"value": "50+", "label": "Years Experience"}, {"value": "1K+", "label": "Projects"}, {"value": "500+", "label": "Employees"}, {"value": "100+", "label": "Awards"}]}, "order": 2},
                {"type": "cards", "content": {"title": "Our Values", "items": [{"title": "Quality", "description": "We never compromise on quality"}, {"title": "Innovation", "description": "Continuously pushing boundaries"}, {"title": "Integrity", "description": "Trust and transparency"}]}, "order": 3}
            ]
        },
        {
            "id": "landing",
            "name": "Landing Page",
            "description": "Marketing page with hero, features, testimonials and CTA",
            "category": "marketing",
            "thumbnail": "landing",
            "blocks": [
                {"type": "hero_banner", "content": {"title": "Powerful Headline Here", "subtitle": "Compelling description", "image_url": "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80", "button_text": "Get Started", "button_link": "#contact", "overlay": True}, "order": 0},
                {"type": "features", "content": {"title": "Why Choose Us", "items": [{"title": "Feature One", "description": "Description"}, {"title": "Feature Two", "description": "Description"}, {"title": "Feature Three", "description": "Description"}, {"title": "Feature Four", "description": "Description"}]}, "order": 1},
                {"type": "testimonial", "content": {"quote": "This product changed how we do business.", "author": "John Doe", "role": "CEO, Company Name"}, "order": 2},
                {"type": "cta", "content": {"title": "Ready to Get Started?", "description": "Join thousands of satisfied customers today.", "button_text": "Contact Us", "button_link": "/contact"}, "order": 3}
            ]
        },
        {
            "id": "service",
            "name": "Service Page",
            "description": "Showcase your services with descriptions and pricing",
            "category": "business",
            "thumbnail": "service",
            "blocks": [
                {"type": "hero_simple", "content": {"title": "Our Services", "subtitle": "Professional solutions tailored to your needs"}, "order": 0},
                {"type": "text", "content": {"heading": "What We Offer", "body": "A comprehensive overview of the services we provide..."}, "order": 1},
                {"type": "cards", "content": {"title": "Services", "items": [{"title": "Service One", "description": "Detailed description"}, {"title": "Service Two", "description": "Detailed description"}, {"title": "Service Three", "description": "Detailed description"}]}, "order": 2},
                {"type": "accordion", "content": {"title": "Frequently Asked Questions", "items": [{"title": "What is included?", "body": "Answer..."}, {"title": "How long does it take?", "body": "Answer..."}, {"title": "What are the costs?", "body": "Answer..."}]}, "order": 3}
            ]
        },
        {
            "id": "team",
            "name": "Team Page",
            "description": "Introduce your team members with photos and bios",
            "category": "people",
            "thumbnail": "team",
            "blocks": [
                {"type": "hero_simple", "content": {"title": "Meet Our Team", "subtitle": "The people behind our success"}, "order": 0},
                {"type": "text", "content": {"heading": "Our Leadership", "body": "Get to know the talented individuals who drive our company forward."}, "order": 1},
                {"type": "team_grid", "content": {"items": [{"name": "Jane Smith", "role": "CEO", "image_url": "", "bio": "Short bio..."}, {"name": "Bob Johnson", "role": "CTO", "image_url": "", "bio": "Short bio..."}, {"name": "Alice Brown", "role": "COO", "image_url": "", "bio": "Short bio..."}]}, "order": 2},
                {"type": "cta", "content": {"title": "Join Our Team", "description": "We are always looking for talented people.", "button_text": "View Openings", "button_link": "/careers"}, "order": 3}
            ]
        },
        {
            "id": "news_article",
            "name": "Article / Blog",
            "description": "Long-form content with images and sections",
            "category": "content",
            "thumbnail": "article",
            "blocks": [
                {"type": "hero_banner", "content": {"title": "Article Title", "subtitle": "Published on January 1, 2026", "image_url": "https://images.unsplash.com/photo-1504711434969-e33886168d6c?w=1920&q=80", "overlay": True}, "order": 0},
                {"type": "text", "content": {"heading": "Introduction", "body": "Your article introduction..."}, "order": 1},
                {"type": "image", "content": {"url": "", "caption": "Image caption"}, "order": 2},
                {"type": "text", "content": {"heading": "Main Content", "body": "Continue writing..."}, "order": 3},
                {"type": "quote", "content": {"text": "An important quote from the article.", "author": "Source"}, "order": 4}
            ]
        },
        {
            "id": "gallery_page",
            "name": "Photo Gallery",
            "description": "Visual gallery with image grid and captions",
            "category": "media",
            "thumbnail": "gallery",
            "blocks": [
                {"type": "hero_simple", "content": {"title": "Photo Gallery", "subtitle": "A visual journey through our work"}, "order": 0},
                {"type": "text", "content": {"heading": "", "body": "Browse through our collection of photos."}, "order": 1},
                {"type": "image_gallery", "content": {"items": [{"url": "", "caption": "Photo 1"}, {"url": "", "caption": "Photo 2"}, {"url": "", "caption": "Photo 3"}, {"url": "", "caption": "Photo 4"}, {"url": "", "caption": "Photo 5"}, {"url": "", "caption": "Photo 6"}]}, "order": 2}
            ]
        },
        {
            "id": "contact",
            "name": "Contact Page",
            "description": "Contact information with map and form placeholder",
            "category": "utility",
            "thumbnail": "contact",
            "blocks": [
                {"type": "hero_simple", "content": {"title": "Contact Us", "subtitle": "We would love to hear from you"}, "order": 0},
                {"type": "two_column", "content": {"left_content": "Address:\n123 Steel Avenue\nCikarang, West Java\nIndonesia\n\nPhone: +62 21 xxx xxxx\nEmail: info@gys.co.id", "right_content": "Business Hours:\nMonday - Friday: 8:00 AM - 5:00 PM\nSaturday: 8:00 AM - 12:00 PM\nSunday: Closed"}, "order": 1},
                {"type": "divider", "content": {}, "order": 2},
                {"type": "text", "content": {"heading": "Send Us a Message", "body": "Fill out the form below or email us directly at info@gys.co.id"}, "order": 3}
            ]
        }
    ]


@router.post("/seed")
async def seed_data():
    """Seed initial data for demo purposes"""

    # Always seed menus if empty
    existing_menus = await db.menus.count_documents({})
    if existing_menus == 0:
        corporate_id = str(uuid.uuid4())
        operational_id = str(uuid.uuid4())
        employee_id = str(uuid.uuid4())
        comms_id = str(uuid.uuid4())

        menu_items = [
            {"id": corporate_id, "label": "Corporate Identity", "path": "", "icon": "building", "parent_id": None, "is_visible": True, "open_in_new_tab": False, "order": 0},
            {"id": str(uuid.uuid4()), "label": "Corporate Overview", "path": "/corporate/overview", "icon": "", "parent_id": corporate_id, "is_visible": True, "open_in_new_tab": False, "order": 0},
            {"id": str(uuid.uuid4()), "label": "Corporate Philosophy", "path": "/corporate/philosophy", "icon": "", "parent_id": corporate_id, "is_visible": True, "open_in_new_tab": False, "order": 1},
            {"id": str(uuid.uuid4()), "label": "Corporate History & Group Structure", "path": "/corporate/history", "icon": "", "parent_id": corporate_id, "is_visible": True, "open_in_new_tab": False, "order": 2},
            {"id": operational_id, "label": "Operational/Compliance", "path": "", "icon": "file-text", "parent_id": None, "is_visible": True, "open_in_new_tab": False, "order": 1},
            {"id": str(uuid.uuid4()), "label": "Standard Operating Procedures", "path": "/compliance/sop", "icon": "", "parent_id": operational_id, "is_visible": True, "open_in_new_tab": False, "order": 0},
            {"id": str(uuid.uuid4()), "label": "Company Policies", "path": "/compliance/policies", "icon": "", "parent_id": operational_id, "is_visible": True, "open_in_new_tab": False, "order": 1},
            {"id": str(uuid.uuid4()), "label": "Safety Guidelines", "path": "/compliance/safety", "icon": "", "parent_id": operational_id, "is_visible": True, "open_in_new_tab": False, "order": 2},
            {"id": employee_id, "label": "Employee Services", "path": "", "icon": "users", "parent_id": None, "is_visible": True, "open_in_new_tab": False, "order": 2},
            {"id": str(uuid.uuid4()), "label": "IT Global Services", "path": "/services/it", "icon": "", "parent_id": employee_id, "is_visible": True, "open_in_new_tab": False, "order": 0},
            {"id": str(uuid.uuid4()), "label": "GYS Darwinbox", "path": "/services/hr", "icon": "", "parent_id": employee_id, "is_visible": True, "open_in_new_tab": False, "order": 1},
            {"id": str(uuid.uuid4()), "label": "FA E-Asset", "path": "/services/fa", "icon": "", "parent_id": employee_id, "is_visible": True, "open_in_new_tab": False, "order": 2},
            {"id": comms_id, "label": "Communication", "path": "", "icon": "message-square", "parent_id": None, "is_visible": True, "open_in_new_tab": False, "order": 3},
            {"id": str(uuid.uuid4()), "label": "News & Announcements", "path": "/news", "icon": "", "parent_id": comms_id, "is_visible": True, "open_in_new_tab": False, "order": 0},
            {"id": str(uuid.uuid4()), "label": "Events Calendar", "path": "/events", "icon": "", "parent_id": comms_id, "is_visible": True, "open_in_new_tab": False, "order": 1},
            {"id": str(uuid.uuid4()), "label": "Photo Gallery", "path": "/gallery", "icon": "", "parent_id": comms_id, "is_visible": True, "open_in_new_tab": False, "order": 2},
        ]
        await db.menus.insert_many(menu_items)

    # Check if other data already seeded
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

    now = datetime.now(timezone.utc).isoformat()

    # Seed News
    news_items = [
        {"id": str(uuid.uuid4()), "title": "PT GYS Achieves Record Production of 500,000 Metric Tons", "summary": "Our steel manufacturing plant has reached a historic milestone with record-breaking production figures in Q4 2025.", "content": "PT Garuda Yamato Steel proudly announces that our manufacturing facilities have achieved a record production of 500,000 metric tons of high-quality steel products in Q4 2025.", "image_url": "https://images.unsplash.com/photo-1721745250213-c3e1a2f4eeeb?w=800", "category": "production", "is_featured": True, "created_at": now, "updated_at": now},
        {"id": str(uuid.uuid4()), "title": "Safety First: 1000 Days Without Lost Time Incident", "summary": "GYS celebrates an outstanding safety milestone, reflecting our unwavering commitment to employee wellbeing.", "content": "We are proud to announce that PT Garuda Yamato Steel has achieved 1000 consecutive days without a lost time incident.", "image_url": "https://images.unsplash.com/photo-1735494032948-14ef288fc9d3?w=800", "category": "safety", "is_featured": False, "created_at": now, "updated_at": now},
        {"id": str(uuid.uuid4()), "title": "New Environmental Initiative: Carbon Neutral by 2030", "summary": "PT GYS announces ambitious sustainability goals with new green technology investments.", "content": "In line with our commitment to environmental sustainability, PT Garuda Yamato Steel has unveiled a comprehensive plan to achieve carbon neutrality by 2030.", "image_url": "https://images.unsplash.com/photo-1720036236694-d0a231c52563?w=800", "category": "sustainability", "is_featured": False, "created_at": now, "updated_at": now},
        {"id": str(uuid.uuid4()), "title": "Employee Excellence Awards 2025 Winners Announced", "summary": "Recognizing outstanding contributions from our dedicated team members across all departments.", "content": "The annual Employee Excellence Awards ceremony celebrated the remarkable achievements of our team members.", "image_url": "https://images.unsplash.com/photo-1727504172743-08f14448fab8?w=800", "category": "hr", "is_featured": False, "created_at": now, "updated_at": now},
        {"id": str(uuid.uuid4()), "title": "Strategic Partnership with Japanese Steel Giant", "summary": "PT GYS signs collaboration agreement with Nippon Steel for technology transfer and market expansion.", "content": "PT Garuda Yamato Steel has entered into a strategic partnership with Nippon Steel Corporation.", "image_url": "https://images.unsplash.com/photo-1697281679290-ad7be1b10682?w=800", "category": "business", "is_featured": False, "created_at": now, "updated_at": now},
    ]
    await db.news.insert_many(news_items)

    # Seed Events
    events = [
        {"id": str(uuid.uuid4()), "title": "Annual General Meeting 2026", "description": "Join us for the AGM to discuss company performance and future strategies.", "event_date": "2026-02-15", "event_type": "event", "location": "Main Conference Hall", "created_at": now},
        {"id": str(uuid.uuid4()), "title": "Chinese New Year Celebration", "description": "Company-wide celebration with traditional performances and lucky draw.", "event_date": "2026-01-29", "event_type": "holiday", "location": "Company Grounds", "created_at": now},
        {"id": str(uuid.uuid4()), "title": "Safety Training Workshop", "description": "Mandatory safety training for all production floor employees.", "event_date": "2026-01-20", "event_type": "event", "location": "Training Center", "created_at": now},
        {"id": str(uuid.uuid4()), "title": "Ahmad Wijaya - Birthday", "description": "Happy Birthday to our Production Manager!", "event_date": "2026-01-18", "event_type": "birthday", "location": "", "created_at": now},
        {"id": str(uuid.uuid4()), "title": "Independence Day Ceremony", "description": "National flag-raising ceremony followed by team building activities.", "event_date": "2026-08-17", "event_type": "holiday", "location": "Company Plaza", "created_at": now},
    ]
    await db.events.insert_many(events)

    # Seed Photos
    photos = [
        {"id": str(uuid.uuid4()), "title": "Steel Production Line", "description": "Our state-of-the-art hot rolling mill in action", "image_url": "https://images.unsplash.com/photo-1721745250213-c3e1a2f4eeeb?w=800", "category": "production", "created_at": now},
        {"id": str(uuid.uuid4()), "title": "Quality Control Team", "description": "Our QC team ensuring the highest standards", "image_url": "https://images.unsplash.com/photo-1735494032948-14ef288fc9d3?w=800", "category": "team", "created_at": now},
        {"id": str(uuid.uuid4()), "title": "Factory Interior", "description": "Modern machinery in our main production facility", "image_url": "https://images.unsplash.com/photo-1727504172743-08f14448fab8?w=800", "category": "facility", "created_at": now},
        {"id": str(uuid.uuid4()), "title": "Steel Processing", "description": "High-temperature steel processing", "image_url": "https://images.unsplash.com/photo-1697281679290-ad7be1b10682?w=800", "category": "production", "created_at": now},
        {"id": str(uuid.uuid4()), "title": "Annual Company Gathering", "description": "Team bonding event 2025", "image_url": "https://images.unsplash.com/photo-1720036236694-d0a231c52563?w=800", "category": "events", "created_at": now},
        {"id": str(uuid.uuid4()), "title": "Warehouse Operations", "description": "Finished products ready for distribution", "image_url": "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800", "category": "logistics", "created_at": now},
        {"id": str(uuid.uuid4()), "title": "Safety First Initiative", "description": "Our dedicated safety team", "image_url": "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800", "category": "safety", "created_at": now},
        {"id": str(uuid.uuid4()), "title": "Board Meeting", "description": "Executive leadership quarterly review", "image_url": "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800", "category": "corporate", "created_at": now},
    ]
    await db.photos.insert_many(photos)

    # Seed Employees
    employees = [
        {"id": str(uuid.uuid4()), "name": "Budi Santoso", "email": "budi.santoso@gys.co.id", "department": "Production", "position": "Plant Director", "phone": "+62 812-3456-7890", "avatar_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"},
        {"id": str(uuid.uuid4()), "name": "Siti Rahayu", "email": "siti.rahayu@gys.co.id", "department": "Human Resources", "position": "HR Director", "phone": "+62 812-3456-7891", "avatar_url": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"},
        {"id": str(uuid.uuid4()), "name": "Ahmad Wijaya", "email": "ahmad.wijaya@gys.co.id", "department": "Production", "position": "Production Manager", "phone": "+62 812-3456-7892", "avatar_url": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"},
        {"id": str(uuid.uuid4()), "name": "Dewi Lestari", "email": "dewi.lestari@gys.co.id", "department": "Finance", "position": "Finance Manager", "phone": "+62 812-3456-7893", "avatar_url": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150"},
        {"id": str(uuid.uuid4()), "name": "Rudi Hartono", "email": "rudi.hartono@gys.co.id", "department": "IT", "position": "IT Manager", "phone": "+62 812-3456-7894", "avatar_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150"},
        {"id": str(uuid.uuid4()), "name": "Maya Sari", "email": "maya.sari@gys.co.id", "department": "Quality Control", "position": "QC Supervisor", "phone": "+62 812-3456-7895", "avatar_url": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150"},
        {"id": str(uuid.uuid4()), "name": "Eko Prasetyo", "email": "eko.prasetyo@gys.co.id", "department": "Safety", "position": "Safety Officer", "phone": "+62 812-3456-7896", "avatar_url": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150"},
        {"id": str(uuid.uuid4()), "name": "Linda Kusuma", "email": "linda.kusuma@gys.co.id", "department": "Marketing", "position": "Marketing Manager", "phone": "+62 812-3456-7897", "avatar_url": "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150"},
    ]
    await db.employees.insert_many(employees)

    return {"message": "Data seeded successfully"}
