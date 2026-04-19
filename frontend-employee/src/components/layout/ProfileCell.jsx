import Badge from '../ui/Badge';

export const ProfileCell = ({ profile }) => (
  <div className="hidden sm:block text-right">
    <div className="text-sm font-black text-slate-900 leading-tight mb-0.5">{profile?.name}</div>
    <div className="flex items-center justify-end gap-2 text-[0.6rem] font-black uppercase tracking-widest text-blue-500">
      <Badge variant="blue">{profile?.nip}</Badge>
      <span className="text-slate-300">|</span>
      <span className="text-slate-400">{profile?.position || 'Karyawan'}</span>
    </div>
  </div>
);
export default ProfileCell;
