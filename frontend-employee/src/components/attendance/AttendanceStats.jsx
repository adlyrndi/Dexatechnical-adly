import Card from '../ui/Card';

export const AttendanceStats = ({ currentTime, todayStatus }) => {
  const isSesiAktif = todayStatus?.todayStatus !== 'NOT_CLOCKED_IN' && !todayStatus?.clockOutTime;

  return (
    <div className="lg:col-span-4 flex flex-col gap-6">
      <Card className="bg-gradient-to-br from-white to-slate-50 border-slate-200/60">
        <div className="text-center py-6">
          <div className="text-sm font-black text-blue-500 uppercase tracking-[0.25em] mt-[-10px] mb-4">
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
                {isSesiAktif && (
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                )}
                <span className="text-sm font-black text-blue-600">
                  {todayStatus?.clockOutTime ? '🏁 Shift Selesai' : (todayStatus?.todayStatus === 'NOT_CLOCKED_IN' ? '⏳ Belum Absen' : '🚀 Sesi Aktif')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
export default AttendanceStats;
