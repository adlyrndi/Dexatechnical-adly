import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { adminService } from '../services/api';
import { Card, Button, Input, Badge, Avatar, Toast } from '../components/ui';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalMode, setModalMode] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [formData, setFormData] = useState({ name: '', email: '', nip: '', position: '', password: '' });
  const [confirmDelete, setConfirmDelete] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: 'success' }), 3000);
  };

  const fetchEmployees = async () => {
    try {
      const data = await adminService.getEmployees();
      setEmployees(data);
    } catch (err) { showToast('Gagal memuat data!', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchEmployees(); }, []);

  const handleOpenModal = (mode, emp = null) => {
    setModalMode(mode);
    if (mode === 'edit' && emp) {
      setSelectedId(emp.id);
      setFormData({ name: emp.name, email: emp.email, nip: emp.nip, position: emp.position || '', password: '' });
    } else {
      setFormData({ name: '', email: '', nip: '', position: '', password: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === 'add') {
        if (!formData.password) { showToast('Password wajib diisi!', 'error'); return; }
        await adminService.createEmployee({ ...formData, role: 'EMPLOYEE' });
        showToast('Karyawan berhasil didaftarkan!');
      } else {
        const updateData = { ...formData };
        if (!updateData.password) delete updateData.password;
        await adminService.updateEmployee(selectedId, updateData);
        showToast('Info profil berhasil diperbarui!');
      }
      setModalMode(null);
      fetchEmployees();
    } catch (err) { showToast(err.message, 'error'); }
  };

  const handleDelete = async (id) => {
    try {
      await adminService.deleteEmployee(id);
      showToast('Karyawan berhasil dinonaktifkan.');
      fetchEmployees();
      setConfirmDelete(null);
    } catch (err) { showToast('Gagal menghapus data!', 'error'); }
  };

  const filteredEmployees = employees.filter(emp =>
    (emp.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (emp.email?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (emp.nip || '').includes(searchQuery)
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700 relative">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic">Database <span className="text-blue-600">Karyawan</span></h1>
          <p className="text-slate-400 font-bold mt-1 uppercase text-[0.65rem] tracking-[0.3em]">Otoritas & Manajemen Profil Karyawan</p>
        </div>
        <Button onClick={() => handleOpenModal('add')} className="px-10 h-16 shadow-xl shadow-blue-100 uppercase tracking-widest text-[0.7rem] font-black italic rounded-[1.25rem]">
          + Registrasi Karyawan
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="relative w-full max-w-lg group">
          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">🔍</span>
          <input
            type="text"
            placeholder="Cari berdasarkan Nama, NIP, atau Email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-8 h-16 rounded-[1.5rem] bg-white border-2 border-slate-100 focus:border-blue-600 focus:outline-none focus:ring-8 focus:ring-blue-50 transition-all text-sm font-bold shadow-sm"
          />
        </div>
        <Badge variant="slate" className="px-6 py-2.5 rounded-2xl border-slate-200 shadow-sm font-black">Total: {employees.length} Karyawan</Badge>
      </div>

      <Card className="overflow-hidden border-none bg-white shadow-2xl shadow-slate-200/50 rounded-[2.5rem]">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100">
                <th className="px-12 py-7 text-[0.65rem] font-black text-slate-400 uppercase tracking-[0.3em]">Identitas Karyawan</th>
                <th className="px-12 py-7 text-[0.65rem] font-black text-slate-400 uppercase tracking-[0.3em]">NIP</th>
                <th className="px-12 py-7 text-[0.65rem] font-black text-slate-400 uppercase tracking-[0.3em]">Jabatan</th>
                <th className="px-12 py-7 text-[0.65rem] font-black text-slate-400 uppercase tracking-[0.3em]">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="group hover:bg-blue-50/30 transition-all duration-300">
                  <td className="px-12 py-8">
                    <div className="flex items-center gap-5">
                      <Avatar name={emp.name} className="w-14 h-14 shadow-2xl border-4 border-white" />
                      <div>
                        <div className="text-base font-black text-slate-900 leading-tight mb-1">{emp.name}</div>
                        <div className="text-[0.65rem] font-bold text-blue-500 uppercase tracking-widest">{emp.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-12 py-8">
                    <div className="font-mono text-sm font-black text-slate-600 bg-slate-100 px-4 py-1.5 rounded-xl border border-slate-100 inline-block">{emp.nip}</div>
                  </td>
                  <td className="px-12 py-8">
                    <Badge variant="blue" className="px-4 py-2 rounded-xl text-[0.65rem] font-black uppercase tracking-wider">
                      {emp.position || 'STAF'}
                    </Badge>
                  </td>
                  <td className="px-12 py-8">
                    <div className="flex gap-3">
                      <button onClick={() => handleOpenModal('edit', emp)} className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white text-blue-600 shadow-xl border border-blue-50 hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-1">✏️</button>
                      <button onClick={() => setConfirmDelete(emp)} className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white text-rose-600 shadow-xl border border-rose-50 hover:bg-rose-600 hover:text-white transition-all transform hover:-translate-y-1">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {modalMode && createPortal(
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-[9999] p-4 sm:p-6 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setModalMode(null)}>
          <div 
            className="bg-white w-full max-w-2xl rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-500 ease-out flex flex-col relative" 
            onClick={e => e.stopPropagation()}
          >
            <div className="px-12 pt-12 pb-6 flex justify-between items-start">
              <div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic mb-1">
                  {modalMode === 'add' ? 'Registrasi' : 'Pembaruan'} <span className="text-blue-600">Profil</span>
                </h2>
                <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-[0.3em]">
                  Kelola Detail Karyawan
                </p>
              </div>
              <button 
                onClick={() => setModalMode(null)} 
                className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all font-black"
                aria-label="Tutup"
              >
                ✕
              </button>
            </div>

            <div className="px-12 pb-12">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <Input label="Nama Lengkap" placeholder="Masukkan nama..." value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                  <Input label="NIP Karyawan" placeholder="Contoh: 100200" value={formData.nip} onChange={e => setFormData({ ...formData, nip: e.target.value })} required />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <Input label="Email Perusahaan" type="email" placeholder="karyawan@dexa.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                  <Input label="Jabatan Fungsional" placeholder="Contoh: IT Support" value={formData.position} onChange={e => setFormData({ ...formData, position: e.target.value })} />
                </div>

                <div>
                   <Input label={modalMode === 'edit' ? "Sandi Baru (Kosongkan jika tetap)" : "Sandi Akses Portal"} type="password" placeholder="••••••••" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required={modalMode === 'add'} />
                </div>

                <div className="flex justify-end gap-6 pt-4">
                  <Button type="button" variant="ghost" onClick={() => setModalMode(null)} className="flex-1 h-16 rounded-[1.5rem] border border-slate-100 text-[0.7rem] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-all">
                    Batalkan
                  </Button>
                  <Button type="submit" className="flex-1 h-16 rounded-[1.5rem] bg-blue-600 text-white shadow-xl shadow-blue-100 text-[0.7rem] font-black italic uppercase tracking-widest hover:bg-blue-700 transition-all">
                    {modalMode === 'add' ? 'SIMPAN KARYAWAN' : 'UPDATE DATA'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>, document.body
      )}

      {confirmDelete && createPortal(
        <div className="fixed inset-0 bg-slate-900/80 flex items-center justify-center z-[10000] p-4 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setConfirmDelete(null)}>
          <div className="bg-white w-full max-w-md rounded-[3rem] p-12 text-center shadow-2xl animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
            <div className="text-6xl mb-8 animate-bounce">⚠️</div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tighter italic mb-4">Hapus Akses?</h3>
            <p className="text-sm font-bold text-slate-400 leading-relaxed mb-10">
              Anda akan memutus akses <span className="text-slate-900 font-black">{confirmDelete.name}</span> dari sistem. Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex flex-col gap-3">
              <Button onClick={() => handleDelete(confirmDelete.id)} className="w-full h-16 rounded-[1.5rem] bg-rose-600 text-white shadow-xl shadow-rose-100 text-[0.7rem] font-black italic uppercase tracking-widest hover:bg-rose-700 transition-all">
                YA, HAPUS AKSES
              </Button>
              <Button variant="ghost" onClick={() => setConfirmDelete(null)} className="w-full h-16 rounded-[1.5rem] border border-slate-100 text-[0.7rem] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all">
                BATALKAN
              </Button>
            </div>
          </div>
        </div>, document.body
      )}
    </div>
  );
}
