-- Sample data for testing the voting system
-- Run this after setting up the schema

-- Insert sample elections
INSERT INTO elections (id, title, description, is_active, start_date, end_date) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Student Council Election 2024', 'Vote for your student council representatives', true, NOW(), NOW() + INTERVAL '30 days'),
('550e8400-e29b-41d4-a716-446655440001', 'Company Board Members 2024', 'Elect the board members for the upcoming year', true, NOW(), NOW() + INTERVAL '30 days'),
('550e8400-e29b-41d4-a716-446655440002', 'Community Poll: Park Renovation', 'Should we renovate the community park?', true, NOW(), NOW() + INTERVAL '7 days');

-- Insert candidates for Student Council Election
INSERT INTO candidates (id, election_id, name, description, image_url) VALUES
('660e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'John Smith', 'Experienced leader with 2 years in student government', NULL),
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'Sarah Johnson', 'Passionate advocate for student rights and campus improvements', NULL),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'Michael Chen', 'Focused on sustainability and environmental initiatives', NULL);

-- Insert candidates for Company Board Members
INSERT INTO candidates (id, election_id, name, description, image_url) VALUES
('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'Emily Davis', '15 years of industry experience, strategic vision', NULL),
('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', 'Robert Wilson', 'Expert in financial management and growth strategies', NULL),
('660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', 'Lisa Anderson', 'Strong advocate for employee welfare and innovation', NULL);

-- Insert candidates for Community Poll (Yes/No style)
INSERT INTO candidates (id, election_id, name, description, image_url) VALUES
('660e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440002', 'Yes - Renovate the Park', 'Support park renovation with modern facilities', NULL),
('660e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440002', 'No - Keep Current Park', 'Maintain the park in its current state', NULL);

