import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { authService } from '../services/api';
import Sidebar from '../components/layout/Sidebar';
import Overview from './Overview';
import Employees from './Employees';
import AttendanceLogs from './AttendanceLogs';

export default function Dashboard({ onLogout }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authService.getProfile();
        setProfile(data);
      } catch (err) {
        console.error('Failed to load admin profile');
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans">
      <Sidebar profile={profile} onLogout={onLogout} />
      
      <main className="flex-1 ml-80 p-12 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <Routes>
            <Route path="overview" element={<Overview />} />
            <Route path="employees" element={<Employees />} />
            <Route path="logs" element={<AttendanceLogs />} />
            <Route path="/" element={<Navigate to="overview" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
