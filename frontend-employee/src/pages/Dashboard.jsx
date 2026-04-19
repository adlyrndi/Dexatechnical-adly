import { useState, useEffect } from 'react';
import { API_URL } from '../utils/constants';
import PanelAbsen from '../components/attendance/PanelAbsen.jsx';

export default function Dashboard({ token, onLogout }) {
  const [profile, setProfile] = useState(null);
  const [todayStatus, setTodayStatus] = useState(null);

  const fetchStatus = () => {
    fetch(`${API_URL}/dashboard/employee`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => setTodayStatus(data));
  };

  useEffect(() => {
    fetch(`${API_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => setProfile(data));

    fetchStatus();
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center">
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">Dexa Attendance</h1>
              <p className="text-[0.6rem] font-black text-slate-400 uppercase tracking-widest">Portal Absensi Karyawan</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:block text-right">
              <div className="text-sm font-black text-slate-900 leading-tight">{profile?.name}</div>
              <div className="text-[0.65rem] font-bold text-slate-400 tracking-wider">
                {profile?.position || 'Karyawan'} • {profile?.nip}
              </div>
            </div>
            <button
              onClick={onLogout}
              title="Keluar"
              className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-500 flex items-center justify-center transition-all group"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">🚪</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-6">
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 mt-4">
          <PanelAbsen 
            token={token} 
            todayStatus={todayStatus} 
            fetchStatus={fetchStatus} 
          />
        </div>
      </main>

      <footer className="py-8 text-center text-[0.6rem] font-black text-slate-300 uppercase tracking-[0.4em]">
        Dexa Group Dashboard &bull; 2026
      </footer>
    </div>
  );
}
