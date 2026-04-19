import { useState } from 'react';
import { API_URL } from '../../utils/constants';

export default function Login({ onLoginSuccess, onSwitchToRegister }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: identifier, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal masuk');
      onLoginSuccess(data.access_token);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px]">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-premium rounded-3xl p-10">
          <div className="text-center mb-10">
            <div className="text-5xl mb-4 drop-shadow-sm">🔐</div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Selamat Datang</h1>
            <p className="text-slate-400 font-bold mt-2 italic">Masuk ke Portal Absensi Dexa</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && <div className="p-4 bg-rose-50 text-rose-500 rounded-2xl text-sm font-bold text-center border border-rose-100">{error}</div>}
            
            <div>
              <label className="block text-[0.65rem] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Email atau NIP</label>
              <input className="input-field" type="text" placeholder="Masukkan Email atau NIP" value={identifier} onChange={e => setIdentifier(e.target.value)} required />
            </div>

            <div>
              <label className="block text-[0.65rem] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Kata Sandi</label>
              <input className="input-field" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full h-14 uppercase tracking-widest font-black italic">
              {loading ? 'Mengautentikasi...' : 'Masuk Sekarang'}
            </button>
          </form>

          <p className="text-center mt-8 text-sm font-bold text-slate-400">
            Belum punya akun?{' '}
            <button onClick={onSwitchToRegister} className="text-prime-600 hover:text-prime-700 underline underline-offset-4">Daftar Sekarang</button>
          </p>
        </div>
      </div>
    </div>
  );
}
