<p align="center">
  <img src="src/assets/logos/fixbhai-logo.png" alt="FixBhai" height="80" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Bootstrap-5-7952B3?logo=bootstrap&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/PHP-8-777BB4?logo=php&logoColor=white" />
  <img src="https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white" />
  <img src="https://img.shields.io/badge/Currency-BDT%20৳-green" />
</p>

---

## About

FixBhai is a local home service marketplace for Bangladesh. Customers book verified technicians for AC repair, plumbing, electrical, cleaning and more. Prices are in Bangladeshi Taka (৳).

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Environment

```bash
cp .env.example .env.local
```

```env
VITE_API_URL=http://localhost/backend/api
VITE_USE_MOCK=true    # set false when PHP backend is running
```

> Login works with any email + password in mock mode.

---

## Database

```bash
mysql -u root -p < database/fixbhai.sql
```

After importing, generate real password hashes:

1. Visit `http://localhost/backend/seed.php`
2. Copy the `UPDATE` statements shown
3. Run them in phpMyAdmin
4. Delete `backend/seed.php`

---

## Demo Accounts

| Role | Email | Password |
|---|---|---|
| Customer | rahim@gmail.com | Demo@1234 |
| Admin | admin@fixbhai.com | Admin@123 |
| Technician | karim@fixbhai.com | Tech@1234 |

---

## Services (BDT)

| Service | Starting Price |
|---|---|
| AC Repair | ৳800 |
| Plumbing | ৳400 |
| Electrical | ৳300 |
| Cleaning | ৳600 |
| Painting | ৳1,200 |
| Carpentry | ৳500 |
| Pest Control | ৳700 |
| CCTV Install | ৳1,500 |

---

## Project Structure

```
├── src/                  React frontend (Vite)
│   ├── assets/           Logos, icons, images
│   ├── api/              Axios client + API modules
│   ├── components/       UI, layout, common components
│   ├── context/          Auth, Booking, Toast contexts
│   ├── features/         Feature-based components
│   ├── hooks/            Custom React hooks
│   ├── pages/            Route-level pages
│   └── services/         Business logic layer
├── backend/              PHP REST API (XAMPP)
│   ├── api/auth/         login, register, me
│   ├── api/services/     service catalogue
│   ├── api/technicians/  technician directory
│   ├── api/bookings/     create, list, status
│   └── config/           database, helpers, JWT
└── database/
    └── fixbhai.sql       MySQL schema + seed data
```

---

## Tech Stack

React 18 · Vite · Bootstrap 5 · React Router v6 · Axios · PHP 8 · MySQL 8 · JWT

## License

MIT © 2025 FixBhai Bangladesh
