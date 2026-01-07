-- Elections table
CREATE TABLE IF NOT EXISTS elections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Candidates table
CREATE TABLE IF NOT EXISTS candidates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    election_id UUID REFERENCES elections(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Votes table
CREATE TABLE IF NOT EXISTS votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    election_id UUID REFERENCES elections(id) ON DELETE CASCADE,
    candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
    vote_hash VARCHAR(255) NOT NULL UNIQUE,
    voted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, election_id)
);

-- Audit logs table for tamper-proof logging
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    election_id UUID REFERENCES elections(id) ON DELETE CASCADE,
    candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
    vote_hash VARCHAR(255) NOT NULL,
    action VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address VARCHAR(45)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_votes_user_election ON votes(user_id, election_id);
CREATE INDEX IF NOT EXISTS idx_votes_election ON votes(election_id);
CREATE INDEX IF NOT EXISTS idx_candidates_election ON candidates(election_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_election ON audit_logs(election_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_vote_hash ON audit_logs(vote_hash);

-- Enable Row Level Security (RLS)
ALTER TABLE elections ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies (adjust based on your security requirements)
-- Allow anyone to read active elections
CREATE POLICY "Anyone can view active elections" ON elections
    FOR SELECT USING (is_active = true);

-- Allow anyone to read candidates for active elections
CREATE POLICY "Anyone can view candidates" ON candidates
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM elections 
            WHERE elections.id = candidates.election_id 
            AND elections.is_active = true
        )
    );

-- Users can only see their own votes
CREATE POLICY "Users can view their own votes" ON votes
    FOR SELECT USING (auth.uid() = user_id);

-- Only authenticated users can insert votes
CREATE POLICY "Authenticated users can vote" ON votes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Only admins can view audit logs (adjust based on your needs)
CREATE POLICY "Admins can view audit logs" ON audit_logs
    FOR SELECT USING (true); -- Adjust this based on your admin check logic

