<p align="center">
  <img src="public/fixbhai-logo.png" alt="FixBhai" height="80" />
</p>


## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Environment

```bash
cp .env.example .env.local
```

```env
VITE_API_URL=https://api.fixbhai.in/v1
VITE_USE_MOCK=true   # set false when backend is running
```

## Database

```bash
mysql -u root -p < database/fixbhai.sql
```

## Demo Accounts

| Role | Email | Password |
|---|---|---|
| Customer | demo@fixbhai.in | Demo@1234 |
| Admin | admin@fixbhai.in | Admin@123 |
| Technician | rajesh@fixbhai.in | Tech@1234 |

## Tech Stack

React 18 · Vite · Bootstrap 5 · React Router v6 · Axios · MySQL 8

## License

MIT © 2025 FixBhai
