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

          <div className="flex items-center gap-5">
            <div className="flex items-center gap-3 pr-5 border-r border-slate-100">
              <div className="hidden sm:block text-right">
                <div className="text-sm font-black text-slate-900 leading-tight mb-0.5">{profile?.name}</div>
                <div className="flex items-center justify-end gap-2 text-[0.6rem] font-black uppercase tracking-widest text-blue-500">
                  <span className="bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">{profile?.nip}</span>
                  <span className="text-slate-300">|</span>
                  <span className="text-slate-400">{profile?.position || 'Karyawan'}</span>
                </div>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center uppercase justify-center text-white font-black shadow-lg shadow-blue-200">
                {profile?.name?.charAt(0) || 'U'}
              </div>
            </div>

            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-rose-500 bg-rose-50 hover:bg-rose-100 transition-all duration-300 group"
              title="Keluar"
            >
              <span className="text-[0.65rem] font-black uppercase tracking-widest hidden lg:block">Keluar</span>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center hover:scale-110 transition-transform">
                <svg className="w-6 h-6 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
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
    </div>
  );
}
