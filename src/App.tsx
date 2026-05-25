import { useState, useEffect, lazy, Suspense } from 'react';
import { API_BASE_URL } from './config';
import { IconBarOptionCategorized } from './IconBarOptions';
import LoadingSpinner from './components/LoadingSpinner';

const UserDashboard = lazy(() => import('./UserDashboard'));
const AdminDashboard = lazy(() => import('./AdminDashboard'));
const CbtPortal = lazy(() => import('./CbtPortal'));

function App() {
  const [activeImage, setActiveImage] = useState<string | undefined>(undefined);
  const [activeVideoId, setActiveVideoId] = useState<string | undefined>(undefined);
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
  const [prodiList, setProdiList] = useState<string[]>([
    'S1 Kesmas Program Reguler',
    'S1 Kesmas Program RPLA1',
    'S1 Kesmas Program RPLA2',
    'S1 TI Program Reguler',
    'S1 TI Program RPLA1',
    'S1 TI Program RPLA2',
    'S1 SI Program Reguler',
    'S1 SI Program RPLA1',
    'S1 SI Program RPLA2',
    'S2 Kesmas Program Reguler',
    'S2 Kesmas Program RPLA2',
    'S1 Kebidanan Program Reguler',
    'S1 Kebidanan Program RPLA1',
    'S1 Kebidanan Program RPLA2',
    'S1 Keperawatan Program Reguler',
    'S1 Keperawatan Program RPLA1',
    'S1 Keperawatan Program RPLA2',
    'Profesi Ners',
    'Profesi Bidan',
    'D3 Rekam Medis',
    'S1 Ilmu Komunikasi',
    'S1 Ilmu Hukum',
    'D4 Manajemen Informasi Kesehatan'
  ]);

  useEffect(() => {
    if (!isReload) {
      sessionStorage.clear();
      localStorage.clear();
    }

    const fetchProdis = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/prodis`);
        const data = await response.json();
        if (data.status === 'success') {
          setProdiList(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch prodis:', error);
      }
    };
    fetchProdis();
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

    // --- AKSES JALUR CEPAT (KHUSUS ADMIN/MAHASISWA) ---
    
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

    // 3. User Mahasiswa (Jalur Cepat Offline)
    if (loginEmail === 'student@uhtp.ac.id' && loginPassword === 'student123') {
      setLoggedInUser({
        id: 123,
        name: 'Lukman Hakim',
        email: 'student@uhtp.ac.id',
        program_studi: 'S1 Teknik Informatika',
        gelombang: '20263',
        kode_pembayaran: 'SPMB-2026-0001',
        role: 'user',
        status_biodata: 'verified',
        status_kelulusan: 'lulus'
      } as any);
      setIsLoggedIn(true);
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
      <section 
        className="relative w-full min-h-[85vh] lg:min-h-[90vh] flex items-center overflow-hidden pt-24 pb-12"
        style={{ backgroundImage: 'linear-gradient(to bottom, #a6e1da 0%, #ffffff 100%)' }}
      >
        {/* Modern Abstract Background */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -mr-96 -mt-96"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px] -ml-48 -mb-48"></div>
        
        {/* Decorative Circle from the user's reference */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/3 w-[600px] h-[600px] rounded-full border-[2px] border-primary/10 hidden lg:block"></div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 w-[800px] h-[800px] rounded-full border-[1px] border-primary/5 hidden lg:block"></div>
        
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-6 animate-slide-up">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-primary-light/80 text-primary border border-primary-light/40 text-xs font-semibold">
                <span className="flex size-2 rounded-full bg-primary"></span>
                PMB TA 2026/2027 Telah Dibuka
              </div>
              
              <h1 className="text-slate-900 text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight font-display">
                Selamat Datang di Situs <br />
                <span className="text-primary">PMB Online</span>
              </h1>
              
              <p className="text-slate-600 text-base md:text-lg font-medium max-w-xl leading-relaxed">
                Universitas Hang Tuah Pekanbaru <br />
                <span className="text-slate-400 font-normal">Tahun Ajaran 2026/2027</span>
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button 
                  onClick={scrollToPortal}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold text-sm transition-colors shadow-md shadow-primary/10 active:scale-95 cursor-pointer"
                >
                  Daftar Sekarang
                </button>
                <button 
                  onClick={() => {
                    const el = document.getElementById('akses-portal');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white border border-slate-200 hover:border-primary hover:text-primary text-slate-600 font-semibold text-sm transition-colors active:scale-95 shadow-xs cursor-pointer"
                >
                  Informasi Portal
                </button>
              </div>
            </div>

            {/* Right Video Component - Elegant Bento-style Frame */}
            <div className="relative group">
              {/* Subtle ambient glow behind card */}
              <div className="absolute -inset-4 bg-primary/5 rounded-[2.5rem] blur-2xl -z-10 group-hover:bg-primary/8 transition-all duration-500"></div>
              
              {/* Elegant Bento Card Wrapper */}
              <div className="relative rounded-[2rem] p-3 md:p-4 bg-white border border-slate-100 shadow-lg transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:border-primary/10">
                <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-950 shadow-inner">
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src="https://www.youtube.com/embed/9R8Pv7V4oQo?rel=0"
                    title="Universitas Hang Tuah Pekanbaru Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
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
          
          <IconBarOptionCategorized />
        </div>
      </section>

      {/* Mobile view for Quick Access - immediately follows Hero */}
      <div className="md:hidden py-8 bg-slate-50/50">
        <div className="px-4">
          <IconBarOptionCategorized />
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


      {/* Portal CTA Section - Clean Centered Layout */}
      <section 
        id="akses-portal" 
        className="relative py-16 md:py-20 border-y border-slate-100 overflow-hidden"
        style={{ backgroundImage: 'linear-gradient(to bottom, #a6e1da 0%, #ffffff 100%)' }}
      >
        {/* Immersive Background Effects */}
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]"></div>
        
        <div className="max-w-4xl mx-auto px-6 md:px-12 relative z-10 text-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-150 text-[#00857A] font-semibold text-xs mx-auto shadow-xs">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              Sistem Pendaftaran Terintegrasi
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight font-display text-slate-900">
              Kelola Pendaftaran <br />
              Dalam <span className="text-[#00857A]">Satu Portal</span>
            </h2>
            
            <p className="text-slate-500 text-base md:text-lg leading-relaxed max-w-xl mx-auto font-medium">
              Lengkapi biodata, unggah dokumen, hingga pantau status kelulusan secara real-time dengan sistem yang aman dan cepat.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button 
                onClick={() => setIsLoginModalOpen(true)}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#00857A] hover:bg-[#00695C] text-white font-semibold text-sm transition-colors shadow-md shadow-[#00857A]/10 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">login</span>
                Masuk Portal
              </button>
              <button 
                onClick={() => setIsRegisterModalOpen(true)}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white border border-slate-200 hover:border-[#00857A] hover:text-[#00857A] text-slate-700 font-semibold text-sm transition-colors active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-[18px]">person_add</span>
                Daftar Akun
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 pt-8 border-t border-slate-150">
              <div className="flex items-center gap-2.5">
                <div className="size-9 rounded-xl bg-white border border-slate-150 shadow-xs flex items-center justify-center text-[#00857A]">
                  <span className="material-symbols-outlined text-[18px]">security</span>
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Data Terenkripsi</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="size-9 rounded-xl bg-white border border-slate-150 shadow-xs flex items-center justify-center text-[#00857A]">
                  <span className="material-symbols-outlined text-[18px]">bolt</span>
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Akses Tanpa Hambat</span>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Info Pendaftaran Section - Redesigned as a Clean Interactive Gallery */}
      <section className="relative py-20 md:py-28 bg-white overflow-hidden">
        {/* Subtle Decorative Background Elements */}
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="text-center mb-16 md:mb-20 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-sm mb-6">
              <span className="material-symbols-outlined text-[18px]">collections_bookmark</span>
              Brosur & Biaya Kuliah
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-6">
              Informasi <span className="text-primary italic">Penerimaan</span> <br />
              Tahun Ajaran 2026/2027
            </h2>
            <p className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto font-medium">
              Klik pada brosur untuk memperbesar informasi rincian biaya pendaftaran dan jadwal lengkap kegiatan akademik.
            </p>
            <div className="flex flex-wrap justify-center items-center gap-3.5 mt-8 text-xs font-bold text-slate-600">
              <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl shadow-xs border border-slate-100">
                <span className="material-symbols-outlined text-[18px] text-emerald-500">zoom_in</span>
                Klik Untuk Memperbesar
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl shadow-xs border border-slate-100">
                <span className="material-symbols-outlined text-[18px] text-[#00857A]">download_for_offline</span>
                Kualitas Tinggi (HQ)
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl shadow-xs border border-slate-100">
                <span className="material-symbols-outlined text-[18px] text-amber-500">payments</span>
                Rincian Biaya Transparan
              </div>
            </div>
          </div>

          <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 relative z-10">
            {/* Brosur Depan */}
            <div
              onClick={() => setActiveImage('/brosurdepan2026(1).jpg')}
              className="group cursor-pointer flex flex-col bg-white rounded-3xl p-4 border border-slate-200/85 shadow-md hover:shadow-[0_30px_60px_-15px_rgba(0,133,122,0.2)] hover:border-emerald-500/30 transition-all duration-500 hover:-translate-y-2 cubic-bezier"
            >
              <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden mb-4 bg-slate-100 shadow-inner border border-slate-100">
                <div className="absolute top-3 left-3 z-20 bg-emerald-500/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm border border-emerald-400/20">
                  Informasi Kampus
                </div>
                <img
                  src="/brosurdepan2026(1).jpg"
                  alt="Brosur Halaman Depan"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 backdrop-blur-[3px] transition-all duration-500 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    <div className="size-12 bg-white text-emerald-600 rounded-full flex items-center justify-center shadow-lg scale-90 group-hover:scale-100 transition-all duration-300">
                      <span className="material-symbols-outlined text-[24px]">zoom_in</span>
                    </div>
                    <span className="text-[10px] font-black text-white uppercase tracking-widest bg-emerald-700/85 px-3.5 py-1.5 rounded-full backdrop-blur-md">Perbesar Brosur</span>
                  </div>
                </div>
              </div>
              <div className="px-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-800 font-display transition-colors group-hover:text-[#00857A]">Brosur Depan</h3>
                  <p className="text-sm text-slate-500 mt-1.5 font-medium leading-relaxed">Informasi umum kampus dan fasilitas Universitas Hang Tuah Pekanbaru.</p>
                </div>
                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-black uppercase tracking-wider text-emerald-700">
                  <span>Lihat Brosur</span>
                  <span className="material-symbols-outlined text-[16px] text-emerald-600 transition-transform duration-300 group-hover:translate-x-1.5">arrow_forward</span>
                </div>
              </div>
            </div>

            {/* Brosur Belakang */}
            <div
              onClick={() => setActiveImage('/brosurbelakang2026(2).jpg')}
              className="group cursor-pointer flex flex-col bg-white rounded-3xl p-4 border border-slate-200/85 shadow-md hover:shadow-[0_30px_60px_-15px_rgba(212,175,55,0.25)] hover:border-amber-500/30 transition-all duration-500 hover:-translate-y-2 cubic-bezier"
            >
              <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden mb-4 bg-slate-100 shadow-inner border border-slate-100">
                <div className="absolute top-3 left-3 z-20 bg-amber-500/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm border border-amber-400/20">
                  Persyaratan & Prodi
                </div>
                <img
                  src="/brosurbelakang2026(2).jpg"
                  alt="Brosur Halaman Belakang"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 backdrop-blur-[3px] transition-all duration-500 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    <div className="size-12 bg-white text-amber-600 rounded-full flex items-center justify-center shadow-lg scale-90 group-hover:scale-100 transition-all duration-300">
                      <span className="material-symbols-outlined text-[24px]">zoom_in</span>
                    </div>
                    <span className="text-[10px] font-black text-white uppercase tracking-widest bg-amber-600/85 px-3.5 py-1.5 rounded-full backdrop-blur-md">Perbesar Brosur</span>
                  </div>
                </div>
              </div>
              <div className="px-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-800 font-display transition-colors group-hover:text-amber-600">Brosur Belakang</h3>
                  <p className="text-sm text-slate-500 mt-1.5 font-medium leading-relaxed">Daftar Program Studi dan Persyaratan Lengkap Pendaftaran.</p>
                </div>
                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-black uppercase tracking-wider text-amber-700">
                  <span>Lihat Persyaratan</span>
                  <span className="material-symbols-outlined text-[16px] text-amber-600 transition-transform duration-300 group-hover:translate-x-1.5">arrow_forward</span>
                </div>
              </div>
            </div>

            {/* Biaya */}
            <div
              onClick={() => setActiveImage('/biaya26.jpg')}
              className="group cursor-pointer flex flex-col bg-white rounded-3xl p-4 border border-slate-200/85 shadow-md hover:shadow-[0_30px_60px_-15px_rgba(59,130,246,0.2)] hover:border-blue-500/30 transition-all duration-500 hover:-translate-y-2 cubic-bezier"
            >
              <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden mb-4 bg-slate-100 shadow-inner border border-slate-100">
                <div className="absolute top-3 left-3 z-20 bg-blue-500/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm border border-blue-400/20">
                  Estimasi Biaya
                </div>
                <img
                  src="/biaya26.jpg"
                  alt="Rincian Biaya Pendaftaran"
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 backdrop-blur-[3px] transition-all duration-500 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    <div className="size-12 bg-white text-blue-600 rounded-full flex items-center justify-center shadow-lg scale-90 group-hover:scale-100 transition-all duration-300">
                      <span className="material-symbols-outlined text-[24px]">zoom_in</span>
                    </div>
                    <span className="text-[10px] font-black text-white uppercase tracking-widest bg-blue-600/85 px-3.5 py-1.5 rounded-full backdrop-blur-md">Perbesar Brosur</span>
                  </div>
                </div>
              </div>
              <div className="px-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-800 font-display transition-colors group-hover:text-blue-600">Rincian Biaya</h3>
                  <p className="text-sm text-slate-500 mt-1.5 font-medium leading-relaxed">Detail estimasi biaya pendidikan (registrasi, SPP, dan lainnya).</p>
                </div>
                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-black uppercase tracking-wider text-blue-700">
                  <span>Lihat Rincian</span>
                  <span className="material-symbols-outlined text-[16px] text-blue-600 transition-transform duration-300 group-hover:translate-x-1.5">arrow_forward</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Gallery Section */}
      <section 
        className="py-20 md:py-28 border-t border-slate-200/50"
        style={{ backgroundImage: 'linear-gradient(to bottom, #a6e1da 0%, #ffffff 100%)' }}
      >
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-sm mb-4">
                <span className="material-symbols-outlined text-[16px]">smart_display</span>
                Multimedia UHTP
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Galeri <span className="text-primary italic">Video</span> Kampus
              </h2>
              <p className="text-slate-500 text-sm mt-2 font-medium max-w-xl">
                Tonton dokumentasi kegiatan perkuliahan, profil program studi, dan bincang podcast menarik seputar Universitas Hang Tuah Pekanbaru.
              </p>
            </div>
            <a
              className="inline-flex items-center gap-2.5 px-5 py-3 bg-white border border-slate-200 hover:border-red-500/30 text-slate-700 hover:text-red-600 font-bold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-sm hover:shadow-md active:scale-95 group/yt cursor-pointer"
              href="https://www.youtube.com/@UniversitasHangTuahPekanbaru"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="w-5 h-5 fill-current text-red-600 group-hover/yt:scale-110 transition-transform duration-300" viewBox="0 0 24 24">
                <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              <span>YouTube Channel</span>
              <span className="material-symbols-outlined text-[16px] text-slate-400 group-hover/yt:text-red-500 transition-colors">open_in_new</span>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {/* Video 1 */}
            <div 
              onClick={() => setActiveVideoId('ghTNfJnyRQg')}
              className="group cursor-pointer flex flex-col bg-white rounded-3xl p-3 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-red-500/20 transition-all duration-500 hover:-translate-y-1.5"
            >
              <div className="relative rounded-2xl overflow-hidden aspect-video shadow-inner bg-slate-950 mb-3.5 border border-slate-100">
                <div className="absolute top-2.5 right-2.5 z-20 bg-slate-900/75 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
                  Jalur Masuk
                </div>
                <div className="absolute top-2.5 left-2.5 z-20 bg-red-600/90 backdrop-blur-md text-white size-6 rounded-full flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-[12px] font-bold">play_arrow</span>
                </div>
                <img
                  src="https://img.youtube.com/vi/ghTNfJnyRQg/maxresdefault.jpg"
                  alt="JALUR PENERIMAAN MAHASISWA BARU"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 backdrop-blur-[2px] transition-all duration-500 flex items-center justify-center">
                  <div className="size-12 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-red-600/35 scale-90 group-hover:scale-100 transition-all duration-500 relative">
                    <span className="absolute inset-0 rounded-full bg-red-600/40 animate-ping"></span>
                    <span className="material-symbols-outlined text-[24px] font-black pl-0.5">play_arrow</span>
                  </div>
                </div>
              </div>
              <div className="px-1 flex-1 flex flex-col justify-between">
                <h3 className="text-[13px] font-extrabold text-slate-800 line-clamp-2 leading-snug group-hover:text-red-600 transition-colors">
                  Jalur Prestasi - Penerimaan Mahasiswa Baru Gelombang 1
                </h3>
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <span className="material-symbols-outlined text-[12px]">schedule</span>
                  Tonton Video
                </div>
              </div>
            </div>

            {/* Video 2 */}
            <div 
              onClick={() => setActiveVideoId('Ody81H1pK68')}
              className="group cursor-pointer flex flex-col bg-white rounded-3xl p-3 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-red-500/20 transition-all duration-500 hover:-translate-y-1.5"
            >
              <div className="relative rounded-2xl overflow-hidden aspect-video shadow-inner bg-slate-950 mb-3.5 border border-slate-100">
                <div className="absolute top-2.5 right-2.5 z-20 bg-slate-900/75 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
                  Profil Kampus
                </div>
                <div className="absolute top-2.5 left-2.5 z-20 bg-red-600/90 backdrop-blur-md text-white size-6 rounded-full flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-[12px] font-bold">play_arrow</span>
                </div>
                <img
                  src="https://img.youtube.com/vi/Ody81H1pK68/maxresdefault.jpg"
                  alt="Video Promosi Kampus"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 backdrop-blur-[2px] transition-all duration-500 flex items-center justify-center">
                  <div className="size-12 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-red-600/35 scale-90 group-hover:scale-100 transition-all duration-500 relative">
                    <span className="absolute inset-0 rounded-full bg-red-600/40 animate-ping"></span>
                    <span className="material-symbols-outlined text-[24px] font-black pl-0.5">play_arrow</span>
                  </div>
                </div>
              </div>
              <div className="px-1 flex-1 flex flex-col justify-between">
                <h3 className="text-[13px] font-extrabold text-slate-800 line-clamp-2 leading-snug group-hover:text-red-600 transition-colors">
                  Kuliah Nyaman, Fasilitas Lengkap, Tentu Hanya di UHTP
                </h3>
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <span className="material-symbols-outlined text-[12px]">schedule</span>
                  Tonton Video
                </div>
              </div>
            </div>

            {/* Video 3 */}
            <div 
              onClick={() => setActiveVideoId('lgjxMAQqt70')}
              className="group cursor-pointer flex flex-col bg-white rounded-3xl p-3 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-red-500/20 transition-all duration-500 hover:-translate-y-1.5"
            >
              <div className="relative rounded-2xl overflow-hidden aspect-video shadow-inner bg-slate-950 mb-3.5 border border-slate-100">
                <div className="absolute top-2.5 right-2.5 z-20 bg-slate-900/75 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
                  Podcast
                </div>
                <div className="absolute top-2.5 left-2.5 z-20 bg-red-600/90 backdrop-blur-md text-white size-6 rounded-full flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-[12px] font-bold">play_arrow</span>
                </div>
                <img
                  src="https://img.youtube.com/vi/lgjxMAQqt70/maxresdefault.jpg"
                  alt="Podcast Penerimaan Mahasiswa Baru"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 backdrop-blur-[2px] transition-all duration-500 flex items-center justify-center">
                  <div className="size-12 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-red-600/35 scale-90 group-hover:scale-100 transition-all duration-500 relative">
                    <span className="absolute inset-0 rounded-full bg-red-600/40 animate-ping"></span>
                    <span className="material-symbols-outlined text-[24px] font-black pl-0.5">play_arrow</span>
                  </div>
                </div>
              </div>
              <div className="px-1 flex-1 flex flex-col justify-between">
                <h3 className="text-[13px] font-extrabold text-slate-800 line-clamp-2 leading-snug group-hover:text-red-600 transition-colors">
                  Bincang-bincang Hangat Seputar Kampus (Podcast UHTP)
                </h3>
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <span className="material-symbols-outlined text-[12px]">schedule</span>
                  Tonton Video
                </div>
              </div>
            </div>

            {/* Video 4 */}
            <div 
              onClick={() => setActiveVideoId('aktuYTD5Slo')}
              className="group cursor-pointer flex flex-col bg-white rounded-3xl p-3 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-red-500/20 transition-all duration-500 hover:-translate-y-1.5"
            >
              <div className="relative rounded-2xl overflow-hidden aspect-video shadow-inner bg-slate-950 mb-3.5 border border-slate-100">
                <div className="absolute top-2.5 right-2.5 z-20 bg-slate-900/75 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
                  Aktivitas
                </div>
                <div className="absolute top-2.5 left-2.5 z-20 bg-red-600/90 backdrop-blur-md text-white size-6 rounded-full flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-[12px] font-bold">play_arrow</span>
                </div>
                <img
                  src="https://img.youtube.com/vi/aktuYTD5Slo/maxresdefault.jpg"
                  alt="Kegiatan Kampus"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 backdrop-blur-[2px] transition-all duration-500 flex items-center justify-center">
                  <div className="size-12 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-red-600/35 scale-90 group-hover:scale-100 transition-all duration-500 relative">
                    <span className="absolute inset-0 rounded-full bg-red-600/40 animate-ping"></span>
                    <span className="material-symbols-outlined text-[24px] font-black pl-0.5">play_arrow</span>
                  </div>
                </div>
              </div>
              <div className="px-1 flex-1 flex flex-col justify-between">
                <h3 className="text-[13px] font-extrabold text-slate-800 line-clamp-2 leading-snug group-hover:text-red-600 transition-colors">
                  Serunya Perkuliahan dan Praktik Mahasiswa UHTP
                </h3>
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <span className="material-symbols-outlined text-[12px]">schedule</span>
                  Tonton Video
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      {/* Footer */}
      <footer className="bg-[#00695C] border-t-2 border-[#D4AF37] pt-16 pb-8 text-white w-full font-sans overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12">
            
            {/* Column 1: Brand & Bio */}
            <div className="space-y-6">
              <div>
                <h4 className="font-display font-black text-xl tracking-tight text-white mb-1">
                  Universitas Hang Tuah
                </h4>
                <p className="font-bold text-xs uppercase tracking-widest text-amber-300 font-sans">
                  Pekanbaru
                </p>
              </div>
              <p className="text-sm text-teal-100/90 leading-relaxed font-medium">
                Terwujudnya Universitas Unggul dan menghasilkan lulusan sesuai kompetensi yang mampu bersaing di tingkat Asia Tenggara tahun 2036.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="size-9 rounded-xl bg-white/10 hover:bg-[#1877F2] text-white flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-[#1877F2]/20 hover:-translate-y-1" title="Facebook">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="size-9 rounded-xl bg-white/10 hover:bg-[#1DA1F2] text-white flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-[#1DA1F2]/20 hover:-translate-y-1" title="Twitter">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="size-9 rounded-xl bg-white/10 hover:bg-gradient-to-tr hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] text-white flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-pink-500/20 hover:-translate-y-1" title="Instagram">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.981 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="size-9 rounded-xl bg-white/10 hover:bg-[#0A66C2] text-white flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-[#0A66C2]/20 hover:-translate-y-1" title="LinkedIn">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="size-9 rounded-xl bg-white/10 hover:bg-[#FF0000] text-white flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-[#FF0000]/20 hover:-translate-y-1" title="YouTube">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Column 2: Tautan Akademik */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-white mb-6 border-l-2 border-[#D4AF37] pl-3">
                Link Cepat & Lembaga
              </h4>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm font-medium">
                <li>
                  <div className="text-teal-100 flex items-center gap-1.5 cursor-default select-none">
                    <span className="material-symbols-outlined text-[16px] text-amber-300">chevron_right</span>
                    SIAK Online
                  </div>
                </li>
                <li>
                  <div className="text-teal-100 flex items-center gap-1.5 cursor-default select-none">
                    <span className="material-symbols-outlined text-[16px] text-amber-300">chevron_right</span>
                    LP3M
                  </div>
                </li>
                <li>
                  <div className="text-teal-100 flex items-center gap-1.5 cursor-default select-none">
                    <span className="material-symbols-outlined text-[16px] text-amber-300">chevron_right</span>
                    Portal Terpadu
                  </div>
                </li>
                <li>
                  <div className="text-teal-100 flex items-center gap-1.5 cursor-default select-none">
                    <span className="material-symbols-outlined text-[16px] text-amber-300">chevron_right</span>
                    SPMI
                  </div>
                </li>
                <li>
                  <div className="text-teal-100 flex items-center gap-1.5 cursor-default select-none">
                    <span className="material-symbols-outlined text-[16px] text-amber-300">chevron_right</span>
                    SPMB Online
                  </div>
                </li>
                <li>
                  <div className="text-teal-100 flex items-center gap-1.5 cursor-default select-none">
                    <span className="material-symbols-outlined text-[16px] text-amber-300">chevron_right</span>
                    SPI
                  </div>
                </li>
                <li>
                  <div className="text-teal-100 flex items-center gap-1.5 cursor-default select-none col-span-2">
                    <span className="material-symbols-outlined text-[16px] text-amber-300">chevron_right</span>
                    Tracer Study
                  </div>
                </li>
              </ul>
            </div>

            {/* Column 3: Kontak */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-white mb-6 border-l-2 border-[#D4AF37] pl-3">
                Kontak Kami
              </h4>
              <div className="space-y-4 text-sm font-medium text-teal-100">
                <div className="flex items-start gap-3">
                  <div className="size-8 rounded-lg bg-white/10 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                    <span className="material-symbols-outlined text-[18px]">pin_drop</span>
                  </div>
                  <p className="leading-relaxed">Jl. Mustang No.1, Pekanbaru, Riau</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-lg bg-white/10 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                    <span className="material-symbols-outlined text-[18px]">phone</span>
                  </div>
                  <p>(0761) 33850</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-lg bg-white/10 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                    <span className="material-symbols-outlined text-[18px]">mail</span>
                  </div>
                  <p className="hover:text-white transition-colors"><a href="mailto:info@uhtp.ac.id">info@uhtp.ac.id</a></p>
                </div>
              </div>
            </div>

            {/* Column 4: Lokasi */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-white mb-6 border-l-2 border-[#D4AF37] pl-3">
                Lokasi Kampus
              </h4>
              <a
                href="https://maps.app.goo.gl/CrUtkJLdZstApLF96"
                target="_blank"
                rel="noopener noreferrer"
                className="block relative rounded-2xl overflow-hidden shadow-lg border border-white/10 hover:border-white/30 aspect-[4/3] group/map transition-all duration-300"
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
                <div className="absolute inset-0 bg-slate-950/0 group-hover/map:bg-slate-950/40 backdrop-blur-[1px] transition-all duration-300 flex items-center justify-center">
                  <div className="bg-[#D4AF37] text-teal-950 px-3.5 py-2 rounded-xl shadow-xl font-extrabold text-xs opacity-0 group-hover/map:opacity-100 transition-all duration-300 transform translate-y-2 group-hover/map:translate-y-0 flex items-center gap-1 hover:bg-amber-400">
                    Buka Google Maps
                    <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                  </div>
                </div>
              </a>
            </div>

          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-teal-100/50">
            <p>© 2026 Universitas Hang Tuah Pekanbaru. All Rights Reserved.</p>
            <p className="flex items-center gap-1">
              Dikembangkan oleh 
              <span className="text-teal-100 font-bold">Panitia SPMB UHTP</span>
            </p>
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
              className="absolute top-4 right-4 sm:top-8 sm:right-8 z-[110] size-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer"
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

      {/* Fullscreen Video Modal Overlay */}
      {
        activeVideoId && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 sm:p-8 animate-in fade-in duration-300"
            onClick={() => setActiveVideoId(undefined)}
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 sm:top-8 sm:right-8 z-[110] size-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setActiveVideoId(undefined);
              }}
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>

            {/* Video IFrame Container */}
            <div
              className="relative w-full max-w-4xl aspect-video rounded-3xl overflow-hidden shadow-2xl shadow-black/80 bg-black border border-white/10"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the video container itself
            >
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1&rel=0`}
                title="YouTube Video Player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )
      }
      {/* Login Modal Overlay */}
      {
        isLoginModalOpen && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 sm:p-8 animate-in fade-in duration-300"
            onClick={() => setIsLoginModalOpen(false)}
          >
            <div
              className="relative w-full max-w-[380px] bg-white rounded-3xl overflow-hidden shadow-2xl shadow-black/25 border border-slate-100 animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top Accent Gradient Line */}
              <div className="absolute top-0 inset-x-0 h-1.5" style={{ background: 'linear-gradient(90deg, #00857A, #D4AF37, #00695C)' }}></div>

              {/* Ambient Glow Decorative Blobs */}
              <div className="absolute -top-24 -left-24 size-48 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute -bottom-24 -right-24 size-48 bg-gold/10 rounded-full blur-3xl pointer-events-none"></div>

              {/* Close Button */}
              <button
                className="absolute top-3.5 right-3.5 z-30 size-9 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 hover:border-slate-300 text-slate-500 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm cursor-pointer"
                onClick={() => setIsLoginModalOpen(false)}
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>

              <div className="p-6 pt-10 relative z-10">
                <div className="mb-6 text-center">
                  {/* Premium Brand Icon Emblem */}
                  <div className="relative size-16 mx-auto mb-4 flex items-center justify-center">
                    <div className="absolute inset-0 bg-primary/5 rounded-2xl rotate-6 animate-pulse"></div>
                    <div className="absolute inset-0 bg-primary/10 rounded-2xl -rotate-6 transition-transform duration-500 group-hover:rotate-12"></div>
                    <div className="relative size-12 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20" style={{ background: 'linear-gradient(135deg, #00857A, #00695C)' }}>
                      <span className="material-symbols-outlined text-2.5xl font-light">account_circle</span>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-display font-extrabold text-slate-900 tracking-tight mb-1">
                    Login <span className="text-primary">Portal</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium max-w-[260px] mx-auto leading-relaxed">
                    Silakan masukkan email dan password Anda.
                  </p>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-4">
                  <div className="space-y-1.5 min-w-0">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email</label>
                    <div className="relative flex items-center group">
                      <span className="material-symbols-outlined absolute left-3.5 text-slate-400 text-[18px] transition-colors duration-300 group-focus-within:text-primary">mail</span>
                      <input
                        key={`login-email-${modalKey}`}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50/60 border border-slate-200/80 rounded-xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary text-sm font-medium transition-all duration-300 block shadow-sm hover:border-slate-300"
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
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Password</label>
                    <div className="relative flex items-center group">
                      <span className="material-symbols-outlined absolute left-3.5 text-slate-400 text-[18px] transition-colors duration-300 group-focus-within:text-primary">lock</span>
                      <input
                        key={`login-password-${modalKey}`}
                        className="w-full pl-10 pr-10 py-2.5 bg-slate-50/60 border border-slate-200/80 rounded-xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary text-sm font-medium transition-all duration-300 block shadow-sm hover:border-slate-300"
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
                        className="absolute right-3 text-slate-400 hover:text-slate-600 flex items-center justify-center p-1.5 rounded-xl hover:bg-slate-100 transition-all duration-200 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">{showPassword ? "visibility" : "visibility_off"}</span>
                      </button>
                    </div>
                  </div>

                  {loginError && (
                    <div className="bg-red-50/80 border border-red-100 text-red-600 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2 duration-300 shadow-sm">
                      <span className="material-symbols-outlined text-[18px] text-red-500">error</span>
                      <span className="leading-snug">{loginError}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input type="checkbox" className="size-4 rounded border-slate-300 text-primary focus:ring-primary/20 focus:ring-offset-0 transition-all duration-200 cursor-pointer" />
                      <span className="text-xs font-semibold text-slate-500 group-hover:text-slate-700 transition-colors">Ingat saya</span>
                    </label>
                    <button 
                      type="button"
                      onClick={() => {
                        setIsLoginModalOpen(false);
                        setIsForgotModalOpen(true);
                      }}
                      className="text-xs font-bold text-primary hover:text-primary-dark transition-colors bg-transparent border-none p-0 cursor-pointer hover:underline"
                    >
                      Lupa sandi?
                    </button>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isLoadingLogin} 
                    className="group relative w-full text-white font-bold text-sm py-3 rounded-xl shadow-lg shadow-primary/20 mt-3 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden cursor-pointer"
                    style={{ background: 'linear-gradient(90deg, #00857A, #00695C)' }}
                  >
                    <span className="absolute inset-0 w-full h-full bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></span>
                    <span className="relative flex items-center justify-center gap-2">
                      {isLoadingLogin ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Memproses...</span>
                        </>
                      ) : (
                        <>
                          <span>Masuk Sekarang</span>
                          <span className="material-symbols-outlined text-[16px] transition-transform duration-300 group-hover:translate-x-1">arrow_forward</span>
                        </>
                      )}
                    </span>
                  </button>
                </form>
                
                <div className="mt-6 text-center border-t border-slate-100 pt-4">
                  <p className="text-xs text-slate-500 font-medium">
                    Belum punya akun?{' '}
                    <button 
                      type="button" 
                      onClick={() => {
                        setIsLoginModalOpen(false); 
                        setIsRegisterModalOpen(true);
                      }} 
                      className="font-bold text-primary hover:text-primary-dark transition-colors bg-transparent border-none p-0 cursor-pointer inline-flex items-center gap-0.5 hover:underline"
                    >
                      Daftar di sini
                      <span className="material-symbols-outlined text-[12px] font-bold">arrow_forward</span>
                    </button>
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
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 sm:p-8 animate-in fade-in duration-300"
            onClick={() => setIsAdminLoginModalOpen(false)}
          >
            <div
              className="relative w-full max-w-[380px] bg-white rounded-3xl overflow-hidden shadow-2xl shadow-black/25 border border-slate-100 animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top Accent Gradient Line (Navy-themed) */}
              <div className="absolute top-0 inset-x-0 h-1.5" style={{ background: 'linear-gradient(90deg, #0f172a, #D4AF37, #1e293b)' }}></div>

              {/* Ambient Glow Decorative Blobs */}
              <div className="absolute -top-24 -left-24 size-48 bg-navy/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute -bottom-24 -right-24 size-48 bg-gold/10 rounded-full blur-3xl pointer-events-none"></div>

              {/* Close Button */}
              <button
                className="absolute top-3.5 right-3.5 z-30 size-9 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 hover:border-slate-300 text-slate-500 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm cursor-pointer"
                onClick={() => setIsAdminLoginModalOpen(false)}
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>

              <div className="p-6 pt-10 relative z-10">
                <div className="mb-6 text-center">
                  {/* Premium Admin Icon Emblem */}
                  <div className="relative size-16 mx-auto mb-4 flex items-center justify-center">
                    <div className="absolute inset-0 bg-navy/5 rounded-2xl rotate-6 animate-pulse"></div>
                    <div className="absolute inset-0 bg-navy/10 rounded-2xl -rotate-6 transition-transform duration-500 group-hover:rotate-12"></div>
                    <div className="relative size-12 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-navy/20" style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)' }}>
                      <span className="material-symbols-outlined text-2.5xl font-light">admin_panel_settings</span>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-display font-extrabold text-slate-900 tracking-tight mb-1">
                    Admin <span className="text-navy">Portal</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium max-w-[260px] mx-auto leading-relaxed">
                    Masuk untuk memverifikasi pembayaran.
                  </p>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleAdminLogin(); }} className="space-y-4">
                  <div className="space-y-1.5 min-w-0">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email Admin</label>
                    <div className="relative flex items-center group">
                      <span className="material-symbols-outlined absolute left-3.5 text-slate-400 text-[18px] transition-colors duration-300 group-focus-within:text-navy">mail</span>
                      <input
                        key={`admin-email-${modalKey}`}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50/60 border border-slate-200/80 rounded-xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-navy/10 focus:border-navy text-sm font-medium transition-all duration-300 block shadow-sm hover:border-slate-300"
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
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Password</label>
                    <div className="relative flex items-center group">
                      <span className="material-symbols-outlined absolute left-3.5 text-slate-400 text-[18px] transition-colors duration-300 group-focus-within:text-navy">lock</span>
                      <input
                        key={`admin-password-${modalKey}`}
                        className="w-full pl-10 pr-10 py-2.5 bg-slate-50/60 border border-slate-200/80 rounded-xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-navy/10 focus:border-navy text-sm font-medium transition-all duration-300 block shadow-sm hover:border-slate-300"
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
                        className="absolute right-3 text-slate-400 hover:text-slate-600 flex items-center justify-center p-1.5 rounded-xl hover:bg-slate-100 transition-all duration-200 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">{showPassword ? "visibility" : "visibility_off"}</span>
                      </button>
                    </div>
                  </div>

                  {adminLoginError && (
                    <div className="bg-red-50/80 border border-red-100 text-red-600 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2 duration-300 shadow-sm">
                      <span className="material-symbols-outlined text-[18px] text-red-500">error</span>
                      <span className="leading-snug">{adminLoginError}</span>
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={isLoadingAdminLogin} 
                    className="group relative w-full text-white font-bold text-sm py-3 rounded-xl shadow-lg shadow-navy/20 mt-3 transition-all duration-300 hover:shadow-xl hover:shadow-navy/30 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden cursor-pointer"
                    style={{ background: 'linear-gradient(90deg, #0f172a, #1e293b)' }}
                  >
                    <span className="absolute inset-0 w-full h-full bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></span>
                    <span className="relative flex items-center justify-center gap-2">
                      {isLoadingAdminLogin ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Memproses...</span>
                        </>
                      ) : (
                        <>
                          <span>Login Admin</span>
                          <span className="material-symbols-outlined text-[16px] transition-transform duration-300 group-hover:translate-x-1">login</span>
                        </>
                      )}
                    </span>
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
              <div className="bg-slate-50 p-6 sm:p-8 border-b border-slate-200/60 relative shrink-0">
                <button
                  className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 size-10 bg-white hover:bg-slate-50 text-slate-600 rounded-full flex items-center justify-center shadow-sm border border-slate-150 transition-all hover:scale-105"
                  onClick={() => setIsRegisterModalOpen(false)}
                >
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>
                <div className="flex items-center gap-3 text-[#00857A] font-extrabold mb-5 font-display">
                  <div className="size-10 rounded-xl bg-[#00857A]/10 flex items-center justify-center text-[#00857A]">
                    <span className="material-symbols-outlined text-xl">info</span>
                  </div>
                  <h3 className="text-lg sm:text-xl tracking-tight font-bold">Informasi Program RPL</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 text-sm leading-relaxed">
                  {/* Card 1 */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-[#00857A]/20 transition-all duration-300 flex flex-col justify-between">
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-[14px] sm:text-[15px] flex items-center gap-1.5 mb-2 font-display">
                        <span className="material-symbols-outlined text-[18px] text-[#00857A]">school</span>
                        RPL A1 (Transfer SKS)
                      </h4>
                      <span className="inline-block text-[9px] font-black uppercase tracking-wider bg-emerald-50 text-[#00857A] border border-emerald-100/50 px-2.5 py-0.5 rounded-md w-fit mb-4">
                        Lulusan D3 ke S1
                      </span>
                      <ul className="space-y-2 text-[12px] font-medium text-slate-600">
                        <li className="flex items-start gap-2">
                          <span className="material-symbols-outlined text-[15px] text-emerald-600 shrink-0 mt-0.5">check_circle</span>
                          Lulusan D3 / Pernah Kuliah
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="material-symbols-outlined text-[15px] text-emerald-600 shrink-0 mt-0.5">check_circle</span>
                          Lama Kuliah Minimal 3 Semester
                        </li>
                      </ul>
                    </div>
                  </div>
                  {/* Card 2 */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-[#00857A]/20 transition-all duration-300 flex flex-col justify-between">
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-[14px] sm:text-[15px] flex items-center gap-1.5 mb-2 font-display">
                        <span className="material-symbols-outlined text-[18px] text-[#00857A]">work</span>
                        RPL A2 (Perolehan SKS)
                      </h4>
                      <span className="inline-block text-[9px] font-black uppercase tracking-wider bg-emerald-50 text-[#00857A] border border-emerald-100/50 px-2.5 py-0.5 rounded-md w-fit mb-4">
                        Lulusan D3 ke S1
                      </span>
                      <ul className="space-y-2 text-[12px] font-medium text-slate-600">
                        <li className="flex items-start gap-2">
                          <span className="material-symbols-outlined text-[15px] text-emerald-600 shrink-0 mt-0.5">check_circle</span>
                          Sudah Bekerja Minimal 2 Tahun
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="material-symbols-outlined text-[15px] text-emerald-600 shrink-0 mt-0.5">check_circle</span>
                          Lama Kuliah Minimal 2 Semester
                        </li>
                      </ul>
                    </div>
                  </div>
                  {/* Card 3 */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-[#00857A]/20 transition-all duration-300 flex flex-col justify-between">
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-[14px] sm:text-[15px] flex items-center gap-1.5 mb-2 font-display">
                        <span className="material-symbols-outlined text-[18px] text-[#00857A]">trending_up</span>
                        RPL Lanjutan S2
                      </h4>
                      <span className="inline-block text-[9px] font-black uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-100/50 px-2.5 py-0.5 rounded-md w-fit mb-4">
                        Lulusan S1/D4 ke S2
                      </span>
                      <ul className="space-y-2 text-[12px] font-medium text-slate-600">
                        <li className="flex items-start gap-2">
                          <span className="material-symbols-outlined text-[15px] text-emerald-600 shrink-0 mt-0.5">check_circle</span>
                          Punya Pengalaman Kerja
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="material-symbols-outlined text-[15px] text-emerald-600 shrink-0 mt-0.5">check_circle</span>
                          Lama Kuliah Minimal 2 Semester
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <form onSubmit={(e) => { e.preventDefault(); handleRegister(); }} className="p-6 sm:p-8 overflow-y-auto bg-white flex flex-col min-h-0">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-slate-900 font-display">Form Pendaftaran Akun</h3>
                  <p className="text-sm text-slate-500 font-medium">Silakan lengkapi formulir di bawah ini dengan data yang valid.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  {/* Left Column */}
                  <div className="space-y-5">
                    <div className="flex flex-col gap-1.5 min-w-0">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Lengkap</label>
                      <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Masukkan nama Anda" autoComplete="off" className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#00857A]/10 focus:border-[#00857A] text-sm font-medium transition-all hover:border-slate-300" />
                      <p className="text-[11px] text-slate-400 mt-1.5 font-medium flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px] text-slate-400/80">info</span>Nama lengkap tanpa gelar akademik</p>
                    </div>
                    <div className="flex flex-col gap-1.5 min-w-0">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">NIK (Nomor Induk Kependudukan)</label>
                      <input type="text" name="nik" value={formData.nik} onChange={handleInputChange} placeholder="16 Digit NIK" autoComplete="off" className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#00857A]/10 focus:border-[#00857A] text-sm font-medium transition-all hover:border-slate-300" />
                      <p className="text-[11px] text-slate-400 mt-1.5 font-medium flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px] text-slate-400/80">info</span>Sesuai dengan KTP/Kartu Keluarga</p>
                    </div>
                    {/* Pilihan */}
                    <div className="flex flex-col gap-1.5 min-w-0 relative">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Program Studi Pilihan</label>
                      <div className="relative">
                        <select name="program_studi" value={formData.program_studi} onChange={handleInputChange} className="appearance-none w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#00857A]/10 focus:border-[#00857A] text-sm font-medium transition-all cursor-pointer pr-10 hover:border-slate-300">
                          <option value="">- Pilih Program Studi -</option>
                          {prodiList.map((prodiName) => (
                            <option key={prodiName} value={prodiName}>{prodiName}</option>
                          ))}
                        </select>
                        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[20px]">keyboard_arrow_down</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5 min-w-0">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Alamat Email</label>
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="email@anda.com" autoComplete="off" className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#00857A]/10 focus:border-[#00857A] text-sm font-medium transition-all hover:border-slate-300" />
                      <p className="text-[11px] text-slate-400 mt-1.5 font-medium flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px] text-slate-400/80">info</span>Gunakan email yang valid dan aktif</p>
                    </div>
                    <div className="flex flex-col gap-1.5 min-w-0">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nomor Handphone / WA</label>
                      <input type="text" name="no_hp" value={formData.no_hp} onChange={handleInputChange} placeholder="08xxxxxxxxxx" autoComplete="off" className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#00857A]/10 focus:border-[#00857A] text-sm font-medium transition-all hover:border-slate-300" />
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-5 pt-1 md:pt-0 flex flex-col">
                    <div className="flex flex-col gap-1.5 min-w-0">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Buat Password</label>
                      <input type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="Minimal 8 karakter" autoComplete="new-password" className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#00857A]/10 focus:border-[#00857A] text-sm font-medium transition-all hover:border-slate-300" />
                    </div>
                    <div className="flex flex-col gap-1.5 min-w-0 relative">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gelombang Pendaftaran</label>
                      <div className="relative">
                        <select name="gelombang" value={formData.gelombang} onChange={handleInputChange} className="appearance-none w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#00857A]/10 focus:border-[#00857A] text-sm font-medium transition-all cursor-pointer pr-10 hover:border-slate-300">
                          <option>20263</option>
                          <option>20264</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[20px]">keyboard_arrow_down</span>
                      </div>
                    </div>
                    {/* Sumber Informasi */}
                    <div className="flex flex-col gap-1.5 min-w-0 relative">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sumber Informasi</label>
                      <div className="relative">
                        <select name="sumber_informasi" value={formData.sumber_informasi} onChange={handleInputChange} className="appearance-none w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#00857A]/10 focus:border-[#00857A] text-sm font-medium transition-all cursor-pointer pr-10 hover:border-slate-300">
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
                        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[20px]">keyboard_arrow_down</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1.5 font-medium flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px] text-slate-400/80">info</span>Dari mana Anda mengetahui UHTP?</p>
                    </div>
                    
                    <div className="flex flex-col gap-1.5 min-w-0 pt-2 flex-grow">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Verifikasi Keamanan</label>
                      <div className="flex items-end gap-3 w-full">
                        <div className="flex-1">
                          <input type="text" name="kode_keamanan_input" value={formData.kode_keamanan_input} onChange={handleInputChange} placeholder="Ketik kode di samping" className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#00857A]/10 focus:border-[#00857A] text-sm font-medium transition-all h-[52px] hover:border-slate-300" />
                        </div>
                        <div className="w-[120px] h-[52px] bg-slate-900 text-white font-mono tracking-[0.2em] rounded-xl shadow-inner font-bold text-xl relative overflow-hidden flex items-center justify-center select-none shrink-0 border border-slate-800">
                          <div className="absolute inset-0 top-1/2 w-full h-[1px] bg-white opacity-20 pointer-events-none"></div>
                          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white transform -rotate-6 origin-left z-10 opacity-20 pointer-events-none"></div>
                          <div className="absolute top-1/3 left-0 w-full h-[1px] bg-white transform rotate-3 origin-left z-10 opacity-20 pointer-events-none"></div>
                          <span className="relative z-20 mix-blend-screen opacity-90">{captchaCode}</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1.5 font-medium flex items-center justify-between">
                        <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px] text-slate-400/80">info</span>Perhatikan huruf besar/kecil</span>
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
              className="relative w-full max-w-[380px] bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                className="absolute top-3.5 right-3.5 z-10 size-9 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full flex items-center justify-center transition-colors"
                onClick={() => setIsForgotModalOpen(false)}
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>

              <div className="p-6 pt-8">
                <div className="mb-6 text-center">
                  <div className="size-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="material-symbols-outlined text-2xl">lock_reset</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">Lupa Sandi?</h3>
                  <p className="text-xs text-slate-500 font-medium">Verifikasi data Anda untuk meriset password.</p>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleForgotPassword(); }} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">Email Terdaftar</label>
                    <input
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-medium"
                      placeholder="email@anda.com"
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">NIK (Sesuai KTP)</label>
                    <input
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-medium"
                      placeholder="16 Digit NIK"
                      type="text"
                      value={forgotNik}
                      onChange={(e) => setForgotNik(e.target.value.replace(/[^0-9]/g, '').slice(0, 16))}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">Password Baru</label>
                    <input
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-medium"
                      placeholder="Min. 8 Karakter"
                      type="password"
                      value={forgotNewPassword}
                      onChange={(e) => setForgotNewPassword(e.target.value)}
                    />
                  </div>

                  {forgotError && (
                    <div className="bg-red-50 text-red-600 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px]">error</span>
                      {forgotError}
                    </div>
                  )}

                  {forgotSuccess && (
                    <div className="bg-emerald-50 text-emerald-600 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px]">check_circle</span>
                      {forgotSuccess}
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={forgotSuccess !== '' || isLoadingForgot} 
                    className="w-full bg-primary text-white font-bold text-sm py-3 rounded-xl shadow-lg shadow-primary/30 mt-4 hover:-translate-y-0.5 transition-all disabled:opacity-50"
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