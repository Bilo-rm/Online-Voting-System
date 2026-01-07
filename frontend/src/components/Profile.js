import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import './Profile.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${API_URL}/user/profile`);
      setProfile(response.data);
    } catch (err) {
      setError('Failed to load profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  if (error || !profile) {
    return (
      <div className="container">
        <div className="error-message">{error || 'Profile not found'}</div>
        <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="container">
        <button onClick={() => navigate('/dashboard')} className="btn btn-secondary back-btn">
          ← Back to Dashboard
        </button>

        <div className="profile-header card">
          <div className="profile-avatar-section">
            <div className="profile-avatar">
              {user?.name ? user.name.charAt(0).toUpperCase() : user?.email.charAt(0).toUpperCase()}
            </div>
            <div className="profile-title-section">
              <h1>My Profile</h1>
              <p className="profile-subtitle">Manage your account and view voting activity</p>
            </div>
          </div>
          
          <div className="profile-stats">
            <div className="profile-stat-card">
              <div className="stat-icon">🗳️</div>
              <div className="stat-content">
                <div className="stat-number">{profile.total_votes}</div>
                <div className="stat-label">Total Votes</div>
              </div>
            </div>
            <div className="profile-stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <div className="stat-number">{profile.voting_history.length}</div>
                <div className="stat-label">Elections Participated</div>
              </div>
            </div>
            {profile.is_admin && (
              <div className="profile-stat-card admin-card">
                <div className="stat-icon">👑</div>
                <div className="stat-content">
                  <div className="stat-number">Admin</div>
                  <div className="stat-label">Account Type</div>
                </div>
              </div>
            )}
          </div>

          <div className="profile-info">
            <div className="info-item">
              <div className="info-icon">👤</div>
              <div className="info-content">
                <span className="info-label">Full Name</span>
                <span className="info-value">{user?.name || 'Not set'}</span>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon">✉️</div>
              <div className="info-content">
                <span className="info-label">Email Address</span>
                <span className="info-value">{profile.email || user?.email}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="voting-history card">
          <div className="section-header-profile">
            <div>
              <h2>Voting History</h2>
              <p className="section-subtitle">Your participation in past elections</p>
            </div>
            {profile.voting_history.length > 0 && (
              <div className="history-count-badge">
                {profile.voting_history.length} {profile.voting_history.length === 1 ? 'vote' : 'votes'}
              </div>
            )}
          </div>
          
          {profile.voting_history.length === 0 ? (
            <div className="no-history">
              <div className="empty-icon-large">📭</div>
              <h3>No voting history yet</h3>
              <p>You haven't participated in any elections. Visit the dashboard to vote in active elections.</p>
              <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
                View Elections
              </button>
            </div>
          ) : (
            <div className="history-list">
              {profile.voting_history.map((vote, index) => (
                <div key={vote.vote_id} className="history-item">
                  <div className="history-number">{index + 1}</div>
                  <div className="history-content">
                    <div className="history-main">
                      <h3>{vote.election_title}</h3>
                      <div className="candidate-voted">
                        <span className="vote-icon">✓</span>
                        <span className="candidate-name">Voted for: <strong>{vote.candidate_name}</strong></span>
                      </div>
                    </div>
                    <div className="history-meta">
                      <span className="vote-date">
                        <span className="date-icon">📅</span>
                        {new Date(vote.voted_at).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      <button
                        onClick={() => navigate(`/results/${vote.election_id}`)}
                        className="btn btn-primary btn-sm"
                      >
                        View Results →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

