# FixBhai Database Setup

## Quick Setup

1. **Open phpMyAdmin**: `http://localhost/phpmyadmin`
2. **Create Database**: Click "New" → Name: `fixbhai` → Create
3. **Import SQL**: Select `fixbhai` database → Import → Choose `fixbhai.sql` → Go

## Database Schema

### Tables

#### 1. users
Stores all users (customers, technicians, admins)
- `id` - Primary key
- `name` - Full name
- `email` - Unique email (login)
- `phone` - Phone number
- `password_hash` - Bcrypt hashed password
- `role` - customer | technician | admin
- `specialization` - Technician specialization (NEW)
- `specialization_other` - Custom specialization text (NEW)
- `avatar_url` - Profile picture URL
- `is_active` - Account status
- `created_at`, `updated_at` - Timestamps

#### 2. bookings
Service booking records
- `id` - Booking ID (varchar)
- `customer_id` - Foreign key to users
- `technician_id` - Foreign key to technicians
- `service_id` - Foreign key to services
- `status` - pending | confirmed | in_progress | completed | cancelled
- `scheduled_date`, `scheduled_time` - Appointment time
- `address` - Service location
- `problem_category` - Issue category
- `description` - Problem description
- `amount` - Service cost
- `payment_status` - unpaid | paid | refunded
- `payment_method` - cash | bkash | nagad | rocket

#### 3. services
Available services
- `id` - Primary key
- `category_id` - Foreign key to service_categories
- `name` - Service name
- `slug` - URL-friendly name
- `icon` - Bootstrap icon name
- `color`, `icon_color` - UI colors
- `base_price` - Starting price
- `is_active` - Availability status

#### 4. service_categories
Service categories
- `id` - Primary key
- `slug` - URL-friendly name
- `name` - Category name
- `icon` - Bootstrap icon
- `sort_order` - Display order

#### 5. technicians
Technician profiles (extends users)
- `id` - Primary key
- `user_id` - Foreign key to users
- `service_id` - Primary service
- `experience` - Years of experience
- `location` - Service area
- `bio` - Profile description
- `is_verified` - Verification status
- `is_available` - Current availability
- `rating` - Average rating
- `review_count` - Total reviews
- `hourly_rate` - Service rate

#### 6. reviews
Service reviews
- `id` - Primary key
- `booking_id` - Foreign key to bookings
- `customer_id` - Foreign key to users
- `technician_id` - Foreign key to technicians
- `rating` - 1-5 stars
- `comment` - Review text

#### 7. payments
Payment records
- `id` - Primary key
- `user_id` - Foreign key to users
- `booking_id` - Foreign key to bookings
- `amount` - Payment amount
- `payment_method` - bkash | nagad | rocket | cash
- `transaction_id` - Payment reference
- `status` - pending | completed | failed

#### 8. notifications
User notifications
- `id` - Primary key
- `user_id` - Foreign key to users
- `type` - Notification type
- `title` - Notification title
- `message` - Notification content
- `is_read` - Read status
- `meta` - JSON metadata

#### 9. refresh_tokens
JWT refresh tokens (legacy, not used with sessions)
- `id` - Primary key
- `user_id` - Foreign key to users
- `token` - Refresh token
- `expires_at` - Expiration time

### Views

#### v_booking_summary
Complete booking information with related data
- Joins bookings, services, users (customer & technician)
- Used for booking lists and reports

#### v_technician_leaderboard
Technician rankings with statistics
- Joins technicians, users, services, bookings
- Calculates total jobs, completed jobs, ratings
- Used for technician listings

## Default Users

### Admin
- **Email**: admin@fixbhai.com
- **Password**: Admin@123
- **Role**: admin

### Customer
- **Email**: rahim@gmail.com
- **Password**: Demo@1234
- **Role**: customer

### Technician
- **Email**: karim@fixbhai.com
- **Password**: Tech@1234
- **Role**: technician
- **Specialization**: AC Repair

## Password Hashing

All passwords are hashed using PHP's `password_hash()` with bcrypt:
```php
$hash = password_hash('password', PASSWORD_DEFAULT);
```

To create new users, use the registration API or hash passwords manually:
```php
$hash = password_hash('YourPassword123', PASSWORD_DEFAULT);
```

## Technician Specializations

Available specializations (stored in `users.specialization`):
- Electrical
- AC Repair
- Plumbing
- Cleaning
- Carpentry
- Painting
- Car Mechanic
- Pest Control
- CCTV Install
- Appliance Repair
- Gardening
- Other (with custom text in `specialization_other`)

## Database Relationships

```
users (1) ─── (many) bookings
users (1) ─── (1) technicians
technicians (1) ─── (many) bookings
services (1) ─── (many) bookings
service_categories (1) ─── (many) services
bookings (1) ─── (1) reviews
bookings (1) ─── (many) payments
users (1) ─── (many) notifications
```

## Indexes

Optimized indexes for common queries:
- `users.email` - Login queries
- `users.role` - Role-based filtering
- `bookings.customer_id` - Customer bookings
- `bookings.technician_id` - Technician jobs
- `bookings.status` - Status filtering
- `bookings.scheduled_date` - Date filtering
- `services.category_id` - Category filtering
- `technicians.is_available` - Available technicians

## Backup & Restore

### Backup
```bash
mysqldump -u root -p fixbhai > fixbhai_backup.sql
```

### Restore
```bash
mysql -u root -p fixbhai < fixbhai_backup.sql
```

## Troubleshooting

### Error: Table already exists
```sql
DROP DATABASE fixbhai;
CREATE DATABASE fixbhai;
-- Then import fixbhai.sql
```

### Error: Foreign key constraint fails
Make sure to import in order (tables are created in correct order in fixbhai.sql)

### Error: Access denied
Check MySQL user permissions:
```sql
GRANT ALL PRIVILEGES ON fixbhai.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

## Version History

- **v1.0** - Initial schema
- **v1.1** - Added specialization columns to users table
- **v1.2** - Current version with all features

## Notes

- Uses InnoDB engine for foreign key support
- UTF-8 (utf8mb4) encoding for international characters
- Timestamps use MySQL's CURRENT_TIMESTAMP
- Soft deletes not implemented (use is_active flag)
- Session-based authentication (no JWT tokens stored)
