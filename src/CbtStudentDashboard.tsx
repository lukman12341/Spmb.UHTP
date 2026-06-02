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
  const [statusKelulusan, setStatusKelulusan] = useState<string | null>(null);
  const [statusRegistrasi, setStatusRegistrasi] = useState<string>('Belum Registrasi');
  const [buktiRegistrasiPath, setBuktiRegistrasiPath] = useState<string | null>(null);
  const [birthPlace, setBirthPlace] = useState<string>('-');
  const [birthDate, setBirthDate] = useState<string>('-');
  const [studentNisn, setStudentNisn] = useState<string>('-');
  
  const hasWawancara = ['keperawatan', 'ners', 'kebidanan', 'bidan'].some((p: string) => major?.toLowerCase().includes(p));

  const checkHasKesehatan = (majorName: string): boolean => {
    if (!majorName) return false;
    const lower = majorName.toLowerCase();
    
    const isS1Kesmas = lower.includes('s1') && (lower.includes('kesmas') || lower.includes('kesehatan masyarakat') || lower.includes('ikm'));
    const isS1Bidan = lower.includes('s1') && (lower.includes('bidan') || lower.includes('kebidanan'));
    const isS1Keperawatan = lower.includes('s1') && (lower.includes('keperawatan') || lower.includes('kperwatan') || lower.includes('kpr'));
    const isD3Rmik = lower.includes('d3') && (lower.includes('rmik') || lower.includes('rekam medis') || lower.includes('perekam medis') || lower.includes('mik'));
    const isD4Rmik = lower.includes('d4') && (lower.includes('rmik') || lower.includes('mik') || lower.includes('rekam medis') || lower.includes('perekam medis') || lower.includes('manajemen informasi kesehatan'));
    const isProfesiNers = lower.includes('profesi') && lower.includes('ners');
    const isProfesiBidan = lower.includes('profesi') && (lower.includes('bidan') || lower.includes('kebidanan'));
    
    return isS1Kesmas || isS1Bidan || isS1Keperawatan || isD3Rmik || isD4Rmik || isProfesiNers || isProfesiBidan;
  };

  const hasKesehatan = checkHasKesehatan(major);
  
  const isLulus = statusKelulusan === 'Lulus' || (statusKelulusan !== null && (statusKelulusan.startsWith('Lulus Di') || statusKelulusan.includes('Lulus Di')));
  const isTidakLulus = statusKelulusan === 'Tidak Lulus' || statusKelulusan === 'Gagal';
  const isFinalStatus = isLulus || isTidakLulus;
  
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
        if (statusData.status_kelulusan) {
          setStatusKelulusan(statusData.status_kelulusan);
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
      <div className="flex-1 overflow-y-auto p-6 lg:p-10 bg-slate-50/50 custom-scrollbar animate-in fade-in duration-700">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Modern Softer Info Box */}
          <div className="relative overflow-hidden bg-emerald-50/60 border border-emerald-100 rounded-2xl p-6 text-slate-800 shadow-xs">
            
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="size-12 rounded-xl bg-emerald-100/70 flex items-center justify-center border border-emerald-200/50 text-emerald-600 flex-shrink-0">
                <span className="material-symbols-outlined text-[24px]">medical_information</span>
              </div>
              <div className="flex-1 space-y-1">
                <h4 className="text-sm font-bold text-emerald-900 tracking-wider uppercase font-display">Informasi Tes Kesehatan</h4>
                <p className="text-emerald-850 text-xs md:text-sm leading-relaxed font-medium">
                  Silakan lakukan pemeriksaan kesehatan di Klinik/Puskesmas/Rumah Sakit terdekat, lalu unggah hasilnya di bawah ini. 
                  Pastikan data akurat sesuai dengan surat keterangan medis yang Anda terima.
                </p>
                <div className="pt-2">
                  <a 
                    href="/contoh-tes-kesehatan.jpg" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition-all duration-300 shadow-xs cursor-pointer active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[16px]">download</span>
                    Unduh / Lihat Contoh Surat Kesehatan
                  </a>
                </div>
              </div>
              <button 
                onClick={() => setCurrentView('dashboard')} 
                className="size-8 flex items-center justify-center text-slate-400 hover:text-slate-650 hover:bg-slate-100/70 rounded-lg transition-all self-start md:self-center cursor-pointer border border-transparent hover:border-slate-200/50"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Column 1: Student Information Summary (Read-Only Info Card) */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
              <div className="border-b border-slate-100 pb-4 flex items-center gap-2.5">
                <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">badge</span>
                </div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-display">
                  Profil Calon Mahasiswa
                </h3>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">No Ujian</span>
                  <div className="flex items-center gap-2.5 px-4 py-3 bg-slate-50/50 border border-slate-100 rounded-xl">
                    <span className="material-symbols-outlined text-slate-400 text-[18px]">qr_code</span>
                    <span className="text-xs font-bold text-slate-650 font-mono">{noUjian}</span>
                    <span className="material-symbols-outlined text-slate-350 text-[14px] ml-auto">lock</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nama Lengkap</span>
                  <div className="flex items-center gap-2.5 px-4 py-3 bg-slate-50/50 border border-slate-100 rounded-xl">
                    <span className="material-symbols-outlined text-slate-400 text-[18px]">person</span>
                    <span className="text-xs font-bold text-slate-650 uppercase truncate">{studentName}</span>
                    <span className="material-symbols-outlined text-slate-355 text-[14px] ml-auto">lock</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Program Studi</span>
                  <div className="flex items-center gap-2.5 px-4 py-3 bg-slate-50/50 border border-slate-100 rounded-xl">
                    <span className="material-symbols-outlined text-slate-400 text-[18px]">school</span>
                    <span className="text-xs font-bold text-slate-650 uppercase truncate">{major}</span>
                    <span className="material-symbols-outlined text-slate-355 text-[14px] ml-auto">lock</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2 & 3: Main Editable Health Form */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 lg:p-8">
              <div className="border-b border-slate-100 pb-4 mb-6 flex items-center gap-2.5">
                <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">edit_note</span>
                </div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-display">
                  Formulir Data Kesehatan
                </h3>
              </div>

              <form onSubmit={handleHealthSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 ml-0.5">Tinggi Badan (cm)</label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-4 text-primary text-[18px]">height</span>
                      <input 
                        type="number" 
                        placeholder="Contoh: 170"
                        className="w-full pl-11 pr-5 py-3 bg-slate-50/50 focus:bg-white border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-xl transition-all duration-350 text-sm font-medium text-slate-700 placeholder-slate-400"
                        value={healthForm.tinggi_badan}
                        onChange={e => setHealthForm({...healthForm, tinggi_badan: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 ml-0.5">Golongan Darah</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary text-[18px]">bloodtype</span>
                      <select 
                        className="w-full pl-11 pr-10 py-3 bg-slate-50/50 focus:bg-white border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-xl transition-all duration-350 text-sm font-medium text-slate-700 appearance-none cursor-pointer"
                        value={healthForm.golongan_darah}
                        onChange={e => setHealthForm({...healthForm, golongan_darah: e.target.value})}
                        required
                      >
                        <option value="">Pilih Golongan Darah</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="AB">AB</option>
                        <option value="O">O</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[18px]">keyboard_arrow_down</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 ml-0.5">Tes Buta Warna</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary text-[18px]">visibility</span>
                      <select 
                        className="w-full pl-11 pr-10 py-3 bg-slate-50/50 focus:bg-white border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-xl transition-all duration-350 text-sm font-medium text-slate-700 appearance-none cursor-pointer"
                        value={healthForm.buta_warna}
                        onChange={e => setHealthForm({...healthForm, buta_warna: e.target.value})}
                      >
                        <option value="Tidak Buta Warna">Tidak Buta Warna</option>
                        <option value="Buta Warna Parsial">Buta Warna Parsial</option>
                        <option value="Buta Warna Total">Buta Warna Total</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[18px]">keyboard_arrow_down</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 ml-0.5">Tekanan Darah (mmHg)</label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-4 text-primary text-[18px]">monitor_heart</span>
                      <input 
                        type="text" 
                        placeholder="Contoh: 120/80"
                        className="w-full pl-11 pr-5 py-3 bg-slate-50/50 focus:bg-white border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-xl transition-all duration-350 text-sm font-medium text-slate-700 placeholder-slate-400"
                        value={healthForm.tekanan_darah}
                        onChange={e => setHealthForm({...healthForm, tekanan_darah: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 ml-0.5">Riwayat Penyakit (Opsional)</label>
                  <div className="relative flex">
                    <span className="material-symbols-outlined absolute left-4 top-3.5 text-primary text-[18px]">medical_services</span>
                    <textarea 
                      className="w-full pl-11 pr-5 py-3 bg-slate-50/50 focus:bg-white border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-xl transition-all duration-350 text-sm font-medium text-slate-700 placeholder-slate-400 resize-none h-24"
                      placeholder="Masukkan riwayat penyakit penting jika ada..."
                      value={healthForm.riwayat_penyakit}
                      onChange={e => setHealthForm({...healthForm, riwayat_penyakit: e.target.value})}
                    />
                  </div>
                </div>

                {/* File Upload Zone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 ml-0.5">Unggah Bukti Tes Kesehatan</label>
                  <div 
                    onClick={() => document.getElementById('bukti_kesehatan_input')?.click()}
                    className="group relative border-2 border-dashed border-primary/20 hover:border-primary bg-primary/3 hover:bg-primary/5 rounded-xl p-6 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center"
                  >
                    <input 
                      id="bukti_kesehatan_input"
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
                      className="hidden"
                      accept="image/*,.pdf"
                      required={!buktiFile}
                    />
                    {buktiFile ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="size-12 rounded-xl bg-teal-50 text-primary flex items-center justify-center">
                          <span className="material-symbols-outlined text-[28px]">description</span>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-slate-700 max-w-xs md:max-w-md truncate">{buktiFile.name}</p>
                          <p className="text-xs text-slate-400">{(buktiFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setBuktiFile(null);
                            const input = document.getElementById('bukti_kesehatan_input') as HTMLInputElement;
                            if (input) input.value = '';
                          }}
                          className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-semibold transition-colors"
                        >
                          <span className="material-symbols-outlined text-[14px]">delete</span>
                          Hapus File
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <div className="size-12 rounded-xl bg-primary/10 group-hover:bg-primary/20 text-primary flex items-center justify-center transition-colors">
                          <span className="material-symbols-outlined text-[28px]">cloud_upload</span>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-primary">Pilih file atau seret ke sini</p>
                          <p className="text-xs text-slate-400 font-medium">Format: JPG, PNG, PDF (Maksimal 5MB)</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit and Cancel Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
                  <button 
                    type="submit" 
                    disabled={isSubmittingHealth}
                    className="w-full sm:w-auto px-8 py-3 bg-primary hover:bg-primary-dark disabled:bg-primary/50 text-white rounded-xl shadow-xs font-bold text-xs uppercase tracking-wider transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmittingHealth ? (
                      <span className="material-symbols-outlined animate-spin text-[16px]">sync</span>
                    ) : (
                      <span className="material-symbols-outlined text-[16px]">save</span>
                    )}
                    {isSubmittingHealth ? 'Menyimpan...' : 'Simpan Data'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setCurrentView('dashboard')}
                    className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-650 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 text-center cursor-pointer"
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
    <div className="flex-1 overflow-y-auto p-6 lg:p-10 bg-slate-50/50 custom-scrollbar animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="relative overflow-hidden bg-primary rounded-2xl p-8 lg:p-10 text-white shadow-sm">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="size-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-lg shadow-black/5">
                <span className="material-symbols-outlined text-[28px]">content_paste</span>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="px-2 py-0.5 bg-white/10 text-white text-[9px] font-bold uppercase tracking-widest rounded border border-white/20">Wajib</span>
                  <h3 className="text-xl font-bold tracking-tight uppercase font-display">Tes Wawancara</h3>
                </div>
                <p className="text-xs text-primary-light font-medium">Sampaikan aspirasi dan motivasi Anda dengan jujur.</p>
              </div>
            </div>
            <button 
              onClick={() => setCurrentView('dashboard')} 
              className="size-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-xl transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 lg:p-10">
            {isLoadingWawancara ? (
              <div className="py-20 text-center flex flex-col items-center gap-4">
                <div className="size-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Memuat Soal...</p>
              </div>
            ) : wawancaraQuestions.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center gap-4 text-slate-400">
                <span className="material-symbols-outlined text-5xl opacity-20">inventory_2</span>
                <p className="text-xs font-bold uppercase tracking-widest">Belum ada soal wawancara yang tersedia.</p>
                <button 
                  onClick={() => setCurrentView('dashboard')}
                  className="mt-4 px-8 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all cursor-pointer"
                >
                  Kembali
                </button>
              </div>
            ) : (
              <form onSubmit={handleWawancaraSubmit} className="space-y-10">
                {wawancaraQuestions.map((q: any, idx: number) => (
                  <div key={q.id} className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs border border-primary/15">
                        {idx + 1}
                      </div>
                      <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Pertanyaan {idx + 1}</p>
                    </div>

                    <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 text-slate-700 font-semibold leading-relaxed text-sm rich-text-content" dangerouslySetInnerHTML={{ __html: q.pertanyaan }}></div>
                    
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1 block">Jawaban Anda</label>
                      <textarea 
                        required
                        value={wawancaraAnswers[q.id] || ''}
                        onChange={(e) => setWawancaraAnswers({ ...wawancaraAnswers, [q.id]: e.target.value })}
                        className="w-full h-32 p-5 bg-white border border-slate-250 focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-2xl transition-all duration-300 outline-none text-slate-700 font-medium placeholder:text-slate-350 shadow-xs"
                        placeholder="Ketik jawaban lengkap Anda di sini..."
                      ></textarea>
                    </div>
                  </div>
                ))}

                <div className="flex items-center gap-3 pt-8 border-t border-slate-100">
                  <button 
                    type="submit"
                    disabled={isSubmittingWawancara}
                    className="px-8 py-3.5 bg-gradient-to-r from-[#00857A] to-[#00695C] hover:from-[#00695C] hover:to-[#00857A] text-white rounded-xl shadow-lg shadow-primary/20 font-bold text-xs uppercase tracking-wider transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmittingWawancara ? (
                      <>
                        <span className="material-symbols-outlined animate-spin text-[16px]">sync</span>
                        Sedang Menyimpan...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[16px]">send</span>
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
                    className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-650 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer"
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
        <div className="relative bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-slate-100 overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="size-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined text-[28px]">app_registration</span>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="px-2 py-0.5 bg-primary/10 text-primary text-[9px] font-bold uppercase tracking-widest rounded border border-primary/15">Tahap Akhir</span>
                  <h3 className="text-xl font-bold text-slate-800 tracking-tight uppercase font-display">Registrasi Ulang</h3>
                </div>
                <p className="text-xs text-slate-400 font-medium">Lengkapi administrasi untuk mendapatkan NIM Resmi.</p>
              </div>
            </div>
            <button 
              onClick={() => setCurrentView('dashboard')} 
              className="size-10 flex items-center justify-center bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-xl transition-all duration-300 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Left Column: Instructions & Info */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col space-y-8 animate-in slide-in-from-left-8 duration-700">
            <div className="space-y-4">
              <div className="size-12 rounded-xl bg-primary text-white flex items-center justify-center shadow-md shadow-primary/20">
                <span className="material-symbols-outlined text-[24px]">info</span>
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-800 uppercase tracking-tight font-display">Instruksi Pembayaran</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Silakan unggah bukti transfer atau kwitansi pembayaran registrasi ulang Anda untuk mendapatkan Nomor Induk Mahasiswa (NIM).
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Registration Period Info Box */}
              {schedule && schedule.tanggal_registrasi_mulai && schedule.tanggal_registrasi_akhir && (
                <div className="p-5 bg-amber-50/50 rounded-2xl border border-amber-200/60 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="flex items-center gap-3 text-amber-700">
                    <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                    <span className="text-[9px] font-bold uppercase tracking-widest">Batas Waktu Registrasi Ulang</span>
                  </div>
                  <div className="space-y-2 text-[12px] text-slate-700 font-medium">
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
                    <p className="text-[9px] text-amber-600 font-bold uppercase tracking-wider mt-3 text-center bg-amber-100/30 py-1.5 rounded-lg border border-amber-200/40">
                      ⚠️ Harap lakukan registrasi ulang sebelum batas waktu
                    </p>
                  </div>
                </div>
              )}

              <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-4">
                <div className="flex items-center gap-3 text-primary">
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest">Ketentuan File</span>
                </div>
                <ul className="space-y-2.5">
                  {[
                    'Format file JPG, PNG, atau PDF',
                    'Ukuran file maksimal 5 MB',
                    'Data transfer harus terlihat jelas',
                    'Verifikasi dilakukan dalam 1x24 jam'
                  ].map((text, i) => (
                    <li key={i} className="flex items-center gap-3 text-[11px] text-slate-600 font-medium">
                      <div className="size-1 bg-primary rounded-full"></div>
                      {text}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bank Account Info Card */}
              <div className="p-6 bg-gradient-to-tr from-[#00857A] to-[#00695C] rounded-2xl text-white space-y-4 shadow-lg shadow-primary/10 group/bank">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[20px] group-hover/bank:rotate-12 transition-transform">account_balance</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest">Rekening Pembayaran</span>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] text-primary-light font-bold uppercase tracking-widest">Bank BTN Syariah</p>
                  <p className="text-lg font-bold tracking-tight font-mono">00323-01-30-000028-7</p>
                  <p className="text-[10px] text-white/90 font-medium">a.n. Yayasan Hang Tuah Pekanbaru</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Upload Form */}
          <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-slate-100 flex flex-col animate-in slide-in-from-right-8 duration-700">
            <form onSubmit={handleRegistrasiSubmit} className="flex-1 flex flex-col space-y-6">
              <div className="space-y-6 flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px]">upload_file</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest font-display">Unggah Dokumen</h4>
                  </div>
                  <span className="text-[9px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md border border-primary/15">Wajib</span>
                </div>

                <div className={`relative flex-1 group transition-all duration-300 border-2 border-dashed rounded-2xl p-6 text-center flex flex-col items-center justify-center min-h-[260px] ${buktiRegistrasiFile ? 'border-primary bg-primary/3' : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'}`}>
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
                    <div className={`size-14 mx-auto rounded-xl flex items-center justify-center transition-all duration-300 ${buktiRegistrasiFile ? 'bg-primary text-white shadow-md' : 'bg-white text-slate-350 shadow-xs'}`}>
                      <span className="material-symbols-outlined text-[28px]">
                        {buktiRegistrasiFile ? 'check_circle' : 'add_photo_alternate'}
                      </span>
                    </div>
                    
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-slate-800 tracking-tight max-w-[200px] mx-auto truncate">
                        {buktiRegistrasiFile ? buktiRegistrasiFile.name : 'Pilih Bukti Pembayaran'}
                      </h4>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
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
                  className="w-full group relative py-3.5 bg-gradient-to-r from-[#00857A] to-[#00695C] hover:from-[#00695C] hover:to-[#00857A] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-md shadow-primary/25 disabled:opacity-50 active:scale-98 overflow-hidden cursor-pointer"
                >
                  <div className="relative z-10 flex items-center justify-center gap-2">
                    {isSubmittingRegistrasi ? (
                      <span className="material-symbols-outlined animate-spin text-[16px]">sync</span>
                    ) : (
                      <span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">send</span>
                    )}
                    {isSubmittingRegistrasi ? 'Memproses...' : 'Submit Registrasi'}
                  </div>
                </button>
                
                <button 
                  type="button" 
                  onClick={() => setCurrentView('dashboard')}
                  className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-650 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer"
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
        <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-slate-100">
          
          <div className="relative z-10 flex items-center justify-between gap-8 border-b border-slate-100 pb-6">
            <div className="flex items-center gap-6">
              <button 
                onClick={() => setCurrentView('dashboard')}
                className="size-11 rounded-xl bg-slate-50 border border-slate-100 text-slate-500 flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-all duration-300 active:scale-95 hover:rotate-12"
              >
                <span className="material-symbols-outlined text-[24px]">arrow_back</span>
              </button>
              <div>
                <h2 className="text-xl font-bold text-slate-800 tracking-tight font-display">HASIL SELEKSI</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Status kelulusan resmi Anda</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 space-y-8">
            {isLulus ? (
              <div className="space-y-8">
                {/* Two-Column Success Display */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in zoom-in duration-700">
                  {/* Left Card: Status Message */}
                  <div className="p-8 lg:p-10 bg-primary rounded-2xl text-white shadow-md border border-primary-dark/10 flex flex-col justify-between gap-6">
                    <div className="space-y-6">
                      <div className="size-12 rounded-xl bg-white/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[26px] text-gold">workspace_premium</span>
                      </div>
                      <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-white/15 rounded-md text-gold text-[9px] font-bold uppercase tracking-wider">
                          <span className="size-1.5 bg-gold rounded-full animate-pulse"></span>
                          Seleksi Selesai
                        </div>
                        <h3 className="text-xl lg:text-2xl font-bold tracking-tight leading-snug font-display text-white">
                          Selamat! Anda Dinyatakan <br/>
                          <span className="text-gold uppercase font-black tracking-wide">
                            Lulus Seleksi
                          </span>
                        </h3>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-white/10 mt-auto">
                      <p className="text-white/85 text-[11px] md:text-xs font-medium leading-relaxed italic pl-3 border-l-2 border-white/30">
                        Teruslah berkarya dan jadilah bagian dari perubahan positif bersama Universitas Hang Tuah Pekanbaru.
                      </p>
                    </div>
                  </div>

                  {/* Right Card: Actions & Details */}
                  <div className="p-8 lg:p-10 bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col justify-between gap-6">
                    <div className="space-y-6">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Program Studi Tujuan</p>
                        <h4 className="text-lg font-bold text-slate-800 leading-tight font-display">{major}</h4>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100/60 flex items-center gap-3">
                          <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                            <span className="material-symbols-outlined text-[20px]">badge</span>
                          </div>
                          <div>
                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Nomor Ujian</span>
                            <span className="text-[12px] font-bold text-slate-700 font-mono">{noUjian}</span>
                          </div>
                        </div>

                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100/60 flex items-center gap-3">
                          <div className="size-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center flex-shrink-0">
                            <span className="material-symbols-outlined text-[20px]">calendar_today</span>
                          </div>
                          <div>
                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Gelombang</span>
                            <span className="text-[12px] font-bold text-slate-700">{studentGelombang}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={handlePrintSKL}
                      className="w-full py-4 bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-xs transition-all duration-300 flex items-center justify-center gap-2.5 active:scale-[0.98] cursor-pointer group"
                    >
                      <span className="material-symbols-outlined text-[20px] transition-transform duration-300">download_for_offline</span>
                      Unduh SKL Resmi
                    </button>
                  </div>
                </div>

                {/* Next Steps Grid - Refined 3 Column Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { step: '1', title: 'Unduh SKL', desc: 'Cetak Surat Keterangan Lulus resmi.', icon: 'description', color: 'primary' },
                    { step: '2', title: 'Pembayaran', desc: 'Transfer ke rekening resmi UHTP.', icon: 'payments', color: 'primary' },
                    { step: '3', title: 'Registrasi', desc: 'Unggah bukti bayar untuk NIM.', icon: 'app_registration', color: 'primary' }
                  ].map((item: any, i: number) => (
                    <div key={i} className="flex flex-col gap-4 p-5 rounded-xl bg-white border border-slate-100 shadow-xs">
                      <div className="flex items-center justify-between">
                        <div className="size-10 rounded-lg bg-primary/5 text-primary flex items-center justify-center flex-shrink-0">
                          <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                        </div>
                        <span className="text-[9px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Langkah 0{item.step}</span>
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-slate-800 tracking-tight">
                           {item.title}
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Status Registrasi If Already Done */}
                {statusRegistrasi !== 'Belum Registrasi' && (
                  <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col md:flex-row items-center gap-6 shadow-xs">
                    <div className="size-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-[26px]">check_circle</span>
                    </div>
                    <div className="flex-1 space-y-1 text-center md:text-left">
                      <h3 className="text-base font-bold text-slate-800 uppercase tracking-wide font-display">Administrasi Selesai</h3>
                      <p className="text-slate-600 font-medium text-xs">
                        Anda telah mengunggah bukti registrasi. Status saat ini: 
                        <span className="px-2.5 py-0.5 bg-emerald-500 text-white rounded text-[8px] font-bold uppercase tracking-wider ml-2 inline-block">
                          {statusRegistrasi}
                        </span>
                      </p>
                    </div>
                    <button 
                      onClick={handlePrintKwitansi}
                      className="w-full md:w-auto px-5 py-3 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition-all duration-300 rounded-lg text-xs font-bold uppercase tracking-wider shadow-xs active:scale-95 cursor-pointer text-center"
                    >
                      Lihat Kwitansi
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center p-10 bg-rose-50/20 rounded-3xl border border-rose-100/60 shadow-xs text-center space-y-6">
                <div className="size-20 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center shadow-inner border border-rose-100/40">
                  <span className="material-symbols-outlined text-[40px]">cancel</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-rose-900 uppercase tracking-wider font-display">Maaf, Anda Belum Lulus</h3>
                  <p className="text-slate-500 text-xs leading-relaxed max-w-md font-medium mx-auto">
                    Tetap semangat dan pantang menyerah. Kegagalan hari ini adalah langkah awal menuju kesuksesan di masa depan. Anda dapat mencoba kembali di gelombang berikutnya.
                  </p>
                </div>
                <button 
                  onClick={() => setCurrentView('dashboard')}
                  className="px-8 py-3.5 bg-white border border-rose-200 text-rose-600 hover:bg-rose-600 hover:text-white transition-all duration-300 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-xs cursor-pointer active:scale-95"
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
    <div className="flex h-screen w-full bg-slate-50 font-sans overflow-hidden animate-in fade-in duration-700">
      
      {/* Refined Sidebar */}
      <div className="w-72 bg-slate-900 flex flex-col p-8 hidden lg:flex relative overflow-y-auto border-r border-slate-800 custom-scrollbar">
        
        <div className="flex items-center gap-4 mb-6 relative z-10">
          <div className="size-12 bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-700">
            <span className="material-symbols-outlined text-gold text-2xl">school</span>
          </div>
          <div>
            <h2 className="text-base font-black tracking-tight text-white uppercase font-display">SPMB Portal</h2>
            <p className="text-[8px] font-extrabold text-slate-300 uppercase tracking-widest bg-slate-800 px-1.5 py-0.5 rounded-md w-fit border border-slate-700 mt-0.5">v2.0 stable</p>
          </div>
        </div>

        {/* Profile Section */}
        <div className="mb-6 text-center px-2 relative z-10">
          <div className="relative size-20 mx-auto rounded-full p-1 bg-gradient-to-tr from-[#00857A] via-white/10 to-[#D4AF37] shadow-2xl mb-4 transition-transform duration-500 hover:rotate-6">
            {photoUrl ? (
              <img src={photoUrl} alt="Profil" className="w-full h-full rounded-full object-cover" />
            ) : (
              <div className="w-full h-full rounded-full flex items-center justify-center bg-gradient-to-tr from-[#00857A] to-[#00695C] text-white">
                <span className="material-symbols-outlined text-[28px]">person</span>
              </div>
            )}
          </div>
          <h3 className="text-xs font-bold text-slate-200 tracking-wide font-display mt-3 truncate">{studentName}</h3>
          <div className="flex items-center justify-center gap-1.5 mt-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-primary/10 border border-primary/20 rounded-full">
              <span className="relative flex size-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full size-1.5 bg-emerald-500"></span>
              </span>
              <span className="text-[8px] text-primary-light font-bold uppercase tracking-widest">Siswa Aktif</span>
            </div>
          </div>
        </div>

        <nav className="space-y-2 relative z-10">
          <button 
            onClick={() => setCurrentView('dashboard')}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 group active:scale-95 border-l-4 ${
              currentView === 'dashboard' 
              ? 'bg-white/10 text-white border-gold font-bold' 
              : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border-transparent'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">dashboard</span>
            <span className="text-xs font-bold uppercase tracking-widest">Dashboard</span>
          </button>
        </nav>

        {/* Logout Button */}
        <button 
          onClick={onLogout}
          className="mt-auto flex items-center gap-4 px-5 py-4 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-all duration-300 group font-bold text-[10px] uppercase tracking-wider relative z-10 border border-transparent hover:border-rose-500/15"
        >
          <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">logout</span>
          Keluar
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <header className="px-10 py-6 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-xs flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <div className="size-10 rounded-xl bg-primary/10 border border-primary/10 flex items-center justify-center text-primary shadow-inner">
              <span className="material-symbols-outlined">person</span>
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-800 tracking-tight flex items-center gap-2 font-display">
                Portal Mahasiswa
                <span className="relative flex size-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full size-1.5 bg-emerald-500"></span>
                </span>
              </h1>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide mt-0.5">
                No Ujian: <span className="text-primary font-bold">{noUjian}</span> • {formattedTime}
              </p>
            </div>
          </div>
          <div className="text-right hidden md:block group">
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Program Studi</div>
            <div className="text-sm font-bold text-slate-700 uppercase tracking-tight font-display">{major}</div>
          </div>
        </header>

        {/* Content Body */}
        {currentView === 'dashboard' ? (
          <main className="flex-1 overflow-y-auto p-8 lg:p-10 space-y-10 custom-scrollbar">
            
            {/* Welcome Banner */}
            <section className="relative p-8 lg:p-10 bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md animate-in fade-in slide-in-from-top-4 duration-700">
              <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                <div className="size-16 rounded-2xl bg-primary text-white flex items-center justify-center shadow-sm flex-shrink-0">
                  <span className="material-symbols-outlined text-[32px]">waving_hand</span>
                </div>
                <div className="text-center md:text-left space-y-2">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                    <h2 className="text-xl lg:text-2xl font-bold tracking-tight text-slate-800 font-display">
                      {(() => {
                        const hours = currentTime.getHours();
                        if (hours < 11) return 'Selamat Pagi';
                        if (hours < 15) return 'Selamat Siang';
                        if (hours < 18) return 'Selamat Sore';
                        return 'Selamat Malam';
                      })()}, <span className="text-primary">{studentName}</span>
                    </h2>
                    <span className="px-2.5 py-0.5 bg-primary/10 text-primary text-[9px] font-bold uppercase tracking-widest rounded-md border border-primary/20">Siswa Aktif</span>
                  </div>
                  <p className="text-slate-500 text-xs md:text-sm font-medium leading-relaxed max-w-2xl">
                    Sistem Seleksi Penerimaan Mahasiswa Baru Digital Universitas Hang Tuah Pekanbaru. 
                    Pantau tahapan pendaftaran Anda di bawah ini secara real-time.
                  </p>
                </div>
              </div>
            </section>

            {/* Steps Grid */}
            <section className={`grid grid-cols-1 ${
              (3 + (hasKesehatan ? 1 : 0) + (hasWawancara ? 1 : 0)) === 3 ? 'md:grid-cols-3' :
              (3 + (hasKesehatan ? 1 : 0) + (hasWawancara ? 1 : 0)) === 4 ? 'md:grid-cols-4' :
              'md:grid-cols-5'
            } gap-6`}>
              {/* Step 1: Online Exam */}
              <button 
                onClick={(hasFinishedExam || !isExamOpen) ? undefined : onStartExam}
                disabled={hasFinishedExam || !isExamOpen || isLoadingSchedule}
                className={`group relative flex flex-col p-6 rounded-2xl text-left transition-all duration-300 border ${
                  hasFinishedExam 
                  ? 'bg-slate-50/80 border-slate-100 opacity-90 cursor-not-allowed' 
                  : !isExamOpen 
                    ? 'bg-slate-100/60 border-slate-100/50 opacity-60 cursor-not-allowed'
                    : 'bg-white border-slate-100 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 cursor-pointer'
                }`}
              >
                <div className="w-full flex items-center justify-between mb-6">
                  <div className={`size-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    hasFinishedExam 
                    ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' 
                    : !isExamOpen 
                      ? 'bg-slate-200 text-slate-400'
                      : 'bg-primary text-white shadow-xs'
                  }`}>
                    <span className="material-symbols-outlined text-[24px]">
                      {hasFinishedExam ? 'check_circle' : (isExamOpen ? 'computer' : 'lock_clock')}
                    </span>
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">Tahap 1</span>
                </div>
                
                <h3 className={`text-sm font-bold tracking-tight mb-1 font-display ${hasFinishedExam || !isExamOpen ? 'text-slate-500' : 'text-slate-800'}`}>
                  Ujian Online
                </h3>
                <p className={`text-[9px] font-extrabold uppercase tracking-widest ${hasFinishedExam ? 'text-emerald-550' : (!isExamOpen ? 'text-slate-400' : 'text-primary')}`}>
                  {hasFinishedExam ? 'Selesai' : examMessage}
                </p>
              </button>

              {/* Step 2: Health Test */}
              {hasKesehatan && (
                <button 
                  onClick={() => {
                    if (healthStatus) return;
                    if (hasFinishedExam) setCurrentView('kesehatan');
                    else alert('Selesaikan ujian online terlebih dahulu.');
                  }}
                  disabled={!hasFinishedExam || !!healthStatus || isLoadingSchedule}
                  className={`group relative flex flex-col p-6 rounded-2xl text-left transition-all duration-300 border ${
                    healthStatus 
                    ? 'bg-slate-50/80 border-slate-100 opacity-90 cursor-not-allowed' 
                    : hasFinishedExam 
                      ? 'bg-white border-slate-100 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 cursor-pointer' 
                      : 'bg-slate-100/60 border-slate-100/50 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div className="w-full flex items-center justify-between mb-6">
                    <div className={`size-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      healthStatus
                      ? 'bg-emerald-550/10 text-emerald-600 border border-emerald-500/20'
                      : hasFinishedExam 
                        ? 'bg-primary text-white shadow-xs' 
                        : 'bg-slate-200 text-slate-400'
                    }`}>
                      <span className="material-symbols-outlined text-[24px]">
                        {healthStatus ? 'check_circle' : 'medical_services'}
                      </span>
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">Tahap 2</span>
                  </div>
                  
                  <h3 className={`text-sm font-bold tracking-tight mb-1 font-display ${healthStatus || !hasFinishedExam ? 'text-slate-500' : 'text-slate-800'}`}>
                    Tes Kesehatan
                  </h3>
                  
                  <div className="flex flex-col">
                    <p className={`text-[9px] font-extrabold uppercase tracking-widest ${
                      healthStatus ? 'text-emerald-550' : (hasFinishedExam ? 'text-primary' : 'text-slate-400')
                    }`}>
                      {healthStatus ? 'Selesai' : (hasFinishedExam ? 'Silakan Isi' : 'Menunggu')}
                    </p>
                    {healthStatus && (
                      <span className={`mt-2 inline-block px-2 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-wider w-fit shadow-xs ${
                        (healthStatus === 'Sehat' || healthStatus === 'Lulus') ? 'bg-emerald-500 text-white' : 
                        (healthStatus === 'Menunggu') ? 'bg-amber-500 text-white' : 'bg-rose-500 text-white'
                      }`}>
                        {healthStatus === 'Menunggu' ? 'VERIFIKASI' : `STATUS: ${healthStatus}`}
                      </span>
                    )}
                  </div>
                </button>
              )}

              {/* Step 3: Wawancara Test */}
              {hasWawancara && (
                <button 
                  onClick={() => {
                    if (hasilWawancara && hasilWawancara !== 'BELUM UJIAN') return;
                    if (hasFinishedExam) setCurrentView('wawancara');
                    else alert('Selesaikan ujian online terlebih dahulu.');
                  }}
                  disabled={!hasFinishedExam || (hasilWawancara !== null && hasilWawancara !== 'BELUM UJIAN')}
                  className={`group relative flex flex-col p-6 rounded-2xl text-left transition-all duration-300 border ${
                    (hasilWawancara !== null && hasilWawancara !== 'BELUM UJIAN')
                    ? 'bg-slate-50/80 border-slate-100 opacity-90 cursor-not-allowed'
                    : hasFinishedExam 
                      ? 'bg-white border-slate-100 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 cursor-pointer' 
                      : 'bg-slate-100/60 border-slate-100/50 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div className="w-full flex items-center justify-between mb-6">
                    <div className={`size-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      (hasilWawancara && hasilWawancara !== 'BELUM UJIAN')
                      ? 'bg-emerald-550/10 text-emerald-600 border border-emerald-500/20'
                      : hasFinishedExam 
                        ? 'bg-primary text-white shadow-xs' 
                        : 'bg-slate-200 text-slate-400'
                    }`}>
                      <span className="material-symbols-outlined text-[24px]">
                        {(hasilWawancara && hasilWawancara !== 'BELUM UJIAN') ? 'check_circle' : 'content_paste'}
                      </span>
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                      {hasKesehatan ? 'Tahap 3' : 'Tahap 2'}
                    </span>
                  </div>
                  <h3 className={`text-sm font-bold tracking-tight mb-1 font-display ${(hasilWawancara && hasilWawancara !== 'BELUM UJIAN') || !hasFinishedExam ? 'text-slate-500' : 'text-slate-800'}`}>
                    Tes Wawancara
                  </h3>
                  <p className={`text-[9px] font-extrabold uppercase tracking-widest ${
                    (hasilWawancara && hasilWawancara !== 'BELUM UJIAN') ? 'text-emerald-550' : (hasFinishedExam ? 'text-primary' : 'text-slate-400')
                  }`}>
                    {(hasilWawancara && hasilWawancara !== 'BELUM UJIAN') ? 'Selesai' : (hasFinishedExam ? 'Silakan Isi' : 'Menunggu')}
                  </p>
                </button>
              )}

              {/* Step 4: Graduation */}
              <button 
                onClick={() => {
                  if (isFinalStatus) setCurrentView('pengumuman');
                }}
                disabled={!isFinalStatus}
                className={`group relative flex flex-col p-6 rounded-2xl text-left transition-all duration-300 border ${
                  isLulus 
                    ? 'bg-white border-slate-100 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 cursor-pointer' 
                    : isTidakLulus
                      ? 'bg-white border-slate-100 hover:border-rose-500/20 hover:shadow-lg hover:shadow-rose-950/5 hover:-translate-y-1 cursor-pointer'
                      : 'bg-slate-100/60 border-slate-100/50 opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="w-full flex items-center justify-between mb-6">
                  <div className={`size-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    isLulus
                      ? 'bg-primary text-white shadow-xs'
                      : isTidakLulus
                        ? 'bg-rose-500 text-white shadow-xs'
                        : 'bg-slate-200 text-slate-400'
                  }`}>
                    <span className="material-symbols-outlined text-[24px]">
                      {isLulus ? 'workspace_premium' : (isTidakLulus ? 'cancel' : 'campaign')}
                    </span>
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                    {3 + (hasKesehatan ? 1 : 0) + (hasWawancara ? 1 : 0) - 1}
                  </span>
                </div>
                <h3 className={`text-sm font-bold tracking-tight mb-1 font-display ${isFinalStatus ? 'text-slate-800' : 'text-slate-400'}`}>
                  Hasil Seleksi
                </h3>
                <p className={`text-[9px] font-extrabold uppercase tracking-widest ${
                  isLulus ? 'text-primary' : (isTidakLulus ? 'text-rose-500' : 'text-slate-400')
                }`}>
                  {isLulus ? 'Selamat! Anda Lulus' : (isTidakLulus ? 'Maaf, Coba Lagi' : 'Menunggu')}
                </p>
              </button>

              {/* Step 5: Re-registration */}
              <button 
                onClick={() => {
                  if (statusRegistrasi !== 'Belum Registrasi' && statusRegistrasi !== 'Ditolak') return;
                  setCurrentView('registrasi');
                }}
                disabled={!isLulus || (statusRegistrasi !== 'Belum Registrasi' && statusRegistrasi !== 'Ditolak')}
                className={`group relative flex flex-col p-6 rounded-2xl text-left transition-all duration-300 border ${
                  (statusRegistrasi !== 'Belum Registrasi' && statusRegistrasi !== 'Ditolak') 
                  ? 'bg-slate-50/80 border-slate-100 opacity-90 cursor-not-allowed'
                  : isLulus
                    ? 'bg-white border-slate-100 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 cursor-pointer' 
                    : 'bg-slate-100/60 border-slate-100/50 opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="w-full flex items-center justify-between mb-6">
                  <div className={`size-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    (statusRegistrasi === 'Sudah Registrasi' || statusRegistrasi === 'Menunggu Verifikasi')
                    ? 'bg-emerald-550/10 text-emerald-600 border border-emerald-500/20'
                    : isLulus
                      ? 'bg-primary text-white shadow-xs' 
                      : 'bg-slate-200 text-slate-400'
                  }`}>
                    <span className="material-symbols-outlined text-[24px]">
                      {(statusRegistrasi === 'Sudah Registrasi') ? 'check_circle' : 'app_registration'}
                    </span>
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                    {3 + (hasKesehatan ? 1 : 0) + (hasWawancara ? 1 : 0)}
                  </span>
                </div>
                
                <h3 className={`text-sm font-bold tracking-tight mb-1 font-display ${isLulus ? 'text-slate-800' : 'text-slate-400'}`}>
                  Registrasi Ulang
                </h3>
                
                <div className="flex flex-col">
                  <p className={`text-[9px] font-extrabold uppercase tracking-widest ${
                    statusRegistrasi !== 'Belum Registrasi' ? 'text-emerald-550' : (isLulus ? 'text-primary' : 'text-slate-400')
                  }`}>
                    {statusRegistrasi === 'Belum Registrasi' ? (isLulus ? 'Unggah Bukti' : 'Menunggu') : 'Selesai'}
                  </p>
                  {statusRegistrasi !== 'Belum Registrasi' && (
                    <span className={`mt-2 inline-block px-2 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-wider w-fit shadow-xs ${
                      statusRegistrasi === 'Sudah Registrasi' ? 'bg-emerald-500 text-white' : 
                      statusRegistrasi === 'Menunggu Verifikasi' ? 'bg-amber-500 text-white' : 'bg-rose-500 text-white'
                    }`}>
                      {statusRegistrasi}
                    </span>
                  )}
                  {buktiRegistrasiPath && (
                    <a 
                      href={`${API_BASE_URL}/storage/${buktiRegistrasiPath}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mt-2 text-[9px] font-bold text-primary hover:underline flex items-center gap-1 w-fit"
                    >
                      <span className="material-symbols-outlined text-[12px]">visibility</span>
                      Lihat Bukti
                    </a>
                  )}
                </div>

                {/* Registration Dates Period */}
                {schedule && schedule.tanggal_registrasi_mulai && schedule.tanggal_registrasi_akhir ? (
                  <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-1 text-left w-full">
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-primary">calendar_month</span>
                      Periode Registrasi
                    </span>
                    <div className="flex flex-col gap-0.5 mt-1 pl-4">
                      <span className="text-[10px] font-bold text-slate-700">
                        {new Date(schedule.tanggal_registrasi_mulai).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest my-0.5">s/d</span>
                      <span className="text-[10px] font-bold text-slate-750">
                        {new Date(schedule.tanggal_registrasi_akhir).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-1 text-left w-full text-[9px] font-semibold text-slate-400">
                    <span className="material-symbols-outlined text-[14px]">calendar_month</span>
                    <span>Jadwal belum ditentukan</span>
                  </div>
                )}
              </button>
            </section>

            <section className="bg-white rounded-3xl p-8 lg:p-10 border border-slate-100 shadow-sm">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-3 border-b border-slate-50 pb-4">
                <span className="material-symbols-outlined text-primary text-[20px]">gavel</span>
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
                  <li key={idx} className="flex gap-4 p-4 bg-slate-50/50 rounded-xl border border-slate-100/80 text-xs font-medium text-slate-600 leading-relaxed transition-all duration-300 hover:border-primary/15 hover:bg-white hover:shadow-xs group">
                    <div className="size-5 rounded-full bg-primary/10 text-primary flex-shrink-0 flex items-center justify-center text-[10px] font-bold transition-colors group-hover:bg-primary group-hover:text-white">
                      {idx + 1}
                    </div>
                    <span>{rule}</span>
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
