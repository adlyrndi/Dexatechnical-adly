import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { adminService } from "../services/api";
import { Card, Avatar, Badge } from "../components/ui";

export default function Overview() {
  const [stats, setStats] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async (isSilent = false) => {
      if (!isSilent) setLoading(true);
      try {
        const [statsData, logsData] = await Promise.all([
          adminService.getOverview(),
          adminService.getLogs()
        ]);
        setStats(statsData);
        setRecentLogs(logsData.slice(0, 5));
      } catch (err) {
      } finally {
        if (!isSilent) setLoading(false);
      }
    };

    fetchData();

    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchData(true);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const statCards = [
    {
      label: "Total Karyawan",
      value: stats?.totalEmployees || 0,
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      label: "Hadir Hari Ini",
      value: stats?.today?.present || 0,
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      label: "Terlambat",
      value: stats?.today?.late || 0,
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      label: "Belum Absen",
      value: stats?.today?.absent || 0,
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
      bgColor: "bg-rose-50",
      iconColor: "text-rose-600",
    },
  ];

  const totalPresent = (stats?.today?.present || 0) + (stats?.today?.late || 0);
  const attendanceRate = stats?.totalEmployees > 0
    ? Math.round((totalPresent / stats.totalEmployees) * 100)
    : 0;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic">
            Dashboard <span className="text-blue-600">Overview</span>
          </h1>
          <p className="text-slate-400 font-bold mt-2 uppercase text-[0.7rem] tracking-[0.3em]">
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl border border-emerald-100 text-[0.65rem] font-black uppercase tracking-widest">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse-dot"></span>
            Live Sync
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <Card key={card.label} className="p-8 group hover:scale-[1.03] transition-all duration-300 border-none bg-white shadow-xl shadow-slate-200/40 rounded-[2.5rem] relative overflow-hidden">
            <div className="flex flex-col">
              <div className={`w-14 h-14 rounded-2xl ${card.bgColor} ${card.iconColor} flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-500`}>
                {card.icon}
              </div>
              <div>
                <div className="text-4xl font-black text-slate-900 tracking-tight mb-1">{card.value}</div>
                <div className="text-[0.65rem] font-black text-slate-500 uppercase tracking-[0.15em] mb-4">{card.label}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <Card className="lg:col-span-2 p-10 bg-white border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-black text-slate-900">Aktivitas Terbaru</h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Status Absensi Terkini</p>
            </div>
            <Link to="/dashboard/employees" className="text-blue-600 font-black text-[0.65rem] uppercase tracking-widest hover:underline">Lihat Semua Karyawan</Link>
          </div>

          <div className="space-y-6">
            {recentLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-4 rounded-3xl hover:bg-slate-50 transition-colors group">
                <div className="flex items-center gap-4">
                  <Avatar name={log.user?.name} className="w-10 h-10 shadow-md group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="text-sm font-black text-slate-800">{log.user?.name}</div>
                    <div className="text-[0.6rem] font-bold text-slate-400 inline-flex items-center gap-1">
                      {log.user?.position}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-black text-slate-600 mb-1">
                    {log.clockInTime ? new Date(log.clockInTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                  </div>
                  <Badge variant={log.status === 'PRESENT' ? 'emerald' : 'amber'} className="text-[0.55rem]">
                    {log.status === 'PRESENT' ? 'HADIR' : 'TERLAMBAT'}
                  </Badge>
                </div>
              </div>
            ))}
            {!loading && recentLogs.length === 0 && (
              <div className="py-20 text-center italic text-slate-300">Belum ada aktivitas hari ini</div>
            )}
          </div>
        </Card>

        <div className="space-y-8">
          <Card className="p-10 bg-slate-900 text-white border-none shadow-2xl shadow-blue-900/20 rounded-[2.5rem] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-400 mb-8 relative z-10">Tingkat Kehadiran</h3>
            <div className="flex items-end gap-3 mb-2 relative z-10">
              <span className="text-7xl text-blue-400 font-black tracking-tighter">{attendanceRate}%</span>
              <span className="text-blue-400 font-bold mb-3 uppercase text-[0.6rem]">Hari Ini</span>
            </div>
            <div className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest mb-6 relative z-10">
              <span className="text-white">{totalPresent}</span> / {stats?.totalEmployees || 0} Karyawan Terdata
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full mb-8 relative z-10">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-500 h-full rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all duration-1000" style={{ width: `${attendanceRate}%` }}></div>
            </div>
            <p className="text-[0.6rem] text-slate-500 font-bold leading-relaxed relative z-10 italic">
              *Data diperbarui secara real-time berdasarkan input absensi karyawan.
            </p>
          </Card>

          <Card className="p-10 bg-white border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem]">
            <h4 className="text-xs font-black text-slate-900 mb-6 uppercase tracking-widest">Quick Access</h4>
            <div className="grid grid-cols-1 gap-3">
              <Link to="/dashboard/employees" className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 hover:bg-blue-600 hover:text-white transition-all group">
                <span className="text-xl">👤</span>
                <span className="text-[0.65rem] font-black uppercase tracking-widest">Kelola Karyawan</span>
              </Link>
              <Link to="/dashboard/logs" className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 hover:bg-blue-600 hover:text-white transition-all group">
                <span className="text-xl">📋</span>
                <span className="text-[0.65rem] font-black uppercase tracking-widest">Lihat Log Full</span>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
