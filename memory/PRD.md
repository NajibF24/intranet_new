# PT Garuda Yamato Steel - Intranet CMS

## Project Overview
A professional intranet website for PT Garuda Yamato Steel (GYS) with content management capabilities.

## Original Requirements
- Public-facing intranet website without authentication
- CMS for admins to manage News, Calendar, Photos, and Employee Directory
- Role-based access control for different content sections
- Hero section with manageable content and visual effects
- Searchable Employee Directory
- Events Calendar
- Photo Gallery with album organization
- News section with full article pages

## Current Status: COMPLETE

## Implemented Features

### Public Website
- [x] Homepage with hero section, news, events, gallery preview
- [x] News & Announcements page with category filters
- [x] Individual News Detail pages with full content
- [x] Events Calendar page
- [x] Photo Gallery with album view support
- [x] Employee Directory with search
- [x] Corporate Identity pages (Vision, Mission, Journey, About)
- [x] Compliance pages (SOP, Policies, Safety)
- [x] Service pages (IT, HR, Finance)
- [x] Sticky news banner that appears on scroll
- [x] Responsive design with GYS branding

### Admin CMS
- [x] JWT Authentication with admin login
- [x] Dashboard with content statistics
- [x] News Management (CRUD with file upload, custom categories)
- [x] Events Management (CRUD)
- [x] Gallery Management with Albums
  - Create/Edit/Delete albums
  - Assign photos to albums
  - File upload support
- [x] Employee Directory Management
- [x] Hero Settings with visual toggles
  - Background image upload/URL
  - Animated Particles toggle
  - Gradient Overlay toggle
  - Floating Stats Cards toggle
- [x] User Management
  - Create/Edit/Delete admin users
  - Role assignment (Admin, Editor, Viewer)

### Technical Features
- [x] File upload with 5MB limit
- [x] Recommended image dimensions displayed
- [x] Role-based route protection
- [x] Add Calendar button hidden for non-admin users

## Architecture

### Frontend (React + Tailwind CSS)
- `/app/frontend/src/pages/` - Main page components
- `/app/frontend/src/components/` - Reusable components
- `/app/frontend/src/lib/api.js` - API service

### Backend (FastAPI + MongoDB)
- `/app/backend/server.py` - Main API server
- JWT authentication
- File upload handling

## Test Credentials
- Email: admin@gys.co.id
- Password: admin123

## API Endpoints
- Auth: POST /api/auth/login, GET /api/auth/me
- Users: GET/POST/PUT/DELETE /api/users
- News: GET/POST/PUT/DELETE /api/news
- Events: GET/POST/PUT/DELETE /api/events
- Albums: GET/POST/PUT/DELETE /api/albums
- Photos: GET/POST/PUT/DELETE /api/photos
- Hero: GET/PUT /api/settings/hero
- Employees: GET/POST/PUT/DELETE /api/employees

## Recommended Image Dimensions
- Hero Background: 1920x1080px (16:9), max 5MB
- News Images: 800x450px (16:9), max 5MB
- Gallery Photos: 800x800px (1:1), max 5MB
- Album Covers: 800x600px (4:3), max 5MB

## Completed in This Session
- User Management system with roles
- News Detail page for full article view
- Photo Albums in Gallery management
- Hero visual effects toggles
- File upload support in all Admin sections
- Custom category option for News
- **Removed** Add Calendar button from public Events page (admin only can add events in Admin panel)
- **Added** "Add to Outlook" button for each event - downloads .ics file for Outlook/Google Calendar
- **Added** Ticker Banner Settings in Admin panel with:
  - Enable/Disable toggle
  - Default Mode (shows featured news titles automatically)
  - Manual Mode (custom text input)
  - Badge text customization
  - Icon selection (7 options)
- **Added** Service Hub iframe embedding:
  - IT Global Services → https://globalservices.gyssteel.com (fallback if blocked)
  - GYS Darwinbox → https://gys.darwinbox.com
  - FA E-Asset → https://garudayamatosteel.outsystemsenterprise.com/eAsset_Web/ (working!)
  - Features: Refresh, Fullscreen, Open in New Tab buttons
  - Graceful fallback if iframe blocked by security headers

## Future Enhancements (Backlog)
- P2: Additional user permissions granularity
- P2: Bulk photo upload
- P3: Email notifications for events
- P3: Analytics dashboard
- P3: Multi-language support
