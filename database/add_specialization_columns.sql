-- Add specialization columns to users table if they don't exist
-- Run this if you haven't re-imported the full database yet

-- Check if columns exist and add them
SET @dbname = DATABASE();
SET @tablename = 'users';
SET @columnname1 = 'specialization';
SET @columnname2 = 'specialization_other';

-- Add specialization column if it doesn't exist
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname1)
  ) > 0,
  "SELECT 1",
  CONCAT("ALTER TABLE ", @tablename, " ADD COLUMN ", @columnname1, " VARCHAR(100) NULL COMMENT 'Technician specialization: Electrical, AC Repair, Plumbing, etc.' AFTER role")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Add specialization_other column if it doesn't exist
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname2)
  ) > 0,
  "SELECT 1",
  CONCAT("ALTER TABLE ", @tablename, " ADD COLUMN ", @columnname2, " VARCHAR(100) NULL COMMENT 'Custom specialization when Other is selected' AFTER specialization")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Update existing technician with sample specialization
UPDATE users 
SET specialization = 'AC Repair' 
WHERE email = 'karim@fixbhai.com' AND role = 'technician';

SELECT 'Specialization columns added successfully!' as message;
