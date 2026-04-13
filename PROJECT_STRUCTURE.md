# FixBhai Project Structure

## Overview
FixBhai is a home service booking platform built with React (frontend) and PHP (backend).

## Directory Structure

```
FixBhai/
├── backend/                    # PHP Backend API
│   ├── api/                    # API Endpoints
│   │   ├── admin/              # Admin-only endpoints
│   │   │   ├── bookings.php    # Get all bookings
│   │   │   ├── technicians.php # Manage technicians
│   │   │   ├── users.php       # Get all users
│   │   │   ├── user-role.php   # Update user role
│   │   │   └── user-status.php # Update user status
│   │   ├── auth/               # Authentication
│   │   │   ├── login.php       # User login
│   │   │   ├── logout.php      # User logout
│   │   │   ├── refresh.php     # Refresh session
│   │   │   └── register.php    # User registration
│   │   ├── bookings/           # Booking management
│   │   │   ├── create.php      # Create booking
│   │   │   ├── review.php      # Add review
│   │   │   ├── status.php      # Update status
│   │   │   └── user.php        # Get user bookings
│   │   ├── users/              # User profile
│   │   │   ├── delete-avatar.php
│   │   │   ├── update-profile.php
│   │   │   └── upload-avatar.php
│   │   └── ...
│   ├── config/                 # Configuration
│   │   ├── .env                # Environment variables
│   │   ├── .env.example        # Environment template
│   │   ├── database.php        # Database connection
│   │   └── helpers.php         # Shared utilities
│   ├── uploads/                # File uploads
│   │   └── avatars/            # User avatars
│   └── .htaccess               # Apache config
│
├── database/                   # Database files
│   ├── fixbhai.sql             # Database schema
│   └── README.md               # Database setup guide
│
├── src/                        # React Frontend
│   ├── api/                    # API Client Layer
│   │   ├── adminApi.js         # Admin API functions
│   │   ├── authApi.js          # Auth API functions
│   │   ├── bookingApi.js       # Booking API functions
│   │   ├── client.js           # Axios instance
│   │   ├── data.js             # Mock data
│   │   ├── mock.js             # Mock API
│   │   └── userApi.js          # User API functions
│   │
│   ├── components/             # Reusable Components
│   │   ├── common/             # Common components
│   │   │   ├── AvatarUpload.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   └── UserAvatar.jsx
│   │   ├── layout/             # Layout components
│   │   │   ├── Footer.jsx
│   │   │   └── Navbar.jsx
│   │   └── ui/                 # UI primitives
│   │       ├── Button.jsx
│   │       ├── Card.jsx
│   │       ├── Input.jsx
│   │       └── ...
│   │
│   ├── context/                # React Context
│   │   ├── AuthContext.jsx     # Authentication state
│   │   ├── BookingContext.jsx  # Booking state
│   │   └── ToastContext.jsx    # Toast notifications
│   │
│   ├── features/               # Feature Modules
│   │   ├── auth/               # Authentication UI
│   │   ├── bookings/           # Booking UI
│   │   ├── dashboard/          # Dashboard UI
│   │   │   ├── admin/          # Admin dashboard tabs
│   │   │   │   ├── AdminBookingsTab.jsx
│   │   │   │   ├── AdminUsersTab.jsx
│   │   │   │   ├── AdminTechniciansTab.jsx
│   │   │   │   └── ...
│   │   │   ├── DashboardShell.jsx
│   │   │   └── ProfileTab.jsx
│   │   └── services/           # Services UI
│   │
│   ├── hooks/                  # Custom React Hooks
│   │   ├── useAsync.js         # Async operations
│   │   └── useDebounce.js      # Debounce hook
│   │
│   ├── pages/                  # Page Components
│   │   ├── AdminPage.jsx       # Admin dashboard
│   │   ├── DashboardPage.jsx   # Customer dashboard
│   │   ├── HomePage.jsx        # Landing page
│   │   ├── LoginPage.jsx       # Login page
│   │   └── ...
│   │
│   ├── routes/                 # Routing
│   │   └── index.jsx           # Route definitions
│   │
│   ├── services/               # Business Logic
│   │   ├── authService.js      # Auth logic
│   │   └── bookingService.js   # Booking logic
│   │
│   ├── utils/                  # Utilities
│   │   ├── formatters.js       # Data formatters
│   │   └── validators.js       # Input validators
│   │
│   ├── App.jsx                 # Root component
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles
│
├── public/                     # Static Assets
│   ├── favicon.svg
│   └── icons.svg
│
├── .env.local                  # Local environment config
├── .env.example                # Environment template
├── .gitignore                  # Git ignore rules
├── index.html                  # HTML template
├── package.json                # NPM dependencies
├── README.md                   # Main documentation
├── SETUP.md                    # Setup instructions
├── vite.config.js              # Vite configuration
└── PROJECT_STRUCTURE.md        # This file
```

