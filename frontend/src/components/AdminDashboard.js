import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import logo from '../assets/logo.png';
import './AdminDashboard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCreateElection, setShowCreateElection] = useState(false);
  const [showManageCandidates, setShowManageCandidates] = useState(false);
  const [selectedElection, setSelectedElection] = useState(null);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, electionsRes] = await Promise.all([
        axios.get(`${API_URL}/admin/stats`),
        axios.get(`${API_URL}/admin/elections/all`)
      ]);
      setStats(statsRes.data);
      setElections(electionsRes.data.elections);
      setError('');
    } catch (err) {
      setError('Failed to load admin data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateElection = async (electionData) => {
    try {
      await axios.post(`${API_URL}/admin/elections`, electionData);
      setShowCreateElection(false);
      setSuccess('Election created successfully!');
      setTimeout(() => setSuccess(''), 3000);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create election');
    }
  };

  const handleUpdateElection = async (id, data) => {
    try {
      await axios.put(`${API_URL}/admin/elections/${id}`, data);
      setSuccess('Election updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update election');
    }
  };

  const handleDeleteElection = async (id) => {
    if (!window.confirm('Are you sure you want to delete this election? This will also delete all votes and candidates.')) {
      return;
    }
    try {
      await axios.delete(`${API_URL}/admin/elections/${id}`);
      setSuccess('Election deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete election');
    }
  };

  const toggleElectionStatus = async (election) => {
    await handleUpdateElection(election.id, { is_active: !election.is_active });
  };

  const openManageCandidates = async (election) => {
    setSelectedElection(election);
    setShowManageCandidates(true);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return <div className="loading">Loading admin dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <div className="container">
          <div className="brand">
            <img src={logo} alt="Online Voting System" className="brand-logo" />
            <div className="brand-text">
              <span className="brand-title">Online Voting System</span>
              <span className="brand-subtitle">Admin Dashboard</span>
            </div>
          </div>
          <div className="header-actions">
            <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">
              User View
            </button>
            <span className="user-name">{user?.name || user?.email}</span>
            <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
          </div>
        </div>
      </header>

      <main className="container">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Total Elections</div>
              <div className="stat-value">{stats.total_elections}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Active</div>
              <div className="stat-value">{stats.active_elections}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Total Votes</div>
              <div className="stat-value">{stats.total_votes}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Users</div>
              <div className="stat-value">{stats.total_users}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Candidates</div>
              <div className="stat-value">{stats.total_candidates}</div>
            </div>
          </div>
        )}

        <div className="section-header">
          <h2>Elections</h2>
          <button onClick={() => setShowCreateElection(true)} className="btn btn-primary">
            + New Election
          </button>
        </div>

        <div className="elections-list">
          {elections.length === 0 ? (
            <div className="card empty-state">
              <p>No elections yet. Create your first election!</p>
            </div>
          ) : (
            elections.map((election) => (
              <ElectionCard
                key={election.id}
                election={election}
                onToggleStatus={toggleElectionStatus}
                onDelete={handleDeleteElection}
                onViewResults={() => navigate(`/results/${election.id}`)}
                onManageCandidates={openManageCandidates}
              />
            ))
          )}
        </div>

        {showCreateElection && (
          <CreateElectionModal
            onClose={() => setShowCreateElection(false)}
            onSubmit={handleCreateElection}
          />
        )}

        {showManageCandidates && selectedElection && (
          <ManageCandidatesModal
            election={selectedElection}
            onClose={() => {
              setShowManageCandidates(false);
              setSelectedElection(null);
            }}
            onSuccess={() => {
              setSuccess('Candidate operation successful!');
              setTimeout(() => setSuccess(''), 3000);
            }}
            onError={(err) => setError(err)}
          />
        )}
      </main>
    </div>
  );
};

