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
- **Corporate History & Group Structure** (`/corporate/history`): Redesigned with horizontal green timeline (1970, 1989, 1991, 2024, Today milestones) and shareholder structure diagram (Yamato 45%, SYS 35%, Hanwa 15%, GRP 5%) with detail cards

### Phase 3 - CMS Page Management (In Progress)
- Page templates (7 templates) created on backend
- New "Create Page" dialog with template-based and blank creation flows
- Enhanced block editor with multiple block types
- **Pending:** Seed existing nav menu pages into CMS page list

## File Architecture
```
/app/frontend/src/pages/
  CorporatePages.jsx          # Re-exports from split files
  CorporateOverview.jsx        # Overview page
  CorporatePhilosophy.jsx      # Philosophy page shell
  PhilosophySections.jsx        # Quality/Innovation/Sustainability sections
  CorporateHistory.jsx          # History page shell
  HistoryTimeline.jsx            # Horizontal timeline component
  HistoryShareholder.jsx         # Shareholder diagram + cards
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
- Admin: admin@test.com / password
