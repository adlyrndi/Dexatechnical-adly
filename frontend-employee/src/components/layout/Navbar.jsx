import Avatar from '../ui/Avatar';
import ProfileCell from './ProfileCell';

export const Navbar = ({ profile, onLogout }) => (
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
          <ProfileCell profile={profile} />
          <Avatar name={profile?.name} />
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
);
export default Navbar;
