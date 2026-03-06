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
- Hero images use `object-cover` with `aspect-video` on mobile for responsive display
- Removed redundant CorporateOverview.jsx page and menu item

### Phase 8 - CMS Finalization & 404 Page (Completed - Mar 6, 2026)
- Verified CMS Page Management works end-to-end: templates (8 types), block-based editor (16 block types), page creation/edit, dynamic rendering at `/page/:slug`
- Added catch-all 404 "Page Not Found" page for unknown routes with Back to Home and Go Back buttons
- Fixed seed data to remove obsolete Corporate Overview menu item

## CMS Page Management Features
- **8 Templates:** Blank, Corporate, Landing, Service, Team, Article/Blog, Photo Gallery, Contact
- **16 Block Types:** hero_banner, hero_simple, text, image, cards, features, stats, testimonial, cta, quote, accordion, two_column, divider, team_grid, image_gallery, rich_text
- **Block Editor:** Drag/reorder, expand/collapse, add/remove blocks, page settings (title, slug, publish status)
- **Dynamic Rendering:** Published pages accessible at `/page/:slug`

## Key API Endpoints
- `POST /api/auth/login` - Login (returns permissions in user object)
- `GET /api/auth/me` - Current user with permissions
- `GET/PUT /api/settings/hero` - Hero settings (includes `navbar_transparent` field)
- `GET/PUT /api/settings/ticker` - Ticker settings
- `GET /api/logs`, `GET /api/logs/count` - Activity logs (admin only)
- `GET /api/templates` - 8 page templates
- `GET/POST /api/pages` - List/create pages
- `GET/PUT/DELETE /api/pages/:id` - Page CRUD
- `GET /api/pages/slug/:slug` - Fetch page by slug (for dynamic rendering)
- All CRUD endpoints enforce `require_permission(section)` on write operations

## Prioritized Backlog
### P2
- Convert static corporate pages to CMS-editable templates
- Additional block types or design refinements

## Credentials
- Admin: admin@gys.co.id / admin123
- Editor: editor@gys.co.id / admin123
- Viewer: viewer@gys.co.id / admin123
