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
- Hidden "Admin Portal" button from public hero section
- Restructured "Corporate Identity" menu with sub-pages

### Phase 2 - CMS Enhancements (COMPLETE)
- Hero CMS with video/image backgrounds, visibility toggles
- Employee CMS with image upload
- News CMS with file upload only

### Phase 3 - Homepage Rework (COMPLETE)
- ArcelorMittal-style news section (1 large + 2 small featured stories)
- Events page with "Add to Outlook" ICS download
- Ticker banner with manual/default modes
- Service Hub with iframe embedding and fallback

### Phase 4 - Full Page & Menu CMS (COMPLETE - Feb 11, 2026)
- **Page Management** (`/admin/pages`): List, create, duplicate, publish/unpublish, delete pages
- **Page Editor** (`/admin/pages/:id/edit`): Block-based editor with 8 block types (Hero, Text, Image, Two Columns, Cards, Features, CTA, Accordion/FAQ)
- **Menu Management** (`/admin/menus`): Add/edit/delete/reorder menu items, submenus, visibility toggle, link to CMS pages or custom URLs
- **Dynamic Page Rendering** (`/page/:slug`): Public-facing pages rendered from CMS blocks
- **Page Templates**: 5 predefined templates (Blank, Content, Landing, About, Service)
- **Route fix**: Reorder endpoint moved before parameterized routes

## Admin Credentials
- Email: admin@gys.co.id
- Password: admin123

## Key API Endpoints
- Pages: GET/POST `/api/pages`, GET/PUT/DELETE `/api/pages/:id`, GET `/api/pages/slug/:slug`
- Menus: GET `/api/menus`, GET `/api/menus/flat`, POST `/api/menus`, PUT `/api/menus/reorder`, PUT/DELETE `/api/menus/:id`
- Templates: GET `/api/templates`
- Settings: GET/PUT `/api/settings/hero`, GET/PUT `/api/settings/ticker`
- Content: `/api/news`, `/api/events`, `/api/photos`, `/api/albums`, `/api/employees`, `/api/users`

## Prioritized Backlog

### P1 - Improvements
- Replace static corporate placeholder pages with dynamic CMS-rendered pages
- Page preview/draft mode in editor
- Make public Header navigation dynamic (driven by CMS menu items instead of hardcoded)

### P2 - Enhancements
- Rich text editing for text blocks (WYSIWYG)
- Page version history / undo
- Image gallery block type
- Embed block type (for iframes)
- SEO metadata preview
