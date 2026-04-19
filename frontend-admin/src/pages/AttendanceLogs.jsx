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
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
           <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic">Monitoring <span className="text-blue-600">Presensi</span></h1>
          <p className="text-slate-400 font-bold mt-1 uppercase text-[0.7rem] tracking-[0.3em]">Log Kehadiran & Verifikasi Karyawan</p>
        </div>
        <Badge variant="slate" className="px-6 py-3 rounded-2xl border-slate-200 font-black">Total: {logs.length} Data</Badge>
      </div>

      <Card className="overflow-hidden border-none bg-white shadow-2xl shadow-slate-200/50 rounded-[2.5rem]">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100">
                <th className="px-12 py-7 text-[0.65rem] font-black text-slate-400 uppercase tracking-[0.3em]">Tanggal Absensi</th>
                <th className="px-12 py-7 text-[0.65rem] font-black text-slate-400 uppercase tracking-[0.3em]">Profil Karyawan</th>
                <th className="px-12 py-7 text-[0.65rem] font-black text-slate-400 uppercase tracking-[0.3em]">Status</th>
                <th className="px-12 py-7 text-[0.65rem] font-black text-slate-400 uppercase tracking-[0.3em]">Jam Masuk</th>
                <th className="px-12 py-7 text-[0.65rem] font-black text-slate-400 uppercase tracking-[0.3em]">Bukti Foto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {logs.map((log) => (
                <tr key={log.id} className="group hover:bg-blue-50/30 transition-all duration-300">
                  <td className="px-12 py-8">
                    <div className="text-sm font-black text-slate-900 leading-tight">
                      {log.attendanceDate ? new Date(log.attendanceDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Tanggal Error'}
                    </div>
                  </td>
                  <td className="px-12 py-8">
                    <div className="flex items-center gap-4">
                      <Avatar name={log.user?.name} className="w-12 h-12 shadow-xl border-4 border-white group-hover:scale-110 transition-transform" />
                      <div>
                        <div className="text-base font-black text-slate-900 leading-tight mb-1">{log.user?.name}</div>
                        <div className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest">{log.user?.nip || '—'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-12 py-8">
                    <Badge variant={log.status?.toUpperCase() === 'PRESENT' ? 'emerald' : 'amber'} className="px-4 py-2 rounded-xl text-[0.65rem] font-black uppercase tracking-wider">
                      {log.status?.toUpperCase() === 'PRESENT' ? 'TEPAT WAKTU' : 'TERLAMBAT'}
                    </Badge>
                  </td>
                  <td className="px-12 py-8">
                     <div className="font-mono text-sm font-black text-slate-600 bg-slate-50 px-4 py-1.5 rounded-xl border border-slate-100 inline-block shadow-sm">
                      {log.clockInTime ? new Date(log.clockInTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '—'}
                    </div>
                  </td>
                  <td className="px-12 py-8">
                    {log.clockInPhoto ? (
                      <button 
                        onClick={() => setSelectedPhoto(getFullPhotoUrl(log.clockInPhoto))}
                        className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white text-blue-600 shadow-xl border border-blue-50 hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-1"
                        title="Lihat Foto Verifikasi"
                      >
                        🖼️
                      </button>
                    ) : (
                      <span className="text-[0.6rem] font-bold text-slate-300 uppercase tracking-widest">Tiada Foto</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && logs.length === 0 && (
             <div className="py-32 text-center text-slate-300 font-bold uppercase tracking-widest text-xs italic">Belum ada riwayat absensi masuk</div>
          )}
        </div>
      </Card>

      {selectedPhoto && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[200] p-6 animate-in fade-in zoom-in duration-500" onClick={() => setSelectedPhoto(null)}>
          <div className="relative max-w-lg w-full" onClick={e => e.stopPropagation()}>
             <Card className="p-3 bg-white/10 border-white/20 shadow-2xl overflow-hidden rounded-[3rem]">
                <img src={selectedPhoto} className="w-full rounded-[2rem] shadow-2xl object-cover" alt="Bukti Absensi" />
                <div className="p-8 text-center bg-white mt-3 rounded-[2rem]">
                  <h3 className="text-slate-900 font-black uppercase tracking-[0.2em] text-[0.65rem] mb-6 underline decoration-blue-500 decoration-4 underline-offset-8">Status Verifikasi Real-Time</h3>
                  <Button onClick={() => setSelectedPhoto(null)} className="w-full h-14 rounded-xl uppercase tracking-widest text-xs">Kembali Ke Dashboard</Button>
                </div>
             </Card>
          </div>
        </div>
      )}
    </div>
  );
}
