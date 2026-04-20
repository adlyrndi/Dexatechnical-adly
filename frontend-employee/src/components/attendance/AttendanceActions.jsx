import Card from '../ui/Card';
import Button from '../ui/Button';
import Toast from '../ui/Toast';

export const AttendanceActions = ({ 
  todayStatus, 
  error, 
  setError, 
  isSubmitting, 
  preview, 
  handlePhotoChange, 
  handleClockIn, 
  handleClockOut 
}) => (
  <div className="lg:col-span-8">
    <Card className="min-h-full border-slate-200/60 p-8">
      <h2 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
        Aktivitas Log
      </h2>

      <div className="h-10 mb-4 relative">
        <Toast message={error} onClose={() => setError('')} />
      </div>

      {todayStatus?.clockOutTime ? (
        <div className="text-center py-12">
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
          {todayStatus?.todayStatus?.toUpperCase() === 'NOT_CLOCKED_IN' && (
            <form onSubmit={handleClockIn} className="space-y-6">
              <div className="relative group overflow-hidden rounded-[2.5rem] border-4 border-dashed transition-all duration-300 bg-white border-slate-100 hover:border-blue-100">
                {preview ? <img src={preview} className="w-full h-64 object-cover" alt="Pratinjau" /> : (
                  <div className="py-20 text-center">
                    <div className="text-5xl mb-4 group-hover:-translate-y-2 transition-transform duration-500">🤳</div>
                    <div className="font-black text-slate-900 text-lg">Verifikasi Identitas</div>
                    <div className="text-[0.7rem] text-slate-400 font-bold uppercase tracking-widest mt-2">Ambil Foto Selfie</div>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={(e) => handlePhotoChange(e, 'in')} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full h-14 italic tracking-widest uppercase font-black">
                {isSubmitting ? 'Mengautentikasi...' : 'Absen Masuk'}
              </Button>
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
                <p className="text-sm font-bold text-slate-400 mt-1">Data kehadiran Anda sedang direkam secara real-time.</p>
              </div>
              <div className="py-4"></div>
              <Button type="submit" disabled={isSubmitting} className="w-full h-14 italic tracking-widest uppercase font-black">
                {isSubmitting ? 'Memproses...' : 'Absen Pulang'}
              </Button>
            </form>
          )}
        </>
      )}
    </Card>
  </div>
);
export default AttendanceActions;
