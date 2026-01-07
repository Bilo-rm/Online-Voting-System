import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ElectionDetail from './components/ElectionDetail';
import Results from './components/Results';
import AdminDashboard from './components/AdminDashboard';
import Profile from './components/Profile';
import PrivateRoute from './components/PrivateRoute';
import Landing from './components/Landing';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <PrivateRoute>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/election/:id"
              element={
                <PrivateRoute>
                  <ElectionDetail />
                </PrivateRoute>
              }
            />
            <Route
              path="/results/:id"
              element={
                <PrivateRoute>
                  <Results />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

