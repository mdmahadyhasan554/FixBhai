-- QUICK FIX: Add specialization columns to existing database
-- Copy and paste this into phpMyAdmin SQL tab

-- Add specialization columns
ALTER TABLE `users` 
ADD COLUMN `specialization` VARCHAR(100) NULL COMMENT 'Technician specialization: Electrical, AC Repair, Plumbing, etc.' AFTER `role`,
ADD COLUMN `specialization_other` VARCHAR(100) NULL COMMENT 'Custom specialization when Other is selected' AFTER `specialization`;

-- Update existing technician
UPDATE `users` 
SET `specialization` = 'AC Repair' 
WHERE `email` = 'karim@fixbhai.com' AND `role` = 'technician';

-- Verify
SELECT id, name, email, role, specialization, specialization_other 
FROM users 
WHERE role = 'technician';
