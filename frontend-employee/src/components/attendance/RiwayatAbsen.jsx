import { useState, useEffect } from 'react';
import { API_URL } from '../../utils/constants';

export default function RiwayatAbsen({ token }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/attendance/history`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        setHistory(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, [token]);

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-2xl shadow-slate-200/40 p-1 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50/80">
              <th className="text-left py-5 px-8 text-[0.6rem] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100/50">Tanggal & Hari</th>
              <th className="text-left py-5 px-8 text-[0.6rem] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100/50">Jam Kerja (Masuk/Pulang)</th>
              <th className="text-left py-5 px-8 text-[0.6rem] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100/50">Status Kehadiran</th>
              <th className="text-center py-5 px-8 text-[0.6rem] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100/50">Verifikasi Foto</th>
              <th className="text-left py-5 px-8 text-[0.6rem] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100/50">Catatan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr><td colSpan="5" className="text-center py-24 text-xs font-black text-slate-300 uppercase tracking-widest animate-pulse">Menyingkronkan data log...</td></tr>
            ) : history.length === 0 ? (
              <tr><td colSpan="5" className="text-center py-24 text-xs font-black text-slate-300 uppercase tracking-widest">Tidak ada catatan aktivitas terdeteksi</td></tr>
            ) : history.map((log) => (
              <tr key={log.id} className="hover:bg-indigo-50/30 transition-all group cursor-default">
                <td className="py-6 px-8 font-black text-slate-900 text-sm">
                  {log.attendanceDate}
                </td>
                <td className="py-6 px-8">
                  <div className="flex gap-6 items-center">
                    <div className="space-y-1">
                      <span className="text-[0.55rem] font-black text-slate-300 block uppercase tracking-wider">Masuk</span>
                      <span className="text-xs font-black text-slate-900 font-mono tracking-tighter">{log.clockInTime ? new Date(log.clockInTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '--:--'}</span>
                    </div>
                    <div className="w-5 h-[2px] bg-slate-100 rounded-full"></div>
                    <div className="space-y-1">
                      <span className="text-[0.55rem] font-black text-slate-300 block uppercase tracking-wider">Pulang</span>
                      <span className={`text-xs font-black font-mono tracking-tighter ${log.clockOutTime ? 'text-slate-900' : 'text-slate-300 italic'}`}>
                        {log.clockOutTime ? new Date(log.clockOutTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : 'Berjalan'}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-6 px-8">
                  <span className={`px-4 py-1.5 rounded-full text-[0.6rem] font-black uppercase tracking-widest border border-current transition-colors ${log.status === 'present' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                    }`}>
                    {log.status === 'present' ? '✓ Hadir' : '⚠ Telat'}
                  </span>
                </td>
                <td className="py-6 px-8 text-center">
                  {log.clockInPhoto ? (
                    <a href={`${API_URL}${log.clockInPhoto}`} target="_blank" rel="noreferrer" className="inline-flex w-11 h-11 rounded-2xl bg-white border border-slate-100 items-center justify-center hover:bg-indigo-600 hover:text-white hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-200 transition-all text-indigo-600 font-bold group">
                      <span className="text-lg">📸</span>
                    </a>
                  ) : <span className="text-[0.6rem] font-black text-slate-200 uppercase tracking-tighter">Tidak Ada</span>}
                </td>
                <td className="py-6 px-8 text-[0.7rem] font-bold text-slate-400 italic max-w-xs truncate group-hover:text-slate-600 transition-colors">
                  {log.notes || '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
