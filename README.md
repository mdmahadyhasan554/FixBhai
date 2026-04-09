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

FixBhai is a comprehensive home service marketplace platform for Bangladesh. Customers can book verified technicians for various services including AC repair, plumbing, electrical work, cleaning, and more. The platform features role-based dashboards for customers, technicians, and administrators, with full booking management, payment processing, and review systems. All prices are in Bangladeshi Taka (৳).

---

## Features

### Customer Features
- Browse and search services with detailed pricing
- Book services with preferred date/time and location
- Track booking status in real-time
- Make secure payments (Cash/Card/Mobile Banking)
- Rate and review completed services
- View booking history and manage active bookings
- Cancel bookings with reason

### Technician Features
- View assigned bookings and job details
- Update booking status (accepted, in-progress, completed)
- Manage availability and profile
- View earnings and performance metrics
- Access customer contact information

### Admin Features
- Comprehensive dashboard with statistics
- User Management: Add, edit, delete users; assign roles; activate/deactivate accounts
- Technician Management: Approve/reject applications; suspend/reactivate; view performance
- Service Management: Add, edit, delete services; configure pricing; customize icons and colors
- Booking oversight and management
- System-wide analytics and reporting

---

## Quick Start

See [SETUP.md](SETUP.md) for detailed setup instructions.

```bash
# 1. Install dependencies
npm install

# 2. Setup database (XAMPP required)
# - Start Apache and MySQL in XAMPP
# - Import database/fixbhai.sql into phpMyAdmin

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local: Set VITE_USE_MOCK=false for backend mode

# 4. Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Demo Accounts

| Role | Email | Password |
|---|---|---|
| Admin | admin@fixbhai.com | Admin@123 |
| Customer | rahim@gmail.com | Demo@1234 |
| Technician | karim@fixbhai.com | Tech@1234 |

---

## Environment Configuration

The application supports two modes:

### Mock Mode (Development without Backend)
```env
VITE_USE_MOCK=true
```
Uses mock data for testing frontend without PHP backend. Any email/password combination works.

### Backend Mode (Full Stack)
```env
VITE_API_URL=http://localhost/reactJS/FixBhai/backend/api
VITE_USE_MOCK=false
VITE_API_TIMEOUT=10000
```
Connects to PHP REST API with MySQL database. Requires XAMPP running.

> Important: After changing VITE_USE_MOCK, restart the dev server (Ctrl+C, then npm run dev) and clear browser storage.

---

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/me` - Get current user
- `POST /auth/refresh` - Refresh JWT token

### Services
- `GET /services` - List all services
- `GET /services/{id}` - Get service details
- `POST /services` - Create service (Admin)
- `PUT /services/{id}` - Update service (Admin)
- `DELETE /services/{id}` - Delete service (Admin)

### Bookings
- `POST /bookings/create` - Create booking
- `GET /bookings` - List user bookings
- `GET /bookings/{id}` - Get booking details
- `PUT /bookings/status` - Update booking status
- `POST /bookings/review` - Submit review

### Technicians
- `GET /technicians` - List technicians
- `GET /technicians/{id}` - Get technician details
- `PUT /technicians/{id}` - Update technician (Admin)

### Payments
- `POST /payments/process` - Process payment
- `GET /payments/{id}` - Get payment details

---

## Services (BDT)

| Service | Starting Price | Description |
|---|---|---|
| AC Repair | ৳800 | Installation, repair, servicing |
| Plumbing | ৳400 | Pipe repair, installation, leak fixing |
| Electrical | ৳300 | Wiring, fixture installation, repairs |
| Cleaning | ৳600 | Home, office, deep cleaning |
| Painting | ৳1,200 | Interior, exterior, wall painting |
| Carpentry | ৳500 | Furniture repair, installation |
| Pest Control | ৳700 | Termite, cockroach, rodent control |
| CCTV Install | ৳1,500 | Camera installation, setup |

---

## Project Structure

