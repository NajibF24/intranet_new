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
- Corporate Overview, Philosophy, History & Group Structure pages

### Phase 3 - Backend Refactoring (Completed)
- Refactored monolithic server.py into modular routes, models, database structure

### Phase 4 - Bug Fixes & Activity Log (Completed - Mar 4, 2026)
- Fixed navbar transparency bug on News Detail page
- Implemented Admin Activity Log tracking all user actions across all CMS sections (news, events, employees, pages, menus, albums, photos, settings)

### Phase 5 - Granular RBAC (Completed - Mar 5, 2026)
- **Three roles:** Admin (full access), Editor (view + edit assigned sections), Viewer (read-only on assigned sections)
- **8 CMS sections:** news, events, gallery, employees, pages, menus, hero, ticker
- **Backend enforcement:** `require_permission(section)` dependency on all write endpoints; viewers blocked from all writes; editors blocked from unassigned sections
- **Frontend:** Permissions grid in User Management dialog; sidebar filters based on user permissions; role badges (Admin/Editor/Viewer) with icons
- **Tested:** 22 backend + 7 frontend tests, 100% pass rate

## Key API Endpoints
- `POST /api/auth/login` - Login (returns permissions in user object)
- `GET /api/auth/me` - Current user with permissions
- `GET /api/logs`, `GET /api/logs/count` - Activity logs (admin only)
- All CRUD endpoints enforce `require_permission(section)` on write operations

## Permissions Model
```
Admin:  role="admin"  → full access, permissions field ignored
Editor: role="editor" → permissions=["news","events",...] → can read + write assigned sections
Viewer: role="viewer" → permissions=["gallery",...] → can read assigned sections only
```

## Prioritized Backlog
### P0
- Complete CMS Page Management: seed nav menu pages into CMS

### P1
- Test page creation flows (template + blank)
- Ensure CMS-created pages render on frontend

### P2
- Convert static CorporateOverview to CMS-editable template
- Additional block types or design refinements

## Credentials
- Admin: admin@gys.co.id / admin123
- Editor: editor@gys.co.id / editor123 (permissions: news, events)
- Viewer: viewer@gys.co.id / viewer123 (permissions: gallery)
