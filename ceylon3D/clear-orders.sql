-- Clear all shop orders and STL orders from database
-- Run this script with: mysql -u root -p ceylon3d < clear-orders.sql

-- Disable foreign key checks temporarily (safe for clearing data)
SET FOREIGN_KEY_CHECKS = 0;

-- Clear shop order tables
DELETE FROM order_items;    -- Delete all order items first
DELETE FROM orders;         -- Then delete orders
ALTER TABLE order_items AUTO_INCREMENT = 1;  -- Reset auto-increment
ALTER TABLE orders AUTO_INCREMENT = 1;

-- Clear STL order tables
DELETE FROM stl_orders;     -- Delete all STL orders
ALTER TABLE stl_orders AUTO_INCREMENT = 1;  -- Reset auto-increment

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Verify tables are empty
SELECT "Order tables cleared successfully!" AS status;
SELECT COUNT(*) as order_item_count FROM order_items;
SELECT COUNT(*) as order_count FROM orders;
SELECT COUNT(*) as stl_order_count FROM stl_orders;
