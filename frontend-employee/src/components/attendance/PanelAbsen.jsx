import { useState, useEffect } from 'react';
import { API_URL } from '../../utils/constants';

const Button = ({ children, variant = "primary", className = "", ...props }) => (
  <button className={`${variant === "primary" ? "btn-primary" : "btn-ghost"} ${className}`} {...props}>
    {children}
  </button>
);

const Card = ({ children, className = "", style = {} }) => (
  <div className={`glass-card ${className}`} style={style}>
    {children}
  </div>
);

const FormField = ({ label, ...props }) => (
  <div className="mb-6">
    <label className="block text-sm font-extrabold text-slate-400 uppercase tracking-widest mb-2">{label}</label>
    {props.type === 'textarea' ? <textarea className="input-field" {...props}></textarea> : <input className="input-field" {...props} />}
  </div>
);

export default function PanelAbsen({ token, todayStatus, fetchStatus }) {
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState('');
  const [clockOutFile, setClockOutFile] = useState(null);
  const [clockOutPreview, setClockOutPreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handlePhotoChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'in') {
          setPhoto(file);
          setPreview(reader.result);
        } else {
          setClockOutFile(file);
          setClockOutPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClockIn = async (e) => {
    e.preventDefault();
    setError('');

    if (!photo) {
      setError('Silakan pilih foto selfie terlebih dahulu sebelum absen masuk.');
      return;
    }

    setIsSubmitting(true);
    try {
      let photoUrl = '';
      if (photo) {
        const formData = new FormData();
        formData.append('file', photo);
        const uploadRes = await fetch(`${API_URL}/upload`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData
        });

        if (!uploadRes.ok) throw new Error('Gagal mengunggah foto. Silakan coba lagi.');

        const uploadData = await uploadRes.json();
        photoUrl = uploadData.url;
      }

      const res = await fetch(`${API_URL}/attendance/clock-in`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ clockInPhoto: photoUrl, notes })
      });
      if (res.ok) fetchStatus();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClockOut = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let photoUrl = '';
      if (clockOutFile) {
        const formData = new FormData();
        formData.append('file', clockOutFile);
        const uploadRes = await fetch(`${API_URL}/upload`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData
        });
        const uploadData = await uploadRes.json();
        photoUrl = uploadData.url;
      }
      const res = await fetch(`${API_URL}/attendance/clock-out`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ clockOutPhoto: photoUrl })
      });
      if (res.ok) fetchStatus();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-700">
      <div className="lg:col-span-4 flex flex-col gap-6">
        <Card className="bg-gradient-to-br from-white to-slate-50 border-slate-200/60">
          <div className="text-center py-6">
            <div className="text-sm font-black text-indigo-500 uppercase tracking-[0.25em] mt-[-10px] mb-4">
              {currentTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
            </div>
            <div className="text-5xl font-black text-slate-900 tracking-tighter mb-8 font-mono">
              {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>

            <div className="space-y-4 pt-6 border-t border-slate-100">
              <div className="flex justify-between items-center px-2">
                <span className="text-[0.7rem] font-bold text-slate-400 uppercase tracking-widest">Jadwal Shift</span>
                <span className="text-sm font-black text-slate-900">08:00 — 17:00</span>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-100/80 shadow-sm text-left relative overflow-hidden group">
                <div className="text-[0.6rem] font-black text-slate-400 uppercase tracking-widest mb-1.5">Status Kehadiran</div>
                <div className="flex items-center gap-2.5">
                  {todayStatus?.todayStatus !== 'NOT_CLOCKED_IN' && !todayStatus?.clockOutTime && (
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                  )}
                  <span className="text-sm font-black text-indigo-600">
                    {todayStatus?.clockOutTime ? '🏁 Shift Selesai' : (todayStatus?.todayStatus === 'NOT_CLOCKED_IN' ? '⏳ Belum Absen' : '🚀 Sesi Aktif')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="p-6 bg-slate-900 rounded-[2rem] text-white relative overflow-hidden shadow-2xl shadow-indigo-200/50 border-l-8 border-rose-500 group">
          <div className="absolute -top-4 -right-4 text-8xl opacity-10 blur-sm group-hover:scale-110 transition-transform duration-700">📋</div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-6 bg-rose-500 rounded-full"></div>
            <span className="text-[0.65rem] font-black uppercase tracking-widest text-rose-400">Kebijakan Absensi</span>
          </div>
          <p className="text-sm font-semibold leading-relaxed text-slate-300 italic">
            "Batas waktu absen masuk adalah pukul <span className="text-rose-400 font-extrabold">08:00 WIB</span>. Absensi yang dilakukan setelah jam tersebut akan otomatis dianggap sebagai <span className="text-rose-400 font-black">TELAT</span> sesuai peraturan perusahaan."
          </p>
        </div>
      </div>

      <div className="lg:col-span-8">
        <Card className="min-h-full border-slate-200/60 p-8">
          <h2 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-2">
            Aktivitas Log
          </h2>

          {todayStatus?.clockOutTime ? (
            <div className="text-center py-16">
              <div className="text-8xl mb-6 hover:scale-110 transition-transform duration-500 cursor-default">👨🏼‍💻</div>
              <h3 className="text-2xl font-black text-slate-900">Presensi Hari Ini Selesai</h3>
              <p className="text-slate-400 font-bold mt-2 mb-10 max-w-xs mx-auto text-sm">
                Data absensi Anda telah masuk ke dalam sistem. Sampai jumpa besok!
              </p>
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-emerald-50 text-emerald-600 rounded-2xl font-black text-[0.7rem] uppercase tracking-widest border border-emerald-100">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Absen Pulang: {new Date(todayStatus.clockOutTime).toLocaleTimeString('id-ID')}
              </div>
            </div>
          ) : (
            <>
              {/* Slim Fixed Error Slot (No Content Shift) */}
              <div className="h-10 mb-4 relative">
                {error && (
                  <div className="absolute inset-x-0 top-0 p-2 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-[0.6rem] font-black uppercase tracking-widest flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-300 shadow-sm shadow-rose-100/20">
                    <span className="text-sm">⚠️</span>
                    <span className="flex-1 truncate">{error}</span>
                    <button onClick={() => setError('')} className="opacity-40 hover:opacity-100 px-1">✕</button>
                  </div>
                )}
              </div>
              {todayStatus?.todayStatus?.toUpperCase() === 'NOT_CLOCKED_IN' && (
                <form onSubmit={handleClockIn} className="space-y-6">
                  <div className={`relative group overflow-hidden rounded-[2.5rem] border-4 border-dashed transition-all duration-300 bg-white ${error ? 'border-rose-200' : 'border-slate-100 hover:border-indigo-100'}`}>
                    {preview ? <img src={preview} className="w-full h-64 object-cover" alt="Pratinjau" /> : (
                      <div className="py-20 text-center">
                        <div className="text-5xl mb-4 group-hover:-translate-y-2 transition-transform duration-500">🤳</div>
                        <div className="font-black text-slate-900 text-lg">Verifikasi Identitas</div>
                        <div className="text-[0.7rem] text-slate-400 font-bold uppercase tracking-widest mt-2">Ambil Foto Selfie</div>
                      </div>
                    )}
                    <input type="file" accept="image/*" onChange={(e) => handlePhotoChange(e, 'in')} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                  </div>
                  {/* <FormField label="Fokus Utama" type="textarea" rows="2" placeholder="Tuliskan fokus pekerjaan Anda hari ini..." value={notes} onChange={e => setNotes(e.target.value)} /> */}
                  <Button type="submit" disabled={isSubmitting} className="w-full h-14 italic tracking-widest uppercase font-black">{isSubmitting ? 'Mengautentikasi...' : 'Absen Masuk'}</Button>
                </form>
              )}

              {(todayStatus?.todayStatus?.toUpperCase() === 'PRESENT' || todayStatus?.todayStatus?.toUpperCase() === 'LATE') && (
                <form onSubmit={handleClockOut} className="text-center py-10 space-y-8">
                  <div className="relative inline-block">
                    <div className="text-7xl group-hover:rotate-12 transition-transform duration-500">💻</div>
                    <div className="absolute -bottom-2 -right-2 bg-emerald-500 w-6 h-6 rounded-full border-4 border-white"></div>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight italic">Sesi Aktif</h3>
                    <p className="text-sm font-bold text-slate-400 mt-1">Telemetri Anda sedang direkam secara real-time.</p>
                  </div>

                  <div className="py-4">
                    {/* Foto opsional dihapus untuk menjaga konsistensi tinggi kartu */}
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full h-14 italic tracking-widest uppercase font-black">
                    {isSubmitting ? 'Memproses...' : 'Absen Pulang'}
                  </Button>
                </form>
              )}
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
