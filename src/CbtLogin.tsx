import React, { useState } from 'react';
import { API_BASE_URL } from './config';

interface CbtLoginProps {
  role: 'peserta' | 'panitia';
  onBack: () => void;
  onLogin: (noUjian: string) => void;
}

const CbtLogin: React.FC<CbtLoginProps> = ({ role, onBack, onLogin }) => {
  const [noUjian, setNoUjian] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [userFocused, setUserFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!noUjian || !password) {
      setError(`Harap isi ${role === 'panitia' ? 'Username' : 'No Ujian'} dan Password`);
      return;
    }

    if (role === 'panitia') {
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ email: noUjian, password: password })
        });

        const data = await response.json();

        if (response.ok) {
          if (data.token) {
            sessionStorage.setItem('admin_token', data.token);
          }
          sessionStorage.setItem('login_timestamp', String(Date.now()));
          // Pass the user name
          onLogin(data.name || 'Administrator');
        } else {
          setError(data.message || 'Username atau Password Panitia salah');
        }
      } catch {
        setError('Koneksi ke server gagal');
      }
      return;
    }

    const normalizeExamNumber = (num: string): string => {
      let val = num.trim().toUpperCase();
      if (val.length === 12) {
        const chars = val.split('');
        if (chars[5] === '0') chars[5] = 'O';
        if (chars[6] === '0') chars[6] = 'O';
        for (let i = 0; i < 5; i++) {
          if (chars[i] === 'O') chars[i] = '0';
        }
        for (let i = 8; i < 12; i++) {
          if (chars[i] === 'O') chars[i] = '0';
        }
        val = chars.join('');
      }
      return val;
    };

    const normalizedNoUjian = normalizeExamNumber(noUjian);
    const normalizedPassword = normalizeExamNumber(password);

    if (normalizedNoUjian !== normalizedPassword) {
      setError(`No Ujian dan Password harus sama`);
      return;
    }

    // Success logic for peserta
    sessionStorage.setItem('login_timestamp', String(Date.now()));
    onLogin(normalizedNoUjian);
  };

  return (
    <div className="w-full max-w-2xl animate-in fade-in zoom-in duration-500">
      <div className="bg-white rounded-[32px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Form */}
        <div className="flex-1 p-10 md:p-12">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
              Login <span className="text-emerald-600">{role === 'peserta' ? 'Peserta' : 'Panitia'}</span>
            </h2>
            <button onClick={onBack} className="text-slate-400 hover:text-slate-600 transition-colors">
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-[11px] font-bold uppercase tracking-wider flex items-center gap-3 animate-shake">
                <span className="material-symbols-outlined text-[18px]">error</span>
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[20px]">person</span>
                </div>
                <input
                  type="text"
                  placeholder={role === 'panitia' ? 'Username' : 'No Ujian'}
                  value={noUjian}
                  onChange={(e) => setNoUjian(e.target.value)}
                  readOnly={!userFocused}
                  onFocus={() => setUserFocused(true)}
                  className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-white rounded-[20px] text-slate-700 font-bold text-sm transition-all outline-none"
                  autoComplete={role === 'panitia' ? 'username' : 'off'}
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[20px]">lock</span>
                </div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  readOnly={!passwordFocused}
                  onFocus={() => setPasswordFocused(true)}
                  className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-white rounded-[20px] text-slate-700 font-bold text-sm transition-all outline-none"
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-[0.2em] text-[12px] rounded-[20px] shadow-lg shadow-emerald-900/20 active:scale-[0.98] transition-all"
            >
              Sign In
            </button>
          </form>
        </div>

        {/* Right Side: Info (Red text like in reference) */}
        <div className="w-full md:w-[240px] bg-slate-50 p-10 flex flex-col justify-center border-t md:border-t-0 md:border-l border-slate-100">
          <div className="space-y-4">
            <p className="text-red-500 text-[11px] font-black uppercase leading-relaxed tracking-wider">
              Apabila mengalami kendala hubungi panitia SPMB
            </p>
            <p className="text-red-600 text-[11px] font-black uppercase leading-relaxed tracking-widest border-t border-red-100 pt-4">
              UNIVERSITAS HANG TUAH PEKANBARU
            </p>
          </div>
          <div className="mt-10">
             <img src="/logo-uhtp.png" alt="Logo UHTP" className="h-12 w-auto grayscale opacity-30" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CbtLogin;
