import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { API_BASE_URL } from './config';

interface CbtStudentDashboardProps {
  noUjian: string;
  studentName: string;
  major: string;
  photoUrl?: string; // Added photoUrl prop
  hasFinishedExam?: boolean;
  onLogout: () => void;
  onStartExam: () => void;
}

const CbtStudentDashboard: React.FC<CbtStudentDashboardProps> = ({ noUjian, studentName, major, photoUrl, hasFinishedExam, onLogout, onStartExam }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [healthStatus, setHealthStatus] = useState<string | null>(null);
  const [schedule, setSchedule] = useState<any>(null);
  const [studentGelombang, setStudentGelombang] = useState<string>('-');
  const [isLoadingSchedule, setIsLoadingSchedule] = useState(true);
  const [currentView, setCurrentView] = useState<'dashboard' | 'kesehatan' | 'wawancara' | 'registrasi' | 'pengumuman'>('dashboard');
  const [hasilWawancara, setHasilWawancara] = useState<string | null>(null);
  const [statusRegistrasi, setStatusRegistrasi] = useState<string>('Belum Registrasi');
  const [buktiRegistrasiPath, setBuktiRegistrasiPath] = useState<string | null>(null);
  const [birthPlace, setBirthPlace] = useState<string>('-');
  const [birthDate, setBirthDate] = useState<string>('-');
  const [studentNisn, setStudentNisn] = useState<string>('-');
  
  const hasWawancara = ['keperawatan', 'ners', 'kebidanan', 'bidan'].some((p: string) => major?.toLowerCase().includes(p));
  
  // Health Form State
  const [healthForm, setHealthForm] = useState({
    tinggi_badan: '',
    golongan_darah: '',
    buta_warna: 'Tidak Buta Warna',
    visus: '',
    tekanan_darah: '',
    riwayat_penyakit: '',
  });
  const [buktiFile, setBuktiFile] = useState<File | null>(null);
  const [isSubmittingHealth, setIsSubmittingHealth] = useState(false);

  // Wawancara Form State
  const [wawancaraQuestions, setWawancaraQuestions] = useState<any[]>([]);
  const [wawancaraAnswers, setWawancaraAnswers] = useState<Record<number, string>>({});
  const [isLoadingWawancara, setIsLoadingWawancara] = useState(false);
  const [isSubmittingWawancara, setIsSubmittingWawancara] = useState(false);
  
  // Registrasi State
  const [buktiRegistrasiFile, setBuktiRegistrasiFile] = useState<File | null>(null);
  const [isSubmittingRegistrasi, setIsSubmittingRegistrasi] = useState(false);

  // Dynamic Exam Status
  const isExamOpen = React.useMemo(() => {
    if (isLoadingSchedule) return false;
    if (!schedule) return false; // Tutup jika tidak ada jadwal yang diseting
    
    const startTime = new Date(schedule.tanggal_ujian + 'T' + schedule.jam_mulai);
    const endTime = new Date(schedule.tanggal_ujian + 'T' + schedule.jam_berakhir);
    
    return currentTime >= startTime && currentTime <= endTime;
  }, [currentTime, schedule, isLoadingSchedule]);

  const examMessage = React.useMemo(() => {
    if (isLoadingSchedule) return 'Mengecek Jadwal...';
    
    if (!schedule) {
      return 'Jadwal Ujian Belum Tersedia';
    }
    
    const startTime = new Date(schedule.tanggal_ujian + 'T' + schedule.jam_mulai);
    const endTime = new Date(schedule.tanggal_ujian + 'T' + schedule.jam_berakhir);
    
    if (currentTime < startTime) {
      return `Belum Dimulai (Jam ${schedule.jam_mulai} - ${schedule.jam_berakhir})`;
    }
    
    if (currentTime > endTime) {
      if (hasFinishedExam) return 'Ujian Telah Selesai';
      return 'Jadwal Ujian Belum Tersedia';
    }
    
    return 'Mulai Ujian Sekarang';
  }, [currentTime, schedule, isLoadingSchedule, hasFinishedExam]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingSchedule(true);
      try {
        // 1. Fetch Student Status & Health
        const statusResponse = await fetch(`${API_BASE_URL}/api/exam/check-status/${noUjian}`);
        const statusData = await statusResponse.json();
        
        if (statusData.status_kesehatan) {
          setHealthStatus(statusData.status_kesehatan);
        }
        if (statusData.gelombang) {
          setStudentGelombang(statusData.gelombang);
        }
        if (statusData.hasil_wawancara) {
          setHasilWawancara(statusData.hasil_wawancara);
        }
        if (statusData.status_registrasi) {
          setStatusRegistrasi(statusData.status_registrasi);
        }
        if (statusData.bukti_registrasi_path) {
          setBuktiRegistrasiPath(statusData.bukti_registrasi_path);
        }
        if (statusData.tempat_lahir) {
          setBirthPlace(statusData.tempat_lahir);
        }
        if (statusData.tanggal_lahir) {
          setBirthDate(statusData.tanggal_lahir);
        }
        if (statusData.nisn) {
          setStudentNisn(statusData.nisn);
        }

        // 2. Fetch Exam Schedule
        const gelombang = statusData.gelombang || '20263';
        const scheduleResponse = await fetch(`${API_BASE_URL}/api/jadwal`);
        const schedules = await scheduleResponse.json();
        
        const activeSchedule = schedules.find((s: { gelombang: string }) => s.gelombang === gelombang);
        
        if (activeSchedule) {
          setSchedule(activeSchedule);
        }
      } catch (err) {
        console.error("Gagal ambil data:", err);
      } finally {
        setIsLoadingSchedule(false);
      }
    };
    fetchData();
  }, [noUjian, hasFinishedExam]);

  const fetchWawancaraQuestions = useCallback(async () => {
    setIsLoadingWawancara(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/soal?soal_untuk=Soal+Wawancara&prodi=${encodeURIComponent(major)}`);
      const data = await response.json();
      setWawancaraQuestions(data);
    } catch (error) {
      console.error('Error fetching interview questions:', error);
    } finally {
      setIsLoadingWawancara(false);
    }
  }, [major]);

  useEffect(() => {
    if (currentView === 'wawancara') {
      fetchWawancaraQuestions();
    }
  }, [currentView, fetchWawancaraQuestions]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  
  const handlePrintSKL = () => {
    document.body.classList.add('printing-skl');
    window.print();
    setTimeout(() => {
      document.body.classList.remove('printing-skl');
    }, 1000);
  };

  const handlePrintKwitansi = () => {
    document.body.classList.add('printing-receipt');
    window.print();
    setTimeout(() => {
      document.body.classList.remove('printing-receipt');
    }, 1000);
  };

  const angkaKeTerbilang = (angka: number): string => {
    const words = ["", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan", "Sepuluh", "Sebelas"];
    if (angka < 12) return words[angka];
    if (angka < 20) return angkaKeTerbilang(angka - 10) + " Belas";
    if (angka < 100) return angkaKeTerbilang(Math.floor(angka / 10)) + " Puluh " + angkaKeTerbilang(angka % 10);
    if (angka < 200) return "Seratus " + angkaKeTerbilang(angka - 100);
    if (angka < 1000) return angkaKeTerbilang(Math.floor(angka / 100)) + " Ratus " + angkaKeTerbilang(angka % 100);
    if (angka < 2000) return "Seribu " + angkaKeTerbilang(angka - 1000);
    if (angka < 1000000) return angkaKeTerbilang(Math.floor(angka / 1000)) + " Ribu " + angkaKeTerbilang(angka % 1000);
    if (angka < 1000000000) return angkaKeTerbilang(Math.floor(angka / 1000000)) + " Juta " + angkaKeTerbilang(angka % 1000000);
    return "";
  };

  const formattedTime = currentTime.toLocaleString('id-ID', { 
    day: '2-digit', month: 'long', year: 'numeric', 
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });

  const handleHealthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingHealth(true);
    
    try {
      const formData = new FormData();
      formData.append('no_ujian', noUjian);
      Object.entries(healthForm).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (buktiFile) {
        formData.append('bukti_kesehatan', buktiFile);
      }

      const response = await fetch(`${API_BASE_URL}/api/exam/kesehatan/store`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Data kesehatan berhasil disimpan!');
        setCurrentView('dashboard');
        // Refresh status
        window.location.reload();
      } else {
        alert('Gagal menyimpan data kesehatan.');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan koneksi.');
    } finally {
      setIsSubmittingHealth(false);
    }
  };

  const renderHealthForm = () => {
    return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-10 bg-white custom-scrollbar animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Info Box */}
        <div className="relative overflow-hidden bg-blue-600 rounded-[32px] p-8 lg:p-10 text-white shadow-sm">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="size-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <span className="material-symbols-outlined text-[28px]">medical_information</span>
            </div>
            <div className="flex-1 text-center md:text-left space-y-2">
              <h4 className="text-xl font-bold uppercase tracking-tight">Informasi Tes Kesehatan</h4>
              <p className="text-blue-50 text-sm font-medium leading-relaxed">
                Silakan lakukan pemeriksaan kesehatan di Klinik/Puskesmas/Rumah Sakit terdekat, lalu unggah hasilnya di bawah ini. 
                Pastikan data akurat sesuai dengan surat keterangan medis yang Anda terima.
              </p>
            </div>
            <button 
              onClick={() => setCurrentView('dashboard')} 
              className="size-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-xl transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-10">
            <form onSubmit={handleHealthSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                {/* Left Column */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">No Ujian</label>
                    <input type="text" readOnly value={noUjian} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-500 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nama Peserta</label>
                    <input type="text" readOnly value={studentName} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-500 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Tinggi Badan (cm)</label>
                    <input 
                      type="number" 
                      placeholder="170"
                      className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all duration-200 hover:border-slate-300 font-bold text-slate-700"
                      value={healthForm.tinggi_badan}
                      onChange={e => setHealthForm({...healthForm, tinggi_badan: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Tes Warna</label>
                    <div className="relative">
                      <select 
                        className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all duration-200 hover:border-slate-300 font-bold text-slate-700 appearance-none cursor-pointer pr-12"
                        value={healthForm.buta_warna}
                        onChange={e => setHealthForm({...healthForm, buta_warna: e.target.value})}
                      >
                        <option value="Tidak Buta Warna">Tidak Buta Warna</option>
                        <option value="Buta Warna Parsial">Buta Warna Parsial</option>
                        <option value="Buta Warna Total">Buta Warna Total</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[20px]">keyboard_arrow_down</span>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Pilihan Prodi</label>
                    <input type="text" readOnly value={major} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-500 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Golongan Darah</label>
                    <div className="relative">
                      <select 
                        className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all duration-200 hover:border-slate-300 font-bold text-slate-700 appearance-none cursor-pointer pr-12"
                        value={healthForm.golongan_darah}
                        onChange={e => setHealthForm({...healthForm, golongan_darah: e.target.value})}
                        required
                      >
                        <option value="">== Pilih ==</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="AB">AB</option>
                        <option value="O">O</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[20px]">keyboard_arrow_down</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Tekanan Darah (mmHg)</label>
                    <input 
                      type="text" 
                      placeholder="120/80"
                      className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all duration-200 hover:border-slate-300 font-bold text-slate-700"
                      value={healthForm.tekanan_darah}
                      onChange={e => setHealthForm({...healthForm, tekanan_darah: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Riwayat Penyakit</label>
                    <textarea 
                      className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all duration-200 hover:border-slate-300 font-bold text-slate-700 resize-none h-[115px]"
                      placeholder="Masukkan riwayat penyakit jika ada..."
                      value={healthForm.riwayat_penyakit}
                      onChange={e => setHealthForm({...healthForm, riwayat_penyakit: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* File Upload */}
              <div className="bg-slate-50 p-8 rounded-[24px] border border-slate-100 space-y-4">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Unggah Bukti Tes Kesehatan</label>
                <div className="flex flex-col gap-3">
                  <input 
                    type="file" 
                    onChange={e => {
                      const file = e.target.files ? e.target.files[0] : null;
                      if (file && file.size > 5 * 1024 * 1024) {
                        alert('Ukuran file terlalu besar. Maksimal 5 MB.');
                        e.target.value = '';
                      } else {
                        setBuktiFile(file);
                      }
                    }}
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-6 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:uppercase file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition-all cursor-pointer"
                    accept="image/*,.pdf"
                    required
                  />
                  <p className="text-[10px] text-slate-400 font-medium tracking-tight italic">Format: JPG, PNG, PDF (Max 5MB)</p>
                </div>
              </div>

              <div className="flex justify-start gap-4">
                <button 
                  type="submit" 
                  disabled={isSubmittingHealth}
                  className="px-10 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-600/20 font-bold text-[11px] uppercase tracking-widest transition-all active:scale-95 flex items-center gap-3 disabled:opacity-50"
                >
                  {isSubmittingHealth ? (
                    <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
                  ) : (
                    <span className="material-symbols-outlined text-[18px]">save</span>
                  )}
                  {isSubmittingHealth ? 'Menyimpan...' : 'Simpan Data'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setCurrentView('dashboard')}
                  className="px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    );
  };

  const handleWawancaraSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingWawancara(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/exam/wawancara/store-answers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          no_ujian: noUjian,
          answers: wawancaraAnswers
        }),
      });

      if (response.ok) {
        alert('Jawaban wawancara berhasil disimpan!');
        setCurrentView('dashboard');
        // Refresh status
        window.location.reload();
      } else {
        alert('Gagal menyimpan jawaban wawancara.');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan koneksi.');
    } finally {
      setIsSubmittingWawancara(false);
    }
  };

  const renderWawancaraForm = () => {
    return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-10 bg-white custom-scrollbar animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="relative overflow-hidden bg-emerald-600 rounded-[32px] p-10 lg:p-14 text-white shadow-sm">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-8">
              <div className="size-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                <span className="material-symbols-outlined text-[32px]">content_paste</span>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="px-2 py-0.5 bg-white/10 text-white text-[9px] font-bold uppercase tracking-widest rounded border border-white/20">Wajib</span>
                  <h3 className="text-2xl font-bold tracking-tight uppercase">Tes Wawancara</h3>
                </div>
                <p className="text-xs text-emerald-50 font-medium">Sampaikan aspirasi dan motivasi Anda dengan jujur.</p>
              </div>
            </div>
            <button 
              onClick={() => setCurrentView('dashboard')} 
              className="size-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-xl transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-10">
            {isLoadingWawancara ? (
              <div className="py-20 text-center flex flex-col items-center gap-4">
                <div className="size-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Memuat Soal...</p>
              </div>
            ) : wawancaraQuestions.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center gap-4 text-slate-400">
                <span className="material-symbols-outlined text-5xl opacity-20">inventory_2</span>
                <p className="text-xs font-bold uppercase tracking-widest">Belum ada soal wawancara yang tersedia.</p>
                <button 
                  onClick={() => setCurrentView('dashboard')}
                  className="mt-4 px-8 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all"
                >
                  Kembali
                </button>
              </div>
            ) : (
              <form onSubmit={handleWawancaraSubmit} className="space-y-12">
                {wawancaraQuestions.map((q: any, idx: number) => (
                  <div key={q.id} className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                    <div className="flex items-center gap-4">
                      <div className="size-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs border border-emerald-100">
                        {idx + 1}
                      </div>
                      <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Pertanyaan {idx + 1}</p>
                    </div>

                    <div className="p-8 bg-slate-50 rounded-[24px] border border-slate-100 text-slate-700 font-bold leading-relaxed text-base rich-text-content" dangerouslySetInnerHTML={{ __html: q.pertanyaan }}></div>
                    
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Jawaban Anda</label>
                      <textarea 
                        required
                        value={wawancaraAnswers[q.id] || ''}
                        onChange={(e) => setWawancaraAnswers({ ...wawancaraAnswers, [q.id]: e.target.value })}
                        className="w-full h-48 p-8 bg-white border-2 border-slate-100 rounded-[32px] focus:border-emerald-500 focus:bg-emerald-50/10 transition-all outline-none text-slate-700 font-medium placeholder:text-slate-300 placeholder:font-normal shadow-inner"
                        placeholder="Ketik jawaban lengkap Anda di sini..."
                      ></textarea>
                    </div>
                  </div>
                ))}

                <div className="flex items-center gap-4 pt-10 border-t border-slate-50">
                  <button 
                    type="submit"
                    disabled={isSubmittingWawancara}
                    className="px-12 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-[24px] shadow-xl shadow-emerald-500/20 font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isSubmittingWawancara ? (
                      <>
                        <span className="material-symbols-outlined animate-spin">sync</span>
                        Sedang Menyimpan...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined">send</span>
                        Submit Jawaban
                      </>
                    )}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      if (window.confirm('Batalkan pengisian wawancara? Data yang belum disimpan akan hilang.')) {
                        setCurrentView('dashboard');
                      }
                    }}
                    className="px-10 py-4 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] transition-all"
                  >
                    Batal
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
    );
  };

  const handleRegistrasiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buktiRegistrasiFile) {
      alert('Silakan pilih file bukti registrasi terlebih dahulu.');
      return;
    }

    setIsSubmittingRegistrasi(true);
    try {
      const formData = new FormData();
      formData.append('no_ujian', noUjian);
      formData.append('bukti_registrasi', buktiRegistrasiFile);

      const response = await fetch(`${API_BASE_URL}/api/exam/registrasi/store`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Bukti registrasi berhasil diunggah! Mohon tunggu verifikasi admin.');
        setCurrentView('dashboard');
        window.location.reload();
      } else {
        alert('Gagal mengunggah bukti registrasi.');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan koneksi.');
    } finally {
      setIsSubmittingRegistrasi(false);
    }
  };

  const renderRegistrasiForm = () => {
    return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-10 bg-slate-50/50 custom-scrollbar animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Modern Header Card */}
        <div className="relative bg-white rounded-[32px] p-8 lg:p-10 shadow-sm border border-slate-100 overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-32 -mt-32"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-8">
              <div className="size-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                <span className="material-symbols-outlined text-[32px]">app_registration</span>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[9px] font-bold uppercase tracking-widest rounded border border-blue-100">Tahap Akhir</span>
                  <h3 className="text-2xl font-bold text-slate-800 tracking-tight uppercase">Registrasi Ulang</h3>
                </div>
                <p className="text-xs text-slate-400 font-medium">Lengkapi administrasi untuk mendapatkan NIM Resmi.</p>
              </div>
            </div>
            <button 
              onClick={() => setCurrentView('dashboard')} 
              className="size-10 flex items-center justify-center bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-xl transition-all duration-300"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Left Column: Instructions & Info */}
          <div className="bg-white rounded-[32px] p-10 lg:p-14 shadow-sm border border-slate-100 flex flex-col space-y-10 animate-in slide-in-from-left-8 duration-700">
            <div className="space-y-6">
              <div className="size-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/20">
                <span className="material-symbols-outlined text-[28px]">info</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-800 uppercase tracking-tight">Instruksi Pembayaran</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                  Silakan unggah bukti transfer atau kwitansi pembayaran registrasi ulang Anda untuk mendapatkan Nomor Induk Mahasiswa (NIM).
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Registration Period Info Box */}
              {schedule && schedule.tanggal_registrasi_mulai && schedule.tanggal_registrasi_akhir && (
                <div className="p-6 bg-amber-50 rounded-[24px] border border-amber-200/80 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="flex items-center gap-3 text-amber-700">
                    <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Batas Waktu Registrasi Ulang</span>
                  </div>
                  <div className="space-y-2 text-[13px] text-slate-700 font-medium">
                    <div className="flex items-center justify-between border-b border-amber-100/50 pb-2">
                      <span className="text-slate-500 font-semibold">Tanggal Mulai</span>
                      <span className="font-bold text-slate-800">
                        {new Date(schedule.tanggal_registrasi_mulai).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-slate-500 font-semibold">Tanggal Akhir</span>
                      <span className="font-bold text-rose-600">
                        {new Date(schedule.tanggal_registrasi_akhir).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wider mt-3 text-center bg-amber-100/30 py-1.5 rounded-lg border border-amber-200/40">
                      ⚠️ Harap lakukan registrasi ulang sebelum batas waktu
                    </p>
                  </div>
                </div>
              )}

              <div className="p-6 bg-slate-50 rounded-[24px] border border-slate-100 space-y-4">
                <div className="flex items-center gap-3 text-blue-600">
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest">Ketentuan File</span>
                </div>
                <ul className="space-y-3">
                  {[
                    'Format file JPG, PNG, atau PDF',
                    'Ukuran file maksimal 5 MB',
                    'Data transfer harus terlihat jelas',
                    'Verifikasi dilakukan dalam 1x24 jam'
                  ].map((text, i) => (
                    <li key={i} className="flex items-center gap-3 text-[12px] text-slate-600 font-medium">
                      <div className="size-1 bg-blue-400 rounded-full"></div>
                      {text}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bank Account Info Card */}
              <div className="p-6 bg-blue-600 rounded-[24px] text-white space-y-4 shadow-lg shadow-blue-600/20 group/bank">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[20px] group-hover/bank:rotate-12 transition-transform">account_balance</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest">Rekening Pembayaran</span>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] text-blue-100 font-bold uppercase tracking-widest">Bank BTN Syariah</p>
                  <p className="text-lg font-bold tracking-tight">00323-01-30-000028-7</p>
                  <p className="text-[10px] text-blue-50 font-medium">a.n. Yayasan Hang Tuah Pekanbaru</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Upload Form */}
          <div className="bg-white rounded-[32px] p-10 lg:p-14 shadow-sm border border-slate-100 flex flex-col animate-in slide-in-from-right-8 duration-700">
            <form onSubmit={handleRegistrasiSubmit} className="flex-1 flex flex-col space-y-8">
              <div className="space-y-6 flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px]">upload_file</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Unggah Dokumen</h4>
                  </div>
                  <span className="text-[9px] font-bold text-blue-600 uppercase bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">Wajib</span>
                </div>

                <div className={`relative flex-1 group transition-all duration-300 ${buktiRegistrasiFile ? 'border-blue-500 bg-blue-50/20' : 'border-slate-100 bg-slate-50 hover:bg-slate-100/50'} border-2 border-dashed rounded-[24px] p-8 text-center flex flex-col items-center justify-center min-h-[280px]`}>
                  <input 
                    type="file" 
                    onChange={e => {
                      const file = e.target.files ? e.target.files[0] : null;
                      if (file && file.size > 5 * 1024 * 1024) {
                        alert('Ukuran file terlalu besar. Maksimal 5 MB.');
                        e.target.value = '';
                      } else {
                        setBuktiRegistrasiFile(file);
                      }
                    }}
                    accept="image/*,.pdf"
                    required
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  />
                  
                  <div className="relative z-10 space-y-4">
                    <div className={`size-16 mx-auto rounded-2xl flex items-center justify-center transition-all duration-300 ${buktiRegistrasiFile ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-white text-slate-300 shadow-sm'}`}>
                      <span className="material-symbols-outlined text-[32px]">
                        {buktiRegistrasiFile ? 'check_circle' : 'add_photo_alternate'}
                      </span>
                    </div>
                    
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-slate-800 tracking-tight max-w-[220px] mx-auto truncate">
                        {buktiRegistrasiFile ? buktiRegistrasiFile.name : 'Pilih Bukti Pembayaran'}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">
                        Klik atau seret file ke sini
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 max-w-sm mx-auto w-full pt-4">
                <button 
                  type="submit" 
                  disabled={isSubmittingRegistrasi}
                  className="w-full group relative py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 active:scale-95 overflow-hidden"
                >
                  <div className="relative z-10 flex items-center justify-center gap-2">
                    {isSubmittingRegistrasi ? (
                      <span className="material-symbols-outlined animate-spin text-[16px]">sync</span>
                    ) : (
                      <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">send</span>
                    )}
                    {isSubmittingRegistrasi ? 'Memproses...' : 'Submit Registrasi'}
                  </div>
                </button>
                
                <button 
                  type="button" 
                  onClick={() => setCurrentView('dashboard')}
                  className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-400 rounded-xl font-bold text-[9px] uppercase tracking-widest transition-all"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    );
  };

  const renderPengumuman = () => {
    return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-10 bg-slate-50/50 custom-scrollbar animate-in fade-in slide-in-from-bottom-8 duration-1000 cubic-bezier">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Modern Header Card */}
        <div className="relative bg-white rounded-[40px] p-8 lg:p-12 shadow-2xl shadow-slate-200/50 border border-white overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-32 -mt-32 transition-transform duration-1000 group-hover:scale-110"></div>
          
          <div className="relative z-10 flex items-center justify-between gap-8 border-b border-slate-50 pb-8">
            <div className="flex items-center gap-8">
              <button 
                onClick={() => setCurrentView('dashboard')}
                className="size-14 rounded-2xl bg-slate-50 text-slate-500 flex items-center justify-center hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-500 active:scale-90 hover:rotate-12"
              >
                <span className="material-symbols-outlined text-[28px]">arrow_back</span>
              </button>
              <div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight uppercase">HASIL SELEKSI</h2>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1 italic">Status kelulusan resmi Anda.</p>
              </div>
            </div>
          </div>
          
          <div className="mt-10 space-y-10">
            {hasilWawancara === 'LULUS' ? (
              <div className="space-y-8">
                {/* Two-Column Success Display */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in zoom-in duration-700">
                  {/* Left Card: Status Message */}
                  <div className="relative p-10 bg-emerald-600 rounded-[40px] text-white overflow-hidden shadow-xl shadow-emerald-900/10 group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32 transition-transform duration-1000 group-hover:scale-110"></div>
                    <div className="relative z-10 flex flex-col h-full justify-between gap-8">
                      <div className="space-y-6">
                        <div className="size-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                          <span className="material-symbols-outlined text-[32px] text-emerald-200">workspace_premium</span>
                        </div>
                        <div className="space-y-3">
                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-white text-[9px] font-bold uppercase tracking-widest border border-white/10">
                            <span className="size-1.5 bg-emerald-200 rounded-full animate-pulse"></span>
                            Seleksi Selesai
                          </div>
                          <h3 className="text-3xl font-black tracking-tight leading-tight uppercase">
                            Selamat!<br/>Anda <span className="text-emerald-200">LULUS</span>.
                          </h3>
                        </div>
                      </div>
                      <p className="text-emerald-50/80 text-[13px] font-medium leading-relaxed italic border-l-2 border-emerald-400/30 pl-4">
                        "Teruslah berkarya dan jadilah bagian dari perubahan positif bersama Universitas Hang Tuah Pekanbaru."
                      </p>
                    </div>
                  </div>

                  {/* Right Card: Actions & Details */}
                  <div className="relative p-10 bg-white border border-slate-100 rounded-[40px] shadow-xl shadow-slate-200/40 flex flex-col justify-between gap-8">
                    <div className="space-y-6">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Program Studi Tujuan</p>
                        <h4 className="text-xl font-bold text-slate-800 leading-tight">{major}</h4>
                      </div>
                      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          <span>Nomor Ujian</span>
                          <span className="text-slate-800">{noUjian}</span>
                        </div>
                        <div className="h-px bg-slate-200/50 w-full"></div>
                        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          <span>Gelombang</span>
                          <span className="text-slate-800">{studentGelombang}</span>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={handlePrintSKL}
                      className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 text-white transition-all rounded-2xl text-[12px] font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-3 active:scale-95 group"
                    >
                      <span className="material-symbols-outlined text-[24px] group-hover:bounce">download_for_offline</span>
                      Unduh SKL Resmi
                    </button>
                  </div>
                </div>

                {/* Next Steps Grid - Refined 3 Column Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { step: '1', title: 'Unduh SKL', desc: 'Cetak Surat Keterangan Lulus resmi.', icon: 'description', color: 'emerald' },
                    { step: '2', title: 'Pembayaran', desc: 'Transfer ke rekening resmi UHTP.', icon: 'payments', color: 'blue' },
                    { step: '3', title: 'Registrasi', desc: 'Unggah bukti bayar untuk NIM.', icon: 'app_registration', color: 'indigo' }
                  ].map((item: any, i: number) => (
                    <div key={i} className="flex items-start gap-6 p-6 rounded-[28px] bg-white border border-slate-100 shadow-sm hover:shadow-lg hover:border-emerald-500/10 transition-all duration-500 group">
                      <div className={`size-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-${item.color}-600 group-hover:text-white transition-all duration-500 shadow-inner flex-shrink-0`}>
                        <span className="material-symbols-outlined text-[28px]">{item.icon}</span>
                      </div>
                      <div className="space-y-1.5 pt-1">
                        <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                           <span className={`text-${item.color}-600 opacity-40`}>0{item.step}</span>
                           {item.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Status Registrasi If Already Done */}
                {statusRegistrasi !== 'Belum Registrasi' && (
                  <div className="p-10 bg-emerald-50 rounded-[48px] border-2 border-emerald-100 flex flex-col md:flex-row items-center gap-10">
                    <div className="size-20 rounded-[28px] bg-emerald-600 text-white flex items-center justify-center shadow-xl shadow-emerald-600/30">
                      <span className="material-symbols-outlined text-[40px]">check_circle</span>
                    </div>
                    <div className="flex-1 space-y-2 text-center md:text-left">
                      <h3 className="text-xl font-black text-emerald-900 uppercase tracking-widest">Administrasi Selesai</h3>
                      <p className="text-slate-600 font-medium">
                        Anda telah mengunggah bukti registrasi. Status saat ini: <span className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-[10px] font-black uppercase ml-2">{statusRegistrasi}</span>
                      </p>
                    </div>
                    <button 
                      onClick={handlePrintKwitansi}
                      className="px-10 py-5 bg-white text-emerald-600 border-2 border-emerald-100 hover:bg-emerald-600 hover:text-white transition-all rounded-[24px] text-xs font-black uppercase tracking-widest"
                    >
                      Lihat Kwitansi
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center p-16 bg-rose-50/30 rounded-[40px] border border-rose-100 shadow-sm text-center space-y-6">
                <div className="size-24 rounded-[32px] bg-rose-100 text-rose-500 flex items-center justify-center shadow-inner">
                  <span className="material-symbols-outlined text-[48px]">cancel</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-rose-900 uppercase tracking-widest">Maaf, Anda Belum Lulus</h3>
                  <p className="text-slate-500 text-sm leading-relaxed max-w-lg font-medium mx-auto">
                    Tetap semangat dan pantang menyerah. Kegagalan hari ini adalah langkah awal menuju kesuksesan di masa depan. Anda dapat mencoba kembali di gelombang berikutnya.
                  </p>
                </div>
                <button 
                  onClick={() => setCurrentView('dashboard')}
                  className="px-10 py-4 bg-white border border-rose-200 text-rose-600 hover:bg-rose-600 hover:text-white transition-all rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-sm"
                >
                  Kembali ke Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    );
  };
  return (
    <div className="flex h-screen w-full bg-[#f8fafc] font-sans overflow-hidden animate-in fade-in duration-700">
      
      {/* Refined Sidebar */}
      <div className="w-72 bg-[#0f172a] flex flex-col p-8 hidden lg:flex relative overflow-hidden">
        {/* Background Decorative Element */}
        <div className="absolute top-0 left-0 w-full h-32 bg-emerald-500/5 blur-3xl rounded-full -translate-y-1/2"></div>
        
        <div className="flex items-center gap-4 mb-12 relative z-10">
          <div className="size-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <span className="material-symbols-outlined text-white text-2xl">school</span>
          </div>
          <div>
            <h2 className="text-base font-black tracking-tight text-white uppercase">SPMB Portal</h2>
            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">V2.0 Stable</p>
          </div>
        </div>

        {/* Profile Section */}
        <div className="mb-12 text-center px-2 relative z-10">
          <div className="size-20 mx-auto rounded-full overflow-hidden mb-4 border-2 border-white/10 shadow-xl">
            {photoUrl ? (
              <img src={photoUrl} alt="Profil" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-emerald-500 text-white">
                <span className="material-symbols-outlined text-[28px]">person</span>
              </div>
            )}
          </div>
          <h3 className="text-xs font-bold text-white uppercase tracking-tight truncate">{studentName}</h3>
          <div className="flex items-center justify-center gap-1.5 mt-2">
             <div className="size-1 bg-emerald-500 rounded-full"></div>
             <p className="text-[8px] text-slate-400 font-bold uppercase tracking-[0.1em]">Siswa Aktif</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2 relative z-10">
          <button 
            onClick={() => setCurrentView('dashboard')}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 group active:scale-95 ${
              currentView === 'dashboard' 
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' 
              : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">dashboard</span>
            <span className="text-xs font-bold uppercase tracking-widest">Dashboard</span>
          </button>
        </nav>

        {/* Logout Button */}
        <button 
          onClick={onLogout}
          className="mt-auto flex items-center gap-4 p-4 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-2xl transition-all group font-bold text-[11px] uppercase tracking-widest relative z-10"
        >
          <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">logout</span>
          Keluar
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <header className="px-10 py-6 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <div className="size-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
              <span className="material-symbols-outlined">person</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
                Portal Mahasiswa
                <span className="size-1.5 bg-emerald-500 rounded-full"></span>
              </h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                No Ujian: <span className="text-emerald-600">{noUjian}</span> • {formattedTime}
              </p>
            </div>
          </div>
          <div className="text-right hidden md:block group">
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Program Studi</div>
            <div className="text-sm font-bold text-slate-700 uppercase tracking-tight">{major}</div>
          </div>
        </header>

        {/* Content Body */}
        {currentView === 'dashboard' ? (
          <main className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
            
            {/* Welcome Banner */}
            <section className="relative p-10 bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm animate-in fade-in slide-in-from-top-4 duration-700">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -mr-32 -mt-32"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                <div className="size-20 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/20">
                  <span className="material-symbols-outlined text-[40px]">waving_hand</span>
                </div>
                <div className="text-center md:text-left space-y-2">
                  <div className="flex flex-col md:flex-row items-center md:items-baseline gap-3">
                    <h2 className="text-2xl font-bold tracking-tight text-slate-800">
                      Selamat Datang, <span>{studentName}</span>
                    </h2>
                    <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-bold uppercase tracking-widest rounded-md border border-emerald-100">Status Aktif</span>
                  </div>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-2xl">
                    Sistem Seleksi Penerimaan Mahasiswa Baru Digital Universitas Hang Tuah Pekanbaru. 
                    Pantau tahapan pendaftaran Anda di bawah ini secara real-time.
                  </p>
                </div>
              </div>
            </section>

            {/* Steps Grid */}
            <section className={`grid grid-cols-1 ${hasWawancara ? 'md:grid-cols-4' : 'md:grid-cols-3'} gap-8`}>
              {/* Step 1: Online Exam */}
              <button 
                onClick={(hasFinishedExam || !isExamOpen) ? undefined : onStartExam}
                disabled={hasFinishedExam || !isExamOpen || isLoadingSchedule}
                className={`group relative flex flex-col p-8 rounded-[32px] transition-all duration-500 overflow-hidden border border-slate-100 ${
                  hasFinishedExam 
                  ? 'bg-slate-50 opacity-80 cursor-not-allowed' 
                  : !isExamOpen 
                    ? 'bg-white cursor-not-allowed'
                    : 'bg-white hover:border-emerald-500/20 hover:shadow-xl hover:shadow-emerald-900/5 hover:-translate-y-2'
                }`}
              >
                <div className={`size-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 ${
                  hasFinishedExam 
                  ? 'bg-slate-100 text-slate-400' 
                  : !isExamOpen 
                    ? 'bg-slate-50 text-slate-200'
                    : 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 group-hover:scale-110'
                }`}>
                  <span className="material-symbols-outlined text-[28px]">
                    {hasFinishedExam ? 'check_circle' : (isExamOpen ? 'computer' : 'lock_clock')}
                  </span>
                </div>
                
                <h3 className={`text-base font-bold tracking-tight mb-2 uppercase ${hasFinishedExam || !isExamOpen ? 'text-slate-800' : 'text-slate-900'}`}>
                  Tes Ujian Online
                </h3>
                <p className={`text-[10px] font-bold uppercase tracking-widest ${hasFinishedExam || !isExamOpen ? 'text-slate-400' : 'text-emerald-600'}`}>
                  {hasFinishedExam ? 'Ujian Telah Selesai' : examMessage}
                </p>
              </button>              {/* Step 2: Health Test */}
              <button 
                onClick={() => {
                  if (healthStatus) return;
                  if (hasFinishedExam) setCurrentView('kesehatan');
                  else alert('Selesaikan ujian online terlebih dahulu.');
                }}
                disabled={!hasFinishedExam || !!healthStatus || isLoadingSchedule}
                className={`group relative flex flex-col p-8 rounded-[32px] transition-all duration-500 border border-slate-100 ${
                  healthStatus 
                  ? 'bg-slate-50 opacity-80 cursor-not-allowed' 
                  : hasFinishedExam 
                    ? 'bg-white hover:border-emerald-500/20 hover:shadow-xl hover:shadow-emerald-900/5 hover:-translate-y-2 cursor-pointer' 
                    : 'bg-white opacity-60 cursor-not-allowed'
                }`}
              >
                <div className={`size-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 ${
                  healthStatus
                  ? 'bg-slate-100 text-slate-400'
                  : hasFinishedExam 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 group-hover:scale-110' 
                    : 'bg-slate-50 text-slate-200'
                }`}>
                  <span className="material-symbols-outlined text-[28px]">
                    {healthStatus ? 'check_circle' : 'medical_services'}
                  </span>
                </div>
                
                <h3 className={`text-base font-bold tracking-tight mb-2 uppercase ${hasFinishedExam ? 'text-slate-800' : 'text-slate-400'}`}>
                  Tes Kesehatan
                </h3>
                
                <div className="flex flex-col">
                  <p className={`text-[10px] font-bold uppercase tracking-widest ${
                    healthStatus ? 'text-slate-400' : (hasFinishedExam ? 'text-emerald-600' : 'text-slate-400')
                  }`}>
                    {healthStatus ? 'Tahapan Selesai' : (hasFinishedExam ? 'Silakan Lanjut' : 'Menunggu Ujian')}
                  </p>
                  {healthStatus && (
                    <span className={`mt-3 inline-block px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest w-fit shadow-sm ${
                      (healthStatus === 'Sehat' || healthStatus === 'Lulus') ? 'bg-emerald-600 text-white' : 
                      (healthStatus === 'Menunggu') ? 'bg-amber-500 text-white' : 'bg-rose-600 text-white'
                    }`}>
                      {healthStatus === 'Menunggu' ? 'VERIFIKASI' : `STATUS: ${healthStatus}`}
                    </span>
                  )}
                </div>
              </button>
              {/* Step 3: Wawancara Test */}
              {hasWawancara && (
                <button 
                  onClick={() => {
                    if (hasilWawancara && hasilWawancara !== 'BELUM UJIAN') return;
                    if (hasFinishedExam) setCurrentView('wawancara');
                    else alert('Selesaikan ujian online terlebih dahulu.');
                  }}
                  disabled={!hasFinishedExam || (hasilWawancara !== null && hasilWawancara !== 'BELUM UJIAN')}
                  className={`group relative flex flex-col p-8 rounded-[32px] transition-all duration-500 border border-slate-100 ${
                    (hasilWawancara !== null && hasilWawancara !== 'BELUM UJIAN')
                    ? 'bg-slate-50 opacity-80 cursor-not-allowed'
                    : hasFinishedExam 
                      ? 'bg-white hover:border-emerald-500/20 hover:shadow-xl hover:shadow-emerald-900/5 hover:-translate-y-2' 
                      : 'bg-white opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div className={`size-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 ${
                    (hasilWawancara !== null && hasilWawancara !== 'BELUM UJIAN')
                    ? 'bg-slate-100 text-slate-400'
                    : hasFinishedExam 
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 group-hover:scale-110' 
                      : 'bg-slate-50 text-slate-300'
                  }`}>
                    <span className="material-symbols-outlined text-[28px]">
                      {(hasilWawancara && hasilWawancara !== 'BELUM UJIAN') ? 'check_circle' : 'content_paste'}
                    </span>
                  </div>
                  <h3 className={`text-base font-bold tracking-tight mb-2 uppercase ${hasFinishedExam ? 'text-slate-800' : 'text-slate-400'}`}>
                    Tes Wawancara
                  </h3>
                  <p className={`text-[10px] font-bold uppercase tracking-widest ${
                    (hasilWawancara && hasilWawancara !== 'BELUM UJIAN') ? 'text-slate-400' : (hasFinishedExam ? 'text-emerald-600' : 'text-slate-400')
                  }`}>
                    {(hasilWawancara && hasilWawancara !== 'BELUM UJIAN') ? 'Tahapan Selesai' : (hasFinishedExam ? 'Silakan Lanjut' : 'Menunggu Ujian')}
                  </p>
                </button>
              )}


              {/* Step 4: Graduation */}
              <button 
                onClick={() => {
                  if (hasilWawancara === 'LULUS' || hasilWawancara === 'TIDAK LULUS') setCurrentView('pengumuman');
                }}
                disabled={!hasilWawancara || (hasilWawancara !== 'LULUS' && hasilWawancara !== 'TIDAK LULUS')}
                className={`group relative flex flex-col p-8 rounded-[32px] text-left transition-all duration-500 border border-slate-100 ${
                  hasilWawancara === 'LULUS' 
                    ? 'bg-white hover:border-emerald-500/20 hover:shadow-xl hover:shadow-emerald-900/5 hover:-translate-y-2 cursor-pointer' 
                    : hasilWawancara === 'TIDAK LULUS'
                      ? 'bg-white hover:border-rose-500/20 hover:shadow-xl hover:shadow-rose-900/5 hover:-translate-y-2 cursor-pointer'
                      : 'bg-white opacity-60 cursor-not-allowed'
                }`}
              >
                <div className={`size-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 ${
                  hasilWawancara === 'LULUS'
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 group-hover:scale-110'
                    : hasilWawancara === 'TIDAK LULUS'
                      ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20 group-hover:scale-110'
                      : 'bg-slate-50 text-slate-200'
                }`}>
                  <span className="material-symbols-outlined text-[28px]">
                    {hasilWawancara === 'LULUS' ? 'workspace_premium' : (hasilWawancara === 'TIDAK LULUS' ? 'cancel' : 'campaign')}
                  </span>
                </div>
                <h3 className={`text-base font-bold tracking-tight mb-1 uppercase ${(hasilWawancara === 'LULUS' || hasilWawancara === 'TIDAK LULUS') ? 'text-slate-800' : 'text-slate-400'}`}>
                  Hasil Seleksi
                </h3>
                <p className={`text-[10px] font-bold uppercase tracking-widest ${
                  hasilWawancara === 'LULUS' ? 'text-emerald-600' : (hasilWawancara === 'TIDAK LULUS' ? 'text-rose-600' : 'text-slate-400')
                }`}>
                  {hasilWawancara === 'LULUS' ? 'Selamat! Anda Lulus' : (hasilWawancara === 'TIDAK LULUS' ? 'Maaf, Coba Lagi' : 'Menunggu Hasil')}
                </p>
              </button>

              {/* Step 5: Re-registration */}
              <button 
                onClick={() => {
                  if (statusRegistrasi !== 'Belum Registrasi' && statusRegistrasi !== 'Ditolak') return;
                  setCurrentView('registrasi');
                }}
                disabled={hasilWawancara !== 'LULUS' || (statusRegistrasi !== 'Belum Registrasi' && statusRegistrasi !== 'Ditolak')}
                className={`group relative flex flex-col p-8 rounded-[32px] transition-all duration-500 border border-slate-100 ${
                  (statusRegistrasi !== 'Belum Registrasi' && statusRegistrasi !== 'Ditolak') 
                  ? 'bg-slate-50 opacity-80 cursor-not-allowed'
                  : hasilWawancara === 'LULUS'
                    ? 'bg-white hover:border-blue-500/20 hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-2 cursor-pointer' 
                    : 'bg-white opacity-60 cursor-not-allowed'
                }`}
              >
                <div className={`size-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 ${
                  (statusRegistrasi !== 'Belum Registrasi' && statusRegistrasi !== 'Ditolak')
                  ? 'bg-blue-50 text-blue-400'
                  : hasilWawancara === 'LULUS'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 group-hover:scale-110' 
                    : 'bg-slate-50 text-slate-300'
                }`}>
                  <span className="material-symbols-outlined text-[28px]">
                    {(statusRegistrasi === 'Sudah Registrasi') ? 'check_circle' : 'app_registration'}
                  </span>
                </div>
                
                <h3 className={`text-base font-bold tracking-tight mb-1 uppercase ${hasilWawancara === 'LULUS' ? 'text-slate-800' : 'text-slate-400'}`}>
                  Registrasi Ulang
                </h3>
                
                <div className="flex flex-col">
                  <p className={`text-[10px] font-bold uppercase tracking-widest ${
                    statusRegistrasi !== 'Belum Registrasi' ? 'text-slate-400' : (hasilWawancara === 'LULUS' ? 'text-blue-600' : 'text-slate-400')
                  }`}>
                    {statusRegistrasi === 'Belum Registrasi' ? (hasilWawancara === 'LULUS' ? 'Unggah Bukti' : 'Menunggu') : 'Selesai'}
                  </p>
                  {statusRegistrasi !== 'Belum Registrasi' && (
                    <span className={`mt-3 inline-block px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest w-fit shadow-sm ${
                      statusRegistrasi === 'Sudah Registrasi' ? 'bg-emerald-600 text-white' : 
                      statusRegistrasi === 'Menunggu Verifikasi' ? 'bg-amber-500 text-white' : 'bg-rose-600 text-white'
                    }`}>
                      {statusRegistrasi}
                    </span>
                  )}
                  {buktiRegistrasiPath && (
                    <a 
                      href={`${API_BASE_URL}/storage/${buktiRegistrasiPath}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mt-3 text-[9px] font-bold text-blue-600 hover:underline flex items-center gap-1 w-fit"
                    >
                      <span className="material-symbols-outlined text-[12px]">visibility</span>
                      Lihat Bukti
                    </a>
                  )}
                </div>

                {/* Registration Dates Period */}
                {schedule && schedule.tanggal_registrasi_mulai && schedule.tanggal_registrasi_akhir ? (
                  <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-1 text-left w-full">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-blue-500">calendar_month</span>
                      Periode Registrasi
                    </span>
                    <div className="flex flex-col gap-0.5 mt-1 pl-5">
                      <span className="text-[11px] font-bold text-slate-700">
                        {new Date(schedule.tanggal_registrasi_mulai).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest my-0.5">s/d</span>
                      <span className="text-[11px] font-bold text-slate-700">
                        {new Date(schedule.tanggal_registrasi_akhir).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-1 text-left w-full text-[10px] font-semibold text-slate-400">
                    <span className="material-symbols-outlined text-[14px]">calendar_month</span>
                    <span>Jadwal belum ditentukan</span>
                  </div>
                )}
              </button>
            </section>




            <section className="bg-white rounded-[32px] p-10 border border-slate-100 shadow-sm">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                <span className="material-symbols-outlined text-emerald-600 text-[20px]">gavel</span>
                Ketentuan Seleksi & Ujian
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  schedule 
                    ? `Ujian dilaksanakan pada tanggal ${new Date(schedule.tanggal_ujian).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} pukul ${schedule.jam_mulai} s/d ${schedule.jam_berakhir} WIB.`
                    : "Ujian dimulai pukul 08.00 s/d 21.00 WIB setiap harinya.",
                  "Waktu pengerjaan ujian adalah 120 menit (2 jam).",
                  "Jawaban yang sudah dikirim tidak dapat diubah kembali.",
                  "Pastikan koneksi internet Anda stabil sebelum memulai.",
                  "Ujian hanya dapat dilakukan satu kali kesempatan.",
                  "Segala bentuk kecurangan akan membatalkan kelulusan."
                ].map((rule: string, idx: number) => (
                  <li key={idx} className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-100 text-xs font-medium text-slate-600 leading-relaxed group hover:border-emerald-500/20 transition-all">
                    <div className="size-5 rounded-full bg-emerald-100 text-emerald-600 flex-shrink-0 flex items-center justify-center text-[10px] font-bold">
                      {idx + 1}
                    </div>
                    {rule}
                  </li>
                ))}
              </ul>
            </section>

          </main>
        ) : currentView === 'kesehatan' ? (
          renderHealthForm()
        ) : currentView === 'wawancara' ? (
          renderWawancaraForm()
        ) : currentView === 'pengumuman' ? (
          renderPengumuman()
        ) : (
          renderRegistrasiForm()
        )}

        {/* Footer */}
        <footer className="px-10 py-6 border-t border-slate-100 flex items-center justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest">
          <div>&copy; 2026 Universitas Hang Tuah Pekanbaru</div>
          <div className="flex gap-4">
            <span>Version 3.0.0</span>
            <span className="text-emerald-500">• Secure Exam Protocol</span>
          </div>
        </footer>

      </div>

      {/* Printable SKL (Portal) */}
      {createPortal(
        <div id="printable-skl" className="hidden-on-screen">
          <div className="skl-container">
            <div className="skl-header">
              <img src="/logo-uhtp.png" alt="Logo UHTP" className="skl-logo" />
              <div className="skl-header-text">
                <h1>YAYASAN HANG TUAH PEKANBARU</h1>
                <h2>UNIVERSITAS HANG TUAH PEKANBARU</h2>
                <p>Jl. Mustafa Sari No. 5 Tangkerang Selatan Pekanbaru - Riau</p>
                <p>Telp. (0761) 33815 Fax. (0761) 33815 Website: www.htp.ac.id</p>
              </div>
            </div>

            <div className="skl-body">
              <div className="skl-title-box">
                <h3>SURAT KETERANGAN LULUS</h3>
                <p>Nomor: {Math.floor(1000 + Math.random() * 9000)}/UHTP/SPMB/{new Date().getFullYear()}</p>
              </div>

              <p className="skl-intro">
                Rektor Universitas Hang Tuah Pekanbaru, dengan ini menerangkan bahwa:
              </p>

              <table className="skl-data-table">
                <tbody>
                  <tr>
                    <td className="skl-label">Nama Lengkap</td>
                    <td className="skl-colon">:</td>
                    <td className="skl-value font-bold uppercase">{studentName}</td>
                  </tr>
                  <tr>
                    <td className="skl-label">Tempat / Tgl Lahir</td>
                    <td className="skl-colon">:</td>
                    <td className="skl-value">
                      {birthPlace}, {birthDate !== '-' ? new Date(birthDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                    </td>
                  </tr>
                  <tr>
                    <td className="skl-label">NISN</td>
                    <td className="skl-colon">:</td>
                    <td className="skl-value">{studentNisn}</td>
                  </tr>
                  <tr>
                    <td className="skl-label">Nomor Ujian</td>
                    <td className="skl-colon">:</td>
                    <td className="skl-value font-bold">{noUjian}</td>
                  </tr>
                  <tr>
                    <td className="skl-label">Program Studi</td>
                    <td className="skl-colon">:</td>
                    <td className="skl-value">{major}</td>
                  </tr>
                  <tr>
                    <td className="skl-label">Gelombang</td>
                    <td className="skl-colon">:</td>
                    <td className="skl-value">{studentGelombang}</td>
                  </tr>
                </tbody>
              </table>

              <p className="skl-closing">
                Dinyatakan <strong>LULUS</strong> Seleksi Penerimaan Mahasiswa Baru Universitas Hang Tuah Pekanbaru Tahun Akademik 2026/2027. 
                Demikian surat keterangan ini diberikan untuk dapat dipergunakan sebagaimana mestinya.
              </p>

              <div className="skl-footer">
                <div className="skl-signature-box">
                  <p>Pekanbaru, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  <p>Rektor,</p>
                  <div className="skl-signature-space"></div>
                  <p className="skl-signature-name">Prof. Dr. Syafrani, M.Si</p>
                  <p>NIDN. 0022026301</p>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Printable Kwitansi (Portal) */}
      {createPortal(
        <div id="printable-receipt" className="hidden-on-screen">
          <div className="receipt-container p-10 border-2 border-slate-800 rounded-sm relative">
            {/* Background Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none z-0">
               <img src="/logo-uhtp.png" alt="UHTP Watermark" className="w-[500px]" />
            </div>

            <div className="relative z-10">
              <div className="receipt-header border-b-2 border-black pb-4 mb-8">
                <img src="/logo-uhtp.png" alt="Logo UHTP" className="receipt-logo size-20" />
                <div className="receipt-title-box text-center flex-1">
                  <h1 className="receipt-main-title text-xl font-bold">KWITANSI PEMBAYARAN REGISTRASI ULANG</h1>
                  <h2 className="receipt-sub-title text-sm font-bold uppercase">SELEKSI PENERIMAAN MAHASISWA BARU (SPMB) UNIVERSITAS HANG TUAH PEKANBARU</h2>
                  <h3 className="receipt-ta text-sm font-bold">TA 2026/2027</h3>
                </div>
              </div>

              <table className="receipt-table w-full text-sm">
                <tbody>
                  <tr>
                    <td className="receipt-label py-2 w-48">No Kwitansi</td>
                    <td className="receipt-colon py-2 w-4">:</td>
                    <td className="receipt-value py-2">6219</td>
                  </tr>
                  <tr>
                    <td className="receipt-label py-2">Sudah terima dari</td>
                    <td className="receipt-colon py-2">:</td>
                    <td className="receipt-value py-2 uppercase font-bold text-base">
                      {studentName} <span className="text-sm font-medium normal-case">(No Ujian: {noUjian})</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="receipt-label py-2">Untuk pembayaran</td>
                    <td className="receipt-colon py-2">:</td>
                    <td className="receipt-value py-2">Pembayaran Pertama Uang Masuk Prodi {major}</td>
                  </tr>
                  <tr>
                    <td className="receipt-label py-4">Jumlah</td>
                    <td className="receipt-colon py-4">:</td>
                    <td className="receipt-value py-4 text-3xl font-black tracking-tight">Rp 3.000.000</td>
                  </tr>
                  <tr>
                    <td className="receipt-label py-2">Terbilang</td>
                    <td className="receipt-colon py-2">:</td>
                    <td className="receipt-value py-2 italic font-medium">" {angkaKeTerbilang(3000000)} Rupiah "</td>
                  </tr>
                </tbody>
              </table>

              <div className="receipt-footer-box flex justify-between items-end mt-12 px-4">
                <div className="signature-box text-center">
                  <p className="text-xs mb-1">Pekanbaru, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  <p className="text-xs font-bold mb-12">Bagian Keuangan</p>
                  <div className="relative inline-block">
                    {/* Fake Stamp & Signature Area */}
                    <div className="absolute -top-12 -left-8 w-24 h-24 border-4 border-blue-500/30 rounded-full flex items-center justify-center text-blue-500/30 font-black text-xs rotate-12 pointer-events-none">
                      UHTP LUNAS
                    </div>
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/3/3a/Jon_Snow_Signature.png" 
                      alt="Signature" 
                      className="h-16 w-auto object-contain relative z-10" 
                    />
                    <p className="signature-name font-bold underline mt-2 text-sm">Verdy Sando, S.Sos., MKM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default CbtStudentDashboard;
