import { useState, useEffect } from 'react';
import { authService, attendanceService } from '../services/api';
import Navbar from '../components/layout/Navbar';
import AttendancePanel from '../components/attendance/AttendancePanel';

export default function Dashboard({ onLogout }) {
  const [profile, setProfile] = useState(null);
  const [todayStatus, setTodayStatus] = useState(null);

  const fetchStatus = async () => {
    try {
      const data = await attendanceService.getStatus();
      setTodayStatus(data);
    } catch (err) { console.error('Failed to fetch status'); }
  };

  useEffect(() => {
    const initDashboard = async () => {
      try {
        const userProfile = await authService.getProfile();
        setProfile(userProfile);
        fetchStatus();
      } catch (err) {
        console.error('Initial load failed');
      }
    };
    initDashboard();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar profile={profile} onLogout={onLogout} />

      <main className="flex-1 max-w-7xl mx-auto w-full p-6">
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 mt-4">
          <AttendancePanel 
            todayStatus={todayStatus} 
            fetchStatus={fetchStatus} 
          />
        </div>
      </main>
    </div>
  );
}
