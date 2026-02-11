# GYS Corporate Intranet CMS - PRD

## Original Problem Statement
Build and improve a corporate intranet website for PT Garuda Yamato Steel with a comprehensive Content Management System (CMS).

## Architecture
- **Frontend:** React (CRA), Tailwind CSS, Framer Motion, Shadcn/UI
- **Backend:** FastAPI (Python), Motor (async MongoDB)
- **Database:** MongoDB
- **Auth:** JWT-based admin authentication

## What's Been Implemented

### Phase 1 - Quick Fixes & UI Updates (COMPLETE)
- Hidden "Admin Portal" from public hero
- Restructured "Corporate Identity" menu

### Phase 2 - CMS Enhancements (COMPLETE)
- Hero CMS with video/image backgrounds, visibility toggles, welcome badge toggle
- Employee CMS with image upload
- News CMS with file upload only

### Phase 3 - Homepage Rework (COMPLETE)
- ArcelorMittal-style featured news section (staggered text-left/image-right rows, #3C3C3C bg, alternating slide animations)
- Events page with "Add to Outlook" ICS download
- Ticker banner with manual/default modes
- Service Hub with iframe embedding and fallback

### Phase 4 - Full Page & Menu CMS (COMPLETE - Feb 11, 2026)
- Page Management, Block-Based Editor (8 block types), Page Templates
- Menu Management with 3-level hierarchy
- Dynamic Page Rendering at /page/:slug

### Dynamic CMS Navigation (COMPLETE - Feb 11, 2026)
- Public navbar now fully driven by CMS menu items (no hardcoded nav)
- 3-level hierarchy: L1 main nav → L2 dropdown → L3 fly-out
- Existing pages pre-seeded into CMS menus
- Visibility toggle: hidden items don't appear in public navbar
- Admin can add/edit/delete/reorder all menu items

### Hero Loading Fix (COMPLETE - Feb 11, 2026)
- Fixed glitch where hero showed text/stats before background image loaded
- Image preloading with `new Image().onload` before showing content
- localStorage caching for instant load on repeat visits

## Admin Credentials
- Email: admin@gys.co.id
- Password: admin123

## Key API Endpoints
- Menus: GET /api/menus, GET /api/menus?visible_only=true, POST/PUT/DELETE /api/menus/:id, PUT /api/menus/reorder
- Pages: GET/POST /api/pages, GET/PUT/DELETE /api/pages/:id, GET /api/pages/slug/:slug
- Templates: GET /api/templates
- Settings: GET/PUT /api/settings/hero, GET/PUT /api/settings/ticker
- Content: /api/news, /api/events, /api/photos, /api/albums, /api/employees, /api/users

## Prioritized Backlog

### P1 - Improvements
- Replace static corporate placeholder pages with dynamic CMS-rendered pages
- Rich text editing (WYSIWYG) for text blocks

### P2 - Enhancements
- Page preview/draft mode in editor
- Page version history
- Image gallery block type
- Embed block type
- SEO metadata preview
