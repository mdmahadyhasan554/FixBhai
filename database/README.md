# FixBhai Database

## 📁 Files

### `fixbhai.sql` - Complete Database Schema
**This is the only file you need!** It contains:
- ✅ Complete database schema (all tables)
- ✅ Sample data (services, categories, technicians)
- ✅ **Working user accounts with correct passwords**
- ✅ Payments table structure
- ✅ Views and indexes
- ✅ Foreign key constraints

## 🚀 Quick Setup

1. Start XAMPP (Apache + MySQL)
2. Open phpMyAdmin: http://localhost/phpmyadmin
3. Create database: `fixbhai`
4. Import `fixbhai.sql`
5. **Done!** Ready to use

## 👤 Default User Accounts

| Role | Email | Password | Access |
|------|-------|----------|--------|
| **Admin** | admin@fixbhai.com | Admin@123 | /admin |
| **Customer** | rahim@gmail.com | Demo@1234 | /dashboard |
| **Technician** | karim@fixbhai.com | Tech@1234 | /technician |

## 📊 Database Structure

### Core Tables
- `users` - User accounts (admin, customer, technician)
- `services` - Available services (AC Repair, Plumbing, etc.)
- `service_categories` - Service categories
- `technicians` - Technician profiles
- `bookings` - Service bookings
- `payments` - Payment transactions
- `reviews` - Customer reviews
- `notifications` - User notifications
- `refresh_tokens` - JWT refresh tokens

### Views
- `v_booking_summary` - Booking details with joins
- `v_technician_leaderboard` - Technician rankings

## 🔐 Password Information

All passwords are hashed using PHP's `password_hash()` with bcrypt (cost 10).

**To change passwords:**
```php
// Generate new hash
$hash = password_hash('YourNewPassword', PASSWORD_BCRYPT, ['cost' => 10]);

// Update in database
UPDATE users SET password_hash = '$hash' WHERE email = 'admin@fixbhai.com';
```

Or use `backend/seed.php` to generate new hashes.

## 🛠️ Maintenance

### Reset Database
```sql
DROP DATABASE IF EXISTS fixbhai;
CREATE DATABASE fixbhai;
-- Then re-import fixbhai.sql
```

### Add New Admin
```sql
INSERT INTO users (name, email, phone, password_hash, role, is_active)
VALUES (
  'New Admin',
  'newadmin@example.com',
  '+8801700000000',
  '$2y$10$GENERATE_HASH_USING_PHP',
  'admin',
  1
);
```

## 📝 Notes

- All timestamps use UTC
- Phone numbers use Bangladesh format (+880)
- Currency is Bangladeshi Taka (৳)
- Payment methods: bKash, Nagad, Rocket, Cash

## 🔒 Security

- Delete `backend/seed.php` after use
- Change default passwords in production
- Update JWT secret in `backend/config/helpers.php`
- Use strong passwords in production
- Enable HTTPS in production

## 📞 Support

For issues or questions, check:
- `../BACKEND_SETUP.md` - Setup guide
- `../SETUP_COMPLETE.md` - Quick reference
- Backend API documentation in Postman collection
