import { useState } from 'react';
import Login from './components/auth/Login.jsx';
import Register from './components/auth/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import './index.css';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [view, setView] = useState('login');

  if (!token) {
    if (view === 'register') {
      return <Register onRegisterSuccess={() => setView('login')} onSwitchToLogin={() => setView('login')} />;
    }
    return (
      <Login 
        onLoginSuccess={(t) => {
          setToken(t);
          localStorage.setItem('token', t);
        }} 
        onSwitchToRegister={() => setView('register')} 
      />
    );
  }

  return (
    <Dashboard
      token={token}
      onLogout={() => {
        setToken('');
        localStorage.removeItem('token');
        setView('login');
      }}
    />
  );
}
