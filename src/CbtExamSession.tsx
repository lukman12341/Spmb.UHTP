import React, { useState, useEffect, useCallback } from 'react';
import { API_BASE_URL } from './config';

interface Soal {
  id: number;
  pertanyaan: string;
  pilihan_a: string;
  pilihan_b: string;
  pilihan_c: string;
  pilihan_d: string;
  jawaban: string;
  status: string;
}

interface CbtExamSessionProps {
  noUjian: string;
  studentName: string;
  major: string;
  jalur: string;
  globalEndTime?: string; // ISO string or YYYY-MM-DDTHH:mm
  onFinish: (score: number, details: any[]) => void;
}

const CbtExamSession: React.FC<CbtExamSessionProps> = ({ noUjian, studentName, major, jalur, globalEndTime, onFinish }) => {
  const [soalList, setSoalList] = useState<Soal[]>([]);
  
  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    const saved = localStorage.getItem(`cbt_current_index_${noUjian}`);
    return saved ? parseInt(saved, 10) : 0;
  });
  
  const [answers, setAnswers] = useState<Record<number, string>>(() => {
    const saved = localStorage.getItem(`cbt_answers_${noUjian}`);
    return saved ? JSON.parse(saved) : {};
  });
  
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    const saved = localStorage.getItem(`cbt_time_left_${noUjian}`);
    return saved ? parseInt(saved, 10) : 7200; // 120 menit dalam detik
  });
  
  const [isLoading, setIsLoading] = useState(true);

  // Use refs to avoid closure issues in autoFinish (timer)
  const soalListRef = React.useRef(soalList);
  const answersRef = React.useRef(answers);

  React.useEffect(() => { soalListRef.current = soalList; }, [soalList]);
  React.useEffect(() => { answersRef.current = answers; }, [answers]);

  const clearBackup = useCallback(() => {
    localStorage.removeItem(`cbt_answers_${noUjian}`);
    localStorage.removeItem(`cbt_time_left_${noUjian}`);
    localStorage.removeItem(`cbt_current_index_${noUjian}`);
  }, [noUjian]);

  const changeIndex = (idx: number) => {
    setCurrentIndex(idx);
    localStorage.setItem(`cbt_current_index_${noUjian}`, idx.toString());
  };

  const autoFinish = useCallback(() => {
    let score = 0;
    const currentSoalList = soalListRef.current;
    const currentAnswers = answersRef.current;
    
    const details = currentSoalList.map((soal) => {
      const isCorrect = currentAnswers[soal.id] === soal.jawaban;
      if (isCorrect) score += 1;
      return {
        no_ujian: noUjian,
        pertanyaan: soal.pertanyaan,
        jawaban: currentAnswers[soal.id] || '-',
        kunci: soal.jawaban,
        status: isCorrect ? 'Betul' : 'Salah'
      };
    });
    clearBackup();
    onFinish(score, details);
  }, [noUjian, onFinish, clearBackup]);

  const fetchSoal = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/soal?soal_untuk=${jalur}&prodi=${encodeURIComponent(major)}`);
      const data = await response.json();
      
      // Menangani berbagai kemungkinan format response (Array atau Object)
      const rawData = Array.isArray(data) ? data : (data.data || []);
      
      // Filter hanya soal yang berstatus 'aktif'
      const activeSoal = rawData.filter((s: Soal) => s.status === 'aktif' || s.status === 'Aktif');
      setSoalList(activeSoal);
    } catch (error) {
      console.error('Error fetching soal:', error);
    } finally {
      setIsLoading(false);
    }
  }, [jalur, major]);

  useEffect(() => {
    fetchSoal();
    const timer = setInterval(() => {
      // 1. Sisa waktu lokal (120 menit)
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          autoFinish();
          return 0;
        }
        const nextTime = prev - 1;
        localStorage.setItem(`cbt_time_left_${noUjian}`, nextTime.toString());
        return nextTime;
      });

      // 2. Batas waktu global dari Jadwal Admin
      if (globalEndTime) {
        const now = new Date();
        const end = new Date(globalEndTime);
        if (now >= end) {
          clearInterval(timer);
          alert("Waktu ujian telah berakhir berdasarkan jadwal. Ujian Anda akan dikumpulkan otomatis.");
          autoFinish();
        }
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [globalEndTime, fetchSoal, autoFinish, noUjian]);

  const handleAnswerSelect = (jawaban: string) => {
    const updatedAnswers = { ...answers, [soalList[currentIndex].id]: jawaban };
    setAnswers(updatedAnswers);
    localStorage.setItem(`cbt_answers_${noUjian}`, JSON.stringify(updatedAnswers));
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSubmit = () => {
    if (window.confirm("Apakah Anda yakin ingin mengakhiri ujian?")) {
      let score = 0;
      const details = soalList.map((soal) => {
        const isCorrect = answers[soal.id] === soal.jawaban;
        if (isCorrect) score += 1;
        return {
          no_ujian: noUjian,
          pertanyaan: soal.pertanyaan,
          jawaban: answers[soal.id] || '-',
          kunci: soal.jawaban,
          status: isCorrect ? 'Betul' : 'Salah'
        };
      });
      clearBackup();
      onFinish(score, details);
    }
  };

  if (isLoading) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 gap-4">
      <div className="size-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Memuat Butir Soal...</p>
    </div>
  );

  if (soalList.length === 0) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 gap-4">
      <span className="material-symbols-outlined text-6xl text-slate-300">inventory_2</span>
      <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Belum ada soal tersedia untuk jalur ini.</p>
      <button onClick={() => window.location.reload()} className="px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold">Kembali</button>
    </div>
  );

  const currentSoal = soalList[currentIndex];

  return (
    <div className="h-full w-full bg-slate-50/50 flex flex-col font-sans">
      {/* Header Sesi Ujian */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="size-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">description</span>
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800">Ujian Online - {jalur}</h1>
            <p className="text-xs font-medium text-slate-500">{studentName} • {noUjian}</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-xs font-semibold text-slate-500 mb-0.5">Sisa Waktu</p>
            <div className={`text-lg font-mono font-bold ${timeLeft < 300 ? 'text-rose-600 animate-pulse' : 'text-slate-800'}`}>
              {formatTime(timeLeft)}
            </div>
          </div>
          <div className="h-8 w-px bg-slate-200"></div>
          <button 
            onClick={handleSubmit}
            className="px-5 py-2 bg-white border border-rose-200 text-rose-600 text-sm font-semibold rounded-lg hover:bg-rose-50 hover:text-rose-700 transition-colors flex items-center gap-2 shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">done_all</span>
            Selesai Ujian
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <aside className="w-72 bg-white border-r border-slate-200/60 p-6 flex flex-col hidden lg:flex shadow-sm z-20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Navigasi Soal</h3>
            <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-500">{Object.keys(answers).length}/{soalList.length} Dijawab</span>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
            <div className="grid grid-cols-5 gap-2">
              {soalList.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => changeIndex(idx)}
                  className={`h-9 w-full rounded border flex items-center justify-center text-xs font-semibold transition-colors ${
                    currentIndex === idx 
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm' 
                      : answers[soalList[idx].id] 
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100' 
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Question Area */}
        <main className="flex-1 p-6 lg:p-10 overflow-y-auto relative bg-slate-50/50 custom-scrollbar">
          <div className="max-w-3xl mx-auto space-y-8 pb-10">
            {/* Question Card */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 relative">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-widest rounded-md border border-slate-200">
                  Soal No. {currentIndex + 1}
                </span>
              </div>
              <div 
                className="text-base text-slate-800 leading-relaxed mb-8 font-medium rich-text-content"
                dangerouslySetInnerHTML={{ __html: currentSoal.pertanyaan }}
              ></div>

              <div className="space-y-3">
                {[
                  { key: 'A', text: currentSoal.pilihan_a },
                  { key: 'B', text: currentSoal.pilihan_b },
                  { key: 'C', text: currentSoal.pilihan_c },
                  { key: 'D', text: currentSoal.pilihan_d }
                ].map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => handleAnswerSelect(opt.key)}
                    className={`w-full flex items-start gap-4 p-4 rounded-xl border transition-colors text-left group ${
                      answers[currentSoal.id] === opt.key 
                        ? 'bg-emerald-50/50 border-emerald-400 text-emerald-900' 
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className={`flex-shrink-0 size-7 rounded-lg flex items-center justify-center font-bold text-xs transition-colors mt-0.5 ${
                      answers[currentSoal.id] === opt.key 
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-700'
                    }`}>
                      {opt.key}
                    </div>
                    <span className="text-[15px] leading-relaxed pt-1">{opt.text}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-2">
              <button 
                onClick={() => changeIndex(Math.max(0, currentIndex - 1))}
                disabled={currentIndex === 0}
                className="flex items-center gap-2 px-5 py-2.5 text-slate-500 font-medium hover:text-slate-800 disabled:opacity-0 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span> Sebelumnya
              </button>
              
              <p className="text-xs font-medium text-slate-400">Hal {currentIndex + 1} dari {soalList.length}</p>

              <button 
                onClick={() => changeIndex(Math.min(soalList.length - 1, currentIndex + 1))}
                disabled={currentIndex === soalList.length - 1}
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white font-semibold text-sm rounded-lg hover:bg-emerald-700 disabled:opacity-0 transition-colors shadow-sm"
              >
                Selanjutnya <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CbtExamSession;
