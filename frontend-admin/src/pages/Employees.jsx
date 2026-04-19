import { useState, useEffect } from 'react';
import { adminService } from '../services/api';
import { Card, Button, Input, Badge, Avatar } from '../components/ui';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', nip: '', position: '', password: '' });

  const fetchEmployees = async () => {
    try {
      const data = await adminService.getEmployees();
      setEmployees(data);
    } catch (err) { console.error('Gagal memuat karyawan'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchEmployees(); }, []);

  const handleOpenModal = (mode, emp = null) => {
    setModalMode(mode);
    if (mode === 'edit' && emp) {
      setSelectedId(emp.id);
      setFormData({ name: emp.name, email: emp.email, nip: emp.nip, position: emp.position, password: '' });
    } else {
      setFormData({ name: '', email: '', nip: '', position: '', password: 'password123' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === 'add') {
        await adminService.createEmployee(formData);
      } else {
        const updateData = { ...formData };
        if (!updateData.password) delete updateData.password;
        await adminService.updateEmployee(selectedId, updateData);
      }
      setModalMode(null);
      fetchEmployees();
    } catch (err) { alert(err.message); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus karyawan ini? Secara permanen akan menghapus data riwayat absensinya.')) {
      try {
        await adminService.deleteEmployee(id);
        fetchEmployees();
      } catch (err) { alert(err.message); }
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div>
           <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic">Personel <span className="text-blue-600">Dexa</span></h1>
          <p className="text-slate-400 font-bold mt-1 uppercase text-[0.7rem] tracking-[0.3em]">Manajemen Database Karyawan</p>
        </div>
        <Button onClick={() => handleOpenModal('add')} className="px-10 h-16 shadow-[0_12px_40px_rgba(37,99,235,0.25)] uppercase tracking-[0.2em] text-[0.75rem] font-black italic rounded-2xl">
          + Daftarkan Personel
        </Button>
      </div>

      <Card className="overflow-hidden border-none bg-white shadow-2xl shadow-slate-200/60 rounded-[2.5rem]">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-10 py-6 text-[0.65rem] font-black text-slate-400 uppercase tracking-[0.25em]">Identitas Karyawan</th>
                <th className="px-10 py-6 text-[0.65rem] font-black text-slate-400 uppercase tracking-[0.25em]">Detail NIP</th>
                <th className="px-10 py-6 text-[0.65rem] font-black text-slate-400 uppercase tracking-[0.25em]">Jabatan Struktural</th>
                <th className="px-10 py-6 text-[0.65rem] font-black text-slate-400 uppercase tracking-[0.25em]">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {employees.map((emp) => (
                <tr key={emp.id} className="group hover:bg-blue-50/30 transition-all duration-300">
                  <td className="px-10 py-7">
                    <div className="flex items-center gap-4">
                      <Avatar name={emp.name} className="w-14 h-14 text-sm shadow-xl border-4 border-white group-hover:scale-110 transition-transform" />
                      <div>
                        <div className="text-base font-black text-slate-900 leading-tight mb-1">{emp.name}</div>
                        <div className="text-[0.7rem] font-bold text-slate-400 uppercase tracking-widest">{emp.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-7">
                    <Badge variant="blue" className="px-4 py-1.5 rounded-xl text-[0.7rem]">{emp.nip}</Badge>
                  </td>
                  <td className="px-10 py-7">
                    <span className="text-xs font-black text-slate-600 uppercase tracking-[0.15em]">{emp.position}</span>
                  </td>
                  <td className="px-10 py-7">
                    <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 transition-transform">
                      <button onClick={() => handleOpenModal('edit', emp)} className="w-11 h-11 rounded-2xl flex items-center justify-center bg-white text-blue-600 shadow-xl shadow-blue-100 border border-blue-50 hover:bg-blue-600 hover:text-white transition-all">✏️</button>
                      <button onClick={() => handleDelete(emp.id)} className="w-11 h-11 rounded-2xl flex items-center justify-center bg-white text-rose-600 shadow-xl shadow-rose-100 border border-rose-50 hover:bg-rose-600 hover:text-white transition-all">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {employees.length === 0 && !loading && (
            <div className="py-32 text-center">
              <div className="text-6xl mb-6 grayscale opacity-20">📂</div>
              <div className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[0.65rem]">Belum ada data personel terdaftar</div>
            </div>
          )}
        </div>
      </Card>

      {modalMode && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-6 animate-in fade-in duration-500">
          <Card className="w-full max-w-xl p-12 shadow-[0_32px_80px_rgba(0,0,0,0.2)] rounded-[3rem] border-white/20">
            <h2 className="text-3xl font-black text-slate-900 mb-2 italic">{modalMode === 'add' ? 'Registrasi Personel' : 'Modifikasi Data'}</h2>
            <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-[0.25em] mb-12">{modalMode === 'add' ? 'Masukkan data lengkap karyawan baru' : 'Sesuaikan informasi profil karyawan terpilih'}</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input label="Nama Lengkap" placeholder="Budi Santoso" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              <div className="grid grid-cols-2 gap-6">
                <Input label="NIP" placeholder="123456" value={formData.nip} onChange={e => setFormData({...formData, nip: e.target.value})} required />
                <Input label="Jabatan" placeholder="Software Engineer" value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} required />
              </div>
              <Input label="Email Perusahaan" type="email" placeholder="budi@dexa.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
              <Input label={modalMode === 'edit' ? "Sandi Baru (Kosongkan jika tetap)" : "Akses Kata Sandi"} type="password" placeholder="••••••••" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required={modalMode === 'add'} />
              
              <div className="flex gap-6 mt-14">
                <Button type="button" variant="ghost" onClick={() => setModalMode(null)} className="flex-1 h-16 border-slate-100 uppercase tracking-widest text-xs">Batal</Button>
                <Button type="submit" className="flex-1 h-16 uppercase tracking-[0.2em] font-black italic">Simpan Perubahan</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