## Key Technologies

### Frontend
- **React 18** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Bootstrap 5** - CSS framework
- **Vite** - Build tool

### Backend
- **PHP 8+** - Server-side language
- **MySQL** - Database
- **PDO** - Database abstraction
- **Session-based auth** - Authentication

## Authentication Flow

1. User logs in via `/api/auth/login.php`
2. Backend creates PHP session with user data
3. Session cookie sent to browser (HttpOnly, SameSite=Lax)
4. Frontend includes `credentials: 'include'` in all requests
5. Backend validates session on protected endpoints

## API Conventions

### Request Format
```javascript
fetch('/api/endpoint.php', {
  method: 'POST',
  credentials: 'include', // REQUIRED for sessions
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ data })
})
```

### Response Format
```json
{
  "success": true,
  "data": {},
  "message": "Success message"
}
```

### Error Format
```json
{
  "success": false,
  "message": "Error message",
  "errors": {} // Optional field errors
}
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  phone VARCHAR(20),
  role ENUM('customer', 'technician', 'admin'),
  is_active TINYINT(1) DEFAULT 1,
  avatar_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Bookings Table
```sql
CREATE TABLE bookings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  technician_id INT,
  service_id INT,
  booking_date DATE,
  booking_time TIME,
  status ENUM('pending', 'confirmed', 'completed', 'cancelled'),
  total_amount DECIMAL(10,2),
  rating INT,
  review TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (technician_id) REFERENCES users(id)
);
```

## Environment Variables

### Frontend (.env.local)
```env
VITE_API_URL=http://localhost/reactJS/FixBhai/backend/api
VITE_USE_MOCK=false
VITE_API_TIMEOUT=10000
```

### Backend (backend/config/.env)
```env
DB_HOST=localhost
DB_NAME=fixbhai
DB_USER=root
DB_PASS=
JWT_SECRET=your_secret_key_here
JWT_EXPIRY=604800
```

## Development Workflow

1. **Start XAMPP** (Apache + MySQL)
2. **Import database** from `database/fixbhai.sql`
3. **Configure environment** files
4. **Install frontend dependencies**: `npm install`
5. **Start dev server**: `npm run dev`
6. **Access app**: `http://localhost:5173`

## User Roles

### Customer
- Create bookings
- View own bookings
- Rate and review services
- Manage profile

### Technician
- View assigned bookings
- Update booking status
- Manage profile

### Admin
- View all users and bookings
- Manage user roles and status
- Approve/reject technicians
- View analytics

## Code Organization Principles

1. **Separation of Concerns**: API, business logic, and UI are separated
2. **Reusability**: Common components and utilities are shared
3. **Consistency**: All API endpoints follow same patterns
4. **Security**: Authentication required for protected routes
5. **Error Handling**: Consistent error responses across all endpoints

## Testing

### Test Accounts
- **Admin**: admin@fixbhai.com / Admin@123
- **Customer**: rahim@gmail.com / Demo@1234
- **Technician**: karim@fixbhai.com / Tech@1234

## Deployment Checklist

- [ ] Update environment variables for production
- [ ] Change JWT_SECRET to strong random value
- [ ] Enable HTTPS and set session.cookie_secure=1
- [ ] Change SameSite cookie to 'None' or 'Strict'
- [ ] Update CORS origin to production domain
- [ ] Optimize database indexes
- [ ] Enable error logging
- [ ] Disable debug mode
- [ ] Set up automated backups
