import { useState } from 'react';
import { API_URL } from '../../utils/constants';

export default function Register({ onRegisterSuccess, onSwitchToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nip, setNip] = useState('');
  const [position, setPosition] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, nip, position, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal mendaftar');
      onRegisterSuccess();
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px]">
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-premium rounded-3xl p-10">
          <div className="text-center mb-10">
            <div className="text-6xl mb-4 drop-shadow-sm">🤝</div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Pendaftaran</h1>
            <p className="text-slate-400 font-bold mt-2 italic">Bergabunglah dengan tim cerdas kami</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {error && <div className="p-4 bg-rose-50 text-rose-500 rounded-2xl text-sm font-bold text-center border border-rose-100">{error}</div>}

            <div>
              <label className="block text-[0.65rem] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Nama Lengkap</label>
              <input className="input-field" type="text" placeholder="Budi Santoso" value={name} onChange={e => setName(e.target.value)} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[0.65rem] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">NIP</label>
                <input className="input-field" type="text" placeholder="123456" value={nip} onChange={e => setNip(e.target.value)} required />
              </div>
              <div>
                <label className="block text-[0.65rem] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Jabatan</label>
                <input className="input-field" type="text" placeholder="Engineer" value={position} onChange={e => setPosition(e.target.value)} required />
              </div>
            </div>

            <div>
              <label className="block text-[0.65rem] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Alamat Email</label>
              <input className="input-field" type="email" placeholder="budi@dexa.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>

            <div>
              <label className="block text-[0.65rem] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Kata Sandi</label>
              <input className="input-field" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full h-14 uppercase tracking-widest font-black italic mt-4">
              {loading ? 'Mendaftarkan...' : 'Selesaikan Pendaftaran'}
            </button>
          </form>

          <p className="text-center mt-8 text-sm font-bold text-slate-400">
            Sudah punya akun?{' '}
            <button onClick={onSwitchToLogin} className="text-prime-600 hover:text-prime-700 underline underline-offset-4">Masuk Sekarang</button>
          </p>
        </div>
      </div>
    </div>
  );
}
