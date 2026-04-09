-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 28, 2026 at 03:40 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `fixbhai`
--

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` varchar(20) NOT NULL,
  `customer_id` int(10) UNSIGNED NOT NULL,
  `technician_id` int(10) UNSIGNED DEFAULT NULL,
  `service_id` int(10) UNSIGNED NOT NULL,
  `status` enum('pending','confirmed','in_progress','completed','cancelled') NOT NULL DEFAULT 'pending',
  `scheduled_date` date NOT NULL,
  `scheduled_time` varchar(20) NOT NULL,
  `address` text NOT NULL,
  `problem_category` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `payment_status` enum('unpaid','paid','refunded') NOT NULL DEFAULT 'unpaid',
  `cancelled_reason` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `type` varchar(50) NOT NULL,
  `title` varchar(200) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `meta` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`meta`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `refresh_tokens`
--

CREATE TABLE `refresh_tokens` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `token` varchar(512) NOT NULL,
  `expires_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int(10) UNSIGNED NOT NULL,
  `booking_id` varchar(20) NOT NULL,
  `customer_id` int(10) UNSIGNED NOT NULL,
  `technician_id` int(10) UNSIGNED NOT NULL,
  `rating` tinyint(4) NOT NULL CHECK (`rating` between 1 and 5),
  `comment` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `id` int(10) UNSIGNED NOT NULL,
  `category_id` int(10) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `icon` varchar(50) NOT NULL,
  `color` varchar(10) NOT NULL DEFAULT '#dbeafe',
  `icon_color` varchar(10) NOT NULL DEFAULT '#2563eb',
  `base_price` decimal(10,2) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`id`, `category_id`, `name`, `slug`, `description`, `icon`, `color`, `icon_color`, `base_price`, `is_active`, `created_at`) VALUES
(1, 1, 'AC Repair', 'ac-repair', NULL, 'wind', '#dbeafe', '#2563eb', 299.00, 1, '2026-03-27 08:48:51'),
(2, 2, 'Plumbing', 'plumbing', NULL, 'droplet', '#d1fae5', '#059669', 199.00, 1, '2026-03-27 08:48:51'),
(3, 3, 'Electrical', 'electrical', NULL, 'lightning-charge', '#fef3c7', '#d97706', 249.00, 1, '2026-03-27 08:48:51'),
(4, 4, 'Cleaning', 'cleaning', NULL, 'stars', '#ede9fe', '#7c3aed', 399.00, 1, '2026-03-27 08:48:51'),
(5, 5, 'Painting', 'painting', NULL, 'brush', '#fce7f3', '#db2777', 599.00, 1, '2026-03-27 08:48:51'),
(6, 6, 'Carpentry', 'carpentry', NULL, 'hammer', '#ffedd5', '#ea580c', 349.00, 1, '2026-03-27 08:48:51'),
(7, 7, 'Pest Control', 'pest-control', NULL, 'bug', '#dcfce7', '#16a34a', 499.00, 1, '2026-03-27 08:48:51'),
(8, 8, 'CCTV Install', 'cctv-install', NULL, 'camera-video', '#e0f2fe', '#0284c7', 799.00, 1, '2026-03-27 08:48:51');

-- --------------------------------------------------------

--
-- Table structure for table `service_categories`
--

