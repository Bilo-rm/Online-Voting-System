-- Script to make a user an admin
-- Replace 'user-email@example.com' with the actual user email

-- This updates the user metadata in Supabase Auth
-- You can also do this via Supabase Dashboard:
-- 1. Go to Authentication > Users
-- 2. Find the user
-- 3. Click on the user
-- 4. Under "User Metadata", add: {"is_admin": true}

-- For programmatic access, use Supabase Admin API or update via dashboard

-- Example: To make a user admin via Supabase Dashboard:
-- 1. Navigate to Authentication > Users
-- 2. Select the user
-- 3. In User Metadata section, add: {"is_admin": true}
-- 4. Save

-- Note: The admin check in the backend uses JWT token's is_admin field
-- which is set during login based on user metadata

