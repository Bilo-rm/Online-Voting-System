-- Add admin role support
-- This extends the existing schema

-- Create a function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM auth.users
        WHERE auth.users.id = user_id
        AND (auth.users.raw_user_meta_data->>'is_admin')::boolean = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update RLS policies to allow admins full access
DROP POLICY IF EXISTS "Anyone can view active elections" ON elections;
DROP POLICY IF EXISTS "Anyone can view candidates" ON candidates;

-- Allow anyone to view active elections
CREATE POLICY "Anyone can view active elections" ON elections
    FOR SELECT USING (is_active = true);

-- Allow admins to view all elections
CREATE POLICY "Admins can view all elections" ON elections
    FOR SELECT USING (is_admin(auth.uid()));

-- Allow admins to manage elections
CREATE POLICY "Admins can insert elections" ON elections
    FOR INSERT WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update elections" ON elections
    FOR UPDATE USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete elections" ON elections
    FOR DELETE USING (is_admin(auth.uid()));

-- Allow anyone to view candidates for active elections
CREATE POLICY "Anyone can view candidates" ON candidates
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM elections 
            WHERE elections.id = candidates.election_id 
            AND elections.is_active = true
        )
    );

-- Allow admins to view all candidates
CREATE POLICY "Admins can view all candidates" ON candidates
    FOR SELECT USING (is_admin(auth.uid()));

-- Allow admins to manage candidates
CREATE POLICY "Admins can insert candidates" ON candidates
    FOR INSERT WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update candidates" ON candidates
    FOR UPDATE USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete candidates" ON candidates
    FOR DELETE USING (is_admin(auth.uid()));

