import { useState } from 'react';
import { authService } from '../../services/api';
import { Button, Card, Input } from '../ui';

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
      await authService.register({ name, email, nip, position, password });
      onRegisterSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px]">
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Card className="p-10">
          <div className="text-center mb-10">
            <div className="text-6xl mb-4 drop-shadow-sm">🤝</div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Pendaftaran</h1>
            <p className="text-slate-400 font-bold mt-2 italic">Bergabunglah dengan tim cerdas kami</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {error && <div className="p-4 bg-rose-50 text-rose-500 rounded-2xl text-sm font-bold text-center border border-rose-100">{error}</div>}

            <Input label="Nama Lengkap" placeholder="Budi Santoso" value={name} onChange={e => setName(e.target.value)} required />
            <div className="grid grid-cols-2 gap-4">
              <Input label="NIP" placeholder="123456" value={nip} onChange={e => setNip(e.target.value)} required />
              <Input label="Jabatan" placeholder="Engineer" value={position} onChange={e => setPosition(e.target.value)} required />
            </div>
            <Input label="Alamat Email" type="email" placeholder="budi@dexa.com" value={email} onChange={e => setEmail(e.target.value)} required />
            <Input label="Kata Sandi" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />

            <Button type="submit" disabled={loading} className="w-full h-14 uppercase tracking-widest font-black italic mt-4">
              {loading ? 'Mendaftarkan...' : 'Selesaikan Pendaftaran'}
            </Button>
          </form>

          <p className="text-center mt-8 text-sm font-bold text-slate-400">
            Sudah punya akun?{' '}
            <button onClick={onSwitchToLogin} className="text-blue-600 hover:text-blue-700 underline underline-offset-4 font-black">Masuk Sekarang</button>
          </p>
        </Card>
      </div>
    </div>
  );
}
