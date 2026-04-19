import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  useEffect(() => {
    console.log('Admin App Mounted! Token:', token ? 'Exists' : 'Empty');
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin_user');
    setToken('');
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={!token ? (
            <Login 
              onLoginSuccess={(t) => {
                localStorage.setItem('token', t);
                setToken(t);
              }} 
            />
          ) : <Navigate to="/dashboard" replace />} 
        />
        
        <Route 
          path="/dashboard/*" 
          element={token ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/login" replace />} 
        />

        <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
