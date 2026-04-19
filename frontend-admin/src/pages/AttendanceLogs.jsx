import { useState, useEffect } from 'react';
import { adminService } from '../services/api';
import { API_URL } from '../utils/constants';
import { Card, Badge, Avatar, Button } from '../components/ui';

export default function AttendanceLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await adminService.getLogs();
        setLogs(data);
      } catch (err) { console.error('Gagal memuat log'); }
      finally { setLoading(false); }
    };
    fetchLogs();
  }, []);

  const getFullPhotoUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${API_URL}${path}`;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Log Absensi</h1>
        <p className="text-slate-400 font-bold mt-1 uppercase text-[0.65rem] tracking-[0.2em]">Monitoring Kehadiran & Verifikasi Foto Karyawan</p>
      </div>

      <Card className="overflow-hidden border-slate-100">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-[0.65rem] font-black text-slate-400 uppercase tracking-[0.2em]">Waktu & Tanggal</th>
              <th className="px-6 py-4 text-[0.65rem] font-black text-slate-400 uppercase tracking-[0.2em]">Karyawan</th>
              <th className="px-6 py-4 text-[0.65rem] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
              <th className="px-6 py-4 text-[0.65rem] font-black text-slate-400 uppercase tracking-[0.2em]">Check-In</th>
              <th className="px-6 py-4 text-[0.65rem] font-black text-slate-400 uppercase tracking-[0.2em]">Bukti</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-5">
                  <div className="text-sm font-black text-slate-900 leading-tight">
                    {log.attendanceDate ? new Date(log.attendanceDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Tanggal Error'}
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <Avatar name={log.user?.name} className="w-8 h-8 text-[0.6rem]" />
                    <div>
                      <div className="text-xs font-black text-slate-700 leading-tight">{log.user?.name}</div>
                      <div className="text-[0.6rem] font-bold text-slate-400">{log.user?.nip}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <Badge variant={log.status?.toUpperCase() === 'PRESENT' ? 'emerald' : 'rose'}>
                    {log.status?.toUpperCase() === 'PRESENT' ? 'Tepat Waktu' : 'Terlambat'}
                  </Badge>
                </td>
                <td className="px-6 py-5">
                   <div className="text-xs font-black text-slate-600 font-mono">
                    {log.clockInTime ? new Date(log.clockInTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '—'}
                  </div>
                </td>
                <td className="px-6 py-5">
                  {log.clockInPhoto ? (
                    <button 
                      onClick={() => setSelectedPhoto(getFullPhotoUrl(log.clockInPhoto))}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all text-[0.6rem] font-black uppercase tracking-widest border border-blue-100"
                    >
                      <span>🖼️</span> LIHAT FOTO
                    </button>
                  ) : (
                    <span className="text-[0.6rem] font-bold text-slate-300 uppercase tracking-widest">Tidak Ada Foto</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {selectedPhoto && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-[200] p-6 animate-in fade-in zoom-in duration-300" onClick={() => setSelectedPhoto(null)}>
          <div className="relative max-w-lg w-full" onClick={e => e.stopPropagation()}>
             <Card className="p-2 overflow-hidden bg-white/10 border-white/20">
                <img src={selectedPhoto} className="w-full rounded-2xl shadow-2xl" alt="Bukti Absensi" />
                <div className="p-6 text-center">
                  <h3 className="text-white font-black uppercase tracking-widest text-xs mb-4">Verifikasi Wajah Karyawan</h3>
                  <Button onClick={() => setSelectedPhoto(null)} className="w-full">Tutup</Button>
                </div>
             </Card>
          </div>
        </div>
      )}
    </div>
  );
}