CREATE TABLE `service_categories` (
  `id` int(10) UNSIGNED NOT NULL,
  `slug` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `icon` varchar(50) NOT NULL,
  `sort_order` tinyint(4) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `service_categories`
--

INSERT INTO `service_categories` (`id`, `slug`, `name`, `icon`, `sort_order`) VALUES
(1, 'appliance', 'AC & Appliances', 'wind', 1),
(2, 'plumbing', 'Plumbing', 'droplet-fill', 2),
(3, 'electrical', 'Electrical', 'lightning-charge-fill', 3),
(4, 'cleaning', 'Cleaning', 'stars', 4),
(5, 'painting', 'Painting', 'brush-fill', 5),
(6, 'carpentry', 'Carpentry', 'hammer', 6),
(7, 'pest', 'Pest Control', 'bug-fill', 7),
(8, 'security', 'Security', 'camera-video-fill', 8);

-- --------------------------------------------------------

--
-- Table structure for table `technicians`
--

CREATE TABLE `technicians` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `service_id` int(10) UNSIGNED NOT NULL,
  `experience` varchar(20) NOT NULL,
  `location` varchar(150) NOT NULL,
  `bio` text DEFAULT NULL,
  `is_verified` tinyint(1) NOT NULL DEFAULT 0,
  `is_available` tinyint(1) NOT NULL DEFAULT 1,
  `rating` decimal(3,2) NOT NULL DEFAULT 0.00,
  `review_count` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `hourly_rate` decimal(10,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `technicians`
--

INSERT INTO `technicians` (`id`, `user_id`, `service_id`, `experience`, `location`, `bio`, `is_verified`, `is_available`, `rating`, `review_count`, `hourly_rate`, `created_at`, `updated_at`) VALUES
(1, 3, 1, '8 yrs', 'Andheri, Mumbai', NULL, 1, 1, 4.90, 234, 299.00, '2026-03-27 08:48:52', '2026-03-27 08:48:52');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('customer','technician','admin') NOT NULL DEFAULT 'customer',
  `avatar_url` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `phone`, `password_hash`, `role`, `avatar_url`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Admin', 'admin@fixbhai.in', '+91 98765 00000', '$2b$12$exampleHashForAdminPassword000000000000000000000000000', 'admin', NULL, 1, '2026-03-27 08:48:51', '2026-03-27 08:48:51'),
(2, 'Demo User', 'demo@fixbhai.in', '+91 98765 43210', '$2b$12$exampleHashForDemoPassword0000000000000000000000000000', 'customer', NULL, 1, '2026-03-27 08:48:51', '2026-03-27 08:48:51'),
(3, 'Rajesh Kumar', 'rajesh@fixbhai.in', '+91 98765 11111', '$2b$12$exampleHashForTechPassword0000000000000000000000000000', 'technician', 'https://i.pravatar.cc/150?img=11', 1, '2026-03-27 08:48:51', '2026-03-27 08:48:51');

-- --------------------------------------------------------

--
-- Stand-in structure for view `v_booking_summary`
-- (See below for the actual view)
--
CREATE TABLE `v_booking_summary` (
`id` varchar(20)
,`status` enum('pending','confirmed','in_progress','completed','cancelled')
,`scheduled_date` date
,`scheduled_time` varchar(20)
,`amount` decimal(10,2)
,`payment_status` enum('unpaid','paid','refunded')
,`created_at` timestamp
,`service_name` varchar(100)
,`base_price` decimal(10,2)
,`customer_name` varchar(100)
,`customer_email` varchar(150)
,`customer_phone` varchar(20)
,`technician_name` varchar(100)
,`technician_verified` tinyint(1)
,`technician_rating` decimal(3,2)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `v_technician_leaderboard`
-- (See below for the actual view)
--
CREATE TABLE `v_technician_leaderboard` (
`id` int(10) unsigned
,`name` varchar(100)
,`avatar_url` varchar(500)
,`service` varchar(100)
,`experience` varchar(20)
,`location` varchar(150)
,`is_verified` tinyint(1)
,`is_available` tinyint(1)
,`rating` decimal(3,2)
,`review_count` int(10) unsigned
,`hourly_rate` decimal(10,2)
,`total_jobs` bigint(21)
,`completed_jobs` decimal(22,0)
);

-- --------------------------------------------------------

--
-- Structure for view `v_booking_summary`
--
DROP TABLE IF EXISTS `v_booking_summary`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_booking_summary`  AS SELECT `b`.`id` AS `id`, `b`.`status` AS `status`, `b`.`scheduled_date` AS `scheduled_date`, `b`.`scheduled_time` AS `scheduled_time`, `b`.`amount` AS `amount`, `b`.`payment_status` AS `payment_status`, `b`.`created_at` AS `created_at`, `s`.`name` AS `service_name`, `s`.`base_price` AS `base_price`, `cu`.`name` AS `customer_name`, `cu`.`email` AS `customer_email`, `cu`.`phone` AS `customer_phone`, `tu`.`name` AS `technician_name`, `t`.`is_verified` AS `technician_verified`, `t`.`rating` AS `technician_rating` FROM ((((`bookings` `b` join `services` `s` on(`s`.`id` = `b`.`service_id`)) join `users` `cu` on(`cu`.`id` = `b`.`customer_id`)) left join `technicians` `t` on(`t`.`id` = `b`.`technician_id`)) left join `users` `tu` on(`tu`.`id` = `t`.`user_id`)) ;

-- --------------------------------------------------------

--
-- Structure for view `v_technician_leaderboard`
--
DROP TABLE IF EXISTS `v_technician_leaderboard`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_technician_leaderboard`  AS SELECT `t`.`id` AS `id`, `u`.`name` AS `name`, `u`.`avatar_url` AS `avatar_url`, `s`.`name` AS `service`, `t`.`experience` AS `experience`, `t`.`location` AS `location`, `t`.`is_verified` AS `is_verified`, `t`.`is_available` AS `is_available`, `t`.`rating` AS `rating`, `t`.`review_count` AS `review_count`, `t`.`hourly_rate` AS `hourly_rate`, count(`b`.`id`) AS `total_jobs`, sum(case when `b`.`status` = 'completed' then 1 else 0 end) AS `completed_jobs` FROM (((`technicians` `t` join `users` `u` on(`u`.`id` = `t`.`user_id`)) join `services` `s` on(`s`.`id` = `t`.`service_id`)) left join `bookings` `b` on(`b`.`technician_id` = `t`.`id`)) GROUP BY `t`.`id`, `u`.`name`, `u`.`avatar_url`, `s`.`name`, `t`.`experience`, `t`.`location`, `t`.`is_verified`, `t`.`is_available`, `t`.`rating`, `t`.`review_count`, `t`.`hourly_rate` ORDER BY `t`.`rating` DESC, sum(case when `b`.`status` = 'completed' then 1 else 0 end) DESC ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `service_id` (`service_id`),
  ADD KEY `idx_bookings_customer` (`customer_id`),
  ADD KEY `idx_bookings_technician` (`technician_id`),
  ADD KEY `idx_bookings_status` (`status`),
  ADD KEY `idx_bookings_date` (`scheduled_date`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_notif_user` (`user_id`),
  ADD KEY `idx_notif_unread` (`user_id`,`is_read`);

--
-- Indexes for table `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`),
  ADD KEY `idx_refresh_token` (`token`),
  ADD KEY `idx_refresh_user` (`user_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `booking_id` (`booking_id`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `idx_reviews_technician` (`technician_id`),
  ADD KEY `idx_reviews_rating` (`rating`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `idx_services_category` (`category_id`),
  ADD KEY `idx_services_active` (`is_active`);

--
-- Indexes for table `service_categories`
--
ALTER TABLE `service_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `technicians`
--
ALTER TABLE `technicians`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`),
  ADD KEY `idx_tech_service` (`service_id`),
  ADD KEY `idx_tech_available` (`is_available`),
  ADD KEY `idx_tech_verified` (`is_verified`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_users_email` (`email`),
  ADD KEY `idx_users_role` (`role`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `service_categories`
--
ALTER TABLE `service_categories`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `technicians`
--
ALTER TABLE `technicians`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`technician_id`) REFERENCES `technicians` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `bookings_ibfk_3` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`);

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  ADD CONSTRAINT `refresh_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `reviews_ibfk_3` FOREIGN KEY (`technician_id`) REFERENCES `technicians` (`id`);

--
-- Constraints for table `services`
--
ALTER TABLE `services`
  ADD CONSTRAINT `services_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `service_categories` (`id`);

--
-- Constraints for table `technicians`
--
ALTER TABLE `technicians`
  ADD CONSTRAINT `technicians_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `technicians_ibfk_2` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- ============================================================
-- PAYMENTS TABLE — Bangladesh mobile banking support
-- Run this after importing the main schema.
-- ============================================================

CREATE TABLE IF NOT EXISTS `payments` (
  `id`             INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  `user_id`        INT UNSIGNED    NOT NULL,
  `booking_id`     VARCHAR(20)     NOT NULL,
  `amount`         DECIMAL(10,2)   NOT NULL,
  `payment_method` ENUM('bkash','nagad','rocket','cash') NOT NULL,
  `transaction_id` VARCHAR(100)    NULL,
  `status`         ENUM('pending','completed','failed') NOT NULL DEFAULT 'pending',
  `created_at`     TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_transaction_id` (`transaction_id`),
  FOREIGN KEY (`user_id`)    REFERENCES `users`(`id`),
  FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`id`),
  INDEX `idx_payments_user`    (`user_id`),
  INDEX `idx_payments_booking` (`booking_id`),
  INDEX `idx_payments_status`  (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Also add payment_method + transaction_id to bookings if not present
ALTER TABLE `bookings`
  ADD COLUMN IF NOT EXISTS `payment_method`  ENUM('cash','bkash','nagad','rocket') NULL AFTER `payment_status`,
  ADD COLUMN IF NOT EXISTS `transaction_id`  VARCHAR(100) NULL AFTER `payment_method`;
