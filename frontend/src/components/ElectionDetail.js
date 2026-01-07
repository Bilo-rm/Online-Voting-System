import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import './ElectionDetail.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const ElectionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchElectionData();
    checkVoteStatus();
  }, [id]);

  const fetchElectionData = async () => {
    try {
      const [electionsRes, candidatesRes] = await Promise.all([
        axios.get(`${API_URL}/elections`),
        axios.get(`${API_URL}/elections/${id}/candidates`)
      ]);

      const electionData = electionsRes.data.elections.find(e => e.id === id);
      setElection(electionData);
      setCandidates(candidatesRes.data.candidates);
    } catch (err) {
      setError('Failed to load election data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const checkVoteStatus = async () => {
    try {
      const response = await axios.get(`${API_URL}/elections/${id}/has-voted`);
      setHasVoted(response.data.has_voted);
    } catch (err) {
      console.error(err);
    }
  };

  const handleVote = async (candidateId) => {
    if (hasVoted) {
      setError('You have already voted in this election');
      return;
    }

    if (!window.confirm('Are you sure you want to cast this vote? This action cannot be undone.')) {
      return;
    }

    setVoting(true);
    setError('');
    setSuccess('');

    try {
      await axios.post(`${API_URL}/elections/${id}/vote`, {
        candidate_id: candidateId
      });

      setSuccess('Vote cast successfully!');
      setHasVoted(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to cast vote');
    } finally {
      setVoting(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading election...</div>;
  }

  if (!election) {
    return (
      <div className="container">
        <div className="error-message">Election not found</div>
        <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">
          Back to Dashboard
        </button>
      </div>
    );
  }

  // Check if user is admin
  const isAdmin = user?.is_admin;

  return (
    <div className="election-detail-container">
      <div className="container">
        <button onClick={() => navigate('/dashboard')} className="btn btn-secondary back-btn">
          ← Back to Dashboard
        </button>

        <div className="election-header card">
          <h1>{election.title}</h1>
          {election.description && (
            <p className="election-description">{election.description}</p>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {isAdmin ? (
          <div className="card">
            <div className="admin-notice">
              <div className="notice-icon">🔒</div>
              <h2>Administrators Cannot Vote</h2>
              <p>As an administrator, you are not allowed to vote in elections to maintain fairness and integrity.</p>
              <button
                onClick={() => navigate(`/results/${id}`)}
                className="btn btn-primary"
              >
                View Results
              </button>
            </div>
          </div>
        ) : hasVoted ? (
          <div className="card">
            <div className="already-voted">
              <div className="notice-icon">✓</div>
              <h2>You have already voted</h2>
              <p>Thank you for participating in this election!</p>
              <button
                onClick={() => navigate(`/results/${id}`)}
                className="btn btn-primary"
              >
                View Results
              </button>
            </div>
          </div>
        ) : (
          <div className="candidates-section">
            <h2>Select a Candidate</h2>
            {candidates.length === 0 ? (
              <div className="card empty-candidates">
                <p>No candidates available for this election yet.</p>
              </div>
            ) : (
              <div className="candidates-grid">
                {candidates.map((candidate) => (
                  <div key={candidate.id} className="candidate-card">
                    {candidate.image_url ? (
                      <img
                        src={candidate.image_url}
                        alt={candidate.name}
                        className="candidate-image"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="candidate-image-placeholder">
                        <span>{candidate.name.charAt(0).toUpperCase()}</span>
                      </div>
                    )}
                    <h3>{candidate.name}</h3>
                    {candidate.description && (
                      <p className="candidate-description">{candidate.description}</p>
                    )}
                    <button
                      onClick={() => handleVote(candidate.id)}
                      className="btn btn-success"
                      disabled={voting}
                    >
                      {voting ? 'Voting...' : 'Vote'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ElectionDetail;

