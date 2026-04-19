import { useState } from 'react';
import { authService } from '../../services/api';
import { Button, Card, Input } from '../ui';

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
      const data = await authService.login({ email: identifier, password });
      onLoginSuccess(data.access_token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px]">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        <Card className="p-10">
          <div className="text-center mb-10">
            <div className="text-5xl mb-4 drop-shadow-sm">🔐</div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Selamat Datang</h1>
            <p className="text-slate-400 font-bold mt-2 italic">Masuk ke Portal Absensi Dexa</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && <div className="p-4 bg-rose-50 text-rose-500 rounded-2xl text-sm font-bold text-center border border-rose-100">{error}</div>}
            
            <Input label="Email atau NIP" type="text" placeholder="Masukkan Email atau NIP" value={identifier} onChange={e => setIdentifier(e.target.value)} required />
            <Input label="Kata Sandi" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />

            <Button type="submit" disabled={loading} className="w-full h-14 uppercase tracking-widest font-black italic">
              {loading ? 'Mengautentikasi...' : 'Masuk Sekarang'}
            </Button>
          </form>

          <p className="text-center mt-8 text-sm font-bold text-slate-400">
            Belum punya akun?{' '}
            <button onClick={onSwitchToRegister} className="text-blue-600 hover:text-blue-700 underline underline-offset-4 font-black">Daftar Sekarang</button>
          </p>
        </Card>
      </div>
    </div>
  );
}
