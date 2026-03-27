<p align="center">
  <img src="public/fixbhai-logo.png" alt="FixBhai Logo" height="80" />
</p>

<h1 align="center">FixBhai — Trusted Services at Your Doorstep</h1>

<p align="center">
  A production-level local technician service marketplace built with React, Bootstrap, and MySQL.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Bootstrap-5-7952B3?logo=bootstrap&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Axios-1.x-5A29E4?logo=axios&logoColor=white" />
  <img src="https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white" />
  <img src="https://img.shields.io/badge/License-MIT-green" />
</p>

---

## Overview

FixBhai is a startup-level home services platform that connects customers with verified local technicians for AC repair, plumbing, electrical work, cleaning, and more. Customers can search, filter, and book services in minutes. Technicians manage their jobs through a dedicated portal. Admins oversee the entire platform through a rich analytics dashboard.

---

## Features

### Customer
- Browse 8+ service categories with search and filter
- View verified technician profiles with ratings and reviews
- 3-step booking wizard — service → schedule → confirm
- Real-time booking status tracking
- Customer dashboard with booking history and stats

### Technician
- Dedicated technician portal
- View assigned jobs and earnings
- Availability toggle
- Profile management

### Admin
- Full platform overview with revenue and booking analytics
- Manage all bookings with status controls
- Technician and user management
- Service performance breakdown with progress charts

### Platform
- JWT authentication with refresh token rotation
- Role-based access control (customer / technician / admin)
- Optimistic UI updates with automatic rollback on failure
- Global toast notification system
- Mock API layer — swap to real backend with one env flag
- Fully responsive — mobile-first Bootstrap grid

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite 8 |
| Styling | Bootstrap 5, Bootstrap Icons, Custom CSS |
| Routing | React Router v6 |
| HTTP Client | Axios with interceptors + token refresh |
| State | React Context + useReducer |
| Database | MySQL 8.0 |

---

## Project Structure

```
local-technician-platform/
├── frontend/                  ← React app (this repo)
│   ├── public/
│   │   └── fixbhai-logo.png
│   ├── src/
│   │   ├── api/               ← Axios client + domain API modules
│   │   ├── components/
│   │   │   ├── ui/            ← Button, Input, Card, Badge, Modal, Spinner
│   │   │   ├── layout/        ← Navbar, Footer, Layout
│   │   │   └── common/        ← UserAvatar, ProtectedRoute, EmptyState, etc.
│   │   ├── context/           ← AuthContext, BookingContext, ToastContext
│   │   ├── features/
│   │   │   ├── auth/          ← LoginForm, RegisterForm
│   │   │   ├── bookings/      ← BookingForm, BookingCard, BookingList
│   │   │   ├── services/      ← ServiceCard, ServiceGrid, ServiceSearch
│   │   │   ├── technicians/   ← TechnicianCard, TechnicianList, TechnicianFilter
│   │   │   ├── dashboard/     ← DashboardShell, StatGrid, DataTable, ActivityFeed
│   │   │   │   ├── admin/     ← AdminOverviewTab, AdminBookingsTab, AdminAnalyticsTab
│   │   │   │   └── technician/← TechOverviewTab
│   │   │   └── home/          ← HeroSection, CategoryStrip, HowItWorks, etc.
│   │   ├── hooks/             ← useForm, useFilter, useAsync, useApi, useLocalStorage
│   │   ├── pages/             ← Route-level page components
│   │   ├── routes/            ← Centralised route definitions
│   │   ├── services/          ← Business logic layer (authService, bookingService)
│   │   ├── utils/             ← formatters, validators, passwordStrength
│   │   └── constants/         ← Routes, nav items, service colours, stat cards
│   ├── .env
│   ├── .env.example
│   └── vite.config.js
│
├── backend/                   ← API server (Node.js / Laravel / Django)
│
└── database/
    └── fixbhai.sql            ← MySQL schema + seed data
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- MySQL 8.0+ (for backend integration)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/fixbhai.git
cd fixbhai
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Backend API URL (leave default to use mock data)
VITE_API_URL=https://api.fixbhai.in/v1

# Set to 'false' when your backend is running
VITE_USE_MOCK=true
```

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### 5. Build for production

```bash
npm run build
```

---

## Database Setup

```bash
mysql -u root -p < database/fixbhai.sql
```

This creates the `fixbhai` database with all tables, seed data, and views.

**Tables:** `users` · `refresh_tokens` · `service_categories` · `services` · `technicians` · `bookings` · `reviews` · `notifications`

**Views:** `v_booking_summary` · `v_technician_leaderboard`

---

## Demo Accounts

| Role | Email | Password |
|---|---|---|
| Customer | demo@fixbhai.in | Demo@1234 |
| Admin | admin@fixbhai.in | Admin@123 |
| Technician | rajesh@fixbhai.in | Tech@1234 |

> Passwords above are for the seeded database. In mock mode (default), any email + password works.

---

## Routes

| Path | Access | Page |
|---|---|---|
| `/` | Public | Homepage |
| `/services` | Public | Services catalogue |
| `/technicians` | Public | Technician directory |
| `/booking` | Auth required | Booking wizard |
| `/login` | Guest only | Login |
| `/register` | Guest only | Register |
| `/dashboard` | Customer | Customer dashboard |
| `/admin` | Admin only | Admin dashboard |
| `/technician` | Technician only | Technician portal |

---

## API Layer

The frontend ships with a full mock API (`VITE_USE_MOCK=true`) so it runs without a backend. Every API module has a real/mock branch:

```js
// Switch to real API — one line change in .env.local
VITE_USE_MOCK=false
VITE_API_URL=http://localhost:3000/api/v1
```

**Axios client features:**
- JWT Bearer token attached to every request
- 401 → automatic token refresh with request queue
- 422 → per-field validation errors surfaced to forms
- Network errors → user-friendly toast messages

---

## Services Offered

| Service | Starting Price |
|---|---|
| AC Repair | ₹299 |
| Plumbing | ₹199 |
| Electrical | ₹249 |
| Cleaning | ₹399 |
| Painting | ₹599 |
| Carpentry | ₹349 |
| Pest Control | ₹499 |
| CCTV Install | ₹799 |

---

## License

MIT © 2025 FixBhai
