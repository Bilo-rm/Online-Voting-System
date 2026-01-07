import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import logo from '../assets/logo.png';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="landing">
      <header className="landing-hero">
        <div className="landing-hero-inner container">
          <div className="landing-hero-left">
            <div className="brand landing-brand">
              <img src={logo} alt="Online Voting System" className="brand-logo" />
              <div className="brand-text">
                <span className="brand-title">Online Voting System</span>
                <span className="brand-subtitle">Secure digital elections</span>
              </div>
            </div>
            <h1>Run secure, modern elections in minutes.</h1>
            <p>
              A full‑stack online voting platform for student councils, companies, and
              communities. Simple for voters, powerful and transparent for admins.
            </p>
            <div className="landing-hero-actions">
              <button className="btn btn-primary" onClick={handleGetStarted}>
                Get Started
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => navigate('/register')}
              >
                Create an account
              </button>
            </div>
            <div className="landing-badges">
              <span>✓ One person, one vote</span>
              <span>✓ Real‑time results</span>
              <span>✓ Tamper‑proof audit logs</span>
            </div>
          </div>

          <div className="landing-hero-right">
            <div className="landing-hero-card">
              <h3>Live results at a glance</h3>
              <p>Track turnout and winners instantly with clear charts.</p>
              <div className="landing-hero-chart-placeholder">
                <div className="bar bar-1" />
                <div className="bar bar-2" />
                <div className="bar bar-3" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="landing-section">
        <div className="container">
          <h2>Everything you need for fair, secure voting</h2>
          <p className="landing-section-subtitle">
            Built with modern security standards and user experience in mind
          </p>
          <div className="landing-grid">
            <div className="landing-card">
              <div className="landing-card-icon">🔐</div>
              <h3>Secure authentication</h3>
              <p>
                Users log in with unique accounts backed by Supabase Auth and JWT
                tokens. Sessions are protected end‑to‑end.
              </p>
            </div>
            <div className="landing-card">
              <div className="landing-card-icon">✓</div>
              <h3>One vote per person</h3>
              <p>
                Database constraints and backend checks ensure each voter can only vote
                once per election.
              </p>
            </div>
            <div className="landing-card">
              <div className="landing-card-icon">📊</div>
              <h3>Real‑time results</h3>
              <p>
                Results update automatically with bar and pie charts so everyone stays
                informed.
              </p>
            </div>
            <div className="landing-card">
              <div className="landing-card-icon">⚙️</div>
              <h3>Admin control panel</h3>
              <p>
                Admins create elections, manage candidates, and export CSV reports—
                without being allowed to vote.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section landing-how">
        <div className="container">
          <h2>How it works</h2>
          <div className="landing-steps">
            <div className="step">
              <span className="step-number">1</span>
              <h3>Create an election</h3>
              <p>Admins configure the election and add candidates from the dashboard.</p>
            </div>
            <div className="step">
              <span className="step-number">2</span>
              <h3>Voters sign in</h3>
              <p>
                Voters register or log in securely, then cast a single vote from any
                device.
              </p>
            </div>
            <div className="step">
              <span className="step-number">3</span>
              <h3>View results live</h3>
              <p>
                Watch results appear instantly with total counts, percentages, and
                exports.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section landing-security">
        <div className="container">
          <h2>Security & transparency built in</h2>
          <p className="landing-section-subtitle">
            Every vote is protected with enterprise-grade security features
          </p>
          <div className="landing-grid">
            <div className="landing-card">
              <div className="landing-card-icon">📝</div>
              <h3>Audit logs</h3>
              <p>
                Every vote is hashed and recorded in an audit log with timestamps and
                IP addresses.
              </p>
            </div>
            <div className="landing-card">
              <div className="landing-card-icon">🛡️</div>
              <h3>Row Level Security</h3>
              <p>
                Supabase RLS policies ensure voters see only their data while admins
                keep a global view.
              </p>
            </div>
            <div className="landing-card">
              <div className="landing-card-icon">⚡</div>
              <h3>Modern stack</h3>
              <p>
                Flask backend, React frontend, and Supabase Postgres provide a robust,
                scalable foundation.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section landing-cta">
        <div className="container">
          <div className="landing-cta-card">
            <h2>Ready to run your next election?</h2>
            <p>
              Get started in just a few clicks. Create your account and launch a secure
              election today.
            </p>
            <div className="landing-cta-actions">
              <button className="btn btn-primary" onClick={handleGetStarted}>
                Get Started
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => navigate('/register')}
              >
                Create an account
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="container">
          <span>© {new Date().getFullYear()} Online Voting System</span>
          <span>Built with Flask · React · Supabase</span>
        </div>
      </footer>
    </div>
  );
};

export default Landing;


