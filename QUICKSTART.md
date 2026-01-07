# Quick Start Guide

Follow these steps to get the Online Voting System up and running quickly.

## Step 1: Supabase Setup (5 minutes)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Wait for the project to be ready (takes ~2 minutes)
4. Go to **SQL Editor** in the left sidebar
5. Click **New Query**
6. Copy and paste the contents of `backend/supabase_schema.sql`
7. Click **Run** to create the database tables
8. (Optional) Run `backend/sample_data.sql` to add sample elections and candidates
9. Go to **Settings** > **API**
10. Copy your **Project URL** and **anon/public key**

## Step 2: Backend Setup (2 minutes)

```bash
# Navigate to backend folder
cd backend

# Create virtual environment (Windows)
python -m venv venv
venv\Scripts\activate

# Create virtual environment (Mac/Linux)
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
# Copy env.example to .env and edit it
copy env.example .env  # Windows
cp env.example .env    # Mac/Linux

# Edit .env file with your Supabase credentials:
# SUPABASE_URL=https://your-project.supabase.co
# SUPABASE_KEY=your-anon-key-here
# JWT_SECRET=any-random-string-here

# Run the Flask server
python app.py
```

The backend should now be running on http://localhost:5000

## Step 3: Frontend Setup (2 minutes)

Open a **new terminal window**:

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start the React app
npm start
```

The frontend should open automatically at http://localhost:3000

## Step 4: Test the System

1. Open http://localhost:3000 in your browser
2. Click **Register** to create a new account
3. Login with your credentials
4. You should see the dashboard with elections (if you ran sample_data.sql)
5. Click **Vote Now** on an election
6. Select a candidate and vote
7. View results with charts

## Troubleshooting

### Backend won't start
- Make sure Python 3.8+ is installed: `python --version`
- Check that all dependencies are installed: `pip list`
- Verify your .env file has correct Supabase credentials
- Check that port 5000 is not already in use

### Frontend won't start
- Make sure Node.js 16+ is installed: `node --version`
- Delete `node_modules` and `package-lock.json`, then run `npm install` again
- Check that port 3000 is not already in use

### Can't connect to Supabase
- Verify your SUPABASE_URL and SUPABASE_KEY in backend/.env
- Check that you ran the SQL schema script in Supabase
- Make sure your Supabase project is active (not paused)

### Authentication errors
- Make sure Supabase Auth is enabled in your project
- Check that email confirmation is disabled (for testing) in Supabase Auth settings

## Next Steps

- Add more elections and candidates through Supabase dashboard
- Customize the UI colors and styling
- Add more security features
- Deploy to production (Heroku, Vercel, etc.)

## Need Help?

Check the main README.md for detailed documentation and API endpoints.

