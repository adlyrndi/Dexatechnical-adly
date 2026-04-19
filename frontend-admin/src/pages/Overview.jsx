import { useState, useEffect } from 'react';
import { adminService } from '../services/api';
import { Card } from '../components/ui';

export default function Overview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await adminService.getOverview();
        setStats(data);
      } catch (err) {
        console.error('Failed to load stats');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="animate-pulse flex items-center justify-center h-64 text-slate-300 font-black uppercase tracking-widest text-xs">Memuat Dashboard...</div>;

  const cards = [
    { label: 'Total Karyawan', value: stats?.totalEmployees || 0, icon: '👥', color: 'bg-blue-600' },
    { label: 'Hadir Hari Ini', value: stats?.today?.present || 0, icon: '✅', color: 'bg-emerald-500' },
    { label: 'Terlambat', value: stats?.today?.late || 0, icon: '⏳', color: 'bg-rose-500' },
    { label: 'Belum Absen', value: stats?.today?.absent || 0, icon: '🚫', color: 'bg-slate-400' },
  ];

  return (
    <div className="space-y-12">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic">Telemetri <span className="text-blue-600">Perusahaan</span></h1>
          <p className="text-slate-400 font-bold mt-1 uppercase text-[0.7rem] tracking-[0.3em]">Ringkasan Ekosistem Dexa Hari Ini</p>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {cards.map((card) => (
          <Card key={card.label} className="p-8 group hover:scale-[1.05] hover:shadow-2xl transition-all duration-500 border-none bg-white shadow-xl shadow-slate-200/50">
            <div className="flex justify-between items-start mb-8">
              <div className="text-5xl drop-shadow-md group-hover:scale-110 transition-transform">{card.icon}</div>
              <div className={`w-3 h-12 rounded-full shadow-lg ${card.color}`}></div>
            </div>
            <div className="text-[0.65rem] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{card.label}</div>
            <div className="text-5xl font-black text-slate-900 tracking-tighter leading-none">{card.value}</div>
          </Card>
        ))}
      </div>

      <Card className="p-10 border-slate-200 bg-white shadow-xl shadow-slate-100 flex items-center justify-between overflow-hidden relative">
        <div className="relative z-10">
          <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2 italic">Aktivitas Sistem</h3>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest italic flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
             Sinkronisasi Database Real-time Aktif
          </p>
        </div>
        <div className="text-6xl grayscale opacity-10 absolute -right-4 -bottom-4 rotate-12">📡</div>
      </Card>
    </div>
  );
}
