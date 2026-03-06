# GYS Intranet Portal - PRD

## Original Problem Statement
Build a full-featured, dynamic intranet portal for PT Garuda Yamato Steel (GYS). Key requirements include a complete backend CMS for managing Pages, Menus, News, and Hero settings, with a dynamic frontend that renders content from the CMS.

## Tech Stack
- **Frontend:** React, Vite, TailwindCSS, Framer Motion, lucide-react, Shadcn UI, jodit-react
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
- Corporate Philosophy, History & Group Structure pages
- (CorporateOverview removed as redundant - Mar 6, 2026)

### Phase 3 - Backend Refactoring (Completed)
- Refactored monolithic server.py into modular routes, models, database structure

### Phase 4 - Bug Fixes & Activity Log (Completed - Mar 4, 2026)
- Fixed navbar transparency bug on News Detail page
- Implemented Admin Activity Log tracking all user actions across all CMS sections

### Phase 5 - Granular RBAC (Completed - Mar 5, 2026)
- Three roles: Admin (full access), Editor (view + edit assigned sections), Viewer (read-only)
- 8 CMS sections: news, events, gallery, employees, pages, menus, hero, ticker
- Backend enforcement with `require_permission(section)` dependency
- Frontend: Permissions grid, sidebar filtering, role badges

### Phase 6 - Rich Text Editor & Responsive UI (Completed - Mar 5, 2026)
- jodit-react WYSIWYG editor for News and Events with fullscreen mode and live preview
- Responsive admin console (mobile-friendly sidebar)
- Responsive hero section with image carousel (up to 5 images, configurable rotation)

### Phase 7 - Navbar Transparency & Image Responsive (Completed - Mar 6, 2026)
- Added CMS toggle for transparent/solid navbar (Hero Settings > Navbar Settings)
- Hero images now use `object-contain` to show full 16:9 without cropping on any device
- Removed redundant CorporateOverview.jsx page and menu item

## Key API Endpoints
- `POST /api/auth/login` - Login (returns permissions in user object)
- `GET /api/auth/me` - Current user with permissions
- `GET/PUT /api/settings/hero` - Hero settings (includes `navbar_transparent` field)
- `GET/PUT /api/settings/ticker` - Ticker settings
- `GET /api/logs`, `GET /api/logs/count` - Activity logs (admin only)
- All CRUD endpoints enforce `require_permission(section)` on write operations

## Permissions Model
```
Admin:  role="admin"  → full access, permissions field ignored
Editor: role="editor" → permissions=["news","events",...] → can read + write assigned sections
Viewer: role="viewer" → permissions=["gallery",...] → can read assigned sections only
```

## Prioritized Backlog
### P1
- Finalize CMS Page Management: templates, block-based editor
- Ensure CMS-created pages render on frontend

### P2
- Additional block types or design refinements
- Catch-all 404 page for unknown routes

## Credentials
- Admin: admin@gys.co.id / admin123
- Editor: editor@gys.co.id / admin123
- Viewer: viewer@gys.co.id / admin123
