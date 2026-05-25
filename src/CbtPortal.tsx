import React, { useState, lazy, Suspense } from 'react';
import CbtLogin from './CbtLogin';
import LoadingSpinner from './components/LoadingSpinner';
import { API_BASE_URL } from './config';

const CbtStudentDashboard = lazy(() => import('./CbtStudentDashboard'));
const CbtAdminDashboard = lazy(() => import('./CbtAdminDashboard'));
const CbtExamSession = lazy(() => import('./CbtExamSession'));

interface CbtPortalProps {
  onBack: () => void;
  photoUrl?: string;
  studentName?: string;
  major?: string;
  onSelectRole: (role: 'peserta' | 'panitia') => void;
}

const CbtPortal: React.FC<CbtPortalProps> = ({ onBack, photoUrl, studentName, major, onSelectRole }) => {
  const [view, setView] = useState<'selection' | 'login-peserta' | 'login-panitia' | 'student-dashboard' | 'admin-dashboard' | 'exam-page'>(() => {
    return (sessionStorage.getItem('cbt_view') as any) || 'selection';
  });
  const [examNumber, setExamNumber] = useState(() => {
    return sessionStorage.getItem('cbt_exam_number') || '';
  });
  const [adminName, setAdminName] = useState(() => {
    return sessionStorage.getItem('cbt_admin_name') || 'Administrator';
  });
  const [hasFinishedExam, setHasFinishedExam] = useState(() => {
    return sessionStorage.getItem(`cbt_finished_${examNumber}`) === 'true';
  });
  const [schedule, setSchedule] = useState<any>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Persist state to sessionStorage whenever it changes
  React.useEffect(() => {
    sessionStorage.setItem('cbt_view', view);
    sessionStorage.setItem('cbt_exam_number', examNumber);
    sessionStorage.setItem('cbt_admin_name', adminName);
    if (examNumber) {
      sessionStorage.setItem(`cbt_finished_${examNumber}`, hasFinishedExam.toString());
    }
  }, [view, examNumber, adminName, hasFinishedExam]);

  const [realStudentName, setRealStudentName] = useState(studentName || '');
  const [realMajor, setRealMajor] = useState(major || '');

  // Sinkronisasi Status Ujian & Jadwal & Nama
  React.useEffect(() => {
    const syncData = async () => {
      if (examNumber && (view === 'student-dashboard' || view === 'exam-page')) {
        try {
          // 1. Cek status selesai & gelombang & data diri
          const response = await fetch(`${API_BASE_URL}/api/exam/check-status/${examNumber}`);
          const data = await response.json();
          // Pertahankan status 'true' jika secara lokal sudah selesai, untuk mencegah reset karena latensi backend
          setHasFinishedExam(data.is_finished || false);
          if (data.nama_peserta) setRealStudentName(data.nama_peserta);
          if (data.program_studi) setRealMajor(data.program_studi);
          
          // 2. Ambil jadwal berdasarkan gelombang
          const gelombang = data.gelombang || '20263';
          const scheduleResponse = await fetch(`${API_BASE_URL}/api/jadwal`);
          const schedules = await scheduleResponse.json();
          const activeSchedule = schedules.find((s: any) => s.gelombang === gelombang);
          if (activeSchedule) {
            setSchedule(activeSchedule);
          }
        } catch (err) {
          console.error("Gagal sinkron data:", err);
        }
      }
    };
    syncData();
  }, [examNumber, view]);

  // Fallback values if not provided via props (e.g. from manual login)
  const displayStudentName = realStudentName || studentName || "M LUKMAN HAKIM";
  const displayMajor = realMajor || major || "S1 SI Program Reguler";

  const getExamJalur = (majorName: string) => {
    if (!majorName) return "Jalur A";
    const name = majorName.toLowerCase();
    if (name.includes("ners")) return "NERS";
    if (name.includes("profesi bidan")) return "Profesi Bidan";
    if (name.includes("pasca") || name.includes("s2") || name.includes("magister")) return "Pasca";
    if (name.includes("stmik")) return "STMIK";
    if (name.includes("beasiswa") || name.includes("jalur b")) return "Jalur B";
    return "Jalur A";
  };
  const displayJalur = getExamJalur(displayMajor);

  const handleSelectRole = (role: 'peserta' | 'panitia') => {
    setView(role === 'peserta' ? 'login-peserta' : 'login-panitia');
  };

  const handleLogin = (identifier: string) => {
    console.log('Logging in with:', identifier);
    if (view === 'login-peserta') {
      setExamNumber(identifier);
      setView('student-dashboard');
    } else if (view === 'login-panitia') {
      setAdminName(identifier);
      setView('admin-dashboard');
    } else {
      onSelectRole('panitia');
    }
  };

  const handleLogout = () => {
    setView('selection');
    setExamNumber('');
    setAdminName('Administrator');
    sessionStorage.removeItem('cbt_view');
    sessionStorage.removeItem('cbt_exam_number');
    sessionStorage.removeItem('cbt_admin_name');
    sessionStorage.removeItem('app_show_cbt'); // Ensure it returns to landing page on refresh
    onBack(); // Return to main landing page
  };

  const handleStartExam = () => {
    console.log('Starting exam for:', examNumber);
    setView('exam-page');
  };

  const saveExamResult = async (score: number, details: any[]) => {
    try {
      sessionStorage.setItem(`cbt_details_${examNumber}`, JSON.stringify(details));
      await fetch(`${API_BASE_URL}/api/admin/kesehatan/update-skor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          no_ujian: examNumber,
          skor: score,
          details: details // Mengirim detail jawaban ke server
        })
      });
    } catch (error) {
      console.error('Error saving exam result:', error);
    }
  };

  return (
    <div className={`min-h-screen bg-[#0a4a3c] flex ${(view === 'student-dashboard' || view === 'admin-dashboard' || view === 'exam-page') ? '' : 'items-center justify-center p-6'} font-sans relative overflow-hidden`}>
      {/* Background Decorative Elements (Smoothing) */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-emerald-400/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-black/10 rounded-full blur-[120px]"></div>

      {/* Back Button (Only visible on selection and login views) */}
      {(view === 'selection' || view === 'login-peserta' || view === 'login-panitia') && (
        <button 
          onClick={view === 'selection' ? onBack : () => setView('selection')}
          className="absolute top-6 left-6 size-12 flex items-center justify-center text-white hover:text-emerald-100 transition-all group z-20 bg-black/30 hover:bg-black/50 rounded-2xl backdrop-blur-md border border-white/10 shadow-2xl"
          title="Kembali"
        >
          <span className="material-symbols-outlined text-[24px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
        </button>
      )}

      <div className={`w-full flex ${(view === 'student-dashboard' || view === 'admin-dashboard' || view === 'exam-page') ? '' : 'justify-center'} relative z-10 ${view === 'exam-page' ? 'h-screen' : ''}`}>
        {view === 'selection' && (
          <div className="w-full max-w-md animate-in fade-in zoom-in duration-700">
            {/* Main Card */}
            <div className="bg-slate-50/95 backdrop-blur-xl rounded-[40px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)] overflow-hidden border border-white/10">
              
              {/* Header Section */}
              <div className="pt-10 pb-6 px-10 text-center">
                <div className="inline-block p-4 bg-white/50 rounded-[24px] mb-5 shadow-sm">
                  <img 
                    src="/logo-uhtp.png" 
                    alt="Logo UHTP" 
                    className="h-16 w-auto object-contain"
                  />
                </div>
                <h1 className="text-4xl font-black text-slate-700 mb-1 tracking-tighter">
                  CBT <span className="text-emerald-700">PORTAL</span>
                </h1>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">
                  Universitas Hang Tuah Pekanbaru
                </p>
                <div className="h-1 w-10 bg-emerald-700 mx-auto rounded-full"></div>
              </div>

              {/* Role Selection Section */}
              <div className="px-10 pb-10">
                <p className="text-center text-slate-500 text-[13px] font-medium mb-8 leading-relaxed">Pilih akses masuk untuk memulai sesi ujian online</p>
                
                <div className="grid grid-cols-2 gap-5">
                  <button 
                    onClick={() => handleSelectRole('peserta')}
                    className="group relative flex flex-col items-center p-6 rounded-[28px] bg-white/50 border-2 border-transparent hover:border-emerald-600/50 hover:bg-white hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300"
                  >
                    <div className="size-16 bg-emerald-50 text-emerald-700 rounded-[20px] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                      <span className="material-symbols-outlined text-[36px]">school</span>
                    </div>
                    <span className="text-[12px] font-bold text-slate-700 group-hover:text-emerald-600 transition-colors uppercase tracking-wider">Peserta</span>
                  </button>

                  <button 
                    onClick={() => handleSelectRole('panitia')}
                    className="group relative flex flex-col items-center p-6 rounded-[28px] bg-white/50 border-2 border-transparent hover:border-emerald-600/50 hover:bg-white hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300"
                  >
                    <div className="size-16 bg-slate-100 text-slate-500 rounded-[20px] flex items-center justify-center mb-4 group-hover:bg-emerald-50 group-hover:text-emerald-700 group-hover:scale-110 transition-all duration-500">
                      <span className="material-symbols-outlined text-[36px]">admin_panel_settings</span>
                    </div>
                    <span className="text-[12px] font-bold text-slate-700 group-hover:text-emerald-600 transition-colors uppercase tracking-wider">Panitia</span>
                  </button>
                </div>
              </div>

              {/* Footer inside Card */}
              <div className="bg-slate-50/80 border-t border-slate-100 py-6 px-10">
                <div className="flex flex-col items-center gap-5">
                  <div className="flex justify-center gap-4">
                    {[
                      { icon: 'facebook-f', url: 'https://www.facebook.com/uhtp.ac.id' },
                      { icon: 'instagram', url: 'https://www.instagram.com/univ_hantuahpekanbaru' },
                      { icon: 'twitter', url: 'https://twitter.com/uhtp_pekanbaru' },
                      { icon: 'youtube', url: 'https://www.youtube.com/@uhtpofficial' }
                    ].map((item) => (
                      <a 
                        key={item.icon} 
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="size-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:border-emerald-200 hover:shadow-md transition-all"
                      >
                        <i className={`fab fa-${item.icon} text-xs`}></i>
                      </a>
                    ))}
                  </div>
                  <div className="text-center">
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.1em]">
                      &copy; 2026 UHTP • Excellence in Education
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {(view === 'login-peserta' || view === 'login-panitia') && (
          <CbtLogin 
            key={view === 'login-peserta' ? 'peserta' : 'panitia'} 
            role={view === 'login-peserta' ? 'peserta' : 'panitia'} 
            onBack={() => setView('selection')}
            onLogin={handleLogin}
          />
        )}

        {view === 'student-dashboard' && (
          <Suspense fallback={<LoadingSpinner />}>
            <CbtStudentDashboard 
              noUjian={examNumber}
              studentName={displayStudentName}
              major={displayMajor}
              photoUrl={photoUrl}
              hasFinishedExam={hasFinishedExam}
              onLogout={() => setShowLogoutModal(true)}
              onStartExam={handleStartExam}
            />
          </Suspense>
        )}

        {view === 'admin-dashboard' && (
          <Suspense fallback={<LoadingSpinner />}>
            <CbtAdminDashboard 
              adminName={adminName}
              onLogout={() => setShowLogoutModal(true)}
            />
          </Suspense>
        )}

        {view === 'exam-page' && (
          <Suspense fallback={<LoadingSpinner />}>
            <CbtExamSession 
              noUjian={examNumber}
              studentName={displayStudentName}
              jalur={displayJalur} // Disinkronkan dengan kategori di Admin
              globalEndTime={schedule ? `${schedule.tanggal_ujian}T${schedule.jam_berakhir}` : undefined}
              onFinish={(score, details) => {
                saveExamResult(score, details);
                alert('Ujian Selesai! Jawaban Anda telah tersimpan.');
                setHasFinishedExam(true);
                setView('student-dashboard');
              }}
            />
          </Suspense>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowLogoutModal(false)}></div>
          <div className="relative bg-white rounded-[32px] w-full max-w-sm p-8 z-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="size-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-[32px]">logout</span>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Konfirmasi Keluar</h3>
            <p className="text-sm text-slate-500 mb-8 leading-relaxed">
              Apakah Anda yakin ingin keluar dari portal CBT?
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-6 py-3 border border-slate-200 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-50 transition-colors uppercase tracking-wider"
              >
                Batal
              </button>
              <button 
                onClick={() => {
                  setShowLogoutModal(false);
                  handleLogout();
                }}
                className="flex-1 px-6 py-3 bg-rose-600 text-white font-bold text-xs rounded-xl hover:bg-rose-700 transition-all uppercase tracking-wider shadow-lg shadow-rose-600/20"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      <p className="absolute bottom-6 left-0 right-0 text-center text-white/40 text-[8px] font-bold uppercase tracking-[0.4em]">
        Computer Based Test Platform
      </p>
    </div>
  );
};

export default CbtPortal;