const ElectionCard = ({ election, onToggleStatus, onDelete, onViewResults, onManageCandidates }) => {
  return (
    <div className={`election-card-admin ${!election.is_active ? 'inactive' : ''}`}>
      <div className="election-card-header">
        <div>
          <h3>{election.title}</h3>
          <span className={`status-badge ${election.is_active ? 'active' : 'inactive'}`}>
            {election.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>
      {election.description && <p className="election-description">{election.description}</p>}
      <div className="election-actions">
        <button onClick={() => onToggleStatus(election)} className="btn btn-sm btn-secondary">
          {election.is_active ? 'Deactivate' : 'Activate'}
        </button>
        <button onClick={() => onManageCandidates(election)} className="btn btn-sm btn-primary">
          Manage Candidates
        </button>
        <button onClick={onViewResults} className="btn btn-sm btn-secondary">
          Results
        </button>
        <button onClick={() => onDelete(election.id)} className="btn btn-sm btn-danger">
          Delete
        </button>
      </div>
    </div>
  );
};

const CreateElectionModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    is_active: true
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      return;
    }
    onSubmit(formData);
    setFormData({ title: '', description: '', is_active: true });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create Election</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="Election title"
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="3"
              placeholder="Optional description"
            />
          </div>
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              />
              Active
            </label>
          </div>
          <div className="modal-actions">
            <button type="submit" className="btn btn-primary">Create</button>
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ManageCandidatesModal = ({ election, onClose, onSuccess, onError }) => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', image_url: '' });

  useEffect(() => {
    fetchCandidates();
  }, [election.id]);

  const fetchCandidates = async () => {
    try {
      const response = await axios.get(`${API_URL}/elections/${election.id}/candidates`);
      setCandidates(response.data.candidates);
    } catch (err) {
      onError('Failed to load candidates');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      if (editingCandidate) {
        await axios.put(`${API_URL}/admin/candidates/${editingCandidate.id}`, formData);
      } else {
        await axios.post(`${API_URL}/admin/candidates`, {
          ...formData,
          election_id: election.id
        });
      }
      setFormData({ name: '', description: '', image_url: '' });
      setEditingCandidate(null);
      setShowAddForm(false);
      fetchCandidates();
      onSuccess();
    } catch (err) {
      onError(err.response?.data?.error || 'Failed to save candidate');
    }
  };

  const handleEdit = (candidate) => {
    setEditingCandidate(candidate);
    setFormData({
      name: candidate.name,
      description: candidate.description || '',
      image_url: candidate.image_url || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this candidate?')) {
      return;
    }
    try {
      await axios.delete(`${API_URL}/admin/candidates/${id}`);
      fetchCandidates();
      onSuccess();
    } catch (err) {
      onError('Failed to delete candidate');
    }
  };

  const cancelForm = () => {
    setShowAddForm(false);
    setEditingCandidate(null);
    setFormData({ name: '', description: '', image_url: '' });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Manage Candidates - {election.title}</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        {loading ? (
          <div className="loading">Loading candidates...</div>
        ) : (
          <>
            <div className="candidates-list-header">
              <span>{candidates.length} candidate{candidates.length !== 1 ? 's' : ''}</span>
              {!showAddForm && (
                <button onClick={() => setShowAddForm(true)} className="btn btn-primary btn-sm">
                  + Add Candidate
                </button>
              )}
            </div>

            {showAddForm && (
              <div className="candidate-form-card">
                <h3>{editingCandidate ? 'Edit Candidate' : 'Add New Candidate'}</h3>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      placeholder="Candidate name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows="2"
                      placeholder="Optional description"
                    />
                  </div>
                  <div className="form-group">
                    <label>Image URL</label>
                    <input
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary">
                      {editingCandidate ? 'Update' : 'Add'} Candidate
                    </button>
                    <button type="button" onClick={cancelForm} className="btn btn-secondary">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="candidates-list">
              {candidates.length === 0 ? (
                <div className="empty-state">
                  <p>No candidates yet. Add your first candidate!</p>
                </div>
              ) : (
                candidates.map((candidate) => (
                  <div key={candidate.id} className="candidate-item">
                    {candidate.image_url && (
                      <img src={candidate.image_url} alt={candidate.name} className="candidate-avatar" />
                    )}
                    <div className="candidate-info">
                      <h4>{candidate.name}</h4>
                      {candidate.description && <p>{candidate.description}</p>}
                    </div>
                    <div className="candidate-actions">
                      <button onClick={() => handleEdit(candidate)} className="btn btn-sm btn-secondary">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(candidate.id)} className="btn btn-sm btn-danger">
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
