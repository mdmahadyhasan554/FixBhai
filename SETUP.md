# FixBhai Setup Guide

Quick setup guide for local development.

## Prerequisites

- Node.js 18+
- XAMPP (Apache + MySQL)
- PHP 8.0+

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Database

1. Start XAMPP Control Panel
2. Start Apache and MySQL services
3. Open phpMyAdmin: http://localhost/phpmyadmin
4. Create new database: `fixbhai`
5. Import file: `database/fixbhai.sql`

### 3. Configure Environment

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Update `.env.local` if needed:

```env
VITE_API_URL=http://localhost/reactJS/FixBhai/backend/api
VITE_USE_MOCK=false
VITE_API_TIMEOUT=10000
```

### 4. Start Development Server

```bash
npm run dev
```

### 5. Access Application

Open http://localhost:5173

## Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@fixbhai.com | Admin@123 |
| Customer | rahim@gmail.com | Demo@1234 |
| Technician | karim@fixbhai.com | Tech@1234 |

## Troubleshooting

### Network Error on Login

1. Ensure Apache and MySQL are running in XAMPP
2. Verify database is imported
3. Check API URL in `.env.local`
4. Restart dev server: `Ctrl+C` then `npm run dev`
5. Hard refresh browser: `Ctrl+Shift+R`

### Database Connection Error

- Verify MySQL is running
- Check database name is `fixbhai`
- Update credentials in `backend/config/database.php` if needed

### CORS Issues

- Ensure `backend/.htaccess` file exists
- Check browser console for specific CORS errors

## Project Structure

```
FixBhai/
├── backend/              # PHP REST API
│   ├── api/             # API endpoints
│   └── config/          # Configuration
├── database/            # SQL files
├── public/              # Static assets
├── src/                 # React source
│   ├── api/             # API client
│   ├── components/      # UI components
│   ├── features/        # Feature modules
│   ├── pages/           # Page components
│   └── routes/          # Routing
└── .env.local           # Environment config
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Need Help?

Check the main README.md for detailed documentation.
