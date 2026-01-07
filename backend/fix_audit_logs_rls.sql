-- Fix RLS policy for audit_logs table
-- Run this SQL in your Supabase SQL Editor

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can view audit logs" ON audit_logs;
DROP POLICY IF EXISTS "Users can insert their own audit logs" ON audit_logs;
DROP POLICY IF EXISTS "Users can view their own audit logs" ON audit_logs;
DROP POLICY IF EXISTS "Admins can view all audit logs" ON audit_logs;

-- Allow authenticated users to insert their own audit logs
-- Note: If using service_role key in backend, this policy may not be needed
-- but it's good to have for security
CREATE POLICY "Users can insert their own audit logs" ON audit_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to view their own audit logs
CREATE POLICY "Users can view their own audit logs" ON audit_logs
    FOR SELECT USING (auth.uid() = user_id);

-- Allow admins to view all audit logs
CREATE POLICY "Admins can view all audit logs" ON audit_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND (auth.users.raw_user_meta_data->>'is_admin')::boolean = true
        )
    );
