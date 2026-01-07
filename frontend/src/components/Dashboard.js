import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import logo from '../assets/logo.png';
import './Dashboard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Dashboard = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      const response = await axios.get(`${API_URL}/elections`);
      setElections(response.data.elections);
    } catch (err) {
      setError('Failed to load elections');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewElection = (electionId) => {
    navigate(`/election/${electionId}`);
  };

  const handleViewResults = (electionId) => {
    navigate(`/results/${electionId}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return <div className="loading">Loading elections...</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="container">
          <div className="brand">
            <img src={logo} alt="Online Voting System" className="brand-logo" />
            <div className="brand-text">
              <span className="brand-title">Online Voting System</span>
              <span className="brand-subtitle">Secure online elections</span>
            </div>
          </div>
          <div className="header-actions">
            <button onClick={() => navigate('/profile')} className="btn btn-secondary">
              <span className="btn-icon">👤</span>
              My Profile
            </button>
            {user?.is_admin && (
              <button onClick={() => navigate('/admin')} className="btn btn-primary">
                <span className="btn-icon">⚙️</span>
                Admin Panel
              </button>
            )}
            <span className="user-name">Welcome, {user?.name || user?.email}</span>
            <button onClick={handleLogout} className="btn btn-secondary">
              <span className="btn-icon">🚪</span>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container dashboard-main">
        {error && <div className="error-message">{error}</div>}

        <div className="dashboard-hero">
          <div className="hero-content">
            <h1 className="dashboard-title">
              Welcome back, {user?.name?.split(' ')[0] || 'Voter'}! 👋
            </h1>
            <p className="dashboard-subtitle">
              Participate in active elections and make your voice heard
            </p>
          </div>
          <div className="hero-stats">
            <div className="hero-stat-item">
              <div className="hero-stat-icon">🗳️</div>
              <div className="hero-stat-content">
                <div className="hero-stat-value">{elections.length}</div>
                <div className="hero-stat-label">Active Elections</div>
              </div>
            </div>
          </div>
        </div>

        <div className="section-header-dash">
          <div>
            <h2 className="section-title">Active Elections</h2>
            <p className="section-description">Vote in ongoing elections</p>
          </div>
        </div>

        {elections.length === 0 ? (
          <div className="empty-state-modern">
            <div className="empty-illustration">
              <div className="empty-circle"></div>
              <div className="empty-icon">📋</div>
            </div>
            <h3>No Active Elections</h3>
            <p>There are no elections available at the moment. Check back later for new voting opportunities.</p>
            {user?.is_admin && (
              <button onClick={() => navigate('/admin')} className="btn btn-primary">
                <span className="btn-icon">➕</span>
                Create Election
              </button>
            )}
          </div>
        ) : (
          <div className="elections-grid">
            {elections.map((election, index) => (
              <div key={election.id} className="election-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="election-card-header-dash">
                  <div className="election-badge">
                    <span className="badge-icon">🗳️</span>
                    <span className="badge-text">Active</span>
                  </div>
                </div>
                <div className="election-card-content">
                  <h3>{election.title}</h3>
                  {election.description && (
                    <p className="election-description">{election.description}</p>
                  )}
                </div>
                <div className="election-card-footer">
                  <div className="election-actions">
                    {!user?.is_admin ? (
                      <>
                        <button
                          onClick={() => handleViewElection(election.id)}
                          className="btn btn-primary btn-icon-text"
                        >
                          <span className="btn-icon">✓</span>
                          Cast Your Vote
                        </button>
                        <button
                          onClick={() => handleViewResults(election.id)}
                          className="btn btn-secondary btn-icon-text"
                        >
                          <span className="btn-icon">📊</span>
                          Results
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleViewResults(election.id)}
                        className="btn btn-primary btn-icon-text btn-full"
                      >
                        <span className="btn-icon">📊</span>
                        View Results
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;

