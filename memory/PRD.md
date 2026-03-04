# GYS Intranet Portal - PRD

## Original Problem Statement
Build a full-featured, dynamic intranet portal for PT Garuda Yamato Steel (GYS). Key requirements include a complete backend CMS for managing Pages, Menus, News, and Hero settings, with a dynamic frontend that renders content from the CMS.

## Tech Stack
- **Frontend:** React, Vite, TailwindCSS, Framer Motion, lucide-react, Shadcn UI
- **Backend:** Python, FastAPI, MongoDB
- **Architecture:** Monorepo with /app/frontend and /app/backend

## What's Been Implemented

### Phase 1 - Core CMS & Homepage (Completed)
- Admin CMS with Pages, Menus, News, Hero settings management
- Dynamic homepage with Hero section (image preloader, no flash)
- Featured News section (ArcelorMittal-style layout)
- Dynamic 3-level nested navigation bar
- News ticker management

### Phase 2 - Corporate Pages (Completed)
- **Corporate Overview** (`/corporate/overview`): Hero, stats bar, about section, vision/mission, global network
- **Corporate Philosophy** (`/corporate/philosophy`): Redesigned with full content - hero, "Strength in Excellence" tagline, intro, 3 core values (Quality, Innovation, Sustainability) with key highlights
- **Corporate History & Group Structure** (`/corporate/history`): Redesigned with horizontal green timeline and shareholder diagram with company logos

### Phase 3 - Backend Refactoring (Completed)
- Refactored monolithic `server.py` into modular structure with routes, models, and database modules
- Added `python-dotenv` for environment variable management

### Phase 4 - Bug Fixes & Activity Log (Completed - Mar 4, 2026)
- **Fixed navbar transparency bug** on News Detail page: Header now transparent with white text on page load, transitions to solid white after scrolling
- **Implemented Admin Activity Log**: Full logging system tracking user logins, content changes (news/pages CRUD), settings updates, and user management actions
  - Backend: `logs` collection, `GET /api/logs` and `GET /api/logs/count` endpoints (admin-only)
  - Frontend: Admin "Activity Log" page with search, category filtering, pagination
  - Sidebar link visible only to admin users

### Phase 3 - CMS Page Management (In Progress)
- Page templates (7 templates) created on backend
- New "Create Page" dialog with template-based and blank creation flows
- Enhanced block editor with multiple block types
- **Pending:** Seed existing nav menu pages into CMS page list

## File Architecture

### Backend
```
/app/backend/
  server.py              # Slim entry: app setup + router includes
  database.py            # MongoDB connection (db, client)
  auth.py                # JWT helpers, password hashing, get_current_user
  models/                # Pydantic models
    user.py, news.py, event.py, album.py, employee.py, page.py, menu.py, settings.py, log.py
  routes/                # API route handlers
    auth.py, users.py, news.py, events.py, albums.py, photos.py,
    employees.py, settings.py, pages.py, menus.py, seed.py, logs.py
  tests/
    test_logs_api.py
```

### Frontend
```
/app/frontend/src/pages/
  HomePage.jsx, NewsPage.jsx, NewsDetailPage.jsx, EventsPage.jsx, GalleryPage.jsx
  CorporatePages.jsx, CorporateOverview.jsx, CorporatePhilosophy.jsx, CorporateHistory.jsx
  PhilosophySections.jsx, HistoryTimeline.jsx, HistoryShareholder.jsx
  AdminLayout.jsx, AdminDashboard.jsx, AdminNews.jsx, AdminLogs.jsx, ...
```

## Key API Endpoints
- `POST /api/auth/login` - Login (logs activity)
- `GET /api/logs` - Get activity logs (admin only)
- `GET /api/logs/count` - Get log count (admin only)
- `GET /api/news`, `POST /api/news`, `PUT /api/news/:id`, `DELETE /api/news/:id` (all log activity)
- `GET /api/pages`, `POST /api/pages`, `PUT /api/pages/:id`, `DELETE /api/pages/:id` (all log activity)
- `PUT /api/settings/hero`, `PUT /api/settings/ticker` (log activity)

## Prioritized Backlog
### P0
- Complete CMS Page Management: seed nav menu pages into CMS

### P1
- Test page creation flows (template + blank)
- Ensure CMS-created pages render on frontend

### P2
- Convert static CorporateOverview to CMS-editable template
- Additional block types or design refinements
- Cleanup potentially redundant CorporateOverview.jsx

## Credentials
- Admin: admin@gys.co.id / admin123
