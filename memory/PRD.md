# PT Garuda Yamato Steel (GYS) Intranet - Product Requirements Document

## Original Problem Statement
Build a professional, high-performance Intranet for PT Garuda Yamato Steel (GYS) using React and SharePoint Framework (SPFx) principles with:
- CMS-based content management
- Employee directory searchable by name, department, email, position
- Functional calendar with add/edit events
- Role-based authentication for CMS (admin access)
- Admin photo upload functionality

## User Personas
1. **GYS Employees** - View news, events, gallery, directory, access services
2. **Admin/Content Manager** - Manage all content via CMS (news, events, photos, employees)

## Core Requirements (Static)
- Inter font family throughout
- Primary color: #0C765B (Steel Green)
- Glassmorphism effects for cards and overlays
- Framer Motion animations
- SharePoint-like modern experience

## What's Been Implemented ✅

### Date: Feb 4, 2026

#### Backend (FastAPI + MongoDB)
- [x] News CRUD API with featured flag
- [x] Events CRUD API (events, holidays, birthdays)
- [x] Photos CRUD API with upload
- [x] Employees CRUD API with search
- [x] Admin authentication (JWT)
- [x] Auto-seed demo data

#### Frontend (React + Tailwind + shadcn/ui)
- [x] **Homepage Sections:**
  - Sticky header with mega-menu navigation
  - Full-screen hero with parallax, gradient overlay, animated stats
  - News & Announcements (featured + grid)
  - Events & Calendar (holidays, birthdays, calendar widget)
  - Photo Gallery (4-column masonry with lightbox)
  - Employee Services Hub (IT, HR, FA cards)
  - Employee Directory (searchable, filterable)
  - Footer with 3-column sitemap + news ticker

- [x] **Sub-pages:**
  - /corporate/vision, /mission, /about
  - /compliance/sop, /policies, /safety
  - /services/it, /hr, /fa

- [x] **Admin CMS:**
  - Login with demo credentials
  - Dashboard with stats
  - News management (CRUD)
  - Events management (CRUD)
  - Gallery management (CRUD + upload)
  - Employee directory management (CRUD)

## Prioritized Backlog

### P0 (Critical) - DONE
- ✅ Core homepage sections
- ✅ Admin authentication
- ✅ Content management CRUD

### P1 (High) - Future
- [ ] Rich text editor for news content
- [ ] Event RSVP functionality
- [ ] Document upload for SOP/Policies

### P2 (Medium) - Future
- [ ] User roles (viewer, editor, admin)
- [ ] Comments on news articles
- [ ] Photo album categorization
- [ ] Push notifications

### P3 (Low) - Future
- [ ] Dark mode toggle
- [ ] Multi-language support
- [ ] Analytics dashboard
- [ ] SSO integration

## Next Tasks
1. Add rich text editor (TipTap/Quill) for news content
2. Implement document upload for SOP/Policies sections
3. Add event RSVP with attendance tracking
4. Consider user role hierarchy
