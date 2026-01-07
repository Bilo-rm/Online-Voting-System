# Online Voting System

A secure web-based voting platform built with Flask, React.js, and Supabase. This system allows users to cast votes for elections such as student council, company board members, or community polls with robust security features.

## Features

- 🔐 **Secure Authentication**: User registration and login with JWT tokens
- 🗳️ **Voting System**: Cast votes for candidates in active elections
- ✅ **One Vote Per User**: Ensures each user can only vote once per election
- 🔒 **Security Features**:
  - Data encryption
  - Tamper-proof vote logging with hash verification
  - Audit logs for all voting activities
  - IP address tracking
- 📊 **Real-time Results**: View election results with live updates
- 📈 **Data Visualization**: Interactive charts (Bar and Pie charts) for results
- 🎨 **Modern UI**: Beautiful and responsive user interface

## Tech Stack

- **Backend**: Flask (Python)
- **Frontend**: React.js
- **Database & Auth**: Supabase (PostgreSQL)
- **Charts**: Recharts

## Project Structure

```
votingsys/
├── backend/
│   ├── app.py                 # Flask application
│   ├── requirements.txt      # Python dependencies
│   ├── .env.example          # Environment variables template
│   └── supabase_schema.sql   # Database schema
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── contexts/         # React contexts (Auth)
│   │   └── App.js
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites

- Python 3.8+
- Node.js 16+
- Supabase account

### 1. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the SQL script from `backend/supabase_schema.sql`
3. Note your Supabase URL and anon key from Project Settings > API

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env and add your Supabase credentials
# SUPABASE_URL=your-supabase-url
# SUPABASE_KEY=your-supabase-anon-key
# JWT_SECRET=your-random-secret-key
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file (optional, defaults to localhost:5000)
# REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Running the Application

**Terminal 1 - Backend:**
```bash
cd backend
python app.py
```
Backend runs on http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
Frontend runs on http://localhost:3000

## Usage

1. **Register**: Create a new account
2. **Login**: Sign in with your credentials
3. **View Elections**: Browse active elections on the dashboard
4. **Vote**: Click "Vote Now" on an election and select a candidate
5. **View Results**: See real-time results with charts and vote counts

## Database Schema

- **elections**: Stores election information
- **candidates**: Stores candidate information for each election
- **votes**: Stores user votes with tamper-proof hashes
- **audit_logs**: Tracks all voting activities for security

## Security Features

1. **JWT Authentication**: Secure token-based authentication
2. **Vote Hashing**: Each vote is hashed using SHA-256 for tamper detection
3. **One Vote Per User**: Database constraint ensures single vote per election
4. **Audit Logging**: All votes are logged with timestamps and IP addresses
5. **Row Level Security**: Supabase RLS policies protect data access

## API Endpoints

### Public/User Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/elections` - Get all active elections
- `GET /api/elections/<id>/candidates` - Get candidates for election
- `POST /api/elections/<id>/vote` - Cast a vote
- `GET /api/elections/<id>/results` - Get election results
- `GET /api/elections/<id>/has-voted` - Check if user has voted
- `GET /api/user/profile` - Get user profile and voting history
- `GET /api/user/is-admin` - Check if current user is admin

### Admin Endpoints (Require Admin Role)
- `GET /api/admin/stats` - Get system statistics
- `GET /api/admin/elections/all` - Get all elections (including inactive)
- `POST /api/admin/elections` - Create new election
- `PUT /api/admin/elections/<id>` - Update election
- `DELETE /api/admin/elections/<id>` - Delete election
- `POST /api/admin/candidates` - Create new candidate
- `PUT /api/admin/candidates/<id>` - Update candidate
- `DELETE /api/admin/candidates/<id>` - Delete candidate
- `GET /api/admin/elections/<id>/export` - Export results as CSV

## New Features (v2.0)

✅ **Admin Panel** - Full admin dashboard for managing elections and candidates
✅ **User Profile** - View voting history and user information
✅ **CSV Export** - Export election results as CSV files
✅ **Admin Role System** - Secure admin authentication and authorization

See [ENHANCEMENTS.md](ENHANCEMENTS.md) for detailed information about new features.

## Future Enhancements

- Email notifications
- Multi-factor authentication
- Advanced analytics dashboard
- Export results to PDF
- Election scheduling and automatic activation/deactivation
- Bulk candidate import
- Voter eligibility management

## License

This project is open source and available for educational purposes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