```
FixBhai/
├── backend/                    # PHP REST API
│   ├── api/
│   │   ├── auth/              # Authentication endpoints
│   │   ├── bookings/          # Booking management
│   │   ├── payments/          # Payment processing
│   │   ├── services/          # Service catalog
│   │   └── technicians/       # Technician management
│   ├── config/
│   │   ├── database.php       # Database connection
│   │   ├── helpers.php        # JWT, CORS, utilities
│   │   └── .env               # Backend environment config
│   └── .htaccess              # Apache configuration
│
├── database/
│   ├── fixbhai.sql            # Database schema + seed data
│   └── README.md              # Database documentation
│
├── src/                       # React frontend
│   ├── api/                   # API client layer
│   │   ├── client.js          # Axios instance with interceptors
│   │   ├── mock.js            # Mock data for development
│   │   ├── authApi.js         # Auth API calls
│   │   ├── bookingApi.js      # Booking API calls
│   │   ├── serviceApi.js      # Service API calls
│   │   └── technicianApi.js   # Technician API calls
│   │
│   ├── components/            # Reusable UI components
│   │   ├── common/            # Buttons, cards, modals
│   │   ├── layout/            # Navbar, footer, sidebar
│   │   └── ui/                # Form inputs, loaders
│   │
│   ├── context/               # React Context providers
│   │   ├── AuthContext.jsx    # Authentication state
│   │   ├── BookingContext.jsx # Booking state
│   │   └── ToastContext.jsx   # Toast notifications
│   │
│   ├── features/              # Feature-based modules
│   │   ├── auth/              # Login, register forms
│   │   ├── bookings/          # Booking forms, lists
│   │   ├── dashboard/         # Dashboard components
│   │   │   ├── admin/         # Admin management tabs
│   │   │   ├── customer/      # Customer dashboard
│   │   │   └── technician/    # Technician dashboard
│   │   ├── services/          # Service catalog
│   │   └── technicians/       # Technician directory
│   │
│   ├── hooks/                 # Custom React hooks
│   │   ├── useAsync.js        # Async operation handler
│   │   ├── useAuth.js         # Auth hook
│   │   └── useBooking.js      # Booking hook
│   │
│   ├── pages/                 # Route-level pages
│   │   ├── HomePage.jsx       # Landing page
│   │   ├── LoginPage.jsx      # Login page
│   │   ├── ServicesPage.jsx   # Services catalog
│   │   ├── BookingPage.jsx    # Booking form
│   │   ├── DashboardPage.jsx  # Customer dashboard
│   │   ├── TechnicianPage.jsx # Technician dashboard
│   │   └── AdminPage.jsx      # Admin dashboard
│   │
│   ├── routes/                # Routing configuration
│   │   └── AppRoutes.jsx      # Route definitions
│   │
│   ├── services/              # Business logic layer
│   │   ├── authService.js     # Auth business logic
│   │   └── bookingService.js  # Booking business logic
│   │
│   ├── utils/                 # Utility functions
│   │   ├── validators.js      # Form validation
│   │   ├── formatters.js      # Data formatting
│   │   └── constants.js       # App constants
│   │
│   ├── App.jsx                # Root component
│   └── main.jsx               # Entry point
│
├── .env.local                 # Local environment config
├── .env.example               # Environment template
├── vite.config.js             # Vite configuration
├── package.json               # Dependencies
└── SETUP.md                   # Setup instructions
```

---

## Tech Stack

### Frontend
- React 18 with Hooks
- Vite for fast development and building
- React Router v6 for routing
- Bootstrap 5 for UI components
- Axios for HTTP requests
- Context API for state management

### Backend
- PHP 8 REST API
- MySQL 8.0 database
- JWT authentication
- CORS enabled
- RESTful architecture

### Development Tools
- ESLint for code quality
- XAMPP for local PHP/MySQL environment
- Git for version control

---

## Security Features

- JWT-based authentication with secure token storage
- Password hashing with PHP password_hash()
- Role-based access control (RBAC)
- Input validation and sanitization
- SQL injection prevention with prepared statements
- CORS configuration for API security
- Booking ownership validation
- Protected admin routes

---

## Troubleshooting

### Login Issues
1. Verify XAMPP Apache and MySQL are running
2. Check database is imported correctly
3. Ensure `.env.local` has `VITE_USE_MOCK=false`
4. Restart dev server: `Ctrl+C` then `npm run dev`
5. Clear browser storage: `localStorage.clear()` in console
6. Hard refresh: `Ctrl+Shift+R`

### Blank Page / White Screen
1. Check browser console for errors
2. Verify all dependencies installed: `npm install`
3. Check for syntax errors in recent changes
4. Restart dev server

### API Connection Errors
1. Verify backend URL in `.env.local`
2. Check XAMPP services are running
3. Test backend directly: `http://localhost/reactJS/FixBhai/backend/api/auth/login.php`
4. Check browser network tab for failed requests

### Database Connection Failed
1. Verify MySQL is running in XAMPP
2. Check database name is `fixbhai`
3. Verify credentials in `backend/config/.env`
4. Test connection in phpMyAdmin

---

## Available Scripts

```bash
npm run dev          # Start development server (http://localhost:5173)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

---

## License

MIT © 2025 FixBhai Bangladesh

---

## Support

For issues and questions:
- Check [SETUP.md](SETUP.md) for setup instructions
- Review troubleshooting section above
- Check browser console for error messages
- Verify XAMPP services are running
