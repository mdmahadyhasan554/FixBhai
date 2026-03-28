-- ============================================================
-- FixBhai — Local Technician Service Platform
-- Database Schema
-- Engine: MySQL 8.0+
-- Charset: utf8mb4 (full Unicode + emoji support)
-- ============================================================

CREATE DATABASE IF NOT EXISTS fixbhai
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE fixbhai;

-- ============================================================
-- 1. USERS
-- Stores customers, technicians, and admins.
-- Role-based access: 'customer' | 'technician' | 'admin'
-- ============================================================

CREATE TABLE users (
  id            INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  name          VARCHAR(100)    NOT NULL,
  email         VARCHAR(150)    NOT NULL UNIQUE,
  phone         VARCHAR(11)     NOT NULL,           -- BD format: 01XXXXXXXXX
  password_hash VARCHAR(255)    NOT NULL,
  role          ENUM('customer','technician','admin') NOT NULL DEFAULT 'customer',
  avatar_url    VARCHAR(500)    NULL,
  is_active     TINYINT(1)      NOT NULL DEFAULT 1,
  created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_users_email  (email),
  INDEX idx_users_role   (role)
) ENGINE=InnoDB;

-- ============================================================
-- 2. REFRESH TOKENS
-- Stores JWT refresh tokens for session management.
-- One user can have multiple active sessions (multi-device).
-- ============================================================

CREATE TABLE refresh_tokens (
  id         INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  user_id    INT UNSIGNED  NOT NULL,
  token      VARCHAR(512)  NOT NULL UNIQUE,
  expires_at TIMESTAMP     NOT NULL,
  created_at TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_refresh_token (token),
  INDEX idx_refresh_user  (user_id)
) ENGINE=InnoDB;

-- ============================================================
-- 3. SERVICE CATEGORIES
-- Top-level groupings: appliance, plumbing, electrical, etc.
-- ============================================================

