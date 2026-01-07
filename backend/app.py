from flask import Flask, request, jsonify
from flask_cors import CORS
from supabase import create_client, Client
import os
from datetime import datetime, timezone
import hashlib
import secrets
from functools import wraps
import jwt
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL", "your-supabase-url")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "your-supabase-key")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY", os.getenv("SUPABASE_KEY", "your-supabase-key"))
JWT_SECRET = os.getenv("JWT_SECRET", secrets.token_urlsafe(32))

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
# Service role client for operations that need to bypass RLS (like audit logs)
supabase_admin: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

def token_required(f):
    """Decorator to verify JWT token"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        try:
            if token.startswith('Bearer '):
                token = token[7:]
            data = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
            request.user_id = data['user_id']
            request.user_email = data.get('email', '')
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Token is invalid'}), 401
        
        return f(*args, **kwargs)
    return decorated

def admin_required(f):
    """Decorator to verify admin access"""
    @wraps(f)
    @token_required
    def decorated(*args, **kwargs):
        try:
            # Get user from JWT token (already decoded in token_required)
            # Check admin status from the token or make a simple check
            # For now, we'll check via a user metadata lookup
            # In production, you might want to store admin status in a separate table
            token = request.headers.get('Authorization')
            if token.startswith('Bearer '):
                token = token[7:]
            
            try:
                data = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
                is_admin = data.get('is_admin', False)
            except:
                is_admin = False
            
            # Alternative: Check via Supabase admin API if needed
            # For simplicity, we'll use the JWT token's is_admin field
            # Make sure to set this during login if user is admin
            
            if not is_admin:
                return jsonify({'error': 'Admin access required'}), 403
            
            return f(*args, **kwargs)
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    return decorated

def hash_vote(vote_data):
    """Create a hash of vote data for tamper-proof logging"""
    vote_string = f"{vote_data['user_id']}{vote_data['election_id']}{vote_data['candidate_id']}{datetime.now(timezone.utc).isoformat()}"
    return hashlib.sha256(vote_string.encode()).hexdigest()

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'}), 200

@app.route('/api/auth/register', methods=['POST'])
def register():
    """Register a new user"""
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')
        name = data.get('name')
        
        if not email or not password or not name:
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Create user in Supabase Auth
        response = supabase.auth.sign_up({
            "email": email,
            "password": password,
            "options": {
                "data": {
                    "name": name
                }
            }
        })
        
        if response.user:
            return jsonify({
                'message': 'User registered successfully',
                'user_id': response.user.id
            }), 201
        else:
            return jsonify({'error': 'Registration failed'}), 400
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    """Login user and return JWT token"""
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'error': 'Email and password required'}), 400
        
        # Authenticate with Supabase
        response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })
        
        if response.user:
            # Check if user is admin
            is_admin = response.user.user_metadata.get('is_admin', False)
            
            # Generate JWT token
            token = jwt.encode({
                'user_id': response.user.id,
                'email': response.user.email,
                'is_admin': is_admin,
                'exp': datetime.now(timezone.utc).timestamp() + 86400  # 24 hours
            }, JWT_SECRET, algorithm='HS256')
            
            return jsonify({
                'token': token,
                'user': {
                    'id': response.user.id,
                    'email': response.user.email,
                    'name': response.user.user_metadata.get('name', ''),
                    'is_admin': is_admin
                }
            }), 200
        else:
            return jsonify({'error': 'Invalid credentials'}), 401
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/elections', methods=['GET'])
def get_elections():
    """Get all active elections"""
    try:
        response = supabase.table('elections').select('*').eq('is_active', True).execute()
        return jsonify({'elections': response.data}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/elections/<election_id>/candidates', methods=['GET'])
def get_candidates(election_id):
    """Get all candidates for an election"""
    try:
        response = supabase.table('candidates').select('*').eq('election_id', election_id).execute()
        return jsonify({'candidates': response.data}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/elections/<election_id>/vote', methods=['POST'])
@token_required
def cast_vote(election_id):
    """Cast a vote for a candidate"""
    try:
        user_id = request.user_id
        data = request.json
        candidate_id = data.get('candidate_id')
        
        if not candidate_id:
            return jsonify({'error': 'Candidate ID required'}), 400
        
        # Check if user is admin - admins cannot vote
        token = request.headers.get('Authorization')
        if token and token.startswith('Bearer '):
            token = token[7:]
            try:
                token_data = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
                is_admin = token_data.get('is_admin', False)
                if is_admin:
                    return jsonify({'error': 'Administrators are not allowed to vote'}), 403
            except:
                pass
        
        # Check if user has already voted
        existing_vote = supabase.table('votes').select('*').eq('user_id', user_id).eq('election_id', election_id).execute()
        
        if existing_vote.data:
            return jsonify({'error': 'You have already voted in this election'}), 400
        
        # Verify election is active
        election = supabase.table('elections').select('*').eq('id', election_id).eq('is_active', True).execute()
        if not election.data:
            return jsonify({'error': 'Election not found or not active'}), 404
        
        # Verify candidate exists in this election
        candidate = supabase.table('candidates').select('*').eq('id', candidate_id).eq('election_id', election_id).execute()
        if not candidate.data:
            return jsonify({'error': 'Invalid candidate for this election'}), 400
        
        # Create vote data
        vote_data = {
            'user_id': user_id,
            'election_id': election_id,
            'candidate_id': candidate_id,
            'voted_at': datetime.now(timezone.utc).isoformat()
        }
        
        # Create tamper-proof hash
        vote_hash = hash_vote(vote_data)
        vote_data['vote_hash'] = vote_hash
        
        # Insert vote
        vote_response = supabase.table('votes').insert(vote_data).execute()
        
        # Log vote in audit log (use admin client to bypass RLS)
        audit_log = {
            'user_id': user_id,
            'election_id': election_id,
            'candidate_id': candidate_id,
            'vote_hash': vote_hash,
            'action': 'vote_cast',
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'ip_address': request.remote_addr
        }
        supabase_admin.table('audit_logs').insert(audit_log).execute()
        
        return jsonify({
            'message': 'Vote cast successfully',
            'vote_hash': vote_hash
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/elections/<election_id>/results', methods=['GET'])
def get_results(election_id):
    """Get election results"""
    try:
        # Get all votes for this election
        votes = supabase.table('votes').select('candidate_id').eq('election_id', election_id).execute()
        
        # Count votes per candidate
        vote_counts = {}
        for vote in votes.data:
            candidate_id = vote['candidate_id']
            vote_counts[candidate_id] = vote_counts.get(candidate_id, 0) + 1
        
        # Get candidate details
        candidates = supabase.table('candidates').select('*').eq('election_id', election_id).execute()
        
        results = []
        total_votes = sum(vote_counts.values())
        
        for candidate in candidates.data:
            candidate_id = candidate['id']
            vote_count = vote_counts.get(candidate_id, 0)
            percentage = (vote_count / total_votes * 100) if total_votes > 0 else 0
            
            results.append({
                'candidate_id': candidate_id,
                'candidate_name': candidate['name'],
                'vote_count': vote_count,
                'percentage': round(percentage, 2)
            })
        
        # Sort by vote count descending
        results.sort(key=lambda x: x['vote_count'], reverse=True)
        
        return jsonify({
            'election_id': election_id,
            'total_votes': total_votes,
            'results': results
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/elections/<election_id>/has-voted', methods=['GET'])
@token_required
def check_vote_status(election_id):
    """Check if user has voted in this election"""
    try:
        user_id = request.user_id
        existing_vote = supabase.table('votes').select('*').eq('user_id', user_id).eq('election_id', election_id).execute()
        
        return jsonify({
            'has_voted': len(existing_vote.data) > 0
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/user/profile', methods=['GET'])
@token_required
def get_user_profile():
    """Get user profile and voting history"""
    try:
        user_id = request.user_id
        
        # Get user votes
        votes_response = supabase.table('votes').select('*').eq('user_id', user_id).order('voted_at', desc=True).execute()
        
        voting_history = []
        for vote in votes_response.data:
            # Get election details
            election = supabase.table('elections').select('title').eq('id', vote['election_id']).execute()
            election_title = election.data[0]['title'] if election.data else 'Unknown'
            
            # Get candidate details
            candidate = supabase.table('candidates').select('name').eq('id', vote['candidate_id']).execute()
            candidate_name = candidate.data[0]['name'] if candidate.data else 'Unknown'
            
            voting_history.append({
                'vote_id': vote['id'],
                'voted_at': vote['voted_at'],
                'election_id': vote['election_id'],
                'election_title': election_title,
                'candidate_id': vote['candidate_id'],
                'candidate_name': candidate_name
            })
        
        # Get user info from token (simpler approach)
        # In production, you might want to fetch from Supabase auth
        token = request.headers.get('Authorization')
        if token and token.startswith('Bearer '):
            token = token[7:]
            try:
                token_data = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
                user_data = {
                    'id': user_id,
                    'email': token_data.get('email', ''),
                    'name': '',  # Could be stored in a users table
                    'is_admin': token_data.get('is_admin', False),
                    'voting_history': voting_history,
                    'total_votes': len(voting_history)
                }
            except:
                user_data = {
                    'id': user_id,
                    'email': '',
                    'name': '',
                    'is_admin': False,
                    'voting_history': voting_history,
                    'total_votes': len(voting_history)
                }
        else:
            user_data = {
                'id': user_id,
                'email': '',
                'name': '',
                'is_admin': False,
                'voting_history': voting_history,
                'total_votes': len(voting_history)
            }
        
        return jsonify(user_data), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/user/is-admin', methods=['GET'])
@token_required
def check_admin_status():
    """Check if current user is admin"""
    try:
        token = request.headers.get('Authorization')
        if token and token.startswith('Bearer '):
            token = token[7:]
            try:
                data = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
                is_admin = data.get('is_admin', False)
            except:
                is_admin = False
        else:
            is_admin = False
        
        return jsonify({'is_admin': is_admin}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Admin endpoints
@app.route('/api/admin/elections', methods=['POST'])
@admin_required
def create_election():
    """Create a new election (Admin only)"""
    try:
        data = request.json
        election_data = {
            'title': data.get('title'),
            'description': data.get('description', ''),
            'is_active': data.get('is_active', True),
            'start_date': data.get('start_date'),
            'end_date': data.get('end_date')
        }
        
        if not election_data['title']:
            return jsonify({'error': 'Title is required'}), 400
        
        response = supabase.table('elections').insert(election_data).execute()
        
        return jsonify({
            'message': 'Election created successfully',
            'election': response.data[0] if response.data else None
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/elections/<election_id>', methods=['PUT'])
@admin_required
def update_election(election_id):
    """Update an election (Admin only)"""
    try:
        data = request.json
        update_data = {}
        
        if 'title' in data:
            update_data['title'] = data['title']
        if 'description' in data:
            update_data['description'] = data['description']
        if 'is_active' in data:
            update_data['is_active'] = data['is_active']
        if 'start_date' in data:
            update_data['start_date'] = data['start_date']
        if 'end_date' in data:
            update_data['end_date'] = data['end_date']
        
        response = supabase.table('elections').update(update_data).eq('id', election_id).execute()
        
        if not response.data:
            return jsonify({'error': 'Election not found'}), 404
        
        return jsonify({
            'message': 'Election updated successfully',
            'election': response.data[0]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/elections/<election_id>', methods=['DELETE'])
@admin_required
def delete_election(election_id):
    """Delete an election (Admin only)"""
    try:
        response = supabase.table('elections').delete().eq('id', election_id).execute()
        
        return jsonify({'message': 'Election deleted successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/elections/all', methods=['GET'])
@admin_required
def get_all_elections():
    """Get all elections including inactive ones (Admin only)"""
    try:
        response = supabase.table('elections').select('*').order('created_at', desc=True).execute()
        return jsonify({'elections': response.data}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/candidates', methods=['POST'])
@admin_required
def create_candidate():
    """Create a new candidate (Admin only)"""
    try:
        data = request.json
        candidate_data = {
            'election_id': data.get('election_id'),
            'name': data.get('name'),
            'description': data.get('description', ''),
            'image_url': data.get('image_url', '')
        }
        
        if not candidate_data['election_id'] or not candidate_data['name']:
            return jsonify({'error': 'Election ID and name are required'}), 400
        
        response = supabase.table('candidates').insert(candidate_data).execute()
        
        return jsonify({
            'message': 'Candidate created successfully',
            'candidate': response.data[0] if response.data else None
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/candidates/<candidate_id>', methods=['PUT'])
@admin_required
def update_candidate(candidate_id):
    """Update a candidate (Admin only)"""
    try:
        data = request.json
        update_data = {}
        
        if 'name' in data:
            update_data['name'] = data['name']
        if 'description' in data:
            update_data['description'] = data['description']
        if 'image_url' in data:
            update_data['image_url'] = data['image_url']
        
        response = supabase.table('candidates').update(update_data).eq('id', candidate_id).execute()
        
        if not response.data:
            return jsonify({'error': 'Candidate not found'}), 404
        
        return jsonify({
            'message': 'Candidate updated successfully',
            'candidate': response.data[0]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/candidates/<candidate_id>', methods=['DELETE'])
@admin_required
def delete_candidate(candidate_id):
    """Delete a candidate (Admin only)"""
    try:
        response = supabase.table('candidates').delete().eq('id', candidate_id).execute()
        
        return jsonify({'message': 'Candidate deleted successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/elections/<election_id>/export', methods=['GET'])
@admin_required
def export_results(election_id):
    """Export election results as CSV (Admin only)"""
    try:
        import csv
        from io import StringIO
        
        # Get results
        votes = supabase.table('votes').select('candidate_id, voted_at').eq('election_id', election_id).execute()
        candidates = supabase.table('candidates').select('*').eq('election_id', election_id).execute()
        election = supabase.table('elections').select('*').eq('id', election_id).execute()
        
        if not election.data:
            return jsonify({'error': 'Election not found'}), 404
        
        # Count votes
        vote_counts = {}
        for vote in votes.data:
            candidate_id = vote['candidate_id']
            vote_counts[candidate_id] = vote_counts.get(candidate_id, 0) + 1
        
        # Create CSV
        output = StringIO()
        writer = csv.writer(output)
        
        # Header
        writer.writerow(['Election Results Export'])
        writer.writerow(['Election:', election.data[0]['title']])
        writer.writerow(['Date:', datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S')])
        writer.writerow([])
        writer.writerow(['Candidate', 'Votes', 'Percentage'])
        
        total_votes = sum(vote_counts.values())
        
        for candidate in candidates.data:
            candidate_id = candidate['id']
            vote_count = vote_counts.get(candidate_id, 0)
            percentage = (vote_count / total_votes * 100) if total_votes > 0 else 0
            writer.writerow([candidate['name'], vote_count, f'{percentage:.2f}%'])
        
        writer.writerow([])
        writer.writerow(['Total Votes:', total_votes])
        
        from flask import Response
        return Response(
            output.getvalue(),
            mimetype='text/csv',
            headers={'Content-Disposition': f'attachment; filename=election_{election_id}_results.csv'}
        )
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/stats', methods=['GET'])
@admin_required
def get_admin_stats():
    """Get admin dashboard statistics"""
    try:
        # Get total elections
        elections = supabase.table('elections').select('id').execute()
        total_elections = len(elections.data)
        active_elections = len([e for e in elections.data if e.get('is_active', False)])
        
        # Get total votes
        votes = supabase.table('votes').select('id').execute()
        total_votes = len(votes.data)
        
        # Get total users (approximate from unique user_ids in votes)
        unique_users = supabase.table('votes').select('user_id').execute()
        total_users = len(set([v['user_id'] for v in unique_users.data]))
        
        # Get total candidates
        candidates = supabase.table('candidates').select('id').execute()
        total_candidates = len(candidates.data)
        
        return jsonify({
            'total_elections': total_elections,
            'active_elections': active_elections,
            'total_votes': total_votes,
            'total_users': total_users,
            'total_candidates': total_candidates
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)

