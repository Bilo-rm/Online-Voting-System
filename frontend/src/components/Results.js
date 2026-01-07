import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import './Results.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe', '#43e97b', '#fa709a'];

const Results = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchResults = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/elections/${id}/results`);
      setResults(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load results');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const handleExportCSV = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/elections/${id}/export`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `election_${id}_results.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError('Failed to export results');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchResults();
    
    // Auto-refresh every 5 seconds if enabled
    let interval;
    if (autoRefresh) {
      interval = setInterval(fetchResults, 5000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [fetchResults, autoRefresh]);

  if (loading) {
    return <div className="loading">Loading results...</div>;
  }

  if (error || !results) {
    return (
      <div className="container">
        <div className="error-message">{error || 'Results not available'}</div>
        <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">
          Back to Dashboard
        </button>
      </div>
    );
  }

  const chartData = results.results.map((result) => ({
    name: result.candidate_name,
    votes: result.vote_count,
    percentage: result.percentage
  }));

  return (
    <div className="results-container">
      <div className="container">
        <button onClick={() => navigate('/dashboard')} className="btn btn-secondary back-btn">
          ← Back to Dashboard
        </button>

        <div className="results-header card">
          <h1>Election Results</h1>
          <div className="results-stats">
            <div className="stat-item">
              <span className="stat-label">Total Votes:</span>
              <span className="stat-value">{results.total_votes}</span>
            </div>
            <div className="auto-refresh-control">
              <label>
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                />
                Auto-refresh (5s)
              </label>
              <button onClick={fetchResults} className="btn btn-secondary btn-sm">
                Refresh Now
              </button>
              {user?.is_admin && (
                <button
                  onClick={handleExportCSV}
                  className="btn btn-primary btn-sm"
                >
                  Export CSV
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="results-table card">
          <h2>Vote Counts</h2>
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Candidate</th>
                <th>Votes</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {results.results.map((result, index) => (
                <tr key={result.candidate_id}>
                  <td>{index + 1}</td>
                  <td>{result.candidate_name}</td>
                  <td>{result.vote_count}</td>
                  <td>{result.percentage}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="charts-section">
          <div className="chart-card card">
            <h2>Bar Chart</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="votes" fill="#667eea" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card card">
            <h2>Pie Chart</h2>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="votes"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;