CREATE TABLE service_categories (
  id         INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  slug       VARCHAR(50)   NOT NULL UNIQUE,   -- e.g. 'appliance'
  name       VARCHAR(100)  NOT NULL,           -- e.g. 'AC & Appliances'
  icon       VARCHAR(50)   NOT NULL,           -- bootstrap-icons name
  sort_order TINYINT       NOT NULL DEFAULT 0,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

-- ============================================================
-- 4. SERVICES
-- Individual bookable services (AC Repair, Plumbing, etc.)
-- ============================================================

CREATE TABLE services (
  id          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  category_id INT UNSIGNED    NOT NULL,
  name        VARCHAR(100)    NOT NULL,
  slug        VARCHAR(100)    NOT NULL UNIQUE,
  description TEXT            NULL,
  icon        VARCHAR(50)     NOT NULL,           -- bootstrap-icons name
  color       VARCHAR(10)     NOT NULL DEFAULT '#dbeafe',  -- bg colour hex
  icon_color  VARCHAR(10)     NOT NULL DEFAULT '#2563eb',  -- icon colour hex
  base_price  DECIMAL(10,2)   NOT NULL,
  is_active   TINYINT(1)      NOT NULL DEFAULT 1,
  created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (category_id) REFERENCES service_categories(id),
  INDEX idx_services_category (category_id),
  INDEX idx_services_active   (is_active)
) ENGINE=InnoDB;

-- ============================================================
-- 5. TECHNICIANS
-- Extended profile for users with role = 'technician'.
-- One-to-one with users table.
-- ============================================================

CREATE TABLE technicians (
  id           INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  user_id      INT UNSIGNED    NOT NULL UNIQUE,
  service_id   INT UNSIGNED    NOT NULL,          -- primary service
  experience   VARCHAR(20)     NOT NULL,           -- e.g. '8 yrs'
  location     VARCHAR(150)    NOT NULL,
  bio          TEXT            NULL,
  is_verified  TINYINT(1)      NOT NULL DEFAULT 0,
  is_available TINYINT(1)      NOT NULL DEFAULT 1,
  rating       DECIMAL(3,2)    NOT NULL DEFAULT 0.00,
  review_count INT UNSIGNED    NOT NULL DEFAULT 0,
  hourly_rate  DECIMAL(10,2)   NOT NULL DEFAULT 0.00,
  created_at   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
  FOREIGN KEY (service_id) REFERENCES services(id),
  INDEX idx_tech_service   (service_id),
  INDEX idx_tech_available (is_available),
  INDEX idx_tech_verified  (is_verified)
) ENGINE=InnoDB;

-- ============================================================
-- 6. BOOKINGS
-- Core transaction table. Links customer → service → technician.
-- ============================================================

CREATE TABLE bookings (
  id               VARCHAR(20)     NOT NULL,          -- e.g. 'BK001'
  customer_id      INT UNSIGNED    NOT NULL,
  technician_id    INT UNSIGNED    NULL,               -- NULL = auto-assign pending
  service_id       INT UNSIGNED    NOT NULL,
  status           ENUM(
                     'pending',
                     'confirmed',
                     'in_progress',
                     'completed',
                     'cancelled'
                   )               NOT NULL DEFAULT 'pending',
  scheduled_date   DATE            NOT NULL,
  scheduled_time   VARCHAR(20)     NOT NULL,           -- e.g. '10:00 AM'
  address          TEXT            NOT NULL,
  problem_category VARCHAR(100)    NULL,
  description      TEXT            NULL,
  notes            TEXT            NULL,
  amount           DECIMAL(10,2)   NOT NULL DEFAULT 0.00,
  payment_status   ENUM('unpaid','paid','refunded') NOT NULL DEFAULT 'unpaid',
  payment_method   ENUM('cash','bkash','nagad','rocket') NULL,  -- future: mobile banking
  transaction_id   VARCHAR(100)    NULL,                         -- bKash/Nagad txn ID
  cancelled_reason TEXT            NULL,
  created_at       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (customer_id)   REFERENCES users(id),
  FOREIGN KEY (technician_id) REFERENCES technicians(id) ON DELETE SET NULL,
  FOREIGN KEY (service_id)    REFERENCES services(id),
  INDEX idx_bookings_customer    (customer_id),
  INDEX idx_bookings_technician  (technician_id),
  INDEX idx_bookings_status      (status),
  INDEX idx_bookings_date        (scheduled_date)
) ENGINE=InnoDB;

-- ============================================================
-- 7. REVIEWS
-- Customer reviews for completed bookings.
-- One review per booking (enforced by UNIQUE constraint).
-- ============================================================

CREATE TABLE reviews (
  id           INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  booking_id   VARCHAR(20)     NOT NULL UNIQUE,
  customer_id  INT UNSIGNED    NOT NULL,
  technician_id INT UNSIGNED   NOT NULL,
  rating       TINYINT         NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment      TEXT            NULL,
  created_at   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (booking_id)    REFERENCES bookings(id)    ON DELETE CASCADE,
  FOREIGN KEY (customer_id)   REFERENCES users(id),
  FOREIGN KEY (technician_id) REFERENCES technicians(id),
  INDEX idx_reviews_technician (technician_id),
  INDEX idx_reviews_rating     (rating)
) ENGINE=InnoDB;

-- ============================================================
-- 8. NOTIFICATIONS
-- In-app notifications for booking status changes, etc.
-- ============================================================

CREATE TABLE notifications (
  id         INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  user_id    INT UNSIGNED    NOT NULL,
  type       VARCHAR(50)     NOT NULL,   -- e.g. 'booking_confirmed'
  title      VARCHAR(200)    NOT NULL,
  message    TEXT            NOT NULL,
  is_read    TINYINT(1)      NOT NULL DEFAULT 0,
  meta       JSON            NULL,       -- extra data e.g. { booking_id: 'BK001' }
  created_at TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_notif_user   (user_id),
  INDEX idx_notif_unread (user_id, is_read)
) ENGINE=InnoDB;

-- ============================================================
-- SEED DATA — Bangladesh localised
-- Passwords are placeholder hashes.
-- Run backend/seed.php to generate real bcrypt hashes,
-- then UPDATE the password_hash column in phpMyAdmin.
-- ============================================================

-- Service categories
INSERT INTO service_categories (slug, name, icon, sort_order) VALUES
  ('appliance',  'AC & Appliances', 'wind',                  1),
  ('plumbing',   'Plumbing',        'droplet-fill',          2),
  ('electrical', 'Electrical',      'lightning-charge-fill', 3),
  ('cleaning',   'Cleaning',        'stars',                 4),
  ('painting',   'Painting',        'brush-fill',            5),
  ('carpentry',  'Carpentry',       'hammer',                6),
  ('pest',       'Pest Control',    'bug-fill',              7),
  ('security',   'Security',        'camera-video-fill',     8);

-- Services — prices in BDT
INSERT INTO services (category_id, name, slug, icon, color, icon_color, base_price) VALUES
  (1, 'AC Repair',     'ac-repair',     'wind',             '#dbeafe', '#2563eb',  800.00),
  (2, 'Plumbing',      'plumbing',      'droplet',          '#d1fae5', '#059669',  400.00),
  (3, 'Electrical',    'electrical',    'lightning-charge', '#fef3c7', '#d97706',  300.00),
  (4, 'Cleaning',      'cleaning',      'stars',            '#ede9fe', '#7c3aed',  600.00),
  (5, 'Painting',      'painting',      'brush',            '#fce7f3', '#db2777', 1200.00),
  (6, 'Carpentry',     'carpentry',     'hammer',           '#ffedd5', '#ea580c',  500.00),
  (7, 'Pest Control',  'pest-control',  'bug',              '#dcfce7', '#16a34a',  700.00),
  (8, 'CCTV Install',  'cctv-install',  'camera-video',     '#e0f2fe', '#0284c7', 1500.00);

-- Admin user (password: Admin@123 — update hash via seed.php)
INSERT INTO users (name, email, phone, password_hash, role) VALUES
  ('Admin FixBhai', 'admin@fixbhai.com', '01700000000',
   '$2y$10$placeholder_run_seed_php_to_fix', 'admin');

-- Demo customer: Rahim Uddin (password: Demo@1234)
INSERT INTO users (name, email, phone, password_hash, role) VALUES
  ('Rahim Uddin', 'rahim@gmail.com', '01712345678',
   '$2y$10$placeholder_run_seed_php_to_fix', 'customer');

-- Demo technician: Karim Sheikh (password: Tech@1234)
INSERT INTO users (name, email, phone, password_hash, role, avatar_url) VALUES
  ('Karim Sheikh', 'karim@fixbhai.com', '01898765432',
   '$2y$10$placeholder_run_seed_php_to_fix',
   'technician', 'https://i.pravatar.cc/150?img=11');

-- Technician profile for Karim
INSERT INTO technicians (user_id, service_id, experience, location, is_verified, is_available, rating, review_count, hourly_rate)
VALUES (3, 1, '8 yrs', 'Mirpur, Dhaka', 1, 1, 4.90, 234, 800.00);

-- ============================================================
-- USEFUL VIEWS
-- ============================================================

-- Booking summary with customer + technician names
CREATE OR REPLACE VIEW v_booking_summary AS
SELECT
  b.id,
  b.status,
  b.scheduled_date,
  b.scheduled_time,
  b.amount,
  b.payment_status,
  b.created_at,
  s.name          AS service_name,
  s.base_price,
  cu.name         AS customer_name,
  cu.email        AS customer_email,
  cu.phone        AS customer_phone,
  tu.name         AS technician_name,
  t.is_verified   AS technician_verified,
  t.rating        AS technician_rating
FROM bookings b
JOIN services  s  ON s.id  = b.service_id
JOIN users     cu ON cu.id = b.customer_id
LEFT JOIN technicians t  ON t.id  = b.technician_id
LEFT JOIN users       tu ON tu.id = t.user_id;

-- Technician leaderboard
CREATE OR REPLACE VIEW v_technician_leaderboard AS
SELECT
  t.id,
  u.name,
  u.avatar_url,
  s.name          AS service,
  t.experience,
  t.location,
  t.is_verified,
  t.is_available,
  t.rating,
  t.review_count,
  t.hourly_rate,
  COUNT(b.id)     AS total_jobs,
  SUM(CASE WHEN b.status = 'completed' THEN 1 ELSE 0 END) AS completed_jobs
FROM technicians t
JOIN users    u ON u.id = t.user_id
JOIN services s ON s.id = t.service_id
LEFT JOIN bookings b ON b.technician_id = t.id
GROUP BY t.id, u.name, u.avatar_url, s.name, t.experience,
         t.location, t.is_verified, t.is_available, t.rating,
         t.review_count, t.hourly_rate
ORDER BY t.rating DESC, completed_jobs DESC;
