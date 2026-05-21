import { useState, useEffect, lazy, Suspense } from 'react';
import { API_BASE_URL } from './config';
import { IconBarOption3 } from './IconBarOptions';
import LoadingSpinner from './components/LoadingSpinner';

const UserDashboard = lazy(() => import('./UserDashboard'));
const AdminDashboard = lazy(() => import('./AdminDashboard'));
const CbtPortal = lazy(() => import('./CbtPortal'));

function App() {
  const [activeImage, setActiveImage] = useState<string | undefined>(undefined);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Focus states to defeat aggressive Chrome autofill
  const [loginEmailFocused, setLoginEmailFocused] = useState(false);
  const [loginPasswordFocused, setLoginPasswordFocused] = useState(false);
  const [adminEmailFocused, setAdminEmailFocused] = useState(false);
  const [adminPasswordFocused, setAdminPasswordFocused] = useState(false);
  
  const [captchaCode, setCaptchaCode] = useState('dWBB');
  const [modalKey, setModalKey] = useState(0);
  const isReload = (() => {
    if (typeof performance !== 'undefined' && performance.getEntriesByType) {
      const navEntries = performance.getEntriesByType('navigation');
      if (navEntries.length > 0) {
        return (navEntries[0] as PerformanceNavigationTiming).type === 'reload';
      }
    }
    return false;
  })();

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return isReload ? sessionStorage.getItem('app_isLoggedIn') === 'true' : false;
  });
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return isReload ? sessionStorage.getItem('app_isAdminLoggedIn') === 'true' : false;
  });
  const [loggedInUser, setLoggedInUser] = useState<{id?: number, name: string, program_studi: string, gelombang: string} | null>(() => {
    if (isReload) {
      const user = sessionStorage.getItem('app_loggedInUser');
      return user ? JSON.parse(user) : null;
    }
    return null;
  });
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [showCbt, setShowCbt] = useState(() => {
    return isReload ? sessionStorage.getItem('app_showCbt') === 'true' : false;
  });

  // Save states to sessionStorage whenever they change
  useEffect(() => {
    sessionStorage.setItem('app_isLoggedIn', String(isLoggedIn));
    sessionStorage.setItem('app_isAdminLoggedIn', String(isAdminLoggedIn));
    sessionStorage.setItem('app_showCbt', String(showCbt));
    if (loggedInUser) {
      sessionStorage.setItem('app_loggedInUser', JSON.stringify(loggedInUser));
    } else {
      sessionStorage.removeItem('app_loggedInUser');
    }
  }, [isLoggedIn, isAdminLoggedIn, showCbt, loggedInUser]);

  // Clear any existing session storage on initial mount if not reloading to ensure clean start
  useEffect(() => {
    if (!isReload) {
      sessionStorage.clear();
      localStorage.clear();
    }
  }, [isReload]);
  
  const scrollToPortal = () => {
    const element = document.getElementById('akses-portal');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoadingLogin, setIsLoadingLogin] = useState(false);

  // Admin Login State
  const [adminLoginEmail, setAdminLoginEmail] = useState('');
  const [adminLoginPassword, setAdminLoginPassword] = useState('');
  const [adminLoginError, setAdminLoginError] = useState('');
  const [isLoadingAdminLogin, setIsLoadingAdminLogin] = useState(false);
  
  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotNik, setForgotNik] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [isLoadingForgot, setIsLoadingForgot] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    nik: '',
    program_studi: '',
    email: '',
    no_hp: '',
    password: '',
    gelombang: '20263',
    sumber_informasi: '',
    kode_keamanan_input: ''
  });
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');
  const [isLoadingRegister, setIsLoadingRegister] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Validasi khusus untuk NIK: Hanya angka dan maksimal 16 karakter
    if (name === 'nik') {
      const sanitizedValue = value.replace(/[^0-9]/g, '').slice(0, 16);
      setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async () => {
    setRegisterError('');
    setRegisterSuccess('');

    if (formData.kode_keamanan_input !== captchaCode) {
      setRegisterError('Kode keamanan tidak cocok! Perhatikan huruf besar dan kecil.');
      return;
    }

    if (!formData.name || !formData.nik || !formData.email || !formData.password || !formData.program_studi || !formData.sumber_informasi) {
      setRegisterError('Mohon lengkapi semua field yang diwajibkan!');
      return;
    }

    if (formData.nik.length !== 16) {
      setRegisterError('NIK harus berjumlah 16 digit!');
      return;
    }

    setIsLoadingRegister(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setRegisterSuccess('Pendaftaran Berhasil! Silakan klik Masuk.');
        const userToLogin = { name: formData.name, program_studi: formData.program_studi, gelombang: formData.gelombang };
        setTimeout(() => {
          setIsRegisterModalOpen(false);
          setIsLoginModalOpen(true);
          setRegisterSuccess('');
          setFormData({
            name: '', nik: '', program_studi: '', email: '', no_hp: '', password: '', gelombang: '20263', sumber_informasi: '', kode_keamanan_input: ''
          });
          setLoggedInUser(userToLogin);
        }, 2000);
      } else {
        setRegisterError(data.message || 'Pendaftaran gagal. Periksa data Anda.');
      }
    } catch {
      setRegisterError('Koneksi ke server gagal. Pastikan backend server menyala.');
    } finally {
      setIsLoadingRegister(false);
    }
  };

  const handleLogin = async () => {
    setLoginError('');
    if (!loginEmail || !loginPassword) {
      setLoginError('Email dan password wajib diisi!');
      return;
    }

    // --- AKSES JALUR CEPAT (KHUSUS ADMIN) ---
    
    // 1. Admin Pertama (SPMB Utama)
    if (loginEmail === 'admin@uhtp.ac.id' && loginPassword === 'admin123') {
      setLoggedInUser({ id: 999, name: 'Admin Utama SPMB', program_studi: '-', gelombang: '-', role: 'admin' } as any);
      setIsAdminLoggedIn(true);
      setIsLoginModalOpen(false);
      setLoginEmail('');
      setLoginPassword('');
      return;
    }

    // 2. Admin Kedua (CBT Ujian)
    if (loginEmail === 'admincbt@uhtp.ac.id' && loginPassword === 'admincbt123') {
      sessionStorage.setItem('cbt_view', 'admin-dashboard');
      sessionStorage.setItem('cbt_admin_name', 'Administrator CBT');
      setShowCbt(true);
      setIsLoginModalOpen(false);
      setLoginEmail('');
      setLoginPassword('');
      return;
    }

    // ----------------------------------------

    setIsLoadingLogin(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });

      const data = await response.json();

      if (response.ok) {
        if (data.role === 'admin') {
          setLoggedInUser(data);
          setIsAdminLoggedIn(true);
        } else {
          setLoggedInUser(data);
          setIsLoggedIn(true);
        }
        setIsLoginModalOpen(false);
        setLoginEmail('');
        setLoginPassword('');
      } else {
        setLoginError(data.message || 'Login gagal. Periksa kembali email dan password Anda.');
      }
    } catch {
      setLoginError('Koneksi ke server gagal. Pastikan backend server menyala.');
    } finally {
      setIsLoadingLogin(false);
    }
  };

  const handleAdminLogin = async () => {
    setAdminLoginError('');
    if (!adminLoginEmail || !adminLoginPassword) {
      setAdminLoginError('Email dan password admin wajib diisi!');
      return;
    }

    setIsLoadingAdminLogin(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email: adminLoginEmail, password: adminLoginPassword })
      });

      const data = await response.json();

      if (response.ok) {
        setLoggedInUser(data.user || data);
        setIsAdminLoggedIn(true);
        setIsAdminLoginModalOpen(false);
        setAdminLoginEmail('');
        setAdminLoginPassword('');
      } else {
        setAdminLoginError(data.message || 'Login admin gagal.');
      }
    } catch {
      setAdminLoginError('Koneksi ke server gagal.');
    } finally {
      setIsLoadingAdminLogin(false);
    }
  };

  const handleForgotPassword = async () => {
    setForgotError('');
    setForgotSuccess('');

    if (!forgotEmail || !forgotNik || !forgotNewPassword) {
      setForgotError('Lengkapi semua data verifikasi!');
      return;
    }

    if (forgotNik.length !== 16) {
      setForgotError('NIK harus berjumlah 16 digit!');
      return;
    }

    if (forgotNewPassword.length < 8) {
      setForgotError('Password baru minimal 8 karakter!');
      return;
    }

    setIsLoadingForgot(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: forgotEmail,
          nik: forgotNik,
          new_password: forgotNewPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setForgotSuccess(data.message);
        setTimeout(() => {
          setIsForgotModalOpen(false);
          setIsLoginModalOpen(true);
          setForgotEmail('');
          setForgotNik('');
          setForgotNewPassword('');
          setForgotSuccess('');
        }, 3000);
      } else {
        setForgotError(data.message || 'Gagal meriset password.');
      }
    } catch {
      setForgotError('Koneksi server gagal.');
    } finally {
      setIsLoadingForgot(false);
    }
  };

  // Fungsi membuat kode acak
  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let result = '';
    for ( let i = 0; i < 4; i++ ) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(result);
  };

  // Acak otomatis & reset form saat modal pendaftaran dibuka
  useEffect(() => {
    if (isRegisterModalOpen) {
      generateCaptcha();
      setFormData({
        name: '',
        nik: '',
        program_studi: '',
        email: '',
        no_hp: '',
        password: '',
        gelombang: '20263',
        sumber_informasi: '',
        kode_keamanan_input: ''
      });
      setRegisterError('');
      setRegisterSuccess('');
      
      const timer = setTimeout(() => {
        setFormData(prev => ({ 
          ...prev, 
          name: '', nik: '', email: '', no_hp: '', password: '' 
        }));
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isRegisterModalOpen]);

  // Reset login form saat modal dibuka
  useEffect(() => {
    if (isLoginModalOpen) {
      setModalKey(prev => prev + 1);
      setLoginEmailFocused(false);
      setLoginPasswordFocused(false);
      setLoginEmail('');
      setLoginPassword('');
      setLoginError('');
    }
  }, [isLoginModalOpen]);

  // Reset admin login form saat modal dibuka
  useEffect(() => {
    if (isAdminLoginModalOpen) {
      setModalKey(prev => prev + 1);
      setAdminEmailFocused(false);
      setAdminPasswordFocused(false);
      setAdminLoginEmail('');
      setAdminLoginPassword('');
      setAdminLoginError('');
    }
  }, [isAdminLoginModalOpen]);

  const [studentPhoto, setStudentPhoto] = useState<string | undefined>(() => {
    if (isReload) {
      return sessionStorage.getItem('app_studentPhoto') || undefined;
    }
    return undefined;
  });

  useEffect(() => {
    if (studentPhoto) {
      sessionStorage.setItem('app_studentPhoto', studentPhoto);
    } else {
      sessionStorage.removeItem('app_studentPhoto');
    }
  }, [studentPhoto]);

  // Render Dashboard instead if logged in
  if (showCbt) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <CbtPortal 
          onBack={() => setShowCbt(false)} 
          photoUrl={studentPhoto}
          studentName={loggedInUser?.name}
          major={loggedInUser?.program_studi}
          onSelectRole={(role) => alert(`Login sebagai ${role} (Fitur ini sedang dalam pengembangan)`)}
        />
      </Suspense>
    );
  }

  // Render Dashboard instead if logged in
  if (isLoggedIn) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <UserDashboard 
          onLogout={() => { 
            setIsLoggedIn(false); 
            setLoggedInUser(null);
            setShowCbt(false);
            sessionStorage.clear(); 
          }} 
          user={loggedInUser} 
          onOpenCbt={(photoUrl) => {
            setStudentPhoto(photoUrl);
            setShowCbt(true);
          }}
        />
      </Suspense>
    );
  }

  if (isAdminLoggedIn) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <AdminDashboard onLogout={() => {
          setIsAdminLoggedIn(false);
          setLoggedInUser(null);
          sessionStorage.clear();
        }} user={loggedInUser} />
      </Suspense>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative w-full min-h-[85vh] lg:min-h-[90vh] flex items-center bg-slate-50 overflow-hidden pt-24 pb-12">
        {/* Modern Abstract Background */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -mr-96 -mt-96"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px] -ml-48 -mb-48"></div>
        
        {/* Decorative Circle from the user's reference */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/3 w-[600px] h-[600px] rounded-full border-[2px] border-primary/10 hidden lg:block"></div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 w-[800px] h-[800px] rounded-full border-[1px] border-primary/5 hidden lg:block"></div>
        
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-slide-up">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white border border-slate-200 shadow-sm text-slate-700 font-bold text-sm">
                <span className="flex size-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                PMB TA 2026/2027 Telah Dibuka
              </div>
              
              <h1 className="text-slate-900 text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight font-display">
                Selamat Datang di Situs <br />
                <span className="bg-clip-text text-transparent bg-linear-to-r from-primary via-[#1ca2f1] to-navy">PMB Online</span>
              </h1>
              
              <p className="text-slate-600 text-lg md:text-xl font-medium max-w-xl leading-relaxed">
                Universitas Hang Tuah Pekanbaru <br />
                <span className="text-slate-500 font-normal">Tahun Ajaran 2026/2027</span>
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-5 pt-2">
                <button 
                  onClick={scrollToPortal}
                  className="w-full sm:w-auto px-10 py-5 rounded-full bg-primary hover:bg-navy text-white font-bold text-lg shadow-xl shadow-primary/30 flex items-center justify-center gap-3 transition-all hover:-translate-y-1 active:scale-95 group"
                >
                  Daftar Sekarang
                </button>

              </div>
            </div>

            {/* Right Video Component */}
            <div className="relative animate-slide-up [animation-delay:200ms]">
              <div className="absolute -inset-10 bg-primary/5 rounded-[3.5rem] blur-3xl -z-10"></div>
              <div className="relative p-2.5 rounded-[2.5rem] overflow-hidden aspect-video shadow-2xl border border-slate-200 bg-white group">
                <iframe
                  className="w-full h-full rounded-[2rem]"
                  src="https://www.youtube.com/embed/9R8Pv7V4oQo?rel=0"
                  title="Universitas Hang Tuah Pekanbaru Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
              

            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Quick Access Section - Bento Grid Layout */}
      <section className="py-16 md:py-24 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-8 h-1 bg-primary rounded-full"></span>
                <span className="text-primary font-bold uppercase tracking-[0.2em] text-[10px]">Informasi Terpadu</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
                Akses Cepat <br />
                <span className="text-slate-400 italic font-medium">Layanan Akademik</span>
              </h2>
            </div>
            <p className="text-slate-500 font-medium text-base max-w-sm">
              Temukan segala kebutuhan pendaftaran Anda dalam satu tempat yang terorganisir dengan rapi.
            </p>
          </div>
          
          <IconBarOption3 />
        </div>
      </section>

      {/* Mobile view for Quick Access - immediately follows Hero */}
      <div className="md:hidden py-8 bg-slate-50/50">
        <div className="px-4">
          <IconBarOption3 />
        </div>
      </div>

      {/* --- Rest of the Content --- */}

      {/* Floating WhatsApp Icon */}
      <a
        href="https://wa.me/6281234567890"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 right-4 z-50 size-16 bg-[#25D366] hover:bg-[#128C7E] rounded-full flex items-center justify-center shadow-xl shadow-[#25D366]/40 transition-transform hover:-translate-y-1"
        aria-label="Chat with us on WhatsApp"
      >
        <svg className="w-8 h-8 text-white fill-current" viewBox="0 0 24 24">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.066.376-.043c.101-.109.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-5.824 4.74-10.563 10.567-10.564 5.823 0 10.564 4.741 10.564 10.564 0 5.824-4.74 10.564-10.564 10.564z" />
        </svg>
      </a>


      {/* Portal CTA Section - Re-imagined as an Immersive Dashboard Preview */}
      <section id="akses-portal" className="relative py-24 md:py-32 lg:py-40 bg-slate-50 overflow-hidden border-y border-slate-200">
        {/* Immersive Background Effects */}
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]"></div>
        
        <div className="max-w-4xl mx-auto px-6 md:px-12 relative z-10 text-center">
          <div className="space-y-10">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white border border-slate-200 text-slate-700 font-bold text-sm mx-auto shadow-sm">
              <span className="material-symbols-outlined text-[18px] text-primary">verified</span>
              Sistem Pendaftaran Terintegrasi
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight font-display text-slate-900">
              Kelola Pendaftaran <br />
              Dalam <span className="bg-clip-text text-transparent bg-linear-to-r from-primary via-[#1ca2f1] to-navy italic">Satu Portal</span>
            </h2>
            
            <p className="text-slate-600 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto font-medium">
              Lengkapi biodata, unggah dokumen, hingga pantau status kelulusan secara real-time dengan sistem yang aman dan cepat.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-4">
              <button 
                onClick={() => setIsLoginModalOpen(true)}
                className="w-full sm:w-auto px-12 py-5 bg-primary hover:bg-navy text-white font-black rounded-full shadow-xl shadow-primary/30 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 text-lg group"
              >
                <span className="material-symbols-outlined font-black">login</span>
                Masuk Portal
              </button>
              <button 
                onClick={() => setIsRegisterModalOpen(true)}
                className="w-full sm:w-auto px-12 py-5 bg-white border-2 border-slate-200 hover:border-primary text-slate-700 hover:text-primary font-bold rounded-full transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 text-lg shadow-sm"
              >
                <span className="material-symbols-outlined font-black">person_add</span>
                Daftar Akun
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 pt-10 border-t border-slate-200">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">security</span>
                </div>
                <span className="text-sm font-bold text-slate-600">Data Terenkripsi</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">bolt</span>
                </div>
                <span className="text-sm font-bold text-slate-600">Akses Tanpa Hambat</span>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Info Pendaftaran Section - Redesigned as a Clean Interactive Gallery */}
      <section className="relative py-20 md:py-28 bg-[#f8fafc] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="text-center mb-16 md:mb-24 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-sm mb-6">
              <span className="material-symbols-outlined text-[18px]">collections_bookmark</span>
              Brosur & Biaya Kuliah
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-6">
              Informasi <span className="text-primary italic">Penerimaan</span> <br />
              Tahun Ajaran 2026/2027
            </h2>
            <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto font-medium">
              Klik pada brosur untuk memperbesar informasi rincian biaya pendaftaran dan jadwal lengkap kegiatan akademik.
            </p>
          </div>

          <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10 relative z-10">
            {/* Brosur Depan */}
            <div
              onClick={() => setActiveImage('/brosurdepan2026(1).jpg')}
              className="group cursor-pointer flex flex-col bg-white rounded-3xl p-3 border-2 border-slate-100 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-500 hover:-translate-y-2"
            >
              <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden mb-4 bg-slate-100">
                <img
                  src="/brosurdepan2026(1).jpg"
                  alt="Brosur Halaman Depan"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors flex items-center justify-center backdrop-blur-[1px] opacity-0 group-hover:opacity-100">
                  <div className="size-14 bg-white text-primary rounded-full flex items-center justify-center shadow-2xl scale-50 group-hover:scale-100 transition-transform duration-300">
                    <span className="material-symbols-outlined text-3xl">zoom_in</span>
                  </div>
                </div>
              </div>
              <div className="px-2 pb-2 text-center">
                <h3 className="text-lg font-bold text-slate-800">Brosur Depan</h3>
                <p className="text-sm text-slate-500 mt-1 line-clamp-2">Informasi umum kampus dan fasilitas Universitas Hang Tuah Pekanbaru.</p>
              </div>
            </div>

            {/* Brosur Belakang */}
            <div
              onClick={() => setActiveImage('/brosurbelakang2026(2).jpg')}
              className="group cursor-pointer flex flex-col bg-white rounded-3xl p-3 border-2 border-slate-100 shadow-sm hover:shadow-xl hover:border-amber-400/50 transition-all duration-500 hover:-translate-y-2"
            >
              <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden mb-4 bg-slate-100">
                <img
                  src="/brosurbelakang2026(2).jpg"
                  alt="Brosur Halaman Belakang"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-amber-400/0 group-hover:bg-amber-400/20 transition-colors flex items-center justify-center backdrop-blur-[1px] opacity-0 group-hover:opacity-100">
                  <div className="size-14 bg-white text-amber-600 rounded-full flex items-center justify-center shadow-2xl scale-50 group-hover:scale-100 transition-transform duration-300">
                    <span className="material-symbols-outlined text-3xl">zoom_in</span>
                  </div>
                </div>
              </div>
              <div className="px-2 pb-2 text-center">
                <h3 className="text-lg font-bold text-slate-800">Brosur Belakang</h3>
                <p className="text-sm text-slate-500 mt-1 line-clamp-2">Daftar Program Studi dan Persyaratan Lengkap Pendaftaran.</p>
              </div>
            </div>

            {/* Biaya */}
            <div
              onClick={() => setActiveImage('/biaya26.jpg')}
              className="group cursor-pointer flex flex-col bg-white rounded-3xl p-3 border-2 border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-400/40 transition-all duration-500 hover:-translate-y-2"
            >
              <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden mb-4 bg-slate-100">
                <img
                  src="/biaya26.jpg"
                  alt="Rincian Biaya Pendaftaran"
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-blue-400/0 group-hover:bg-blue-400/20 transition-colors flex items-center justify-center backdrop-blur-[1px] opacity-0 group-hover:opacity-100">
                  <div className="size-14 bg-white text-blue-500 rounded-full flex items-center justify-center shadow-2xl scale-50 group-hover:scale-100 transition-transform duration-300">
                    <span className="material-symbols-outlined text-3xl">zoom_in</span>
                  </div>
                </div>
              </div>
              <div className="px-2 pb-2 text-center">
                <h3 className="text-lg font-bold text-slate-800">Rincian Biaya</h3>
                <p className="text-sm text-slate-500 mt-1 line-clamp-2">Detail estimasi biaya pendidikan (registrasi, SPP, dan lainnya).</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Gallery Section */}
      <section className="p-6 md:p-12 lg:p-16 bg-slate-50 dark:bg-navy/30">
        <div className="w-full max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs mb-2">
                <span className="material-symbols-outlined text-[14px]">smart_display</span>
                Multimedia UHT
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Galeri Video Kampus</h2>
            </div>
            <a
              className="text-primary text-sm font-bold flex items-center gap-1 hover:text-navy transition-colors bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm"
              href="https://www.youtube.com/@UniversitasHangTuahPekanbaru"
              target="_blank"
              rel="noopener noreferrer"
            >
              Lihat Channel YouTube <span className="material-symbols-outlined text-[18px]">open_in_new</span>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {/* Video 1 */}
            <div className="group flex flex-col">
              <div className="relative rounded-2xl overflow-hidden aspect-video shadow-sm border-2 border-slate-100 bg-slate-900 mb-3 hover:border-primary/50 transition-colors">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/ghTNfJnyRQg?rel=0"
                  title="JALUR PENERIMAAN MAHASISWA BARU"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 line-clamp-2 px-1 group-hover:text-primary transition-colors">
                Jalur Prestasi - Penerimaan Mahasiswa Baru Gelombang 1
              </h3>
            </div>

            {/* Video 2 */}
            <div className="group flex flex-col">
              <div className="relative rounded-2xl overflow-hidden aspect-video shadow-sm border-2 border-slate-100 bg-slate-900 mb-3 hover:border-primary/50 transition-colors">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/Ody81H1pK68?rel=0"
                  title="Video Promosi Kampus"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 line-clamp-2 px-1 group-hover:text-primary transition-colors">
                Kuliah Nyaman, Fasilitas Lengkap, Tentu Hanya di UHTP
              </h3>
            </div>

            {/* Video 3 */}
            <div className="group flex flex-col">
              <div className="relative rounded-2xl overflow-hidden aspect-video shadow-sm border-2 border-slate-100 bg-slate-900 mb-3 hover:border-primary/50 transition-colors">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/lgjxMAQqt70?rel=0"
                  title="Podcast Penerimaan Mahasiswa Baru"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 line-clamp-2 px-1 group-hover:text-primary transition-colors">
                Bincang-bincang Hangat Seputar Kampus (Podcast UHTP)
              </h3>
            </div>

            {/* Video 4 */}
            <div className="group flex flex-col">
              <div className="relative rounded-2xl overflow-hidden aspect-video shadow-sm border-2 border-slate-100 bg-slate-900 mb-3 hover:border-primary/50 transition-colors">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/aktuYTD5Slo?rel=0"
                  title="Kegiatan Kampus"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 line-clamp-2 px-1 group-hover:text-primary transition-colors">
                Serunya Perkuliahan dan Praktik Mahasiswa UHTP
              </h3>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary border-t-4 border-gold pt-12 pb-8 text-white w-full font-sans overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-10">

            {/* Column 1: Link Cepat */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest text-gold mb-5">Link Cepat</h4>
              <ul className="space-y-3 text-sm text-white/80">
                <li className="flex items-center gap-2">SIAK Online</li>
                <li className="flex items-center gap-2">Portal Terpadu</li>
                <li className="flex items-center gap-2">SPMB Online</li>
                <li className="flex items-center gap-2">Tracer Study</li>
              </ul>
            </div>

            {/* Column 2: Lembaga */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest text-gold mb-5">Lembaga</h4>
              <ul className="space-y-3 text-sm text-white/80">
                <li className="flex items-center gap-2">LP3M</li>
                <li className="flex items-center gap-2">SPMI</li>
                <li className="flex items-center gap-2">SPI</li>
              </ul>
            </div>

            {/* Column 3: Kontak */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest text-gold mb-5">Kontak</h4>
              <div className="space-y-4 text-sm text-white/80">
                <p className="leading-relaxed">Jl. Mustang No.1, Pekanbaru, Riau</p>
                <p>(0761) 33850</p>
                <p>info@uhtp.ac.id</p>

                <div className="flex items-center gap-4 pt-2">
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="size-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#1877F2] hover:text-white transition-all transform hover:scale-110" title="Facebook">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="size-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#1DA1F2] hover:text-white transition-all transform hover:scale-110" title="Twitter">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="size-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-gradient-to-tr hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] hover:text-white transition-all transform hover:scale-110" title="Instagram">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.981 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="size-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#0A66C2] hover:text-white transition-all transform hover:scale-110" title="LinkedIn">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                  <a href="https://google.com" target="_blank" rel="noopener noreferrer" className="size-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#DB4437] hover:text-white transition-all transform hover:scale-110" title="Google Plus">
                    <span className="font-bold text-[13px]">G+</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Column 4: Lokasi */}
            <div className="relative group">
              <h4 className="text-sm font-bold uppercase tracking-widest text-gold mb-5">Lokasi</h4>
              <a
                href="https://maps.app.goo.gl/CrUtkJLdZstApLF96"
                target="_blank"
                rel="noopener noreferrer"
                className="block relative rounded-xl overflow-hidden shadow-lg border border-white/10 aspect-video group/map"
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15958.625390979854!2d101.44299446820586!3d0.509749557200547!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31d5ac033100ba71%3A0xc3f34fae2e5cff81!2sUniversitas%20Hang%20Tuah%20Pekanbaru!5e0!3m2!1sid!2sid!4v1709722300000!5m2!1sid!2sid"
                  width="100%"
                  height="100%"
                  style={{ border: 0, pointerEvents: 'none' }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Google Maps Lokasi Kampus"
                ></iframe>
                <div className="absolute inset-0 bg-primary/0 group-hover/map:bg-primary/20 transition-all flex items-center justify-center">
                  <div className="bg-white text-primary px-3 py-1.5 rounded-lg shadow-xl font-bold text-xs opacity-0 group-hover/map:opacity-100 transition-opacity transform translate-y-2 group-hover/map:translate-y-0">
                    Lihat di Maps
                  </div>
                </div>
              </a>
            </div>

          </div>

          <div className="pt-8 border-t border-white/10 text-center text-[11px] text-white/50 tracking-wider">
            <p>© 2026 Universitas Hang Tuah Pekanbaru. All Rights Reserved.</p>
          </div>

        </div>
      </footer>

      {/* Fullscreen Image Modal Overlay */}
      {
        activeImage && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-8 animate-in fade-in duration-300"
            onClick={() => setActiveImage(undefined)}
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 sm:top-8 sm:right-8 z-[110] size-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setActiveImage(undefined);
              }}
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>

            {/* Image Container */}
            <div
              className="relative max-w-[95vw] max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl shadow-black/50"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
            >
              <img
                src={activeImage}
                alt="Brosur Preview"
                className="w-auto h-auto max-w-full max-h-[90vh] object-contain"
              />
            </div>
          </div>
        )
      }

      {/* Login Modal Overlay */}
      {
        isLoginModalOpen && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 sm:p-8 animate-in fade-in duration-300"
            onClick={() => setIsLoginModalOpen(false)}
          >
            <div
              className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl shadow-black/20 border border-slate-100 animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                className="absolute top-4 right-4 z-10 size-10 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full flex items-center justify-center transition-colors"
                onClick={() => setIsLoginModalOpen(false)}
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>

              <div className="p-8 pt-10">
                <div className="mb-8 text-center">
                  <div className="size-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-3xl">account_circle</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Login Portal</h3>
                  <p className="text-sm text-slate-500 font-medium">Silakan masukkan email dan password Anda.</p>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-5">
                  <div className="space-y-1.5 min-w-0">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">Email</label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-4 text-slate-400 text-[20px]">mail</span>
                      <input
                        key={`login-email-${modalKey}`}
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 text-sm font-medium transition-all block"
                        placeholder="email@anda.com"
                        type="email"
                        value={loginEmail}
                        autoComplete="email"
                        readOnly={!loginEmailFocused}
                        onFocus={() => setLoginEmailFocused(true)}
                        onChange={(e) => setLoginEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 min-w-0">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">Password</label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-4 text-slate-400 text-[20px]">lock</span>
                      <input
                        key={`login-password-${modalKey}`}
                        className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 text-sm font-medium transition-all block"
                        placeholder="••••••••"
                        type={showPassword ? "text" : "password"}
                        value={loginPassword}
                        autoComplete="current-password"
                        readOnly={!loginPasswordFocused}
                        onFocus={() => setLoginPasswordFocused(true)}
                        onChange={(e) => setLoginPassword(e.target.value)}
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 text-slate-400 hover:text-slate-600 flex items-center justify-center p-1 rounded-md transition-colors"
                      >
                        <span className="material-symbols-outlined text-[20px]">{showPassword ? "visibility" : "visibility_off"}</span>
                      </button>
                    </div>
                  </div>

                  {loginError && (
                    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">error</span>
                      {loginError}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="size-4 rounded border-slate-300 text-primary focus:ring-primary" />
                      <span className="text-xs font-medium text-slate-600">Ingat saya</span>
                    </label>
                    <button 
                      type="button"
                      onClick={() => {
                        setIsLoginModalOpen(false);
                        setIsForgotModalOpen(true);
                      }}
                      className="text-xs font-bold text-primary hover:text-navy hover:underline transition-colors bg-transparent border-none p-0 cursor-pointer"
                    >
                      Lupa sandi?
                    </button>
                  </div>

                  <button type="submit" disabled={isLoadingLogin} className="w-full bg-primary text-white font-bold text-sm py-4 rounded-xl shadow-lg shadow-primary/30 mt-4 transition-all hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    {isLoadingLogin ? 'Memproses...' : 'Masuk Sekarang'}
                    {!isLoadingLogin && <span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
                  </button>
                </form>
                
                <div className="mt-8 text-center border-t border-slate-100 pt-6">
                  <p className="text-xs text-slate-500">
                    Belum punya akun? <button type="button" onClick={() => {setIsLoginModalOpen(false); setIsRegisterModalOpen(true);}} className="font-bold text-primary hover:underline bg-transparent border-none p-0 cursor-pointer">Daftar di sini</button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      }

      {/* Admin Login Modal Overlay */}
      {
        isAdminLoginModalOpen && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 sm:p-8 animate-in fade-in duration-300"
            onClick={() => setIsAdminLoginModalOpen(false)}
          >
            <div
              className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl shadow-black/40 border border-slate-100 animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                className="absolute top-4 right-4 z-10 size-10 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full flex items-center justify-center transition-colors"
                onClick={() => setIsAdminLoginModalOpen(false)}
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>

              <div className="p-8 pt-10">
                <div className="mb-8 text-center">
                  <div className="size-16 bg-navy/10 text-navy rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-3xl">admin_panel_settings</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Admin Portal</h3>
                  <p className="text-sm text-slate-500 font-medium">Masuk untuk memverifikasi pembayaran.</p>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleAdminLogin(); }} className="space-y-5">
                  <div className="space-y-1.5 min-w-0">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">Email Admin</label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-4 text-slate-400 text-[20px]">mail</span>
                      <input
                        key={`admin-email-${modalKey}`}
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy/50 focus:border-navy/50 text-sm font-medium transition-all block"
                        placeholder="Masukkan email admin"
                        type="email"
                        value={adminLoginEmail}
                        autoComplete="email"
                        readOnly={!adminEmailFocused}
                        onFocus={() => setAdminEmailFocused(true)}
                        onChange={(e) => setAdminLoginEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 min-w-0">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">Password</label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-4 text-slate-400 text-[20px]">lock</span>
                      <input
                        key={`admin-password-${modalKey}`}
                        className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy/50 focus:border-navy/50 text-sm font-medium transition-all block"
                        placeholder="••••••••"
                        type={showPassword ? "text" : "password"}
                        value={adminLoginPassword}
                        autoComplete="current-password"
                        readOnly={!adminPasswordFocused}
                        onFocus={() => setAdminPasswordFocused(true)}
                        onChange={(e) => setAdminLoginPassword(e.target.value)}
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 text-slate-400 hover:text-slate-600 flex items-center justify-center p-1 rounded-md transition-colors"
                      >
                        <span className="material-symbols-outlined text-[20px]">{showPassword ? "visibility" : "visibility_off"}</span>
                      </button>
                    </div>
                  </div>

                  {adminLoginError && (
                    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">error</span>
                      {adminLoginError}
                    </div>
                  )}

                  <button type="submit" disabled={isLoadingAdminLogin} className="w-full bg-navy text-white font-bold text-sm py-4 rounded-xl shadow-lg shadow-navy/30 mt-4 transition-all hover:shadow-xl hover:shadow-navy/40 hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    {isLoadingAdminLogin ? 'Memproses...' : 'Login Admin'}
                    {!isLoadingAdminLogin && <span className="material-symbols-outlined text-[18px]">login</span>}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )
      }

      {/* Register Modal Overlay */}
      {
        isRegisterModalOpen && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 sm:p-8 animate-in fade-in duration-300 overflow-y-auto"
            onClick={() => setIsRegisterModalOpen(false)}
          >
            <div
              className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl shadow-black/40 border border-slate-100 flex flex-col max-h-full sm:max-h-[95vh] animate-in zoom-in-95 duration-200 my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Info Banner */}
              <div className="bg-primary/5 p-6 sm:p-8 border-b border-primary/10 relative shrink-0">
                <button
                  className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 size-10 bg-white hover:bg-slate-50 text-slate-600 rounded-full flex items-center justify-center shadow-sm border border-slate-100 transition-all hover:scale-105"
                  onClick={() => setIsRegisterModalOpen(false)}
                >
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>
                <div className="flex items-center gap-3 text-primary font-black mb-5">
                  <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">info</span>
                  </div>
                  <h3 className="text-lg sm:text-xl tracking-tight">Informasi Program RPL</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-sm text-slate-600 leading-relaxed">
                  <div className="bg-white/60 p-4 rounded-2xl border border-primary/5">
                    <h4 className="font-bold text-slate-800 mb-1 flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px] text-primary">school</span> RPL A1 (Transfer SKS)</h4>
                    <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-primary/70">Lulusan D3 ke S1</p>
                    <ul className="space-y-1.5 text-xs font-medium">
                      <li className="flex items-start gap-1.5"><span className="material-symbols-outlined text-[14px] text-emerald-500 shrink-0">check_circle</span> Lulusan D3 / Pernah Kuliah</li>
                      <li className="flex items-start gap-1.5"><span className="material-symbols-outlined text-[14px] text-emerald-500 shrink-0">check_circle</span> Lama Kuliah Minimal 3 Semester</li>
                    </ul>
                  </div>
                  <div className="bg-white/60 p-4 rounded-2xl border border-primary/5">
                    <h4 className="font-bold text-slate-800 mb-1 flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px] text-primary">work</span> RPL A2 (Perolehan SKS)</h4>
                    <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-primary/70">Lulusan D3 ke S1</p>
                    <ul className="space-y-1.5 text-xs font-medium">
                      <li className="flex items-start gap-1.5"><span className="material-symbols-outlined text-[14px] text-emerald-500 shrink-0">check_circle</span> Sudah Bekerja Minimal 2 Tahun</li>
                      <li className="flex items-start gap-1.5"><span className="material-symbols-outlined text-[14px] text-emerald-500 shrink-0">check_circle</span> Lama Kuliah Minimal 2 Semester</li>
                    </ul>
                  </div>
                  <div className="bg-white/60 p-4 rounded-2xl border border-primary/5">
                    <h4 className="font-bold text-slate-800 mb-1 flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px] text-primary">trending_up</span> Lulusan S1/D4 ke S2</h4>
                    <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-transparent select-none">-</p>
                    <ul className="space-y-1.5 text-xs font-medium mt-4 sm:mt-0">
                      <li className="flex items-start gap-1.5"><span className="material-symbols-outlined text-[14px] text-emerald-500 shrink-0">check_circle</span> Punya Pengalaman Kerja</li>
                      <li className="flex items-start gap-1.5"><span className="material-symbols-outlined text-[14px] text-emerald-500 shrink-0">check_circle</span> Lama Kuliah Minimal 2 Semester</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <form onSubmit={(e) => { e.preventDefault(); handleRegister(); }} className="p-6 sm:p-8 overflow-y-auto bg-white flex flex-col min-h-0">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-slate-900">Form Pendaftaran Akun</h3>
                  <p className="text-sm text-slate-500 font-medium">Silakan lengkapi formulir di bawah ini dengan data yang valid.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  {/* Left Column */}
                  <div className="space-y-5">
                    <div className="flex flex-col gap-1.5 min-w-0">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Nama Lengkap</label>
                      <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Masukkan nama Anda" autoComplete="off" className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-medium transition-all" />
                      <p className="text-[11px] text-red-500 mt-1 font-medium flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">error</span>Nama lengkap tanpa gelar akademik</p>
                    </div>
                    <div className="flex flex-col gap-1.5 min-w-0">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">NIK (Nomor Induk Kependudukan)</label>
                      <input type="text" name="nik" value={formData.nik} onChange={handleInputChange} placeholder="16 Digit NIK" autoComplete="off" className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-medium transition-all" />
                       <p className="text-[11px] text-red-500 mt-1 font-medium flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">error</span>Sesuai dengan KTP/Kartu Keluarga</p>
                    </div>
                    {/* Pilihan */}
                    <div className="flex flex-col gap-1.5 min-w-0 relative">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Program Studi Pilihan</label>
                      <div className="relative">
                        <select name="program_studi" value={formData.program_studi} onChange={handleInputChange} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-medium transition-all cursor-pointer">
                          <option value="">- Pilih Program Studi -</option>
                          <option>S1 Kesmas Program Reguler</option>
                          <option>S1 Kesmas Program RPLA1</option>
                          <option>S1 Kesmas Program RPLA2</option>
                          <option>S1 TI Program Reguler</option>
                          <option>S1 TI Program RPLA1</option>
                          <option>S1 TI Program RPLA2</option>
                          <option>S1 SI Program Reguler</option>
                          <option>S1 SI Program RPLA1</option>
                          <option>S1 SI Program RPLA2</option>
                          <option>S2 Kesmas Program Reguler</option>
                          <option>S2 Kesmas Program RPLA2</option>
                          <option>S1 Kebidanan Program Reguler</option>
                          <option>S1 Kebidanan Program RPLA1</option>
                          <option>S1 Kebidanan Program RPLA2</option>
                          <option>S1 Keperawatan Program Reguler</option>
                          <option>S1 Keperawatan Program RPLA1</option>
                          <option>S1 Keperawatan Program RPLA2</option>
                          <option>Profesi Ners</option>
                          <option>Profesi Bidan</option>
                          <option>D3 Rekam Medis</option>
                          <option>S1 Ilmu Komunikasi</option>
                          <option>S1 Ilmu Hukum</option>
                          <option>D4 Manajemen Informasi Kesehatan</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5 min-w-0">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Alamat Email</label>
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="email@anda.com" autoComplete="off" className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-medium transition-all" />
                      <p className="text-[11px] text-red-500 mt-1 font-medium flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">error</span>Gunakan email yang valid dan aktif</p>
                    </div>
                    <div className="flex flex-col gap-1.5 min-w-0">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Nomor Handphone / WA</label>
                      <input type="text" name="no_hp" value={formData.no_hp} onChange={handleInputChange} placeholder="08xxxxxxxxxx" autoComplete="off" className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-medium transition-all" />
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-5 pt-1 md:pt-0 flex flex-col">
                    <div className="flex flex-col gap-1.5 min-w-0">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Buat Password</label>
                      <input type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="Minimal 8 karakter" autoComplete="new-password" className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-medium transition-all" />
                    </div>
                    <div className="flex flex-col gap-1.5 min-w-0 relative">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Gelombang Pendaftaran</label>
                      <div className="relative">
                        <select name="gelombang" value={formData.gelombang} onChange={handleInputChange} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-medium transition-all cursor-pointer">
                          <option>20263</option>
                          <option>20264</option>
                        </select>
                      </div>
                    </div>
                    {/* Sumber Informasi */}
                    <div className="flex flex-col gap-1.5 min-w-0 relative">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Sumber Informasi</label>
                      <div className="relative">
                        <select name="sumber_informasi" value={formData.sumber_informasi} onChange={handleInputChange} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-medium transition-all cursor-pointer">
                          <option value="">- Pilih Sumber Informasi -</option>
                          <option>Rekomendasi Karyawan Hang Tuah</option>
                          <option>Facebook</option>
                          <option>Twitter</option>
                          <option>Instagram</option>
                          <option>Youtube</option>
                          <option>Tiktok</option>
                          <option>Google</option>
                          <option>Website</option>
                          <option>Media Cetak</option>
                          <option>Radio</option>
                          <option>Televisi</option>
                          <option>Event</option>
                          <option>Spanduk</option>
                          <option>Poster</option>
                          <option>Brosur</option>
                          <option>Rekomendasi Alumni</option>
                          <option>Rekomendasi Guru Sekolah</option>
                          <option>Rekomendasi Teman Sekolah</option>
                          <option>Promosi ke sekolah</option>
                          <option>Rekan Kerja</option>
                          <option>Lainnya</option>
                        </select>
                      </div>
                      <p className="text-[11px] text-red-500 mt-1 font-medium flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">error</span>Dari mana Anda mengetahui UHTP?</p>
                    </div>
                    
                    <div className="flex flex-col gap-1.5 min-w-0 pt-2 flex-grow">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Verifikasi Keamanan</label>
                      <div className="flex items-end gap-3 w-full">
                        <div className="flex-1">
                          <input type="text" name="kode_keamanan_input" value={formData.kode_keamanan_input} onChange={handleInputChange} placeholder="Ketik kode di samping" className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-medium transition-all h-[52px]" />
                        </div>
                        <div className="w-[120px] h-[52px] bg-slate-900 text-white font-mono tracking-[0.2em] rounded-xl shadow-inner font-bold text-xl relative overflow-hidden flex items-center justify-center select-none shrink-0 border border-slate-800">
                          <div className="absolute inset-0 top-1/2 w-full h-[1px] bg-white opacity-20 pointer-events-none"></div>
                          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white transform -rotate-6 origin-left z-10 opacity-20 pointer-events-none"></div>
                          <div className="absolute top-1/3 left-0 w-full h-[1px] bg-white transform rotate-3 origin-left z-10 opacity-20 pointer-events-none"></div>
                          <span className="relative z-20 mix-blend-screen opacity-90">{captchaCode}</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-red-500 mt-1.5 font-medium flex items-center justify-between">
                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">error</span>Perhatikan huruf besar/kecil</span>
                        <button type="button" onClick={generateCaptcha} className="text-primary hover:text-navy font-bold flex items-center gap-1 transition-colors">
                          <span className="material-symbols-outlined text-[14px]">refresh</span> Tukar Kode
                        </button>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  {registerError && (
                    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2 mb-4">
                      <span className="material-symbols-outlined text-[20px]">error</span>
                      {registerError}
                    </div>
                  )}
                  {registerSuccess && (
                    <div className="bg-emerald-50 text-emerald-600 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2 mb-4">
                      <span className="material-symbols-outlined text-[20px]">check_circle</span>
                      {registerSuccess}
                    </div>
                  )}
                </div>
                
                <div className="mt-4 pt-6 border-t border-slate-100 flex items-center justify-end">
                  <button type="submit" disabled={isLoadingRegister} className="w-full sm:w-auto bg-primary hover:bg-navy text-white font-bold text-sm py-3.5 px-10 rounded-xl shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    {isLoadingRegister ? 'Memproses...' : 'Daftar Sekarang'}
                    {!isLoadingRegister && <span className="material-symbols-outlined text-[18px]">how_to_reg</span>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )
      }

      {/* Forgot Password Modal Overlay */}
      {
        isForgotModalOpen && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-300"
            onClick={() => setIsForgotModalOpen(false)}
          >
            <div
              className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                className="absolute top-4 right-4 z-10 size-10 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full flex items-center justify-center transition-colors"
                onClick={() => setIsForgotModalOpen(false)}
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>

              <div className="p-8 pt-10">
                <div className="mb-8 text-center">
                  <div className="size-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-3xl">lock_reset</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Lupa Sandi?</h3>
                  <p className="text-sm text-slate-500 font-medium">Verifikasi data Anda untuk meriset password.</p>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleForgotPassword(); }} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">Email Terdaftar</label>
                    <input
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-medium"
                      placeholder="email@anda.com"
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">NIK (Sesuai KTP)</label>
                    <input
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-medium"
                      placeholder="16 Digit NIK"
                      type="text"
                      value={forgotNik}
                      onChange={(e) => setForgotNik(e.target.value.replace(/[^0-9]/g, '').slice(0, 16))}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">Password Baru</label>
                    <input
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-medium"
                      placeholder="Min. 8 Karakter"
                      type="password"
                      value={forgotNewPassword}
                      onChange={(e) => setForgotNewPassword(e.target.value)}
                    />
                  </div>

                  {forgotError && (
                    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px]">error</span>
                      {forgotError}
                    </div>
                  )}

                  {forgotSuccess && (
                    <div className="bg-emerald-50 text-emerald-600 px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px]">check_circle</span>
                      {forgotSuccess}
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={isLoadingForgot} 
                    className="w-full bg-primary text-white font-bold text-sm py-4 rounded-xl shadow-lg shadow-primary/30 mt-4 hover:-translate-y-0.5 transition-all disabled:opacity-50"
                  >
                    {isLoadingForgot ? 'Memproses...' : 'Riset Password'}
                  </button>

                  <button 
                    type="button"
                    onClick={() => {
                      setIsForgotModalOpen(false);
                      setIsLoginModalOpen(true);
                    }}
                    className="w-full text-center text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors mt-2"
                  >
                    Kembali ke Login
                  </button>
                </form>
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
}

export default App;