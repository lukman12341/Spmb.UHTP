import React, { useState, useEffect, useMemo } from 'react';
import { API_BASE_URL } from './config';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

interface CbtAdminDashboardProps {
  onLogout: () => void;
  adminName?: string;
}

const AnalogTimePicker: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSelect: (time: string) => void;
  initialTime?: string;
  label: string;
}> = ({ isOpen, onClose, onSelect, initialTime, label }) => {
  const [step, setStep] = useState<'hour' | 'minute'>('hour');
  const [selectedHour, setSelectedHour] = useState(initialTime ? parseInt(initialTime.split(':')[0]) : 8);
  const [selectedMinute, setSelectedMinute] = useState(initialTime ? parseInt(initialTime.split(':')[1]) : 0);

  if (!isOpen) return null;

  const hours = Array.from({ length: 24 }, (_, i) => i);


  const handleSelect = () => {
    const formattedTime = `${selectedHour.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}:00`;
    onSelect(formattedTime);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[40px] shadow-2xl w-[400px] overflow-hidden border border-slate-100 flex flex-col animate-in zoom-in duration-300">
        <div className="bg-emerald-600 p-10 text-white text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-3">{label}</p>
          <div className="flex items-center justify-center gap-3 font-black text-7xl tracking-tighter">
            <button onClick={() => setStep('hour')} className={`${step === 'hour' ? 'text-white' : 'text-emerald-300'} transition-colors hover:scale-105 active:scale-95`}>{selectedHour.toString().padStart(2, '0')}</button>
            <span className="opacity-40 animate-pulse">:</span>
            <button onClick={() => setStep('minute')} className={`${step === 'minute' ? 'text-white' : 'text-emerald-300'} transition-colors hover:scale-105 active:scale-95`}>{selectedMinute.toString().padStart(2, '0')}</button>
          </div>
        </div>

        <div className="pt-8 pb-6 flex flex-col items-center">
          <div className="relative size-72 bg-slate-50/50 rounded-full border border-slate-100 flex items-center justify-center shadow-inner">
            {/* Center point */}
            <div className="absolute size-1.5 bg-emerald-600 rounded-full z-40 shadow-sm"></div>

            {/* The Hand */}
            <div
              className="absolute bottom-1/2 left-1/2 w-0.5 bg-emerald-600 origin-bottom transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] z-10"
              style={{
                height: step === 'hour'
                  ? (selectedHour >= 13 || selectedHour === 0 ? '28%' : '42%')
                  : '40%',
                transform: `translateX(-50%) rotate(${(step === 'hour' ? (selectedHour % 12) * 30 : selectedMinute * 6)}deg)`
              }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 size-10 bg-emerald-600/10 rounded-full blur-sm"></div>
            </div>

            {/* Numbers */}
            {(step === 'hour' ? hours : Array.from({ length: 60 }, (_, i) => i)).map((val) => {
              const isSelected = step === 'hour' ? selectedHour === val : selectedMinute === val;
              const isMinuteMajor = val % 5 === 0;

              if (step === 'minute' && !isMinuteMajor && !isSelected) return null;

              let radius = 115;
              let fontSize = '14px';
              let weight = 'font-bold';

              if (step === 'hour') {
                if (val >= 13 || val === 0) {
                  radius = 75;
                  fontSize = '11px';
                  weight = 'font-bold';
                }
                if (val >= 1 && val <= 12) {
                  radius = 120;
                  fontSize = '16px';
                  weight = 'font-bold';
                }
              }

              const angle = step === 'hour' ? (val % 12) * 30 : val * 6;
              const x = Math.sin((angle * Math.PI) / 180) * radius;
              const y = -Math.cos((angle * Math.PI) / 180) * radius;

              return (
                <button
                  key={val}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (step === 'hour') { setSelectedHour(val); }
                    else { setSelectedMinute(val); }
                  }}
                  className={`absolute size-10 flex items-center justify-center transition-all duration-300 z-[30] rounded-full
                    ${isSelected ? 'text-white bg-emerald-600 shadow-xl scale-110 z-40' : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50/50'}
                    ${weight}
                  `}
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                    fontSize
                  }}
                >
                  {val === 0 && step === 'hour' ? '00' : val}
                </button>
              );
            })}
          </div>

          <div className="mt-8 w-full px-8 flex items-center justify-between border-t border-slate-100 pt-6">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px]">touch_app</span>
              {step === 'hour' ? 'Atur Jam' : 'Atur Menit'}
            </span>
            <div className="flex items-center gap-2">
              <button type="button" onClick={onClose} className="px-5 py-2.5 text-[11px] font-black uppercase tracking-[0.1em] text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all">Batal</button>
              <button type="button" onClick={handleSelect} className="px-7 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black uppercase tracking-[0.1em] rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">Simpan</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ALL_PRODI_LIST = [
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
  'D3 Kebidanan',
  'S1 Ilmu Komunikasi',
  'S1 Ilmu Hukum',
  'D4 Manajemen Informasi Kesehatan',
  'Magister Kesehatan Masyarakat',
  'S1 Keperawatan',
  'S1 Kebidanan',
  'S1 Kesehatan Masyarakat',
  'S1 Teknik Informatika',
  'S1 Sistem Informasi'
];

const CbtAdminDashboard: React.FC<CbtAdminDashboardProps> = ({ onLogout, adminName = "Administrator" }) => {
  const loginTime = new Date().toLocaleString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  // Navigation State
  const [view, setView] = useState<string>('dashboard');
  const [backView, setBackView] = useState<string>('proses_kesehatan');
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Kesehatan Data State
  const [kesehatanData, setKesehatanData] = useState<any[]>([]);
  const [kesehatanLoading, setKesehatanLoading] = useState(false);
  const [kesehatanFilterGelombang, setKesehatanFilterGelombang] = useState('');
  const [hasSearchedKesehatan, setHasSearchedKesehatan] = useState(false);
  const [kesehatanSearch, setKesehatanSearch] = useState('');
  const [kesehatanEntries, setKesehatanEntries] = useState(10);
  const [kesehatanCurrentPage, setKesehatanCurrentPage] = useState(1);

  // Wawancara Data State
  const [wawancaraData, setWawancaraData] = useState<any[]>([]);
  const [wawancaraLoading, setWawancaraLoading] = useState(false);
  const [wawancaraFilterGelombang, setWawancaraFilterGelombang] = useState('');
  const [wawancaraFilterProdi, setWawancaraFilterProdi] = useState('');
  const [wawancaraSearch, setWawancaraSearch] = useState('');
  const [wawancaraEntries, setWawancaraEntries] = useState(10);
  const [wawancaraCurrentPage, setWawancaraCurrentPage] = useState(1);

  const [showInputHasilModal, setShowInputHasilModal] = useState(false);
  const [showWawancaraModal, setShowWawancaraModal] = useState(false);
  const [selectedWawancaraStudent, setSelectedWawancaraStudent] = useState<any>(null);
  const [wawancaraStatus, setWawancaraStatus] = useState('LULUS');

  // Kelulusan Data State
  const [showProsesKelulusanModal, setShowProsesKelulusanModal] = useState(false);
  const [selectedKelulusanStudent, setSelectedKelulusanStudent] = useState<any>(null);
  const [statusKelulusan, setStatusKelulusan] = useState('Lulus');
  const [noWhatsappKelulusan, setNoWhatsappKelulusan] = useState('');

  const [selectedCbtResult, setSelectedCbtResult] = useState<any>(null);
  const [cbtResultDetails, setCbtResultDetails] = useState<any[]>([]);
  const [selectedKesehatanStudent, setSelectedKesehatanStudent] = useState<any>(null);
  const [gelombangOptions, setGelombangOptions] = useState<string[]>([]);
  const [prodiOptions, setProdiOptions] = useState<string[]>(ALL_PRODI_LIST);
  const [selectedJadwalGelombang, setSelectedJadwalGelombang] = useState<string | null>(null);
  const [pesertaJadwalData, setPesertaJadwalData] = useState<any[]>([]);
  const [pesertaJadwalLoading, setPesertaJadwalLoading] = useState(false);


  // Dashboard Data State
  const [activeBar, setActiveBar] = useState<{ chart: string, index: number } | null>(null);

  const [stats, setStats] = useState([
    { label: 'Tes Potensi Akademik Jalur A', value: '0', color: 'bg-blue-500', icon: 'school', shadow: 'shadow-blue-500/20' },
    { label: 'Tes Potensi Akademik Jalur B', value: '0', color: 'bg-emerald-500', icon: 'workspace_premium', shadow: 'shadow-emerald-500/20' },
    { label: 'Tes Potensi Akademik Jalur Pasca', value: '0', color: 'bg-amber-500', icon: 'history_edu', shadow: 'shadow-amber-500/20' },
    { label: 'Jumlah Peserta Ujian Hadir', value: '0', color: 'bg-rose-500', icon: 'group', shadow: 'shadow-rose-500/20' },
  ]);
  const [pendaftaranData, setPendaftaranData] = useState<any[]>([]);
  const [registrasiData, setRegistrasiData] = useState<any[]>([]);
  const [sumberData, setSumberData] = useState<any[]>([]);


  const [totals, setTotals] = useState({
    pendaftaran: 0,
    registrasi: 0,
    responden: 0
  });

  const [soalList, setSoalList] = useState<any[]>([]);
  const [isSoalLoading, setIsSoalLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingSoalId, setEditingSoalId] = useState<number | null>(null);
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error', onConfirm?: () => void } | null>(null);


  // Alert modal doesn't need auto-hide for this style


  // Tambah Soal Form State
  const [soalForm, setSoalForm] = useState({
    pertanyaan: '',
    pilihan_a: '',
    pilihan_b: '',
    pilihan_c: '',
    pilihan_d: '',
    jawaban: 'A',
    type_soal: 'TPA',
    soal_untuk: 'Jalur A',
    kategori: 'Latar Belakang dan Motivasi',
    prodi: 'Magister Kesehatan Masyarakat',
    status: 'aktif'
  });

  // Jadwal Ujian Form State
  const [jadwalList, setJadwalList] = useState<any[]>([]);
  const [isJadwalLoading, setIsJadwalLoading] = useState(false);
  const [editingJadwalId, setEditingJadwalId] = useState<number | null>(null);
  const [jadwalForm, setJadwalForm] = useState({
    gelombang: '',
    tanggal_ujian: '',
    jam_mulai: '',
    jam_berakhir: '',
    tanggal_registrasi_mulai: '',
    tanggal_registrasi_akhir: ''
  });

  const [activeTimePicker, setActiveTimePicker] = useState<{ field: string, label: string } | null>(null);

  // Detail SPMB State
  const [detailData, setDetailData] = useState<any>({});
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  // Stats Details State
  const [selectedStatCard, setSelectedStatCard] = useState<string | null>(null);
  const [statDetailsLoading, setStatDetailsLoading] = useState(false);
  const [statDetailsData, setStatDetailsData] = useState<any[]>([]);
  const [statDetailsSearch, setStatDetailsSearch] = useState('');
  const [statDetailsCurrentPage, setStatDetailsCurrentPage] = useState(1);
  const [statDetailsEntries, setStatDetailsEntries] = useState(10);

  // Absensi Data State
  const [absensiFilterGelombang, setAbsensiFilterGelombang] = useState('');
  const [absensiFilterProdi, setAbsensiFilterProdi] = useState('');
  const [absensiData, setAbsensiData] = useState<any[]>([]);
  const [absensiLoading, setAbsensiLoading] = useState(false);
  const [hasSearchedAbsensi, setHasSearchedAbsensi] = useState(false);
  const [absensiSearch, setAbsensiSearch] = useState('');
  const [absensiEntries, setAbsensiEntries] = useState(10);
  const [absensiCurrentPage, setAbsensiCurrentPage] = useState(1);

  // Berita Acara Data State
  const [beritaFilterGelombang, setBeritaFilterGelombang] = useState('');
  const [beritaFilterProdi, setBeritaFilterProdi] = useState('');
  const [beritaData, setBeritaData] = useState<any[]>([]);
  const [beritaLoading, setBeritaLoading] = useState(false);
  const [hasSearchedBerita, setHasSearchedBerita] = useState(false);
  const [beritaSearch, setBeritaSearch] = useState('');
  const [beritaEntries, setBeritaEntries] = useState(10);
  const [beritaCurrentPage, setBeritaCurrentPage] = useState(1);

  // Extra Berita Acara Form fields
  const [beritaHariTanggal, setBeritaHariTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [beritaJamMulai, setBeritaJamMulai] = useState('08:00:00');
  const [beritaJamSelesai, setBeritaJamSelesai] = useState('21:00:00');
  const [beritaMateriUjian, setBeritaMateriUjian] = useState('Tes Potensi Akademik');
  const [beritaHadirUjianCount, setBeritaHadirUjianCount] = useState<number | ''>('');
  const [showBeritaSettings, setShowBeritaSettings] = useState(false);

  // Pengumuman (Announcement) State
  const [pengumumanFilterGelombang, setPengumumanFilterGelombang] = useState('');
  const [pengumumanFilterProdi, setPengumumanFilterProdi] = useState('ALL');
  const [pengumumanFilterStatus, setPengumumanFilterStatus] = useState('Lulus');
  const [pengumumanFilterRegistrasi, setPengumumanFilterRegistrasi] = useState('Sudah');
  const [pengumumanData, setPengumumanData] = useState<any[]>([]);
  const [pengumumanLoading, setPengumumanLoading] = useState(false);

  // Laporan (Reports) State
  const [laporanView, setLaporanView] = useState<'rekap_keseluruhan' | 'belum_registrasi' | 'laporan_ujian_tulis' | 'laporan_tes_kesehatan' | 'rekap_tes_kesehatan'>('rekap_keseluruhan');
  const [laporanFilterPeriode, setLaporanFilterPeriode] = useState('2026');
  const [laporanFilterGelombang, setLaporanFilterGelombang] = useState('');
  const [laporanFilterProdi, setLaporanFilterProdi] = useState('');
  const [laporanPeriodeOptions, setLaporanPeriodeOptions] = useState<string[]>(['2026']);
  const [laporanLoading, setLaporanLoading] = useState(false);
  const [laporanData, setLaporanData] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
    fetchKesehatanOptions();
  }, []);

  useEffect(() => {
    if (view === 'proses_kesehatan' || view === 'rekap_kesehatan') {
      fetchKesehatanOptions();
    }
    if (view === 'detail_spmb') {
      fetchDetailSpmbData();
    }
  }, [view]);

  const fetchDetailSpmbData = async () => {
    setIsDetailLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/dashboard/detail-stats`);
      const data = await response.json();
      setDetailData(data);
    } catch (error) {
      console.error('Error fetching detail stats:', error);
    } finally {
      setIsDetailLoading(false);
    }
  };

  const fetchKesehatanOptions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/kesehatan/options`);
      const data = await response.json();
      if (data.status === 'success') {
        setGelombangOptions(data.gelombang?.length > 0 ? data.gelombang : ['20263', '20264']);
        const dbProdis = data.prodi || [];
        setProdiOptions(dbProdis.length > 0 ? dbProdis : ALL_PRODI_LIST);
        if (data.periode?.length > 0) {
          setLaporanPeriodeOptions(data.periode);
          setLaporanFilterPeriode((current) => data.periode.includes(current) ? current : data.periode[0]);
        }
      } else {
        setGelombangOptions(['20263', '20264']);
        setProdiOptions(ALL_PRODI_LIST);
        setLaporanPeriodeOptions(['2026']);
      }
    } catch (error) {
      console.error('Error fetching kesehatan options:', error);
      setGelombangOptions(['20263', '20264']);
      setProdiOptions(ALL_PRODI_LIST);
      setLaporanPeriodeOptions(['2026']);
    }
  };

  useEffect(() => {
    if (!kesehatanFilterGelombang) {
      setKesehatanData([]);
      setHasSearchedKesehatan(false);
    }
  }, [kesehatanFilterGelombang]);

  const fetchKesehatanData = async () => {
    if (!kesehatanFilterGelombang) return;

    setKesehatanLoading(true);
    setHasSearchedKesehatan(true);
    try {
      const url = `${API_BASE_URL}/api/admin/kesehatan?gelombang=${kesehatanFilterGelombang}`;


      const response = await fetch(url);
      const data = await response.json();
      if (data.status === 'success') {
        setKesehatanData(data.data);
      }
    } catch (error) {
      console.error('Error fetching kesehatan data:', error);
    } finally {
      setKesehatanLoading(false);
    }
  };

  const filteredKesehatanData = useMemo(() => {
    return kesehatanData.filter(mhs =>
      (mhs.nama?.toLowerCase() || '').includes(kesehatanSearch.toLowerCase()) ||
      (mhs.no_ujian?.toLowerCase() || '').includes(kesehatanSearch.toLowerCase())
    );
  }, [kesehatanData, kesehatanSearch]);

  const paginatedKesehatanData = useMemo(() => {
    const startIndex = (kesehatanCurrentPage - 1) * kesehatanEntries;
    return filteredKesehatanData.slice(startIndex, startIndex + kesehatanEntries);
  }, [filteredKesehatanData, kesehatanCurrentPage, kesehatanEntries]);

  const totalKesehatanPages = Math.ceil(filteredKesehatanData.length / kesehatanEntries);

  const fetchWawancaraData = async () => {
    const isKelulusanView = view === 'proses_kelulusan' || view === 'rekap_kelulusan';

    if (!wawancaraFilterGelombang || (!isKelulusanView && !wawancaraFilterProdi)) {
      setNotification({ message: `Harap pilih gelombang${!isKelulusanView ? ' dan prodi' : ''} terlebih dahulu!`, type: 'error' });
      return;
    }

    setWawancaraLoading(true);
    try {
      const url = isKelulusanView
        ? `${API_BASE_URL}/api/admin/wawancara?gelombang=${wawancaraFilterGelombang}`
        : `${API_BASE_URL}/api/admin/wawancara?gelombang=${wawancaraFilterGelombang}&prodi=${wawancaraFilterProdi}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.status === 'success') {
        setWawancaraData(data.data);
      } else {
        setWawancaraData([]);
        setNotification({ message: data.message || 'Data tidak ditemukan.', type: 'error' });
      }
    } catch (error) {
      console.error('Error fetching wawancara data:', error);
      setNotification({ message: 'Gagal mengambil data wawancara.', type: 'error' });
    } finally {
      setWawancaraLoading(false);
    }
  };

  const fetchAbsensiData = async () => {
    if (!absensiFilterGelombang || !absensiFilterProdi) {
      setNotification({ message: 'Harap pilih gelombang dan program studi terlebih dahulu!', type: 'error' });
      return;
    }
    setAbsensiLoading(true);
    setHasSearchedAbsensi(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/kesehatan?gelombang=${absensiFilterGelombang}&prodi=${absensiFilterProdi}`);
      const data = await response.json();
      if (data.status === 'success') {
        setAbsensiData(data.data);
      } else {
        setAbsensiData([]);
      }
    } catch (error) {
      console.error('Error fetching absensi data:', error);
      setAbsensiData([]);
    } finally {
      setAbsensiLoading(false);
    }
  };

  const fetchBeritaData = async () => {
    if (!beritaFilterGelombang || !beritaFilterProdi) {
      setNotification({ message: 'Harap pilih gelombang dan program studi terlebih dahulu!', type: 'error' });
      return;
    }
    setBeritaLoading(true);
    setHasSearchedBerita(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/kesehatan?gelombang=${beritaFilterGelombang}&prodi=${beritaFilterProdi}`);
      const data = await response.json();
      if (data.status === 'success') {
        setBeritaData(data.data);
        setBeritaHadirUjianCount(data.data.length);
      } else {
        setBeritaData([]);
        setBeritaHadirUjianCount(0);
      }

      // Automatically fetch exam schedules and match by gelombang
      try {
        const jResponse = await fetch(`${API_BASE_URL}/api/jadwal`);
        if (jResponse.ok) {
          const jData = await jResponse.json();
          const matchingJadwal = jData.find((j: any) => String(j.gelombang) === String(beritaFilterGelombang));
          if (matchingJadwal) {
            if (matchingJadwal.tanggal_ujian) {
              setBeritaHariTanggal(matchingJadwal.tanggal_ujian);
            }
            if (matchingJadwal.jam_mulai) {
              setBeritaJamMulai(matchingJadwal.jam_mulai);
            }
            if (matchingJadwal.jam_berakhir) {
              setBeritaJamSelesai(matchingJadwal.jam_berakhir);
            }
          }
        }
      } catch (err) {
        console.error('Error auto-syncing exam schedule:', err);
      }
    } catch (error) {
      console.error('Error fetching berita data:', error);
      setBeritaData([]);
      setBeritaHadirUjianCount(0);
    } finally {
      setBeritaLoading(false);
    }
  };


  const handlePrintAbsensi = () => {
    if (absensiData.length === 0) {
      setNotification({ message: 'Tidak ada data peserta untuk dicetak!', type: 'error' });
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      setNotification({ message: 'Gagal membuka jendela cetak. Pastikan pop-up dibolehkan!', type: 'error' });
      return;
    }

    const today = new Date();
    const formattedDate = today.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const rows = absensiData.map((mhs, idx) => `
      <tr style="page-break-inside: avoid;">
        <td style="border: 1px solid black; padding: 8px 4px; text-align: center; font-family: Arial, sans-serif; font-size: 9.5pt; font-weight: bold; color: black;">${idx + 1}</td>
        <td style="border: 1px solid black; padding: 8px 4px; font-family: monospace; font-size: 11pt; font-weight: bold; text-align: center; letter-spacing: 0.5px; color: black; white-space: nowrap;">${mhs.no_ujian || '-'}</td>
        <td style="border: 1px solid black; padding: 8px 12px; font-family: Arial, sans-serif; font-size: 9.5pt; font-weight: bold; text-transform: uppercase; text-align: left; color: black;">${mhs.nama}</td>
        <td style="border: 1px solid black; padding: 8px 12px; font-family: Arial, sans-serif; font-size: 9.5pt; text-transform: uppercase; text-align: left; color: black;">${mhs.pilihan || '-'}</td>
        <td style="border: 1px solid black; font-family: Arial, sans-serif; font-size: 9pt; height: 42px; position: relative; padding: 0; background-color: white;">
          <span style="position: absolute; left: ${idx % 2 === 0 ? '6px' : '50%'}; top: 4px; font-weight: bold; font-size: 9.5pt; color: black;">
            ${idx + 1}.
          </span>
        </td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Cetak Absensi SPMB UHTP</title>
        <style>
          @media print {
            body { margin: 0; padding: 1cm; -webkit-print-color-adjust: exact; }
            @page { size: portrait; margin: 0; }
          }
          body { font-family: Arial, Helvetica, sans-serif; line-height: 1.3; color: black; background-color: white; }
          table { width: 100%; border-collapse: collapse; }
          .header-table td { border: none; padding: 0; }
          .grid-table { border: 1.5px solid black; margin-top: 10px; }
          .grid-table th { border: 1px solid black; padding: 10px 4px; font-family: Arial, sans-serif; font-size: 9.5pt; font-weight: bold; text-align: center; }
        </style>
      </head>
      <body>
        <!-- Header Kop Surat -->
        <table class="header-table" style="width: 100%; border-bottom: 3.5px solid black; padding-bottom: 6px; margin-bottom: 20px;">
          <tr>
            <td style="width: 12%; text-align: center; vertical-align: middle;">
              <img src="/logo-uhtp.png" style="width: 75px; height: 75px; object-fit: contain;" alt="Logo UHTP">
            </td>
            <td style="width: 88%; text-align: center; vertical-align: middle; padding-left: 10px;">
              <div style="font-size: 13pt; font-weight: bold; font-family: Arial, sans-serif; letter-spacing: 0.3px; color: black; line-height: 1.2;">PANITIA SPMB UNIVERSITAS HANG TUAH PEKANBARU</div>
              <div style="font-size: 13.5pt; font-weight: bold; font-family: Arial, sans-serif; margin-top: 3px; color: black; line-height: 1.2;">YAYASAN HANG TUAH PEKANBARU</div>
              <div style="font-size: 8pt; font-family: Arial, sans-serif; margin-top: 5px; color: #111;">Jl. Mustafa Sari No. 05 Tangkerang Selatan, Telp : 0761 33815, Fax : 0761 863646</div>
              <div style="font-size: 8pt; font-family: Arial, sans-serif; margin-top: 1px; color: #111;">Email : spmb@htp.ac.id Izin Mendiknas : 226/D/O/2002 Website : http://www.htp.ac.id</div>
            </td>
          </tr>
        </table>

        <!-- Judul Dokumen -->
        <div style="text-align: center; margin-bottom: 22px; font-family: Arial, sans-serif; color: black;">
          <div style="font-size: 12.5pt; font-weight: bold; letter-spacing: 0.5px; text-transform: uppercase;">ABSENSI UJIAN SPMB GELOMBANG ${absensiFilterGelombang}</div>
          <div style="font-size: 12.5pt; font-weight: bold; margin-top: 4px; text-transform: uppercase;">PROGRAM STUDI ${absensiFilterProdi}</div>
        </div>

        <!-- Tabel Grid -->
        <table class="grid-table">
          <thead>
            <tr style="background-color: #E6E6E6;">
              <th style="width: 5%;">NO</th>
              <th style="width: 18%; white-space: nowrap;">NO UJIAN</th>
              <th style="width: 32%;">NAMA</th>
              <th style="width: 25%;">PROGRAM STUDI</th>
              <th style="width: 20%;">TANDA TANGAN</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>

        <!-- Tanda Tangan Pengawas & Ketua SPMB -->
        <table style="width: 100%; margin-top: 40px; border: none; page-break-inside: avoid; font-family: Arial, sans-serif;">
          <tr>
            <td style="width: 50%; border: none; text-align: left; vertical-align: top; padding-left: 20px;">
              <div style="font-size: 10.5pt; font-weight: bold; color: black; line-height: 1.4;">Mengetahui,</div>
              <div style="font-size: 10.5pt; font-weight: bold; color: black; line-height: 1.4; margin-bottom: 75px;">Ketua Panitia SPMB UHTP,</div>
              <div style="font-size: 10.5pt; font-weight: bold; text-decoration: underline; color: black;">Novita Rany, SKM, M. Kes</div>
              <div style="font-size: 9.5pt; color: black; margin-top: 2px;">NIDN. 1020118301</div>
            </td>
            <td style="width: 50%; border: none; text-align: center; vertical-align: top; padding-right: 20px;">
              <div style="font-size: 10.5pt; color: black; line-height: 1.4;">Pekanbaru, ${formattedDate}</div>
              <div style="font-size: 10.5pt; font-weight: bold; color: black; line-height: 1.4; margin-bottom: 75px;">Pengawas Ujian,</div>
              <div style="font-weight: bold; font-size: 10.5pt; color: black;">( &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; )</div>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const getFilteredPengumumanData = () => {
    return pengumumanData.filter(mhs => {
      const statusLower = (mhs.status || '').toLowerCase();
      
      // Filter by prodi
      if (pengumumanFilterProdi !== 'ALL' && mhs.pilihan !== pengumumanFilterProdi) return false;
      
      // Filter by status kelulusan
      if (pengumumanFilterStatus !== 'ALL') {
        if (statusLower !== pengumumanFilterStatus.toLowerCase()) return false;
      }

      // Filter by status registrasi
      if (pengumumanFilterRegistrasi !== 'ALL') {
        const regStatus = mhs.status_registrasi || 'Belum Registrasi';
        if (pengumumanFilterRegistrasi === 'Sudah' && regStatus !== 'Sudah Registrasi') return false;
        if (pengumumanFilterRegistrasi === 'Belum' && regStatus !== 'Belum Registrasi') return false;
      }

      return true;
    });
  };

  const handlePrintPengumuman = () => {
    const filtered = getFilteredPengumumanData();
    if (filtered.length === 0) {
      setNotification({ message: 'Tidak ada data peserta untuk dicetak!', type: 'error' });
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      setNotification({ message: 'Gagal membuka jendela cetak. Pastikan pop-up dibolehkan!', type: 'error' });
      return;
    }

    const today = new Date();
    const formattedDate = today.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const statusLabel = pengumumanFilterStatus === 'ALL' ? 'Semua Status' : pengumumanFilterStatus.toUpperCase();
    const prodiLabel = pengumumanFilterProdi === 'ALL' ? 'Semua Program Studi' : pengumumanFilterProdi;

    const rows = filtered.map((mhs: any, idx: number) => `
      <tr style="page-break-inside: avoid;">
        <td style="border: 1px solid black; padding: 7px 4px; text-align: center; font-family: Arial, sans-serif; font-size: 9.5pt; font-weight: bold; color: black;">${idx + 1}</td>
        <td style="border: 1px solid black; padding: 7px 4px; font-family: monospace; font-size: 10pt; font-weight: bold; text-align: center; letter-spacing: 0.5px; color: black; white-space: nowrap;">${mhs.no_ujian || '-'}</td>
        <td style="border: 1px solid black; padding: 7px 10px; font-family: Arial, sans-serif; font-size: 9.5pt; font-weight: bold; text-transform: uppercase; text-align: left; color: black;">${mhs.nama}</td>
        <td style="border: 1px solid black; padding: 7px 10px; font-family: Arial, sans-serif; font-size: 9pt; text-transform: uppercase; text-align: left; color: black;">${mhs.pilihan || '-'}</td>
        <td style="border: 1px solid black; padding: 7px 10px; font-family: Arial, sans-serif; font-size: 9pt; font-weight: bold; text-transform: uppercase; text-align: center; color: ${(mhs.status || '').toLowerCase() === 'lulus' ? '#16a34a' : (mhs.status || '').toLowerCase() === 'tidak lulus' ? '#dc2626' : (mhs.status || '').toLowerCase() === 'cadangan' ? '#d97706' : '#333'};">${mhs.status || 'Proses'}</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Pengumuman Kelulusan SPMB</title>
        <style>
          @media print {
            body { margin: 0; padding: 1cm; -webkit-print-color-adjust: exact; }
            @page { size: portrait; margin: 0; }
          }
          body { font-family: Arial, Helvetica, sans-serif; line-height: 1.3; color: black; background-color: white; }
          table { width: 100%; border-collapse: collapse; }
          .header-table td { border: none; padding: 0; }
          .grid-table { border: 1.5px solid black; margin-top: 10px; }
          .grid-table th { border: 1px solid black; padding: 8px 4px; font-family: Arial, sans-serif; font-size: 9pt; font-weight: bold; text-align: center; }
        </style>
      </head>
      <body>
        <!-- Header Kop Surat -->
        <table class="header-table" style="width: 100%; border-bottom: 3.5px solid black; padding-bottom: 6px; margin-bottom: 20px;">
          <tr>
            <td style="width: 12%; text-align: center; vertical-align: middle;">
              <img src="/logo-uhtp.png" style="width: 75px; height: 75px; object-fit: contain;" alt="Logo UHTP">
            </td>
            <td style="width: 88%; text-align: center; vertical-align: middle; padding-left: 10px;">
              <div style="font-size: 13pt; font-weight: bold; font-family: Arial, sans-serif; letter-spacing: 0.3px; color: black; line-height: 1.2;">PANITIA SPMB UNIVERSITAS HANG TUAH PEKANBARU</div>
              <div style="font-size: 13.5pt; font-weight: bold; font-family: Arial, sans-serif; margin-top: 3px; color: black; line-height: 1.2;">YAYASAN HANG TUAH PEKANBARU</div>
              <div style="font-size: 8pt; font-family: Arial, sans-serif; margin-top: 5px; color: #111;">Jl. Mustafa Sari No. 05 Tangkerang Selatan, Telp : 0761 33815, Fax : 0761 863646</div>
              <div style="font-size: 8pt; font-family: Arial, sans-serif; margin-top: 1px; color: #111;">Email : spmb@htp.ac.id Izin Mendiknas : 226/D/O/2002 Website : http://www.htp.ac.id</div>
            </td>
          </tr>
        </table>

        <!-- Judul Dokumen -->
        <div style="text-align: center; margin-bottom: 22px; font-family: Arial, sans-serif; color: black;">
          <div style="font-size: 13pt; font-weight: bold; letter-spacing: 0.5px; text-transform: uppercase;">PENGUMUMAN HASIL SELEKSI</div>
          <div style="font-size: 12pt; font-weight: bold; margin-top: 3px; text-transform: uppercase;">SELEKSI PENERIMAAN MAHASISWA BARU (SPMB)</div>
          <div style="font-size: 11pt; font-weight: bold; margin-top: 3px; text-transform: uppercase;">GELOMBANG ${pengumumanFilterGelombang}</div>
          <div style="font-size: 10pt; margin-top: 6px; font-style: italic; color: #333;">Program Studi: ${prodiLabel}</div>
        </div>

        <div style="font-size: 10pt; font-family: Arial, sans-serif; color: black; margin-bottom: 14px; line-height: 1.6; text-align: justify;">
          Berdasarkan hasil Seleksi Penerimaan Mahasiswa Baru (SPMB) Universitas Hang Tuah Pekanbaru Gelombang ${pengumumanFilterGelombang}, 
          dengan ini diumumkan bahwa nama-nama berikut dinyatakan <b>${statusLabel}</b>:
        </div>

        <!-- Tabel Data -->
        <table class="grid-table">
          <thead>
            <tr style="background-color: #E6E6E6;">
              <th style="width: 5%;">NO</th>
              <th style="width: 16%; white-space: nowrap;">NO UJIAN</th>
              <th style="width: 32%;">NAMA</th>
              <th style="width: 27%;">PROGRAM STUDI</th>
              <th style="width: 20%;">STATUS</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>

        <div style="font-size: 10pt; font-family: Arial, sans-serif; color: black; margin-top: 18px; line-height: 1.6; text-align: justify;">
          Demikian pengumuman ini disampaikan untuk dapat diketahui oleh semua pihak yang berkepentingan.
          Bagi peserta yang dinyatakan <b>LULUS</b>, diwajibkan untuk segera melakukan registrasi ulang sesuai jadwal yang telah ditentukan.
        </div>

        <!-- Tanda Tangan -->
        <table style="width: 100%; margin-top: 40px; border: none; page-break-inside: avoid; font-family: Arial, sans-serif;">
          <tr>
            <td style="width: 50%; border: none;"></td>
            <td style="width: 50%; border: none; text-align: center; vertical-align: top; padding-right: 20px;">
              <div style="font-size: 10.5pt; color: black; line-height: 1.4;">Pekanbaru, ${formattedDate}</div>
              <div style="font-size: 10.5pt; font-weight: bold; color: black; line-height: 1.4; margin-bottom: 75px;">Ketua Panitia SPMB UHTP,</div>
              <div style="font-size: 10.5pt; font-weight: bold; text-decoration: underline; color: black;">Novita Rany, SKM, M. Kes</div>
              <div style="font-size: 9.5pt; color: black; margin-top: 2px;">NIDN. 1020118301</div>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const handlePrintLaporan = () => {
    if (laporanData.length === 0) {
      setNotification({ message: 'Tidak ada data untuk dicetak. Pilih filter terlebih dahulu!', type: 'error' });
      return;
    }
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      setNotification({ message: 'Gagal membuka jendela cetak. Pastikan pop-up dibolehkan!', type: 'error' });
      return;
    }
    const today = new Date();
    const formattedDate = today.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    let title = '';
    let filterLabel = '';
    let tableHeader = '';
    let tableRows = '';

    if (laporanView === 'rekap_keseluruhan') {
      title = 'LAPORAN SPMB KESELURUHAN';
      filterLabel = `Periode: ${laporanFilterPeriode} — Program Studi: ${laporanFilterProdi || 'Semua'}`;
      tableHeader = `<th style="width:5%">NO</th><th style="width:15%">NO UJIAN</th><th style="width:30%">NAMA</th><th style="width:25%">PROGRAM STUDI</th><th style="width:12%">GELOMBANG</th><th style="width:13%">STATUS</th>`;
      tableRows = laporanData.map((m: any, i: number) => `<tr><td style="text-align:center;border:1px solid #333;padding:6px">${i+1}</td><td style="text-align:center;border:1px solid #333;padding:6px;font-family:monospace">${m.no_ujian||'-'}</td><td style="border:1px solid #333;padding:6px;text-transform:uppercase">${m.nama||'-'}</td><td style="border:1px solid #333;padding:6px">${m.pilihan||'-'}</td><td style="text-align:center;border:1px solid #333;padding:6px">${m.gelombang||'-'}</td><td style="text-align:center;border:1px solid #333;padding:6px;font-weight:bold;color:${(m.status||'').toLowerCase()==='lulus'?'#16a34a':'#333'}">${m.status||'-'}</td></tr>`).join('');
    } else if (laporanView === 'belum_registrasi') {
      title = 'LAPORAN SPMB - BELUM REGISTRASI';
      filterLabel = `Periode: ${laporanFilterPeriode} — Program Studi: ${laporanFilterProdi || 'Semua'}`;
      tableHeader = `<th style="width:5%">NO</th><th style="width:15%">NO UJIAN</th><th style="width:30%">NAMA</th><th style="width:25%">PROGRAM STUDI</th><th style="width:12%">GELOMBANG</th><th style="width:13%">NO HP</th>`;
      tableRows = laporanData.map((m: any, i: number) => `<tr><td style="text-align:center;border:1px solid #333;padding:6px">${i+1}</td><td style="text-align:center;border:1px solid #333;padding:6px;font-family:monospace">${m.no_ujian||'-'}</td><td style="border:1px solid #333;padding:6px;text-transform:uppercase">${m.nama||'-'}</td><td style="border:1px solid #333;padding:6px">${m.pilihan||'-'}</td><td style="text-align:center;border:1px solid #333;padding:6px">${m.gelombang||'-'}</td><td style="text-align:center;border:1px solid #333;padding:6px">${m.no_hp||'-'}</td></tr>`).join('');

    } else if (laporanView === 'laporan_ujian_tulis') {
      title = 'LAPORAN HASIL UJIAN TULIS';
      filterLabel = `Gelombang: ${laporanFilterGelombang || '-'} — Program Studi: ${laporanFilterProdi || 'Semua'}`;
      tableHeader = `<th style="width:5%">NO</th><th style="width:15%">NO UJIAN</th><th style="width:30%">NAMA</th><th style="width:20%">PROGRAM STUDI</th><th style="width:10%">BENAR</th><th style="width:10%">SALAH</th><th style="width:10%">NILAI</th>`;
      tableRows = laporanData.map((m: any, i: number) => `<tr><td style="text-align:center;border:1px solid #333;padding:6px">${i+1}</td><td style="text-align:center;border:1px solid #333;padding:6px;font-family:monospace">${m.no_ujian||'-'}</td><td style="border:1px solid #333;padding:6px;text-transform:uppercase">${m.nama||'-'}</td><td style="border:1px solid #333;padding:6px">${m.pilihan||'-'}</td><td style="text-align:center;border:1px solid #333;padding:6px;color:#16a34a;font-weight:bold">${m.benar??'-'}</td><td style="text-align:center;border:1px solid #333;padding:6px;color:#dc2626;font-weight:bold">${m.salah??'-'}</td><td style="text-align:center;border:1px solid #333;padding:6px;font-weight:bold">${m.nilai??m.total_score??'-'}</td></tr>`).join('');
    } else if (laporanView === 'rekap_tes_kesehatan') {
      title = 'REKAPITULASI TES KESEHATAN';
      filterLabel = `Gelombang: ${laporanFilterGelombang || '-'}`;
      tableHeader = `<th style="width:5%">NO</th><th style="width:15%">NO UJIAN</th><th style="width:30%">NAMA</th><th style="width:25%">PROGRAM STUDI</th><th style="width:12%">STATUS</th><th style="width:13%">KETERANGAN</th>`;
      tableRows = laporanData.map((m: any, i: number) => `<tr><td style="text-align:center;border:1px solid #333;padding:6px">${i+1}</td><td style="text-align:center;border:1px solid #333;padding:6px;font-family:monospace">${m.no_ujian||'-'}</td><td style="border:1px solid #333;padding:6px;text-transform:uppercase">${m.nama||'-'}</td><td style="border:1px solid #333;padding:6px">${m.pilihan||'-'}</td><td style="text-align:center;border:1px solid #333;padding:6px;font-weight:bold">${m.status_kesehatan||'Belum Tes'}</td><td style="text-align:center;border:1px solid #333;padding:6px">${m.keterangan_kesehatan||'-'}</td></tr>`).join('');
    } else if (laporanView === 'laporan_tes_kesehatan') {
      title = 'LAPORAN HASIL TES KESEHATAN';
      filterLabel = `Gelombang: ${laporanFilterGelombang || '-'} — Program Studi: ${laporanFilterProdi || 'Semua'}`;
      tableHeader = `<th style="width:5%">NO</th><th style="width:13%">NO UJIAN</th><th style="width:22%">NAMA</th><th style="width:15%">PROGRAM STUDI</th><th style="width:9%">TINGGI</th><th style="width:9%">GOL DARAH</th><th style="width:9%">VISUS</th><th style="width:9%">TENSI</th><th style="width:9%">BUTA WARNA</th>`;
      tableRows = laporanData.map((m: any, i: number) => `<tr><td style="text-align:center;border:1px solid #333;padding:6px">${i+1}</td><td style="text-align:center;border:1px solid #333;padding:6px;font-family:monospace">${m.no_ujian||'-'}</td><td style="border:1px solid #333;padding:6px;text-transform:uppercase">${m.nama||'-'}</td><td style="border:1px solid #333;padding:6px">${m.pilihan||'-'}</td><td style="text-align:center;border:1px solid #333;padding:6px">${m.tinggi_badan||'-'} cm</td><td style="text-align:center;border:1px solid #333;padding:6px">${m.golongan_darah||'-'}</td><td style="text-align:center;border:1px solid #333;padding:6px">${m.visus||'-'}</td><td style="text-align:center;border:1px solid #333;padding:6px">${m.tekanan_darah||'-'}</td><td style="text-align:center;border:1px solid #333;padding:6px">${m.buta_warna||'-'}</td></tr>`).join('');
    }

    printWindow.document.write(`<!DOCTYPE html><html><head><title>${title}</title>
    <style>
      @media print { body { margin: 0; padding: 1cm; -webkit-print-color-adjust: exact; } @page { size: portrait; margin: 0; } }
      body { font-family: Arial, Helvetica, sans-serif; line-height: 1.3; color: black; background-color: white; }
      table { width: 100%; border-collapse: collapse; }
      th { border: 1px solid #333; padding: 8px 4px; font-size: 9pt; font-weight: bold; text-align: center; background: #E6E6E6; }
    </style></head><body>
    <table style="width:100%;border-bottom:3.5px solid black;padding-bottom:6px;margin-bottom:20px;"><tr>
      <td style="width:12%;text-align:center;vertical-align:middle;border:none"><img src="/logo-uhtp.png" style="width:75px;height:75px;object-fit:contain" alt="Logo"></td>
      <td style="width:88%;text-align:center;vertical-align:middle;padding-left:10px;border:none">
        <div style="font-size:13pt;font-weight:bold;letter-spacing:0.3px;line-height:1.2">PANITIA SPMB UNIVERSITAS HANG TUAH PEKANBARU</div>
        <div style="font-size:13.5pt;font-weight:bold;margin-top:3px;line-height:1.2">YAYASAN HANG TUAH PEKANBARU</div>
        <div style="font-size:8pt;margin-top:5px;color:#111">Jl. Mustafa Sari No. 05 Tangkerang Selatan, Telp : 0761 33815, Fax : 0761 863646</div>
        <div style="font-size:8pt;margin-top:1px;color:#111">Email : spmb@htp.ac.id Izin Mendiknas : 226/D/O/2002 Website : http://www.htp.ac.id</div>
      </td>
    </tr></table>
    <div style="text-align:center;margin-bottom:22px">
      <div style="font-size:13pt;font-weight:bold;letter-spacing:0.5px;text-transform:uppercase">${title}</div>
      <div style="font-size:10pt;margin-top:6px;font-style:italic;color:#333">${filterLabel}</div>
    </div>
    <table><thead><tr>${tableHeader}</tr></thead><tbody>${tableRows}</tbody></table>
    <table style="width:100%;margin-top:40px;border:none;page-break-inside:avoid"><tr>
      <td style="width:50%;border:none"></td>
      <td style="width:50%;border:none;text-align:center;vertical-align:top;padding-right:20px">
        <div style="font-size:10.5pt;line-height:1.4">Pekanbaru, ${formattedDate}</div>
        <div style="font-size:10.5pt;font-weight:bold;line-height:1.4;margin-bottom:75px">Ketua Panitia SPMB UHTP,</div>
        <div style="font-size:10.5pt;font-weight:bold;text-decoration:underline">Novita Rany, SKM, M. Kes</div>
        <div style="font-size:9.5pt;margin-top:2px">NIDN. 1020118301</div>
      </td>
    </tr></table>
    </body></html>`);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); }, 500);
  };

  const handlePrintBeritaAcara = () => {
    const filteredCount = beritaData.filter(mhs =>
      (mhs.nama?.toLowerCase() || '').includes(beritaSearch.toLowerCase()) ||
      (mhs.no_ujian?.toLowerCase() || '').includes(beritaSearch.toLowerCase())
    ).length;

    const getIndonesianDayAndDate = (dateString: string) => {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    };

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      setNotification({ message: 'Gagal membuka jendela cetak. Pastikan pop-up dibolehkan!', type: 'error' });
      return;
    }

    const examDate = new Date(beritaHariTanggal);
    const finalDate = isNaN(examDate.getTime()) ? new Date() : examDate;
    const formattedPrintDate = finalDate.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Cetak Berita Acara Ujian SPMB</title>
        <style>
          @media print {
            body { margin: 1.2cm; -webkit-print-color-adjust: exact; }
            @page { size: portrait; margin: 1.2cm; }
          }
          body { font-family: 'Times New Roman', Times, serif; line-height: 1.5; color: black; font-size: 11pt; }
          table { width: 100%; border-collapse: collapse; }
          .header-table td { border: none; padding: 0; }
          .grid-table th, .grid-table td { border: 1px solid black; padding: 6px 10px; font-family: Arial, sans-serif; font-size: 10pt; }
          .metadata-table td { border: none; padding: 4px 0; font-size: 11pt; }
          p { margin: 0 0 10px 0; text-align: justify; text-indent: 40px; }
        </style>
      </head>
      <body>
        <!-- Header Kop Surat -->
        <table class="header-table" style="width: 100%; border-bottom: 4px double black; padding-bottom: 8px; margin-bottom: 20px;">
          <tr>
            <td style="width: 15%; text-align: center; vertical-align: middle;">
              <img src="/logo-uhtp.png" style="width: 80px; height: 80px;" alt="Logo UHTP">
            </td>
            <td style="width: 85%; text-align: center; vertical-align: middle; padding-left: 10px;">
              <div style="font-size: 14pt; font-weight: bold; font-family: 'Times New Roman', serif;">PANITIA SELEKSI PENERIMAAN MAHASISWA BARU (SPMB)</div>
              <div style="font-size: 15pt; font-weight: bold; font-family: 'Times New Roman', serif; margin-top: 2px;">UNIVERSITAS HANG TUAH PEKANBARU</div>
              <div style="font-size: 8pt; font-style: italic; font-family: 'Times New Roman', serif; margin-top: 3px;">Jl. Mustafa Sari No. 05 Tangkerang Selatan Pekanbaru, Telp : 0761 33815, Fax : 0761 863646</div>
              <div style="font-size: 8pt; font-family: 'Times New Roman', serif; margin-top: 1px;">Email : spmb@htp.ac.id | Website : https://spmb.htp.ac.id</div>
            </td>
          </tr>
        </table>

        <!-- Judul Dokumen -->
        <div style="text-align: center; margin-bottom: 25px; font-family: Arial, sans-serif;">
          <div style="font-size: 12pt; font-weight: bold; letter-spacing: 0.5px; text-transform: uppercase;">BERITA ACARA UJIAN TULIS SPMB GELOMBANG ${beritaFilterGelombang}</div>
          <div style="font-size: 12pt; font-weight: bold; text-transform: uppercase; margin-top: 2px;">PROGRAM STUDI ${beritaFilterProdi}</div>
        </div>

        <!-- Tabel Rincian Kegiatan -->
        <table class="metadata-table" style="width: 100%; margin-top: 10px; margin-bottom: 25px; font-family: Arial, sans-serif; font-size: 10.5pt;">
          <tr>
            <td style="width: 22%; padding: 4px 0;">Tes</td>
            <td style="width: 3%; padding: 4px 0;">:</td>
            <td style="width: 75%; padding: 4px 0; font-weight: bold;">${beritaFilterGelombang}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0;">Program Studi</td>
            <td style="padding: 4px 0;">:</td>
            <td style="padding: 4px 0; font-weight: bold; text-transform: uppercase;">${beritaFilterProdi}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0;">Materi Ujian</td>
            <td style="padding: 4px 0;">:</td>
            <td style="padding: 4px 0; font-weight: bold;">${beritaMateriUjian}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0;">Hari/Tanggal</td>
            <td style="padding: 4px 0;">:</td>
            <td style="padding: 4px 0;">${getIndonesianDayAndDate(beritaHariTanggal)}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0;">Jam</td>
            <td style="padding: 4px 0;">:</td>
            <td style="padding: 4px 0;">${beritaJamMulai} s/d ${beritaJamSelesai}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0;">Yang Hadir Ujian</td>
            <td style="padding: 4px 0;">:</td>
            <td style="padding: 4px 0; font-weight: bold;">${beritaHadirUjianCount !== '' ? beritaHadirUjianCount : filteredCount} Orang</td>
          </tr>
        </table>

        <!-- Pengawas Ujian Section -->
        <div style="font-weight: bold; margin-top: 20px; margin-bottom: 8px; font-family: Arial, sans-serif; font-size: 10pt;">PENGAWAS UJIAN</div>
        <table class="grid-table" style="width: 100%; margin-bottom: 25px; font-family: Arial, sans-serif; font-size: 10pt;">
          <thead>
            <tr style="background-color: #e6e6e6; text-align: left; font-weight: bold;">
              <th style="width: 8%; text-align: center; border: 1px solid black; padding: 6px;">NO</th>
              <th style="width: 50%; border: 1px solid black; padding: 6px 10px;">NAMA PENGAWAS</th>
              <th style="width: 42%; border: 1px solid black; padding: 6px 10px;">TANDA TANGAN</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="text-align: center; border: 1px solid black; height: 35px; padding: 6px;">1</td>
              <td style="border: 1px solid black; padding: 6px;"></td>
              <td style="border: 1px solid black; padding: 6px 10px; vertical-align: middle;">1. .................................</td>
            </tr>
            <tr>
              <td style="text-align: center; border: 1px solid black; height: 35px; padding: 6px;">2</td>
              <td style="border: 1px solid black; padding: 6px;"></td>
              <td style="border: 1px solid black; padding: 6px 10px; vertical-align: middle;">2. .................................</td>
            </tr>
          </tbody>
        </table>

        <!-- Saksi Section -->
        <div style="font-weight: bold; margin-top: 20px; margin-bottom: 8px; font-family: Arial, sans-serif; font-size: 10pt;">SAKSI</div>
        <table class="grid-table" style="width: 100%; margin-bottom: 30px; font-family: Arial, sans-serif; font-size: 10pt;">
          <thead>
            <tr style="background-color: #e6e6e6; text-align: left; font-weight: bold;">
              <th style="width: 8%; text-align: center; border: 1px solid black; padding: 6px;">NO</th>
              <th style="width: 50%; border: 1px solid black; padding: 6px 10px;">NAMA PESERTA</th>
              <th style="width: 42%; border: 1px solid black; padding: 6px 10px;">TANDA TANGAN</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="text-align: center; border: 1px solid black; height: 35px; padding: 6px;">1</td>
              <td style="border: 1px solid black; padding: 6px;"></td>
              <td style="border: 1px solid black; padding: 6px 10px; vertical-align: middle;">1. .................................</td>
            </tr>
            <tr>
              <td style="text-align: center; border: 1px solid black; height: 35px; padding: 6px;">2</td>
              <td style="border: 1px solid black; padding: 6px;"></td>
              <td style="border: 1px solid black; padding: 6px 10px; vertical-align: middle;">2. .................................</td>
            </tr>
          </tbody>
        </table>

        <!-- Tanda Tangan Footer -->
        <table style="width: 100%; border: none; page-break-inside: avoid; font-family: Arial, sans-serif; font-size: 10.5pt; margin-top: 10px;">
          <tr>
            <td style="width: 55%; border: none;"></td>
            <td style="width: 45%; text-align: left; border: none; line-height: 1.5;">
              <div>Pekanbaru, ${formattedPrintDate}</div>
              <div>Universitas Hang Tuah Pekanbaru</div>
              <div style="font-weight: bold; margin-bottom: 70px;">Ketua SPMB,</div>
              <div style="font-weight: bold; text-decoration: underline;">Novita Rany, SKM, M. Kes</div>
              <div style="font-size: 9.5pt; color: #333; margin-top: 1px;">NIDN. 1020118301</div>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const filteredWawancaraData = useMemo(() => {
    const isKelulusanView = view === 'proses_kelulusan' || view === 'rekap_kelulusan';
    const allowedWawancaraProdi = [
      's2 kesmas',
      's1 keperawatan',
      'profesi ners',
      's1 kebidanan',
      'profesi bidan'
    ];

    return wawancaraData.filter(mhs => {
      const pilihanLower = (mhs.pilihan || '').toLowerCase();
      const isAllowedProdi = isKelulusanView ? true : allowedWawancaraProdi.some(prodi => pilihanLower.includes(prodi));
      const matchesSearch = (mhs.nama?.toLowerCase() || '').includes(wawancaraSearch.toLowerCase()) ||
        (mhs.no_ujian?.toLowerCase() || '').includes(wawancaraSearch.toLowerCase());

      const healthFailed = mhs.status_kesehatan && !['Sehat', 'Lulus', 'Menunggu'].includes(mhs.status_kesehatan);
      const wawancaraGraded = mhs.hasil_wawancara === 'LULUS' || mhs.hasil_wawancara === 'TIDAK LULUS' || healthFailed;

      const statusLower = (mhs.status || '').toLowerCase();
      const isFinalStatus = statusLower === 'lulus' || statusLower === 'tidak lulus' || statusLower.includes('lulus di');

      let isCorrectView = true;
      if (view === 'rekap_wawancara') isCorrectView = wawancaraGraded;
      else if (view === 'proses_wawancara') isCorrectView = !wawancaraGraded;
      else if (view === 'rekap_kelulusan') isCorrectView = isFinalStatus;
      else if (view === 'proses_kelulusan') isCorrectView = !isFinalStatus;

      return isAllowedProdi && matchesSearch && isCorrectView;
    });
  }, [wawancaraData, wawancaraSearch, view]);

  const paginatedWawancaraData = useMemo(() => {
    const startIndex = (wawancaraCurrentPage - 1) * wawancaraEntries;
    return filteredWawancaraData.slice(startIndex, startIndex + wawancaraEntries);
  }, [filteredWawancaraData, wawancaraCurrentPage, wawancaraEntries]);

  const totalWawancaraPages = Math.ceil(filteredWawancaraData.length / wawancaraEntries);

  // Health Detail States
  const [tinggiBadan, setTinggiBadan] = useState('');
  const [golonganDarah, setGolonganDarah] = useState('');
  const [butaWarna, setButaWarna] = useState('');
  const [visus, setVisus] = useState('');
  const [tekananDarah, setTekananDarah] = useState('');
  const [riwayatPenyakit, setRiwayatPenyakit] = useState('');

  const formatWhatsAppUrl = (phone: string) => {
    if (!phone || phone === '-') return '#';
    let cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.slice(1);
    }
    return `https://wa.me/${cleanPhone}`;
  };

  const handleStatCardClick = async (cardType: string) => {
    if (selectedStatCard === cardType) {
      setSelectedStatCard(null);
      setStatDetailsData([]);
      return;
    }

    setSelectedStatCard(cardType);
    setStatDetailsLoading(true);
    setStatDetailsSearch('');
    setStatDetailsCurrentPage(1);

    try {
      if (cardType === 'kehadiran') {
        const response = await fetch(`${API_BASE_URL}/api/admin/attendances`);
        const data = await response.json();
        setStatDetailsData(data);
      } else {
        const response = await fetch(`${API_BASE_URL}/api/admin/biodatas`);
        const data = await response.json();
        
        let filtered: any[] = [];
        if (cardType === 'jalur_a') {
          filtered = data.filter((item: any) => 
            item.registration && item.registration.program_studi && item.registration.program_studi.toLowerCase().includes('reguler')
          );
        } else if (cardType === 'jalur_b') {
          filtered = data.filter((item: any) => 
            item.registration && item.registration.program_studi && item.registration.program_studi.toLowerCase().includes('beasiswa')
          );
        } else if (cardType === 'pasca') {
          filtered = data.filter((item: any) => 
            item.registration && item.registration.program_studi && item.registration.program_studi.toLowerCase().includes('pasca')
          );
        }
        setStatDetailsData(filtered);
      }
    } catch (error) {
      console.error('Error fetching stat details:', error);
      setStatDetailsData([]);
    } finally {
      setStatDetailsLoading(false);
    }
  };

  const getFilteredStatDetails = () => {
    return statDetailsData.filter(item => {
      const searchLower = statDetailsSearch.toLowerCase();
      if (selectedStatCard === 'kehadiran') {
        const name = (item.registration?.name || '').toLowerCase();
        const examNum = (item.registration?.biodata?.exam_number || '').toLowerCase();
        return name.includes(searchLower) || examNum.includes(searchLower);
      } else {
        const name = (item.registration?.name || item.nama || '').toLowerCase();
        const prodi = (item.registration?.program_studi || item.program_studi || '').toLowerCase();
        const hp = (item.registration?.no_hp || item.no_hp || '').toLowerCase();
        return name.includes(searchLower) || prodi.includes(searchLower) || hp.includes(searchLower);
      }
    });
  };

  const handleExportCSV = () => {
    if (statDetailsData.length === 0) return;
    
    let headers: string[] = [];
    let rows: string[][] = [];
    
    const filteredData = getFilteredStatDetails();
    
    if (selectedStatCard === 'kehadiran') {
      headers = ['No', 'Nama Peserta', 'No. Ujian', 'Waktu Hadir', 'Status'];
      rows = filteredData.map((item, idx) => [
        (idx + 1).toString(),
        item.registration?.name || '-',
        item.registration?.biodata?.exam_number || '-',
        item.attended_at ? new Date(item.attended_at).toLocaleString('id-ID') : '-',
        item.status || 'Hadir'
      ]);
    } else {
      headers = ['No', 'Nama Lengkap', 'Program Studi', 'Gelombang', 'No. HP', 'Status Finalisasi'];
      rows = filteredData.map((item, idx) => [
        (idx + 1).toString(),
        item.registration?.name || item.nama || '-',
        item.registration?.program_studi || item.program_studi || '-',
        item.registration?.gelombang || item.gelombang || '-',
        item.registration?.no_hp || item.no_hp || '-',
        item.is_finalized ? 'Sudah Finalisasi' : 'Belum Finalisasi'
      ]);
    }
    
    const csvContent = "\uFEFF" + [headers.join(','), ...rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(','))].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Detail_${selectedStatCard}_SPMB_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/dashboard/stats`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      setStats(data.stats);
      setPendaftaranData(data.pendaftaranData);
      setRegistrasiData(data.registrasiData);
      setSumberData(data.sumberData);


      setTotals({
        pendaftaran: data.totalPendaftaran,
        registrasi: data.totalRegistrasi,
        responden: data.totalResponden
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };


  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev =>
      prev.includes(menuId) ? [] : [menuId]
    );
  };

  const handleSoalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isWawancara = soalForm.soal_untuk === 'Soal Wawancara';
    const isBasicValid = !!soalForm.pertanyaan;
    const isChoicesValid = isWawancara || (soalForm.pilihan_a && soalForm.pilihan_b && soalForm.pilihan_c && soalForm.pilihan_d);

    if (!isBasicValid || !isChoicesValid) {
      alert(isWawancara ? 'Mohon lengkapi pertanyaan wawancara.' : 'Mohon lengkapi semua field soal dan pilihan jawaban.');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        ...soalForm,
        prodi: soalForm.soal_untuk === 'Soal Wawancara' ? soalForm.prodi : '',
        kategori: soalForm.soal_untuk === 'Soal Wawancara' ? soalForm.kategori : '',
      };
      const response = await fetch(`${API_BASE_URL}/api/soal/store`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setNotification({
          message: `Soal untuk ${soalForm.soal_untuk} berhasil disimpan!`,
          type: 'success',
          onConfirm: () => {
            const targetView = `daftar_${soalForm.soal_untuk.toLowerCase().replace(' ', '_')}`;
            setView(targetView);
            setSoalForm({
              pertanyaan: '', pilihan_a: '', pilihan_b: '', pilihan_c: '', pilihan_d: '',
              jawaban: 'A', type_soal: 'TPA', soal_untuk: 'Jalur A',
              kategori: 'Latar Belakang dan Motivasi', prodi: 'Magister Kesehatan Masyarakat',
              status: 'aktif'
            });
          }
        });
      } else {
        const errorData = await response.json();
        setNotification({ message: `Gagal menyimpan soal: ${errorData.message}`, type: 'error' });
      }
    } catch (error) {
      console.error('Error saving soal:', error);
      setNotification({ message: 'Terjadi kesalahan saat menghubungkan ke server.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateSoal = async (e: React.FormEvent) => {
    e.preventDefault();

    const isWawancara = soalForm.soal_untuk === 'Soal Wawancara';
    const isBasicValid = !!soalForm.pertanyaan;
    const isChoicesValid = isWawancara || (soalForm.pilihan_a && soalForm.pilihan_b && soalForm.pilihan_c && soalForm.pilihan_d);

    if (!isBasicValid || !isChoicesValid) {
      alert(isWawancara ? 'Mohon lengkapi pertanyaan wawancara.' : 'Mohon lengkapi semua field soal dan pilihan jawaban.');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        ...soalForm,
        prodi: soalForm.soal_untuk === 'Soal Wawancara' ? soalForm.prodi : '',
        kategori: soalForm.soal_untuk === 'Soal Wawancara' ? soalForm.kategori : '',
      };
      const response = await fetch(`${API_BASE_URL}/api/soal/${editingSoalId}/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setNotification({
          message: 'Soal berhasil di perbaharui',
          type: 'success',
          onConfirm: () => {
            const targetView = `daftar_${soalForm.soal_untuk.toLowerCase().replace(' ', '_')}`;
            setView(targetView);
            setEditingSoalId(null);
            setSoalForm({
              pertanyaan: '', pilihan_a: '', pilihan_b: '', pilihan_c: '', pilihan_d: '',
              jawaban: 'A', type_soal: 'TPA', soal_untuk: 'Jalur A',
              kategori: 'Latar Belakang dan Motivasi', prodi: 'Magister Kesehatan Masyarakat',
              status: 'aktif'
            });
          }
        });
      } else {
        const errorData = await response.json();
        setNotification({ message: `Gagal memperbarui soal: ${errorData.message}`, type: 'error' });
      }
    } catch (error) {
      console.error('Error updating soal:', error);
      setNotification({ message: 'Terjadi kesalahan saat menghubungkan ke server.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/soal/${id}/toggle-status`, {
        method: 'POST'
      });
      if (response.ok) {
        const data = await response.json();
        const newStatus = data.status;
        setNotification({
          message: `Soal sudah di ${newStatus === 'aktif' ? 'aktifkan' : 'nonaktifkan'}`,
          type: 'success',
          onConfirm: () => {
            setSoalList(prev => prev.map(s =>
              s.id === id ? { ...s, status: newStatus } : s
            ));
          }
        });
      } else {
        setNotification({ message: 'Gagal mengubah status soal.', type: 'error' });
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      setNotification({ message: 'Terjadi kesalahan saat mengubah status.', type: 'error' });
    }
  };

  const handleEditClick = (soal: any) => {
    setEditingSoalId(soal.id);
    setSoalForm({
      pertanyaan: soal.pertanyaan,
      pilihan_a: soal.pilihan_a,
      pilihan_b: soal.pilihan_b,
      pilihan_c: soal.pilihan_c,
      pilihan_d: soal.pilihan_d,
      jawaban: soal.jawaban,
      type_soal: soal.type_soal,
      soal_untuk: soal.soal_untuk,
      kategori: soal.kategori || 'Latar Belakang dan Motivasi',
      prodi: soal.prodi || 'Magister Kesehatan Masyarakat',
      status: soal.status || 'aktif'
    });
    setView('edit_soal');
  };

  const fetchSoalList = async (jalur: string) => {
    setIsSoalLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/soal?soal_untuk=${encodeURIComponent(jalur)}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      setSoalList(data);
    } catch (error) {
      console.error('Error fetching soal list:', error);
      setSoalList([]);
      setNotification({ message: 'Data soal gagal dimuat. Pastikan backend Laravel berjalan di localhost:8000.', type: 'error' });
    } finally {
      setIsSoalLoading(false);
    }
  };

  const fetchJadwalList = async () => {
    setIsJadwalLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/jadwal`);
      const data = await response.json();
      setJadwalList(data);
    } catch (error) {
      console.error('Error fetching jadwal list:', error);
    } finally {
      setIsJadwalLoading(false);
    }
  };

  const fetchPesertaByJadwal = async (gelombang: string) => {
    setPesertaJadwalLoading(true);
    setSelectedJadwalGelombang(gelombang);
    try {
      // Menggunakan endpoint kesehatan sebagai referensi, 
      // atau jika ada endpoint khusus peserta per gelombang bisa diganti di sini
      const response = await fetch(`${API_BASE_URL}/api/admin/kesehatan?gelombang=${gelombang}`);
      const data = await response.json();
      if (data.status === 'success') {
        setPesertaJadwalData(data.data);
      }
    } catch (error) {
      console.error('Error fetching peserta by jadwal:', error);
    } finally {
      setPesertaJadwalLoading(false);
    }
  };

  const handleJadwalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/jadwal/store`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jadwalForm),
      });

      if (response.ok) {
        setNotification({
          message: 'Jadwal berhasil disimpan!',
          type: 'success',
          onConfirm: () => {
            fetchJadwalList();
            setJadwalForm({
              gelombang: '', tanggal_ujian: '', jam_mulai: '', jam_berakhir: '',
              tanggal_registrasi_mulai: '', tanggal_registrasi_akhir: ''
            });
          }
        });
      }
    } catch (error) {
      console.error('Error saving jadwal:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateJadwal = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/jadwal/${editingJadwalId}/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jadwalForm),
      });

      if (response.ok) {
        setNotification({
          message: 'Jadwal berhasil diperbaharui!',
          type: 'success',
          onConfirm: () => {
            fetchJadwalList();
            setEditingJadwalId(null);
            setJadwalForm({
              gelombang: '', tanggal_ujian: '', jam_mulai: '', jam_berakhir: '',
              tanggal_registrasi_mulai: '', tanggal_registrasi_akhir: ''
            });
          }
        });
      }
    } catch (error) {
      console.error('Error updating jadwal:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteJadwal = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus jadwal ini?')) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/jadwal/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setNotification({ message: 'Jadwal berhasil dihapus', type: 'success' });
        fetchJadwalList();
      }
    } catch (error) {
      console.error('Error deleting jadwal:', error);
    }
  };

  const handleEditJadwalClick = (jadwal: any) => {
    setEditingJadwalId(jadwal.id);
    setJadwalForm({
      gelombang: jadwal.gelombang,
      tanggal_ujian: jadwal.tanggal_ujian,
      jam_mulai: jadwal.jam_mulai,
      jam_berakhir: jadwal.jam_berakhir,
      tanggal_registrasi_mulai: jadwal.tanggal_registrasi_mulai,
      tanggal_registrasi_akhir: jadwal.tanggal_registrasi_akhir
    });

    // Scroll to the top where the form is located
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveWawancara = async () => {
    if (!selectedWawancaraStudent) return;
    
    if (!window.confirm("Apakah Anda yakin ingin menyimpan hasil wawancara ini?")) {
      return;
    }

    try {
      setIsSaving(true);
      const response = await fetch(`${API_BASE_URL}/api/admin/wawancara/${selectedWawancaraStudent.id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hasil_wawancara: wawancaraStatus,
          catatan_wawancara: '',
          nilai_wawancara: 100,
          pewawancara: adminName
        })
      });
      if (response.ok) {
        setNotification({ message: 'Hasil wawancara berhasil disimpan', type: 'success' });
        setShowWawancaraModal(false);
        fetchWawancaraData();
      }
    } catch (error) {
      console.error('Error saving wawancara:', error);
      setNotification({ message: 'Gagal menyimpan hasil wawancara', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveKelulusan = async () => {
    if (!selectedKelulusanStudent) return;

    setIsSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/kelulusan/${selectedKelulusanStudent.id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: statusKelulusan,
          no_hp: noWhatsappKelulusan
        })
      });

      if (response.ok) {
        setNotification({
          message: `Berhasil menyimpan status: ${statusKelulusan}`,
          type: 'success'
        });
        setShowProsesKelulusanModal(false);
        fetchWawancaraData();
      } else {
        setNotification({ message: 'Gagal menyimpan status kelulusan', type: 'error' });
      }
    } catch (error) {
      console.error('Error saving kelulusan:', error);
      setNotification({ message: 'Terjadi kesalahan saat menyimpan status', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (view === 'dashboard') {
      fetchDashboardData();
    } else if (view.startsWith('daftar_')) {
      const jalurOptions = ['Jalur A', 'Soal Wawancara', 'Jalur B', 'Pasca', 'NERS', 'Profesi Bidan', 'STMIK'];
      const jalur = jalurOptions.find(j => `daftar_${j.toLowerCase().replace(' ', '_')}` === view) || view;
      fetchSoalList(jalur);
    } else if (view === 'jadwal_ujian') {
      fetchJadwalList();
    }
  }, [view]);

  const renderBarChart = (data: any[], max: number, chartKey: string) => {
    // Palette of pleasant, distinct colors for each bar
    const barPalette = [
      { bar: '#60a5fa', hover: '#3b82f6', light: '#eff6ff', text: '#2563eb' },  // blue
      { bar: '#34d399', hover: '#10b981', light: '#ecfdf5', text: '#059669' },  // emerald
      { bar: '#fbbf24', hover: '#f59e0b', light: '#fffbeb', text: '#d97706' },  // amber
      { bar: '#f87171', hover: '#ef4444', light: '#fef2f2', text: '#dc2626' },  // red
      { bar: '#a78bfa', hover: '#8b5cf6', light: '#f5f3ff', text: '#7c3aed' },  // violet
      { bar: '#fb923c', hover: '#f97316', light: '#fff7ed', text: '#ea580c' },  // orange
      { bar: '#2dd4bf', hover: '#14b8a6', light: '#f0fdfa', text: '#0d9488' },  // teal
      { bar: '#f472b6', hover: '#ec4899', light: '#fdf2f8', text: '#db2777' },  // pink
      { bar: '#38bdf8', hover: '#0ea5e9', light: '#f0f9ff', text: '#0284c7' },  // sky
      { bar: '#a3e635', hover: '#84cc16', light: '#f7fee7', text: '#65a30d' },  // lime
      { bar: '#818cf8', hover: '#6366f1', light: '#eef2ff', text: '#4f46e5' },  // indigo
      { bar: '#fb7185', hover: '#f43f5e', light: '#fff1f2', text: '#e11d48' },  // rose
    ];

    return (
      <div className="h-[340px] flex items-end gap-2.5 pb-10 pl-12 pr-4 relative">
        {/* Y-axis grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pl-12 pr-4 pb-10">
          {[max, max * 0.75, max * 0.5, max * 0.25, 0].map(val => (
            <div key={val} className="border-b border-dashed border-slate-200/80 w-full h-0 flex items-center">
              <span className="text-[10px] -ml-12 font-semibold w-10 text-right text-slate-400 tabular-nums">{Math.round(val)}</span>
            </div>
          ))}
        </div>
        {/* Bars */}
        {data.map((b, i) => {
          const isActive = activeBar?.chart === chartKey && activeBar?.index === i;
          const heightPct = max > 0 ? (b.val / max) * 100 : 0;
          const color = barPalette[i % barPalette.length];
          return (
            <div
              key={b.label}
              className="flex-1 flex flex-col items-center group relative z-10 h-full justify-end cursor-pointer"
              onClick={() => setActiveBar(isActive ? null : { chart: chartKey, index: i })}
            >
              {/* Tooltip */}
              <div
                className={`absolute -top-1 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg shadow-sm transition-all duration-300 flex flex-col items-center z-30 border border-slate-100 whitespace-nowrap ${isActive ? 'opacity-100 -translate-y-1' : 'opacity-0 translate-y-1 pointer-events-none group-hover:opacity-100 group-hover:-translate-y-1'}`}
                style={{ backgroundColor: color.light, color: color.text }}
              >
                <span className="text-[13px] font-black">{b.val}</span>
              </div>
              {/* Bar */}
              <div
                className="w-full max-w-[48px] mx-auto rounded-t-lg transition-all duration-700 ease-out group-hover:opacity-100"
                style={{
                  height: `${heightPct}%`,
                  minHeight: b.val > 0 ? '4px' : '0px',
                  backgroundColor: isActive ? color.hover : color.bar,
                  opacity: isActive ? 1 : 0.85,
                }}
              ></div>
              {/* Label */}
              <div className="flex flex-col items-center mt-2.5 absolute -bottom-10 left-1/2 -translate-x-1/2">
                <span
                  className="text-[11px] font-bold whitespace-nowrap max-w-[70px] truncate transition-colors duration-200"
                  style={{ color: isActive ? color.text : '#64748b' }}
                  title={b.label}
                >{b.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderStatsCards = () => {
    const cardTypes = ['jalur_a', 'jalur_b', 'pasca', 'kehadiran'];
    const cardStyles = [
      { bg: 'bg-blue-50/80', border: 'border-l-blue-500', iconBg: 'bg-blue-100', iconColor: 'text-blue-500', valueColor: 'text-blue-700', activeRing: 'ring-2 ring-blue-500 ring-offset-2' },
      { bg: 'bg-emerald-50/80', border: 'border-l-emerald-500', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-500', valueColor: 'text-emerald-700', activeRing: 'ring-2 ring-emerald-500 ring-offset-2' },
      { bg: 'bg-amber-50/80', border: 'border-l-amber-500', iconBg: 'bg-amber-100', iconColor: 'text-amber-500', valueColor: 'text-amber-700', activeRing: 'ring-2 ring-amber-500 ring-offset-2' },
      { bg: 'bg-rose-50/80', border: 'border-l-rose-500', iconBg: 'bg-rose-100', iconColor: 'text-rose-500', valueColor: 'text-rose-700', activeRing: 'ring-2 ring-rose-500 ring-offset-2' },
    ];
    const icons = ['school', 'workspace_premium', 'history_edu', 'group'];

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, idx) => {
          const type = cardTypes[idx];
          const style = cardStyles[idx];
          const isActive = selectedStatCard === type;

          return (
            <div
              key={stat.label}
              onClick={() => handleStatCardClick(type)}
              className={`${style.bg} rounded-xl border border-slate-200/60 border-l-4 ${style.border} p-5 flex items-center gap-4 group hover:shadow-md cursor-pointer active:scale-95 transition-all duration-300 ${
                isActive ? style.activeRing : ''
              }`}
            >
              <div className={`size-12 ${style.iconBg} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                <span className={`material-symbols-outlined text-[24px] ${style.iconColor}`}>{icons[idx]}</span>
              </div>
              <div className="min-w-0">
                <h3 className={`text-2xl font-bold ${style.valueColor} tabular-nums flex items-center gap-2`}>
                  {stat.value}
                  <span className="material-symbols-outlined text-slate-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity">open_in_new</span>
                </h3>
                <p className="text-[11px] font-medium text-slate-500 leading-tight mt-0.5 truncate">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>
    );
  };


  const renderDetailSpmb = () => {
    const totalDaftar = (Object.values(detailData) as any[]).flat().reduce((acc: number, curr: any) => acc + (curr.total || 0), 0);
    const totalRegistrasi = (Object.values(detailData) as any[]).flat().reduce((acc: number, curr: any) =>
      acc + (curr.classes ? (curr.classes as any[]).reduce((sub: number, cls: any) => sub + (cls.registrasi || 0), 0) : 0), 0);

    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-500 font-sans max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="size-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
              <span className="material-symbols-outlined text-[28px]">assessment</span>
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">Rincian Pendaftaran Mahasiswa Baru</h1>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-0.5">Universitas Hang Tuah Pekanbaru Tahun 2026</p>
            </div>
          </div>
          <button
            onClick={() => setView('dashboard')}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all font-bold text-xs shadow-sm active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Dashboard
          </button>
        </div>

        <div className="bg-white rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden min-h-[400px] flex flex-col">
          {isDetailLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-slate-50/50 py-20">
              <div className="size-16 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin"></div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] animate-pulse">Menyelaraskan Data Database...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-emerald-700 text-white">
                    <th className="px-8 py-5 text-left font-black uppercase tracking-widest text-[11px]">Fakultas / Program Studi</th>
                    <th className="px-8 py-5 text-left font-black uppercase tracking-widest text-[11px] border-l border-white/20 w-56">Kelas / Jalur</th>
                    <th className="px-8 py-5 text-center font-black uppercase tracking-widest text-[11px] border-l border-white/20 w-40">Jumlah Daftar</th>
                    <th className="px-8 py-5 text-center font-black uppercase tracking-widest text-[11px] border-l border-white/20 w-40">Jumlah Registrasi</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(detailData).map(([fakultas, prodis]: [string, any]) => (
                    <React.Fragment key={fakultas}>
                      <tr className="bg-emerald-100 border-y border-emerald-200 hover:bg-emerald-200 transition-colors duration-200 group/faculty">
                        <td colSpan={4} className="px-8 py-4 font-black text-emerald-800 uppercase tracking-[0.2em] text-[10px]">
                          <div className="flex items-center gap-2">
                            <span className="size-2 bg-emerald-500 rounded-full"></span>
                            {fakultas}
                          </div>
                        </td>
                      </tr>
                      {prodis.map((prodi: any) => (
                        <React.Fragment key={prodi.name}>
                          {prodi.classes.map((cls: any, cIdx: number) => (
                            <tr key={cls.name} className="border-b border-slate-200 hover:bg-slate-100 transition-colors duration-200 group/row">
                              {cIdx === 0 && (
                                <td rowSpan={prodi.classes.length > 1 ? prodi.classes.length + 1 : prodi.classes.length} className="px-8 py-6 align-top border-r border-slate-200 bg-white group">
                                  <div className="flex flex-col gap-1">
                                    <span className="font-bold text-rose-600 text-[14px] leading-tight group-hover:text-rose-700 transition-colors">{prodi.name}</span>
                                    <span className="text-[10px] font-black text-rose-400/60 uppercase tracking-widest">Total: {prodi.total}</span>
                                  </div>
                                </td>
                              )}
                              <td className="px-8 py-4 text-slate-600 font-bold border-r border-slate-200 text-[13px]">{cls.name}</td>
                              <td className="px-8 py-4 text-center font-black text-slate-700 border-r border-slate-200 text-[15px] tracking-tight">{cls.daftar}</td>
                              <td className="px-8 py-4 text-center font-black text-slate-700 text-[15px] tracking-tight border-r border-slate-200">{cls.registrasi}</td>
                            </tr>
                          ))}
                          {prodi.classes.length > 1 && (
                            <tr className="bg-blue-100 border-y border-blue-200 hover:bg-blue-200 transition-colors duration-200">
                              <td className="px-8 py-2.5 text-blue-700 font-black text-[10px] uppercase tracking-widest border-r border-slate-200 text-right pr-4">Sub Total</td>
                              <td className="px-8 py-2.5 text-center text-blue-700 font-black text-[15px] border-r border-slate-200">{prodi.total}</td>
                              <td className="px-8 py-2.5 text-center text-blue-700 font-black text-[15px] border-r border-slate-200">{prodi.classes.reduce((acc: any, curr: any) => acc + (curr.registrasi || 0), 0)}</td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </React.Fragment>
                  ))}
                  <tr className="bg-emerald-700 text-white shadow-[0_-4px_20px_rgba(0,0,0,0.1)] hover:bg-emerald-800 transition-colors duration-200 cursor-default">
                    <td colSpan={2} className="px-8 py-6 font-black uppercase tracking-[0.3em] text-[11px]">Total Keseluruhan</td>
                    <td className="px-8 py-6 text-center font-black text-xl border-l border-white/20 tabular-nums">{totalDaftar}</td>
                    <td className="px-8 py-6 text-center font-black text-xl border-l border-white/20 tabular-nums">{totalRegistrasi}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="mt-8 flex items-center justify-between text-slate-400">
          <p className="text-[10px] font-bold uppercase tracking-widest">Sistem Informasi Akademik UHTP © 2026</p>

        </div>
      </div>
    );
  };

  const renderDashboard = () => (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-[1600px] mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Administrator Dashboard</h1>
          <p className="text-xs font-medium text-slate-400 mt-1">Hi {adminName}, login pada {loginTime}</p>
        </div>
      </div>

      {renderStatsCards()}

      <div className="grid grid-cols-1 gap-6">
        <div className="flex justify-end -mb-3 relative z-10 pr-2">
          <button
            onClick={() => setView('detail_spmb')}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg shadow-sm hover:bg-slate-800 transition-all font-semibold text-[11px] active:scale-95 group"
          >
            <span className="material-symbols-outlined text-[16px]">table_chart</span>
            Detail SPMB
          </button>
        </div>

        {/* Chart: Pendaftaran */}
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-9 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">person_add</span>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-700">Grafik Pendaftaran Mahasiswa Baru 2025</h3>
                <p className="text-[10px] font-medium text-slate-400 mt-0.5">Total Pendaftar: <span className="text-blue-600 font-bold">{totals.pendaftaran}</span></p>
              </div>
            </div>
          </div>
          <div className="px-6 py-8 bg-slate-50/40">
            {pendaftaranData.length > 0 ? renderBarChart(pendaftaranData, Math.max(...pendaftaranData.map(d => d.val), 50), 'pendaftaran') : <div className="h-48 flex items-center justify-center text-slate-400 text-sm">Memuat data grafik...</div>}
          </div>
        </div>

        {/* Chart: Registrasi */}
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-9 bg-emerald-50 text-emerald-500 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">how_to_reg</span>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-700">Grafik Registrasi Mahasiswa Baru 2025</h3>
                <p className="text-[10px] font-medium text-slate-400 mt-0.5">Total Registrasi: <span className="text-emerald-600 font-bold">{totals.registrasi}</span></p>
              </div>
            </div>
          </div>
          <div className="px-6 py-8 bg-slate-50/40">
            {registrasiData.length > 0 ? renderBarChart(registrasiData, Math.max(...registrasiData.map(d => d.val), 50), 'registrasi') : <div className="h-48 flex items-center justify-center text-slate-400 text-sm">Memuat data grafik...</div>}
          </div>
        </div>

        {/* Chart: Sumber Informasi */}
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-9 bg-amber-50 text-amber-500 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">analytics</span>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-700">Grafik Sumber Informasi Responden</h3>
                <p className="text-[10px] font-medium text-slate-400 mt-0.5">Total Responden: <span className="text-amber-600 font-bold">{totals.responden}</span></p>
              </div>
            </div>
          </div>
          <div className="px-6 py-8 bg-slate-50/40">
            {sumberData.length > 0 ? renderBarChart(sumberData, Math.max(...sumberData.map(d => d.val), 50), 'sumber') : <div className="h-48 flex items-center justify-center text-slate-400 text-sm">Memuat data grafik...</div>}
          </div>
        </div>
      </div>

    </div>
  );

  const renderTambahSoal = () => (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500 font-sans">
      <div className="flex items-center justify-between mb-4 text-slate-600">
        <h2 className="text-[24px] font-medium text-slate-800">Administrator <span className="text-sm font-normal text-slate-500 opacity-60 ml-2">Hi {adminName} Login {loginTime}</span></h2>
        <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400">
          <span className="material-symbols-outlined text-[14px]">home</span> Home <span className="material-symbols-outlined text-[14px]">chevron_right</span> Dashboard
        </div>
      </div>

      {renderStatsCards()}

      <div className="flex items-center gap-4 mb-8">
        <div className="size-12 bg-white text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm border border-emerald-100">
          <span className="material-symbols-outlined text-[28px]">post_add</span>
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            {soalForm.soal_untuk === 'Soal Wawancara' ? 'Tambah Soal Wawancara' : 'Tambah Soal Ujian'}
          </h1>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Master Data / Tambah Soal</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        <div className="px-10 py-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <h3 className="font-black text-slate-700 uppercase tracking-widest text-sm">Formulir Input Soal</h3>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">CBT UHTP v2.4.0</span>
        </div>

        <form onSubmit={handleSoalSubmit} className="p-8 space-y-6 bg-slate-50/30">
          {/* Group: Pertanyaan */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h4 className="text-[11px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2 border-b border-slate-50 pb-3">
              <span className="material-symbols-outlined text-[18px]">edit_square</span>
              Konten Pertanyaan
            </h4>
            <div className="tinymce-editor-container border-2 border-slate-200 rounded-2xl overflow-hidden focus-within:border-emerald-500 transition-all">
              <CKEditor
                editor={ClassicEditor as any}
                data={soalForm.pertanyaan}
                onChange={(_, editor) => {
                  const data = editor.getData();
                  setSoalForm({ ...soalForm, pertanyaan: data });
                }}
                config={{
                  toolbar: [
                    'heading', '|',
                    'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', '|',
                    'insertTable', 'mediaEmbed', 'undo', 'redo'
                  ]
                }}
              />
            </div>
          </div>

          {/* Group: Pilihan Ganda (Hanya jika bukan Wawancara) */}
          {soalForm.soal_untuk !== 'Soal Wawancara' && (
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
              <h4 className="text-[11px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2 border-b border-slate-50 pb-3">
                <span className="material-symbols-outlined text-[18px]">format_list_bulleted</span>
                Opsi Pilihan Ganda
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {['pilihan_a', 'pilihan_b', 'pilihan_c', 'pilihan_d'].map((id) => {
                  const keyLetter = id.replace('pilihan_', '').toUpperCase();
                  const theme = 
                    keyLetter === 'A' ? { text: 'text-blue-600', bg: 'bg-blue-50/50', border: 'border-blue-100', focus: 'focus-within:border-blue-500 focus-within:ring-blue-500/5' } :
                    keyLetter === 'B' ? { text: 'text-indigo-600', bg: 'bg-indigo-50/50', border: 'border-indigo-100', focus: 'focus-within:border-indigo-500 focus-within:ring-indigo-500/5' } :
                    keyLetter === 'C' ? { text: 'text-purple-600', bg: 'bg-purple-50/50', border: 'border-purple-100', focus: 'focus-within:border-purple-500 focus-within:ring-purple-500/5' } :
                                        { text: 'text-pink-600', bg: 'bg-pink-50/50', border: 'border-pink-100', focus: 'focus-within:border-pink-500 focus-within:ring-pink-500/5' };
                  
                  return (
                    <div key={id} className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pilihan {keyLetter}</label>
                      <div className={`relative flex items-center bg-slate-50 border-2 border-slate-100 rounded-2xl transition-all ${theme.focus}`}>
                        <div className={`absolute left-3 size-8 rounded-xl ${theme.bg} ${theme.text} ${theme.border} border flex items-center justify-center font-black text-xs shadow-sm select-none`}>
                          {keyLetter}
                        </div>
                        <input 
                          type="text" 
                          placeholder={`Masukkan Pilihan ${keyLetter}...`} 
                          className="w-full pl-14 pr-5 py-3.5 bg-transparent outline-none border-none font-bold text-slate-700 text-[13px]" 
                          value={(soalForm as any)[id]} 
                          onChange={e => setSoalForm({ ...soalForm, [id]: e.target.value })} 
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Group: Atribut Soal */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <h4 className="text-[11px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2 border-b border-slate-50 pb-3">
              <span className="material-symbols-outlined text-[18px]">tune</span>
              Pengaturan Jawaban & Atribut
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {soalForm.soal_untuk !== 'Soal Wawancara' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kunci Jawaban</label>
                  <div className="relative flex items-center">
                    <select 
                      className="w-full px-5 pr-12 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 outline-none appearance-none transition-all font-bold text-slate-700 text-[13px] cursor-pointer" 
                      value={soalForm.jawaban} 
                      onChange={e => setSoalForm({ ...soalForm, jawaban: e.target.value })}
                    >
                      <option value="A">Pilihan A</option>
                      <option value="B">Pilihan B</option>
                      <option value="C">Pilihan C</option>
                      <option value="D">Pilihan D</option>
                    </select>
                    <span className="absolute right-4 pointer-events-none material-symbols-outlined text-slate-400 text-[18px]">keyboard_arrow_down</span>
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Soal Untuk</label>
                <div className="relative flex items-center">
                  <select 
                    className="w-full px-5 pr-12 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 outline-none appearance-none transition-all font-bold text-slate-700 text-[13px] cursor-pointer" 
                    value={soalForm.soal_untuk} 
                    onChange={e => setSoalForm({ ...soalForm, soal_untuk: e.target.value })}
                  >
                    <option value="Jalur A">Jalur A</option>
                    <option value="Jalur B">Jalur B</option>
                    <option value="Pasca">Pasca</option>
                    <option value="NERS">NERS</option>
                    <option value="Profesi Bidan">Profesi Bidan</option>
                    <option value="STMIK">STMIK</option>
                    <option value="Soal Wawancara">Soal Wawancara</option>
                  </select>
                  <span className="absolute right-4 pointer-events-none material-symbols-outlined text-slate-400 text-[18px]">keyboard_arrow_down</span>
                </div>
              </div>
              {soalForm.soal_untuk === 'Soal Wawancara' ? (
                <>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kategori Wawancara</label>
                    <div className="relative flex items-center">
                      <select
                        className="w-full px-5 pr-12 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 outline-none appearance-none transition-all font-bold text-slate-700 text-[13px] cursor-pointer"
                        value={soalForm.kategori}
                        onChange={e => setSoalForm({ ...soalForm, kategori: e.target.value })}
                      >
                        <option value="Latar Belakang dan Motivasi">Latar Belakang dan Motivasi</option>
                        <option value="Tujuan dan Harapan">Tujuan dan Harapan</option>
                        <option value="Kemampuan dan Kesiapan">Kemampuan dan Kesiapan</option>
                      </select>
                      <span className="absolute right-4 pointer-events-none material-symbols-outlined text-slate-400 text-[18px]">keyboard_arrow_down</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Prodi</label>
                    <div className="relative flex items-center">
                      <select
                        className="w-full px-5 pr-12 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 outline-none appearance-none transition-all font-bold text-slate-700 text-[13px] cursor-pointer"
                        value={soalForm.prodi}
                        onChange={e => setSoalForm({ ...soalForm, prodi: e.target.value })}
                      >
                        <option value="">Semua Prodi (General)</option>
                        {prodiOptions.length > 0 ? (
                          prodiOptions.map(p => (
                            <option key={p} value={p}>{p}</option>
                          ))
                        ) : (
                          <>
                            <option value="Magister Kesehatan Masyarakat">Magister Kesehatan Masyarakat</option>
                            <option value="S1 Keperawatan">S1 Keperawatan</option>
                            <option value="S1 Kebidanan">S1 Kebidanan</option>
                          </>
                        )}
                      </select>
                      <span className="absolute right-4 pointer-events-none material-symbols-outlined text-slate-400 text-[18px]">keyboard_arrow_down</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Status</label>
                    <div className="relative flex items-center">
                      <select
                        className="w-full px-5 pr-12 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 outline-none appearance-none transition-all font-bold text-slate-700 text-[13px] cursor-pointer"
                        value={(soalForm as any).status}
                        onChange={e => setSoalForm({ ...soalForm, status: e.target.value })}
                      >
                        <option value="aktif">Aktif</option>
                        <option value="nonaktif">Nonaktif</option>
                      </select>
                      <span className="absolute right-4 pointer-events-none material-symbols-outlined text-slate-400 text-[18px]">keyboard_arrow_down</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tipe Soal</label>
                    <div className="relative flex items-center">
                      <select 
                        className="w-full px-5 pr-12 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 outline-none appearance-none transition-all font-bold text-slate-700 text-[13px] cursor-pointer" 
                        value={soalForm.type_soal} 
                        onChange={e => setSoalForm({ ...soalForm, type_soal: e.target.value })}
                      >
                        <option value="TPA">TPA</option>
                        <option value="Bahasa Inggris">Bahasa Inggris</option>
                      </select>
                      <span className="absolute right-4 pointer-events-none material-symbols-outlined text-slate-400 text-[18px]">keyboard_arrow_down</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Status</label>
                    <div className="relative flex items-center">
                      <select
                        className="w-full px-5 pr-12 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 outline-none appearance-none transition-all font-bold text-slate-700 text-[13px] cursor-pointer"
                        value={(soalForm as any).status}
                        onChange={e => setSoalForm({ ...soalForm, status: e.target.value })}
                      >
                        <option value="aktif">Aktif</option>
                        <option value="nonaktif">Nonaktif</option>
                      </select>
                      <span className="absolute right-4 pointer-events-none material-symbols-outlined text-slate-400 text-[18px]">keyboard_arrow_down</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className={`px-10 py-4 ${isSaving ? 'bg-slate-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'} text-white rounded-2xl shadow-lg shadow-emerald-500/20 font-black text-[11px] uppercase tracking-widest transition-all flex items-center gap-2 active:scale-95`}
            >
              {isSaving ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[16px]">sync</span>
                  Menyimpan...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  Simpan Data Soal
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderJadwal = () => (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500 font-sans">
      <div className="flex items-center justify-between mb-4 text-slate-600">
        <h2 className="text-[24px] font-medium text-slate-800">Administrator <span className="text-sm font-normal text-slate-500 opacity-60 ml-2">Hi {adminName} Login {loginTime}</span></h2>
        <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400">
          <span className="material-symbols-outlined text-[14px]">home</span> Home <span className="material-symbols-outlined text-[14px]">chevron_right</span> Dashboard
        </div>
      </div>

      {renderStatsCards()}

      <div className="flex items-center gap-4 mb-8">
        <div className="size-12 bg-white text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm border border-emerald-100">
          <span className="material-symbols-outlined text-[28px]">calendar_month</span>
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Pengaturan Jadwal Ujian</h1>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Setting / Jadwal Ujian</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden mb-10">
        <div className="px-10 py-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <h3 className="font-black text-slate-700 uppercase tracking-widest text-sm">{editingJadwalId ? 'Edit Jadwal' : 'Tambah Jadwal Baru'}</h3>
        </div>

        <form onSubmit={editingJadwalId ? handleUpdateJadwal : handleJadwalSubmit} className="p-8 space-y-8">
          {/* Group: Identitas & Tanggal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Gelombang</label>
              <input type="text" placeholder="Contoh: 20261" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all text-sm font-semibold text-slate-700" value={jadwalForm.gelombang} onChange={e => setJadwalForm({ ...jadwalForm, gelombang: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Tanggal Ujian</label>
              <div className="relative group/field">
                <input
                  type="date"
                  onClick={(e) => {
                    try { (e.target as HTMLInputElement).showPicker(); } catch { }
                  }}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all text-sm font-semibold text-slate-700 cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full"
                  value={jadwalForm.tanggal_ujian}
                  onChange={e => setJadwalForm({ ...jadwalForm, tanggal_ujian: e.target.value })}
                />
                <div className="absolute right-0 top-0 h-full w-12 flex items-center justify-center text-slate-300 pointer-events-none group-focus-within/field:text-emerald-500 transition-colors">
                  <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
            {/* Group: Waktu Pelaksanaan */}
            <div className="space-y-4 p-5 bg-slate-50/50 rounded-2xl border border-slate-100">
              <h4 className="text-[11px] font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-emerald-500">schedule</span>
                Waktu Pelaksanaan
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Jam Mulai</label>
                  <div className="relative group/field">
                    <input
                      type="text"
                      value={jadwalForm.jam_mulai}
                      readOnly
                      onClick={() => setActiveTimePicker({ field: 'jam_mulai', label: 'Pilih Jam Mulai' })}
                      placeholder="08:00:00"
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all text-sm font-semibold text-slate-700 cursor-pointer"
                    />
                    <div className="absolute right-0 top-0 h-full w-10 flex items-center justify-center text-slate-300 pointer-events-none group-focus-within/field:text-emerald-500 transition-colors">
                      <span className="material-symbols-outlined text-[16px]">schedule</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Jam Berakhir</label>
                  <div className="relative group/field">
                    <input
                      type="text"
                      value={jadwalForm.jam_berakhir}
                      readOnly
                      onClick={() => setActiveTimePicker({ field: 'jam_berakhir', label: 'Pilih Jam Berakhir' })}
                      placeholder="21:00:00"
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all text-sm font-semibold text-slate-700 cursor-pointer"
                    />
                    <div className="absolute right-0 top-0 h-full w-10 flex items-center justify-center text-slate-300 pointer-events-none group-focus-within/field:text-emerald-500 transition-colors">
                      <span className="material-symbols-outlined text-[16px]">schedule</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Group: Periode Pendaftaran */}
            <div className="space-y-4 p-5 bg-slate-50/50 rounded-2xl border border-slate-100">
              <h4 className="text-[11px] font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-emerald-500">app_registration</span>
                Periode Registrasi
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Tgl Mulai</label>
                  <div className="relative group/field">
                    <input
                      type="date"
                      onClick={(e) => {
                        try { (e.target as HTMLInputElement).showPicker(); } catch { }
                      }}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all text-[13px] font-semibold text-slate-700 cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full"
                      value={jadwalForm.tanggal_registrasi_mulai}
                      onChange={e => setJadwalForm({ ...jadwalForm, tanggal_registrasi_mulai: e.target.value })}
                    />
                    <div className="absolute right-0 top-0 h-full w-10 flex items-center justify-center text-slate-300 pointer-events-none group-focus-within/field:text-emerald-500 transition-colors">
                      <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Tgl Akhir</label>
                  <div className="relative group/field">
                    <input
                      type="date"
                      onClick={(e) => {
                        try { (e.target as HTMLInputElement).showPicker(); } catch { }
                      }}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all text-[13px] font-semibold text-slate-700 cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full"
                      value={jadwalForm.tanggal_registrasi_akhir}
                      onChange={e => setJadwalForm({ ...jadwalForm, tanggal_registrasi_akhir: e.target.value })}
                    />
                    <div className="absolute right-0 top-0 h-full w-10 flex items-center justify-center text-slate-300 pointer-events-none group-focus-within/field:text-emerald-500 transition-colors">
                      <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100/60 mt-4">
            {editingJadwalId && (
              <button type="button" onClick={() => { setEditingJadwalId(null); setJadwalForm({ gelombang: '', tanggal_ujian: '', jam_mulai: '', jam_berakhir: '', tanggal_registrasi_mulai: '', tanggal_registrasi_akhir: '' }); }} className="px-8 py-3 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all">Batal</button>
            )}
            <button type="submit" disabled={isSaving} className="px-10 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-500/20 font-bold text-[11px] uppercase tracking-widest transition-all disabled:opacity-50">
              {isSaving ? 'Memproses...' : (editingJadwalId ? 'Update Jadwal' : 'Simpan Jadwal')}
            </button>
          </div>
        </form>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="size-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined">event_available</span>
          </div>
          <h2 className="text-lg font-black text-slate-800 tracking-tight">Daftar Jadwal Aktif</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500 bg-white px-4 py-2 rounded-xl border border-slate-100">
            <span>Total:</span>
            <span className="font-black text-emerald-600">{jadwalList.length}</span>
          </div>
          <div className="relative group/search">
            <input type="text" placeholder="Cari jadwal..." className="pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all w-64 shadow-sm" />
            <div className="absolute left-0 top-0 h-full w-11 flex items-center justify-center text-slate-400 group-focus-within/search:text-emerald-500 transition-colors pointer-events-none">
              <span className="material-symbols-outlined text-[20px]">search</span>
            </div>
          </div>
        </div>
      </div>

      {isJadwalLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-3xl p-6 border border-slate-100 animate-pulse h-48"></div>
          ))}
        </div>
      ) : jadwalList.length === 0 ? (
        <div className="bg-white rounded-[32px] p-20 text-center border-2 border-dashed border-slate-100">
          <span className="material-symbols-outlined text-6xl text-slate-200 mb-4">event_busy</span>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Belum ada jadwal yang diset.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {jadwalList.map((j) => (
            <div
              key={j.id}
              onClick={() => fetchPesertaByJadwal(j.gelombang)}
              className={`group bg-white rounded-2xl p-4 border ${selectedJadwalGelombang === j.gelombang ? 'border-emerald-500 ring-2 ring-emerald-500/10' : 'border-slate-200'} shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-300 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4`}
            >
              {/* Gelombang Badge */}
              <div className="flex items-center gap-4 min-w-[120px]">
                <div className="px-4 py-2 bg-emerald-50 text-emerald-700 text-xs font-black uppercase tracking-widest rounded-xl border border-emerald-100">
                  Gel. {j.gelombang}
                </div>
              </div>

              {/* Ujian Info */}
              <div className="flex items-center gap-6 flex-1">
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-slate-50 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
                    <span className="material-symbols-outlined text-[20px]">calendar_today</span>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Tanggal Ujian</p>
                    <p className="text-sm font-bold text-slate-800">{new Date(j.tanggal_ujian).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                </div>

                <div className="hidden sm:block h-8 w-px bg-slate-200"></div>

                <div className="flex items-center gap-3">
                  <div className="size-10 bg-slate-50 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
                    <span className="material-symbols-outlined text-[20px]">schedule</span>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Waktu</p>
                    <p className="text-sm font-bold text-slate-700">{j.jam_mulai.substring(0, 5)} - {j.jam_berakhir.substring(0, 5)}</p>
                  </div>
                </div>
              </div>

              {/* Registrasi Info & Actions */}
              <div className="flex items-center justify-between md:justify-end gap-6">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5 text-right md:text-left">Periode Registrasi</p>
                  <div className="text-xs font-bold text-slate-600">
                    {j.tanggal_registrasi_mulai} <span className="text-slate-300 mx-1">→</span> {j.tanggal_registrasi_akhir}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button onClick={(e) => { e.stopPropagation(); handleEditJadwalClick(j); }} className="size-9 bg-amber-50 border border-amber-100 text-amber-600 rounded-xl flex items-center justify-center hover:bg-amber-500 hover:text-white transition-all shadow-sm"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                  <button onClick={(e) => { e.stopPropagation(); handleDeleteJadwal(j.id); }} className="size-9 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Detail Peserta per Jadwal Section */}
      {selectedJadwalGelombang && (
        <div className="mt-12 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="bg-white rounded-[32px] shadow-xl border border-slate-100 overflow-hidden">
            <div className="px-10 py-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="font-black text-slate-700 uppercase tracking-widest text-sm">Daftar Peserta Gelombang {selectedJadwalGelombang}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total Peserta: {pesertaJadwalData.length}</p>
              </div>
              <button
                onClick={() => setSelectedJadwalGelombang(null)}
                className="size-8 bg-slate-200 text-slate-500 rounded-full flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="p-8">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 text-[11px] font-black uppercase tracking-widest border-b border-slate-200">
                        <th className="px-6 py-4 w-16 text-center">No</th>
                        <th className="px-6 py-4">Nama Mahasiswa</th>
                        <th className="px-6 py-4">No Ujian</th>
                        <th className="px-6 py-4 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-[13px]">
                      {pesertaJadwalLoading ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-12 text-center">
                            <div className="flex flex-col items-center gap-3">
                              <span className="material-symbols-outlined animate-spin text-emerald-500 text-3xl">sync</span>
                              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Memuat data peserta...</span>
                            </div>
                          </td>
                        </tr>
                      ) : pesertaJadwalData.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-bold uppercase tracking-widest text-[11px]">
                            Belum ada peserta terdaftar di gelombang ini
                          </td>
                        </tr>
                      ) : (
                        pesertaJadwalData.map((mhs, i) => (
                          <tr key={mhs.id} className="hover:bg-slate-50/80 even:bg-slate-50/30 transition-colors group">
                            <td className="px-6 py-4 text-center font-bold text-slate-400">{i + 1}</td>
                            <td className="px-6 py-4 font-bold text-slate-700">{mhs.nama}</td>
                            <td className="px-6 py-4 font-mono text-emerald-600 font-bold">{mhs.no_ujian}</td>
                            <td className="px-6 py-4">
                              <div className="flex justify-center">
                                <button
                                  onClick={() => {
                                    setSelectedCbtResult(mhs);
                                    setCbtResultDetails(mhs.details || []);
                                    setBackView('jadwal_ujian');
                                    setView('detail_hasil_ujian');
                                    window.scrollTo(0, 0);
                                  }}
                                  className="px-4 py-1.5 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-all active:scale-95 flex items-center justify-center gap-2"
                                >
                                  <span className="material-symbols-outlined text-[16px]">visibility</span>
                                  Detail
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderDaftarSoal = (jalur: string) => (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500 font-sans">
      <div className="flex items-center justify-between mb-4 text-slate-600">
        <h2 className="text-[24px] font-medium text-slate-800">Administrator <span className="text-sm font-normal text-slate-500 opacity-60 ml-2">Hi {adminName} Login {loginTime}</span></h2>
        <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400">
          <span className="material-symbols-outlined text-[14px]">home</span> Home <span className="material-symbols-outlined text-[14px]">chevron_right</span> Dashboard
        </div>
      </div>

      {renderStatsCards()}

      <div className="flex items-center gap-4 mb-8">
        <div className="size-12 bg-white text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm border border-emerald-100">
          <span className="material-symbols-outlined text-[28px]">list_alt</span>
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Daftar soal {jalur}</h1>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Bank Soal / {jalur}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-12">
        {/* Modern Header Section */}
        <div className="px-6 py-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              <span>Tampilkan</span>
              <select className="bg-transparent border-none focus:ring-0 text-emerald-700 font-bold cursor-pointer py-0 pl-1 pr-7 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23059669%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:14px_14px] bg-no-repeat bg-[position:right_center]">
                <option>10</option><option>25</option><option>50</option>
              </select>
              <span>Baris</span>
            </div>
            <div className="h-6 w-px bg-slate-200"></div>
            <div className="flex items-center gap-2">
              <span className="size-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium text-slate-500">Total: {soalList.length} Soal</span>
            </div>
          </div>

          <div className="relative group/search">
            <input
              type="text"
              placeholder="Cari konten soal..."
              className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all text-sm font-medium text-slate-700 w-64 md:w-80"
            />
            <div className="absolute left-0 top-0 h-full w-10 flex items-center justify-center text-slate-400 group-focus-within/search:text-emerald-500 transition-colors">
              <span className="material-symbols-outlined text-[18px]">search</span>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
          {isSoalLoading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 bg-slate-50/50">
              <div className="size-10 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin"></div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">Memuat Data Soal...</p>
            </div>
          ) : soalList.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center bg-slate-50/50">
              <span className="material-symbols-outlined text-4xl text-slate-350 mb-1">inventory_2</span>
              <h3 className="text-sm font-bold text-slate-700">Tidak Ada Data</h3>
              <p className="text-xs text-slate-400">Belum ada soal yang tersedia untuk kategori {jalur}.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-black text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <th className="px-4 py-3 w-12 text-center">No</th>
                  <th className="px-4 py-3 min-w-[300px]">Pertanyaan</th>
                  {jalur === 'Soal Wawancara' ? (
                    <>
                      <th className="px-4 py-3 w-48 text-center">Kategori</th>
                      <th className="px-4 py-3 w-32 text-center">Prodi</th>
                    </>
                  ) : (
                    <>
                      <th className="px-4 py-3 min-w-[320px]">Pilihan Jawaban</th>
                      <th className="px-4 py-3 w-20 text-center">Kunci</th>
                      <th className="px-4 py-3 w-36 text-center">Atribut</th>
                    </>
                  )}
                  <th className="px-4 py-3 w-24 text-center">Status</th>
                  <th className="px-4 py-3 w-24 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {soalList.map((soal, idx) => (
                  <tr key={soal.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-2.5 text-center align-middle font-bold text-slate-455">
                      {idx + 1}
                    </td>
                    <td className="px-4 py-2.5 align-middle">
                      <div className="rich-text-content text-slate-800 leading-relaxed font-semibold" dangerouslySetInnerHTML={{ __html: soal.pertanyaan }}></div>
                    </td>
                    {jalur === 'Soal Wawancara' ? (
                      <>
                        <td className="px-4 py-2.5 align-middle text-center">
                          <span className="inline-block text-[10px] font-black text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                            {soal.kategori || '-'}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 align-middle text-center font-bold text-emerald-600">
                          {soal.prodi || '-'}
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-2.5 align-middle">
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] leading-tight">
                            {[
                              { key: 'A', text: soal.pilihan_a },
                              { key: 'B', text: soal.pilihan_b },
                              { key: 'C', text: soal.pilihan_c },
                              { key: 'D', text: soal.pilihan_d }
                            ].map((opt) => {
                              return (
                                <div key={opt.key} className="flex items-start gap-1">
                                  <span className="font-black mr-0.5 shrink-0 text-slate-500">
                                    {opt.key}.
                                  </span>
                                  <span className="text-slate-700 font-bold">
                                    {opt.text}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </td>
                        <td className="px-4 py-2.5 align-middle text-center">
                          <span className="inline-flex size-6 items-center justify-center bg-emerald-50 text-emerald-700 rounded-full font-black text-[11px] border border-emerald-200/80 shadow-sm">
                            {soal.jawaban}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 align-middle text-center">
                          <div className="flex flex-wrap items-center justify-center gap-1.5">
                            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[9px] font-bold uppercase tracking-wider border border-indigo-100/80">
                              {soal.type_soal}
                            </span>
                            <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-[9px] font-bold uppercase tracking-wider border border-amber-100/80">
                              {soal.soal_untuk}
                            </span>
                          </div>
                        </td>
                      </>
                    )}
                    <td className="px-4 py-2.5 align-middle text-center">
                      <button
                        onClick={() => handleToggleStatus(soal.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                          soal.status === 'aktif' 
                            ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-200' 
                            : 'text-slate-500 bg-slate-50 hover:bg-slate-100 border-slate-200'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[13px]">{soal.status === 'aktif' ? 'check_circle' : 'cancel'}</span>
                        {soal.status === 'aktif' ? 'Aktif' : 'Mati'}
                      </button>
                    </td>
                    <td className="px-4 py-2.5 align-middle">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleEditClick(soal)}
                          className="size-7 rounded-lg bg-white border border-slate-200 text-blue-600 flex items-center justify-center hover:bg-blue-50 transition-colors shadow-sm cursor-pointer hover:scale-105 active:scale-95"
                          title="Edit Soal"
                        >
                          <span className="material-symbols-outlined text-[15px]">edit</span>
                        </button>
                        <button
                          onClick={() => {/* Tambahkan fungsi hapus di sini */ }}
                          className="size-7 rounded-lg bg-white border border-slate-200 text-rose-600 flex items-center justify-center hover:bg-rose-50 transition-colors shadow-sm cursor-pointer hover:scale-105 active:scale-95"
                          title="Hapus Soal"
                        >
                          <span className="material-symbols-outlined text-[15px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Standard Footer Pagination */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 font-medium">
            Menampilkan <span className="font-bold text-slate-700">1</span> sampai <span className="font-bold text-slate-700">{soalList.length}</span> dari <span className="font-bold text-slate-700">{soalList.length}</span> data
          </p>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 bg-white border border-slate-200 rounded text-xs font-medium text-slate-400 cursor-not-allowed">Previous</button>
            <button className="px-3 py-1.5 bg-emerald-600 text-white rounded text-xs font-bold shadow-sm">1</button>
            <button className="px-3 py-1.5 bg-white border border-slate-200 rounded text-xs font-medium text-slate-600 hover:bg-slate-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );


  const renderProsesKesehatan = () => {
    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-500 text-slate-600 font-sans">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[24px] font-medium text-slate-800">Administrator <span className="text-sm font-normal text-slate-500 opacity-60 ml-2">Hi {adminName} Login {loginTime}</span></h2>
          <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400">
            <span className="material-symbols-outlined text-[14px]">home</span> Home <span className="material-symbols-outlined text-[14px]">chevron_right</span> Dashboard
          </div>
        </div>

        {renderStatsCards()}

        <h3 className="text-[20px] font-normal mb-4 text-slate-800">Proses Tes Kesehatan</h3>

        {/* Filter Box */}
        <div className="bg-white border-t-[3px] border-[#00a65a] shadow-sm rounded-sm mb-4">
          <div className="p-3 flex flex-wrap items-center gap-3">
            <div className="w-full md:w-64">
              <select
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-sm focus:outline-none focus:border-[#00a65a] text-sm text-slate-600 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px_10px] bg-no-repeat bg-[position:right_10px_center]"
                value={kesehatanFilterGelombang}
                onChange={(e) => {
                  setKesehatanFilterGelombang(e.target.value);
                  setKesehatanCurrentPage(1);
                  setHasSearchedKesehatan(false);
                }}
              >
                <option value="">Pilih Gelombang</option>
                {gelombangOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <button
              className="px-4 py-1.5 bg-[#00a65a] text-white rounded-sm text-sm font-semibold hover:bg-[#008d4c] transition-colors"
              onClick={fetchKesehatanData}
            >
              Pilih
            </button>
          </div>
        </div>

        {/* Table Box */}
        {hasSearchedKesehatan && kesehatanFilterGelombang ? (
          <div className="bg-white border-t-[3px] border-[#00a65a] shadow-lg rounded-xl overflow-hidden">
            <div className="p-3 border-b border-slate-100 flex flex-col gap-1">
              <h3 className="text-[15px] text-slate-800">Gelombang: {kesehatanFilterGelombang}</h3>
            </div>
            <div className="p-0">
              <div className="flex flex-wrap items-center justify-between mb-4 gap-4 px-4 pt-4">
                <div className="flex items-center gap-2 text-sm">
                  <span>Show</span>
                  <select
                    value={kesehatanEntries}
                    onChange={(e) => {
                      setKesehatanEntries(Number(e.target.value));
                      setKesehatanCurrentPage(1);
                    }}
                    className="px-2 py-1 pr-6 border border-slate-300 rounded-sm outline-none bg-white appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:8px_8px] bg-no-repeat bg-[position:right_8px_center]"
                  >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                  </select>
                  <span>entries</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span>Search:</span>
                  <input
                    type="text"
                    value={kesehatanSearch}
                    onChange={(e) => {
                      setKesehatanSearch(e.target.value);
                      setKesehatanCurrentPage(1);
                    }}
                    className="px-2 py-1 border border-slate-300 rounded-sm outline-none focus:border-[#00a65a]"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse border border-slate-200">
                  <thead>
                    <tr className="bg-slate-200 border-b border-slate-200 text-slate-900">
                      <th className="px-4 py-2 font-black border-r border-slate-200 w-16 text-center cursor-pointer hover:bg-slate-200 relative">
                        <div className="flex items-center justify-between">No <span className="text-[10px] text-slate-400 opacity-50 absolute right-2">↕</span></div>
                      </th>
                      <th className="px-4 py-2 font-black border-r border-slate-200 cursor-pointer hover:bg-slate-200 relative">
                        <div className="flex items-center justify-between">Nama <span className="text-[10px] text-slate-400 opacity-50 absolute right-2">↕</span></div>
                      </th>
                      <th className="px-4 py-2 font-black border-r border-slate-200 cursor-pointer hover:bg-slate-200 relative">
                        <div className="flex items-center justify-between">No Ujian <span className="text-[10px] text-slate-400 opacity-50 absolute right-2">↕</span></div>
                      </th>
                      <th className="px-4 py-2 font-black cursor-pointer hover:bg-slate-200 w-48 relative text-center">
                        <div className="flex items-center justify-center">Aksi</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {kesehatanLoading ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-4 text-center bg-slate-50 text-slate-500">Memuat data...</td>
                      </tr>
                    ) : paginatedKesehatanData.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-4 text-center bg-slate-50 text-slate-500">No data available in table</td>
                      </tr>
                    ) : (
                      paginatedKesehatanData.map((mhs, i) => (
                        <tr key={mhs.id} className="border-b border-slate-200 hover:bg-slate-50">
                          <td className="px-4 py-2 text-center border-r border-slate-200 bg-slate-100">{(kesehatanCurrentPage - 1) * kesehatanEntries + i + 1}</td>
                          <td className="px-4 py-2 border-r border-slate-200">{mhs.nama}</td>
                          <td className="px-4 py-2 border-r border-slate-200">{mhs.no_ujian}</td>
                          <td className="px-4 py-2 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => {
                                  setSelectedCbtResult(mhs);
                                  setCbtResultDetails(mhs.details || []);
                                  setBackView('proses_kesehatan');
                                  setView('detail_hasil_ujian');
                                  window.scrollTo(0, 0);
                                }}
                                className="px-2 py-1 bg-[#00a65a] text-white rounded-[3px] text-[10px] font-bold hover:bg-[#008d4c] transition-colors flex items-center gap-1 shadow-sm"
                              >
                                Detail
                              </button>
                              {mhs.status_kesehatan && (
                                <button
                                  onClick={() => {
                                    setSelectedKesehatanStudent(mhs);
                                    setTinggiBadan(mhs.tinggi_badan || '');
                                    setGolonganDarah(mhs.golongan_darah || '');
                                    setButaWarna(mhs.buta_warna || '');
                                    setVisus(mhs.visus || '');
                                    setTekananDarah(mhs.tekanan_darah || '');
                                    setRiwayatPenyakit(mhs.riwayat_penyakit || '');
                                    setShowInputHasilModal(true);
                                  }}
                                  className="px-2 py-1 bg-[#3c8dbc] text-white rounded-[3px] text-[10px] font-bold hover:bg-[#367fa9] transition-colors flex items-center gap-1 shadow-sm"
                                >
                                  Detail Kesehatan
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-wrap items-center justify-between mt-4 text-sm px-4 pb-4">
                <div className="text-slate-600">Showing {filteredKesehatanData.length > 0 ? (kesehatanCurrentPage - 1) * kesehatanEntries + 1 : 0} to {Math.min(kesehatanCurrentPage * kesehatanEntries, filteredKesehatanData.length)} of {filteredKesehatanData.length} entries</div>
                <div className="flex border border-slate-300 rounded-sm overflow-hidden">
                  <button
                    disabled={kesehatanCurrentPage === 1}
                    onClick={() => setKesehatanCurrentPage(prev => prev - 1)}
                    className={`px-3 py-1.5 border-r border-slate-300 transition-colors ${kesehatanCurrentPage === 1 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                  >
                    Previous
                  </button>
                  <button
                    disabled={kesehatanCurrentPage === totalKesehatanPages || totalKesehatanPages === 0}
                    onClick={() => setKesehatanCurrentPage(prev => prev + 1)}
                    className={`px-3 py-1.5 transition-colors ${kesehatanCurrentPage === totalKesehatanPages || totalKesehatanPages === 0 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-20 text-center border-2 border-dashed border-slate-100 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-700">
            <span className="material-symbols-outlined text-6xl text-slate-200 mb-4">filter_alt</span>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[11px]">Silakan pilih gelombang untuk menampilkan data</p>
          </div>
        )}
      </div>
    );
  };

  const renderRekapKesehatan = () => {
    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-500 text-slate-600 font-sans">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[24px] font-medium text-slate-800">Administrator <span className="text-sm font-normal text-slate-500 opacity-60 ml-2">Hi {adminName} Login {loginTime}</span></h2>
          <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400">
            <span className="material-symbols-outlined text-[14px]">home</span> Home <span className="material-symbols-outlined text-[14px]">chevron_right</span> Dashboard
          </div>
        </div>

        {renderStatsCards()}

        <h3 className="text-[20px] font-normal mb-4 text-slate-800">Rekap Hasil Tes Kesehatan</h3>

        {/* Filter Box */}
        <div className="bg-white border-t-[3px] border-[#00a65a] shadow-sm rounded-sm mb-4">
          <div className="p-3 flex flex-wrap items-center gap-3">
            <div className="w-full md:w-64">
              <select
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-sm focus:outline-none focus:border-[#00a65a] text-sm text-slate-600 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px_10px] bg-no-repeat bg-[position:right_10px_center]"
                value={kesehatanFilterGelombang}
                onChange={(e) => {
                  setKesehatanFilterGelombang(e.target.value);
                  setKesehatanCurrentPage(1);
                  setHasSearchedKesehatan(false);
                }}
              >
                <option value="">Pilih Gelombang</option>
                {gelombangOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <button
              className="px-4 py-1.5 bg-[#00a65a] text-white rounded-sm text-sm font-semibold hover:bg-[#008d4c] transition-colors"
              onClick={fetchKesehatanData}
            >
              Pilih
            </button>
          </div>
        </div>

        {/* Table Box */}
        {hasSearchedKesehatan && kesehatanFilterGelombang ? (
          <div className="bg-white border-t-[3px] border-[#00a65a] shadow-lg rounded-xl overflow-hidden">
            <div className="p-3 border-b border-slate-100 flex flex-col gap-1">
              <h3 className="text-[15px] text-slate-800">Gelombang: {kesehatanFilterGelombang}</h3>
            </div>
            <div className="p-0">
              <div className="flex flex-wrap items-center justify-between mb-4 gap-4 px-4 pt-4">
                <div className="flex items-center gap-2 text-sm">
                  <span>Show</span>
                  <select
                    value={kesehatanEntries}
                    onChange={(e) => {
                      setKesehatanEntries(Number(e.target.value));
                      setKesehatanCurrentPage(1);
                    }}
                    className="px-2 py-1 pr-6 border border-slate-300 rounded-sm outline-none bg-white appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:8px_8px] bg-no-repeat bg-[position:right_8px_center]"
                  >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                  </select>
                  <span>entries</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span>Search:</span>
                  <input
                    type="text"
                    value={kesehatanSearch}
                    onChange={(e) => {
                      setKesehatanSearch(e.target.value);
                      setKesehatanCurrentPage(1);
                    }}
                    className="px-2 py-1 border border-slate-300 rounded-sm outline-none focus:border-[#00a65a]"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse border border-slate-200">
                  <thead>
                    <tr className="bg-slate-200 border-b border-slate-200 text-slate-900">
                      <th className="px-4 py-2 font-black border-r border-slate-200 w-16 text-center cursor-pointer hover:bg-slate-200 relative">
                        <div className="flex items-center justify-between">No <span className="text-[10px] text-slate-400 opacity-50 absolute right-2">↕</span></div>
                      </th>
                      <th className="px-4 py-2 font-black border-r border-slate-200 cursor-pointer hover:bg-slate-200 relative">
                        <div className="flex items-center justify-between">Nama <span className="text-[10px] text-slate-400 opacity-50 absolute right-2">↕</span></div>
                      </th>
                      <th className="px-4 py-2 font-black border-r border-slate-200 cursor-pointer hover:bg-slate-200 relative">
                        <div className="flex items-center justify-between">No Ujian <span className="text-[10px] text-slate-400 opacity-50 absolute right-2">↕</span></div>
                      </th>
                      <th className="px-4 py-2 font-black border-r border-slate-200 cursor-pointer hover:bg-slate-200 relative">
                        <div className="flex items-center justify-between">Status Kesehatan <span className="text-[10px] text-slate-400 opacity-50 absolute right-2">↕</span></div>
                      </th>
                      <th className="px-4 py-2 font-black cursor-pointer hover:bg-slate-200 w-32 relative">
                        <div className="flex items-center justify-between">Aksi <span className="text-[10px] text-slate-400 opacity-50 absolute right-2">↕</span></div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {kesehatanLoading ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-4 text-center bg-slate-50 text-slate-500">Memuat data...</td>
                      </tr>
                    ) : paginatedKesehatanData.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-4 text-center bg-slate-50 text-slate-500">No data available in table</td>
                      </tr>
                    ) : (
                      paginatedKesehatanData.map((mhs, i) => (
                        <tr key={mhs.id} className="border-b border-slate-200 hover:bg-slate-50">
                          <td className="px-4 py-2 text-center border-r border-slate-200">{(kesehatanCurrentPage - 1) * kesehatanEntries + i + 1}</td>
                          <td className="px-4 py-2 border-r border-slate-200">{mhs.nama}</td>
                          <td className="px-4 py-2 border-r border-slate-200">{mhs.no_ujian}</td>
                          <td className="px-4 py-2 border-r border-slate-200 text-center">
                            <span className={`px-2 py-0.5 rounded-sm text-[11px] font-bold ${!mhs.status_kesehatan ? 'bg-slate-200 text-slate-600' :
                              (mhs.status_kesehatan === 'Sehat' || mhs.status_kesehatan === 'Lulus') ? 'bg-[#00a65a] text-white' :
                                (mhs.status_kesehatan === 'Menunggu') ? 'bg-amber-500 text-white' : 'bg-rose-500 text-white'
                              }`}>
                              {mhs.status_kesehatan ? mhs.status_kesehatan.toUpperCase() : 'BELUM TES'}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => {
                                  setSelectedCbtResult(mhs);
                                  setCbtResultDetails(mhs.details || []);
                                  setBackView('rekap_kesehatan');
                                  setView('detail_hasil_ujian');
                                  window.scrollTo(0, 0);
                                }}
                                className="px-2 py-1 bg-[#00a65a] text-white rounded-[3px] text-[10px] font-bold hover:bg-[#008d4c] transition-colors flex items-center gap-1 shadow-sm"
                              >
                                Detail
                              </button>
                              {mhs.status_kesehatan && (
                                <button
                                  onClick={() => {
                                    setSelectedKesehatanStudent(mhs);
                                    setTinggiBadan(mhs.tinggi_badan || '');
                                    setGolonganDarah(mhs.golongan_darah || '');
                                    setButaWarna(mhs.buta_warna || '');
                                    setVisus(mhs.visus || '');
                                    setTekananDarah(mhs.tekanan_darah || '');
                                    setRiwayatPenyakit(mhs.riwayat_penyakit || '');
                                    setShowInputHasilModal(true);
                                  }}
                                  className="px-2 py-1 bg-[#3c8dbc] text-white rounded-[3px] text-[10px] font-bold hover:bg-[#367fa9] transition-colors flex items-center gap-1 shadow-sm"
                                >
                                  Detail Kesehatan
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-wrap items-center justify-between mt-4 text-sm px-4 pb-4">
                <div className="text-slate-600">Showing {filteredKesehatanData.length > 0 ? (kesehatanCurrentPage - 1) * kesehatanEntries + 1 : 0} to {Math.min(kesehatanCurrentPage * kesehatanEntries, filteredKesehatanData.length)} of {filteredKesehatanData.length} entries</div>
                <div className="flex border border-slate-300 rounded-sm overflow-hidden">
                  <button
                    disabled={kesehatanCurrentPage === 1}
                    onClick={() => setKesehatanCurrentPage(prev => prev - 1)}
                    className={`px-3 py-1.5 border-r border-slate-300 transition-colors ${kesehatanCurrentPage === 1 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                  >
                    Previous
                  </button>
                  <button
                    disabled={kesehatanCurrentPage === totalKesehatanPages || totalKesehatanPages === 0}
                    onClick={() => setKesehatanCurrentPage(prev => prev + 1)}
                    className={`px-3 py-1.5 transition-colors ${kesehatanCurrentPage === totalKesehatanPages || totalKesehatanPages === 0 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-20 text-center border-2 border-dashed border-slate-100 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-700">
            <span className="material-symbols-outlined text-6xl text-slate-200 mb-4">filter_alt</span>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[11px]">Silakan pilih gelombang untuk menampilkan data</p>
          </div>
        )}
      </div>
    );
  };



  const renderProsesWawancara = () => {
    const prodiWawancaraOptions = [
      'S2 Kesmas',
      'S1 Keperawatan',
      'Profesi Ners',
      'S1 Kebidanan',
      'Profesi Bidan'
    ];

    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-500 text-slate-600 font-sans">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[24px] font-medium text-slate-800">Administrator <span className="text-sm font-normal text-slate-500 opacity-60 ml-2">Hi {adminName} Login {loginTime}</span></h2>
          <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400">
            <span className="material-symbols-outlined text-[14px]">home</span> Home <span className="material-symbols-outlined text-[14px]">chevron_right</span> Dashboard
          </div>
        </div>

        {renderStatsCards()}

        <h3 className="text-[20px] font-normal mb-4 text-slate-800">Proses Tes Wawancara</h3>

        {/* Filter Box */}
        <div className="bg-white border-t-[3px] border-[#00a65a] shadow-sm rounded-sm mb-4">
          <div className="p-3 flex flex-wrap items-center gap-3">
            <div className="w-full md:w-64">
              <select
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-sm focus:outline-none focus:border-[#00a65a] text-sm text-slate-600 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px_10px] bg-no-repeat bg-[position:right_10px_center]"
                value={wawancaraFilterGelombang}
                onChange={(e) => {
                  setWawancaraFilterGelombang(e.target.value);
                  setWawancaraCurrentPage(1);
                }}
              >
                <option value="">Pilih Gelombang</option>
                {gelombangOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div className="w-full md:w-64">
              <select
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-sm focus:outline-none focus:border-[#00a65a] text-sm text-slate-600 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px_10px] bg-no-repeat bg-[position:right_10px_center]"
                value={wawancaraFilterProdi}
                onChange={(e) => {
                  setWawancaraFilterProdi(e.target.value);
                  setWawancaraCurrentPage(1);
                }}
              >
                <option value="">Pilih Prodi</option>
                {prodiWawancaraOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <button
              className="px-4 py-1.5 bg-[#00a65a] text-white rounded-sm text-sm font-semibold hover:bg-[#008d4c] transition-colors"
              onClick={fetchWawancaraData}
            >
              Pilih
            </button>
          </div>
        </div>

        {wawancaraData.length > 0 || wawancaraLoading ? (
          <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-slate-200 mt-4">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex flex-col">
                <h4 className="text-[15px] font-bold text-slate-700">Gelombang: <span className="font-medium text-slate-500">{wawancaraFilterGelombang}</span></h4>
                <p className="text-[13px] font-bold text-slate-700">Prodi/Pilihan: <span className="font-medium text-slate-500">{wawancaraFilterProdi}</span></p>
              </div>
            </div>

            {renderWawancaraTable()}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-20 text-center border-2 border-dashed border-slate-100 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-700 mt-4">
            <span className="material-symbols-outlined text-6xl text-slate-200 mb-4">filter_alt</span>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[11px]">Silakan pilih gelombang dan prodi untuk menampilkan data</p>
          </div>
        )}
      </div>
    );
  };

  const renderRekapWawancara = () => {
    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-500 text-slate-600 font-sans">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[24px] font-medium text-slate-800">Administrator <span className="text-sm font-normal text-slate-500 opacity-60 ml-2">Hi {adminName} Login {loginTime}</span></h2>
          <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400">
            <span className="material-symbols-outlined text-[14px]">home</span> Home <span className="material-symbols-outlined text-[14px]">chevron_right</span> Dashboard
          </div>
        </div>

        {renderStatsCards()}

        <h3 className="text-[20px] font-normal mb-4 text-slate-800">Rekap Hasil Wawancara</h3>

        {/* Filter Box */}
        <div className="bg-white border-t-[3px] border-[#00a65a] shadow-sm rounded-sm mb-4">
          <div className="p-3 flex flex-wrap items-center gap-3">
            <div className="w-full md:w-64">
              <select
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-sm focus:outline-none focus:border-[#00a65a] text-sm text-slate-600 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px_10px] bg-no-repeat bg-[position:right_10px_center]"
                value={wawancaraFilterGelombang}
                onChange={(e) => {
                  setWawancaraFilterGelombang(e.target.value);
                  setWawancaraCurrentPage(1);
                  // Auto fetch when gelombang changes for rekap
                  if (e.target.value) {
                    setWawancaraLoading(true);
                    fetch(`${API_BASE_URL}/api/admin/wawancara?gelombang=${e.target.value}`)
                      .then(res => res.json())
                      .then(data => {
                        if (data.status === 'success') setWawancaraData(data.data);
                        setWawancaraLoading(false);
                      })
                      .catch(() => setWawancaraLoading(false));
                  }
                }}
              >
                <option value="">Pilih Gelombang</option>
                {gelombangOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {wawancaraData.length > 0 || wawancaraLoading ? (
          <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-slate-200 mt-4">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <h4 className="text-[18px] font-bold text-slate-700">Gelombang: <span className="font-medium text-slate-500">{wawancaraFilterGelombang}</span></h4>
            </div>

            {renderWawancaraTable()}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-20 text-center border-2 border-dashed border-slate-100 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-700 mt-4">
            <span className="material-symbols-outlined text-6xl text-slate-200 mb-4">filter_alt</span>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[11px]">Silakan pilih gelombang untuk menampilkan data rekap</p>
          </div>
        )}
      </div>
    );
  };

  const renderWawancaraTable = () => {
    return (
      <div className="p-0">
        <div className="flex flex-wrap items-center justify-between mb-4 gap-4 px-4 pt-4">
          <div className="flex items-center gap-2 text-sm">
            <span>Show</span>
            <select
              value={wawancaraEntries}
              onChange={(e) => {
                setWawancaraEntries(Number(e.target.value));
                setWawancaraCurrentPage(1);
              }}
              className="px-2 py-1 pr-6 border border-slate-300 rounded-sm outline-none bg-white appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:8px_8px] bg-no-repeat bg-[position:right_8px_center]"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
            <span>entries</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span>Search:</span>
            <input
              type="text"
              value={wawancaraSearch}
              onChange={(e) => {
                setWawancaraSearch(e.target.value);
                setWawancaraCurrentPage(1);
              }}
              className="px-2 py-1 border border-slate-300 rounded-sm outline-none focus:border-[#00a65a]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <th className="px-4 py-4 text-center font-bold text-[11px] uppercase tracking-wider border-r border-slate-100 w-12">No</th>
                <th className="px-4 py-4 text-left font-bold text-[11px] uppercase tracking-wider border-r border-slate-100">Nama Mahasiswa</th>
                <th className="px-4 py-4 text-left font-bold text-[11px] uppercase tracking-wider border-r border-slate-100">No Ujian</th>
                <th className="px-4 py-4 text-left font-bold text-[11px] uppercase tracking-wider border-r border-slate-100">Program Studi</th>
                <th className="px-4 py-4 text-left font-bold text-[11px] uppercase tracking-wider border-r border-slate-100">Kontak</th>
                <th className="px-4 py-4 text-left font-bold text-[11px] uppercase tracking-wider border-r border-slate-100">Hasil CBT</th>
                <th className="px-4 py-4 text-center font-bold text-[11px] uppercase tracking-wider border-r border-slate-100">Kesehatan</th>
                <th className="px-4 py-4 text-center font-bold text-[11px] uppercase tracking-wider border-r border-slate-100">Wawancara</th>
                <th className="px-4 py-4 text-center font-bold text-[11px] uppercase tracking-wider border-r border-slate-100">Status</th>
                <th className="px-4 py-4 text-center font-bold text-[11px] uppercase tracking-wider">Registrasi</th>
              </tr>
            </thead>
            <tbody>
              {wawancaraLoading ? (
                <tr>
                  <td colSpan={10} className="px-4 py-4 text-center bg-slate-50 text-slate-500">Memuat data...</td>
                </tr>
              ) : paginatedWawancaraData.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-4 text-center bg-slate-50 text-slate-500">No data available in table</td>
                </tr>
              ) : (
                paginatedWawancaraData.map((mhs, i) => {
                  const isS2Kesmas = (mhs.pilihan || wawancaraFilterProdi)?.toLowerCase().includes('kesmas');
                  return (
                    <tr key={mhs.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-4 text-center border-r border-slate-50 text-slate-500 font-mono">{(wawancaraCurrentPage - 1) * wawancaraEntries + i + 1}</td>
                      <td className="px-4 py-4 border-r border-slate-50 font-bold text-slate-700 whitespace-nowrap uppercase">{mhs.nama}</td>
                      <td className="px-4 py-4 border-r border-slate-50 font-mono text-emerald-600 font-bold whitespace-nowrap">{mhs.no_ujian}</td>
                      <td className="px-4 py-4 border-r border-slate-50 uppercase whitespace-nowrap text-slate-600 font-medium">{mhs.pilihan || wawancaraFilterProdi}</td>
                      <td className="px-4 py-4 border-r border-slate-50 text-slate-500 whitespace-nowrap font-medium">{mhs.no_telp || '-'}</td>
                      <td className="px-4 py-4 border-r border-slate-50 text-slate-700 font-black text-center whitespace-nowrap bg-slate-50/30">
                        <span className="bg-white px-2 py-1 rounded border border-slate-200 shadow-sm">{mhs.jumlah_benar || '-'}</span>
                      </td>
                      <td className="px-4 py-4 border-r border-slate-50 text-center">
                        {isS2Kesmas ? (
                          <span className="text-[10px] font-black uppercase text-slate-400 italic">N/A</span>
                        ) : mhs.status_kesehatan ? (
                          <button
                            onClick={() => {
                              setSelectedKesehatanStudent(mhs);
                              setTinggiBadan(mhs.tinggi_badan || '');
                              setGolonganDarah(mhs.golongan_darah || '');
                              setButaWarna(mhs.buta_warna || '');
                              setVisus(mhs.visus || '');
                              setTekananDarah(mhs.tekanan_darah || '');
                              setRiwayatPenyakit(mhs.riwayat_penyakit || '');
                              setShowInputHasilModal(true);
                            }}
                            className={`px-3 py-1.5 rounded-full text-[10px] font-black shadow-sm transition-all hover:scale-105 uppercase tracking-tighter ${(mhs.status_kesehatan === 'Sehat' || mhs.status_kesehatan === 'Lulus')
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                              }`}
                          >
                            {mhs.status_kesehatan}
                          </button>
                        ) : (
                          <span className="px-2.5 py-1.5 bg-amber-50 text-amber-600 border border-amber-200 rounded-full text-[10px] font-black shadow-sm uppercase tracking-wider">
                            Belum Tes
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 border-r border-slate-50 text-center">
                        {isS2Kesmas ? (
                          <span className="text-[10px] font-black uppercase text-slate-400 italic">N/A</span>
                        ) : (mhs.status_kesehatan && !['Sehat', 'Lulus', 'Menunggu'].includes(mhs.status_kesehatan)) ? (
                          <span className="text-[10px] font-black uppercase text-rose-600 bg-rose-50 px-2 py-1 rounded border border-rose-100">Gagal Kes.</span>
                        ) : (
                          <div className="flex flex-col items-center gap-1">
                            <span className={`text-[10px] font-black uppercase px-2.5 py-1.5 rounded-full border shadow-sm tracking-wide whitespace-nowrap ${mhs.hasil_wawancara === 'LULUS'
                                ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                : 'bg-indigo-100 text-indigo-700 border-indigo-200'
                              }`}>
                              {mhs.hasil_wawancara || 'Belum Ujian'}
                            </span>
                            {mhs.nilai_wawancara !== undefined && mhs.nilai_wawancara !== null && (
                              <span className="text-[11px] font-bold text-slate-500">Nilai: {mhs.nilai_wawancara}</span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4 border-r border-slate-50 text-center">
                        {view === 'rekap_wawancara' ? (
                          <span className={`px-3 py-1.5 rounded-full text-[10px] font-black shadow-sm border uppercase tracking-wider whitespace-nowrap ${mhs.status === 'Lulus'
                              ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                              (mhs.status === 'Tidak Lulus' || mhs.status === 'Gagal')
                                ? 'bg-rose-100 text-rose-700 border-rose-200' :
                                'bg-indigo-100 text-indigo-700 border-indigo-200'
                            }`}>
                            {mhs.status || 'Proses'}
                          </span>
                        ) : (mhs.status === 'Tidak Lulus' || mhs.status === 'Gagal') ? (
                          <span className="px-3 py-1.5 bg-rose-100 text-rose-700 border border-rose-200 rounded-full text-[10px] font-black shadow-sm uppercase whitespace-nowrap">Gagal</span>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedWawancaraStudent(mhs);
                              setWawancaraStatus(mhs.hasil_wawancara === 'TIDAK LULUS' ? 'TIDAK LULUS' : 'LULUS');
                              setShowWawancaraModal(true);
                            }}
                            className="px-4 py-1.5 rounded-full text-[10px] font-black text-indigo-700 shadow-sm transition-all hover:scale-105 bg-indigo-100 hover:bg-indigo-200 border border-indigo-200 uppercase whitespace-nowrap"
                          >
                            PROSES
                          </button>
                        )}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`text-[10px] uppercase font-black px-2.5 py-1 rounded-full border shadow-sm tracking-tighter whitespace-nowrap ${mhs.status_registrasi === 'Sudah Registrasi'
                            ? 'text-emerald-700 bg-emerald-50 border-emerald-200' :
                            mhs.status_registrasi === 'Menunggu Verifikasi'
                              ? 'text-amber-700 bg-amber-50 border-amber-200'
                              : 'text-rose-700 bg-rose-100 border-rose-200 shadow-sm'
                          }`}>
                          {mhs.status_registrasi || 'Belum Registrasi'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between mt-4 text-sm px-4 pb-4">
          <div className="text-slate-600">Showing {filteredWawancaraData.length > 0 ? (wawancaraCurrentPage - 1) * wawancaraEntries + 1 : 0} to {Math.min(wawancaraCurrentPage * wawancaraEntries, filteredWawancaraData.length)} of {filteredWawancaraData.length} entries</div>
          <div className="flex border border-slate-300 rounded-sm overflow-hidden">
            <button
              disabled={wawancaraCurrentPage === 1}
              onClick={() => setWawancaraCurrentPage(prev => prev - 1)}
              className={`px-3 py-1.5 border-r border-slate-300 transition-colors ${wawancaraCurrentPage === 1 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
            >
              Previous
            </button>
            <button
              disabled={wawancaraCurrentPage === totalWawancaraPages || totalWawancaraPages === 0}
              onClick={() => setWawancaraCurrentPage(prev => prev + 1)}
              className={`px-3 py-1.5 transition-colors ${wawancaraCurrentPage === totalWawancaraPages || totalWawancaraPages === 0 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderProsesKelulusan = () => {
    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-500 text-slate-600 font-sans">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[24px] font-medium text-slate-800">Administrator <span className="text-sm font-normal text-slate-500 opacity-60 ml-2">Hi {adminName} Login {loginTime}</span></h2>
          <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400">
            <span className="material-symbols-outlined text-[14px]">home</span> Home <span className="material-symbols-outlined text-[14px]">chevron_right</span> Proses Kelulusan
          </div>
        </div>

        {renderStatsCards()}

        <h3 className="text-[20px] font-normal mb-4 text-slate-800">Proses Kelulusan Calon Mahasiswa</h3>

        <div className="bg-white border-t-[3px] border-[#00a65a] shadow-sm rounded-sm mb-4">
          <div className="p-3 flex flex-wrap items-center gap-3">
            <div className="w-full md:w-64">
              <select
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-sm focus:outline-none focus:border-[#00a65a] text-sm text-slate-600 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px_10px] bg-no-repeat bg-[position:right_10px_center]"
                value={wawancaraFilterGelombang}
                onChange={(e) => {
                  setWawancaraFilterGelombang(e.target.value);
                  setWawancaraCurrentPage(1);
                }}
              >
                <option value="">Pilih Gelombang</option>
                {gelombangOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <button
              className="px-4 py-1.5 bg-[#00a65a] text-white rounded-sm text-sm font-semibold hover:bg-[#008d4c] transition-colors"
              onClick={fetchWawancaraData}
            >
              Pilih
            </button>
          </div>
        </div>

        {wawancaraData.length > 0 || wawancaraLoading ? (
          <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-slate-200 mt-4">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex flex-col">
                <h4 className="text-[15px] font-bold text-slate-700">Gelombang: <span className="font-medium text-slate-500">{wawancaraFilterGelombang}</span></h4>
              </div>
            </div>
            {renderKelulusanTable()}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-20 text-center border-2 border-dashed border-slate-100 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-700 mt-4">
            <span className="material-symbols-outlined text-6xl text-slate-200 mb-4">filter_alt</span>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[11px]">Silakan pilih gelombang untuk menampilkan data</p>
          </div>
        )}
      </div>
    );
  };

  const renderAbsensi = () => {
    const filteredAbsensi = absensiData.filter(mhs =>
      (mhs.nama?.toLowerCase() || '').includes(absensiSearch.toLowerCase()) ||
      (mhs.no_ujian?.toLowerCase() || '').includes(absensiSearch.toLowerCase())
    );

    const paginatedAbsensi = filteredAbsensi.slice(
      (absensiCurrentPage - 1) * absensiEntries,
      absensiCurrentPage * absensiEntries
    );

    const totalPages = Math.ceil(filteredAbsensi.length / absensiEntries);

    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-500 font-sans text-slate-600">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="size-12 bg-white text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm border border-emerald-100">
              <span className="material-symbols-outlined text-[28px]">assignment</span>
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">Absensi Ujian Tulis (CBT)</h1>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Master Data / Absensi</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400">
            <span className="material-symbols-outlined text-[14px]">home</span> Home <span className="material-symbols-outlined text-[14px]">chevron_right</span> Absensi
          </div>
        </div>

        {renderStatsCards()}

        <div className="bg-white border-t-[3px] border-[#00857A] shadow-md rounded-2xl p-6 mb-6">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[240px]">
              <label className="block text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-2">Gelombang</label>
              <select
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white transition-all text-sm font-semibold text-slate-700 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px_10px] bg-no-repeat bg-[position:right_15px_center]"
                value={absensiFilterGelombang}
                onChange={e => {
                  setAbsensiFilterGelombang(e.target.value);
                  setAbsensiCurrentPage(1);
                }}
              >
                <option value="">Pilih Gelombang</option>
                {gelombangOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-w-[240px]">
              <label className="block text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-2">Program Studi</label>
              <select
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white transition-all text-sm font-semibold text-slate-700 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px_10px] bg-no-repeat bg-[position:right_15px_center]"
                value={absensiFilterProdi}
                onChange={e => {
                  setAbsensiFilterProdi(e.target.value);
                  setAbsensiCurrentPage(1);
                }}
              >
                <option value="">Pilih Program Studi</option>
                {prodiOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <button
              onClick={fetchAbsensiData}
              disabled={absensiLoading}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-500/10 active:scale-95 transition-all flex items-center gap-2"
            >
              {absensiLoading ? (
                <><span className="material-symbols-outlined text-[18px] animate-spin">sync</span> Memuat...</>
              ) : (
                <><span className="material-symbols-outlined text-[18px]">search</span> Tampilkan</>
              )}
            </button>
          </div>
        </div>

        {hasSearchedAbsensi && (
          <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="font-extrabold text-slate-700 text-base uppercase tracking-tight">Daftar Peserta Absensi</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  Gelombang: {absensiFilterGelombang} | Prodi: {absensiFilterProdi}
                </p>
              </div>

              <button
                onClick={handlePrintAbsensi}
                disabled={absensiData.length === 0}
                className="px-6 py-2.5 bg-[#00a65a] hover:bg-[#008d4c] text-white rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center gap-2 shadow-md shadow-emerald-500/20 hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-[18px]">print</span>
                Cetak Absen
              </button>
            </div>

            <div className="p-0">
              <div className="flex flex-wrap items-center justify-between mb-4 gap-4 px-6 pt-4">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <span>Show</span>
                  <select
                    value={absensiEntries}
                    onChange={(e) => {
                      setAbsensiEntries(Number(e.target.value));
                      setAbsensiCurrentPage(1);
                    }}
                    className="px-2 py-1 pr-6 border border-slate-300 rounded-lg outline-none bg-white appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:8px_8px] bg-no-repeat bg-[position:right_8px_center]"
                  >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                  </select>
                  <span>entries</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <span>Search:</span>
                  <input
                    type="text"
                    value={absensiSearch}
                    onChange={(e) => {
                      setAbsensiSearch(e.target.value);
                      setAbsensiCurrentPage(1);
                    }}
                    className="px-3 py-1 border border-slate-300 rounded-lg outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-[13px] text-left">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                      <th className="px-6 py-4 text-center font-bold text-[11px] uppercase tracking-wider border-r border-slate-100 w-16">No</th>
                      <th className="px-6 py-4 font-bold text-[11px] uppercase tracking-wider border-r border-slate-100">No Ujian</th>
                      <th className="px-6 py-4 font-bold text-[11px] uppercase tracking-wider border-r border-slate-100">Nama Lengkap</th>
                      <th className="px-6 py-4 font-bold text-[11px] uppercase tracking-wider">Program Studi Pilihan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {absensiLoading ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-10 text-center bg-slate-50 text-slate-400 font-semibold uppercase tracking-wider animate-pulse">Memuat data...</td>
                      </tr>
                    ) : filteredAbsensi.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-10 text-center bg-slate-50 text-slate-400">Tidak ada data tersedia.</td>
                      </tr>
                    ) : (
                      paginatedAbsensi.map((mhs, idx) => (
                        <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 text-center border-r border-slate-50 font-mono text-slate-500">{(absensiCurrentPage - 1) * absensiEntries + idx + 1}</td>
                          <td className="px-6 py-4 border-r border-slate-50 font-mono text-slate-600 font-bold">{mhs.no_ujian}</td>
                          <td className="px-6 py-4 border-r border-slate-50 font-extrabold text-slate-700 uppercase">{mhs.nama}</td>
                          <td className="px-6 py-4 font-bold uppercase text-slate-500">{mhs.pilihan || '-'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-wrap items-center justify-between mt-4 text-sm px-6 pb-6">
                <div className="text-slate-500">Showing {filteredAbsensi.length > 0 ? (absensiCurrentPage - 1) * absensiEntries + 1 : 0} to {Math.min(absensiCurrentPage * absensiEntries, filteredAbsensi.length)} of {filteredAbsensi.length} entries</div>
                {totalPages > 1 && (
                  <div className="flex border border-slate-300 rounded-lg overflow-hidden font-semibold">
                    <button
                      disabled={absensiCurrentPage === 1}
                      onClick={() => setAbsensiCurrentPage(prev => prev - 1)}
                      className={`px-3 py-1.5 border-r border-slate-300 transition-colors ${absensiCurrentPage === 1 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                    >
                      Previous
                    </button>
                    <button
                      disabled={absensiCurrentPage === totalPages}
                      onClick={() => setAbsensiCurrentPage(prev => prev + 1)}
                      className={`px-3 py-1.5 transition-colors ${absensiCurrentPage === totalPages ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderBeritaAcara = () => {
    const filteredBerita = beritaData.filter(mhs =>
      (mhs.nama?.toLowerCase() || '').includes(beritaSearch.toLowerCase()) ||
      (mhs.no_ujian?.toLowerCase() || '').includes(beritaSearch.toLowerCase())
    );

    const paginatedBerita = filteredBerita.slice(
      (beritaCurrentPage - 1) * beritaEntries,
      beritaCurrentPage * beritaEntries
    );

    const totalPages = Math.ceil(filteredBerita.length / beritaEntries);

    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-500 font-sans text-slate-600">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="size-12 bg-white text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm border border-emerald-100">
              <span className="material-symbols-outlined text-[28px]">description</span>
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">Berita Acara Ujian Tulis (CBT)</h1>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Master Data / Berita Acara</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400">
            <span className="material-symbols-outlined text-[14px]">home</span> Home <span className="material-symbols-outlined text-[14px]">chevron_right</span> Berita Acara
          </div>
        </div>

        {renderStatsCards()}

        <div className="bg-white border-t-[3px] border-[#00857A] shadow-md rounded-2xl p-6 mb-6">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[240px]">
              <label className="block text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-2">Gelombang</label>
              <select
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white transition-all text-sm font-semibold text-slate-700 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px_10px] bg-no-repeat bg-[position:right_15px_center]"
                value={beritaFilterGelombang}
                onChange={e => {
                  setBeritaFilterGelombang(e.target.value);
                  setBeritaCurrentPage(1);
                }}
              >
                <option value="">Pilih Gelombang</option>
                {gelombangOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-w-[240px]">
              <label className="block text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-2">Program Studi</label>
              <select
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white transition-all text-sm font-semibold text-slate-700 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px_10px] bg-no-repeat bg-[position:right_15px_center]"
                value={beritaFilterProdi}
                onChange={e => {
                  setBeritaFilterProdi(e.target.value);
                  setBeritaCurrentPage(1);
                }}
              >
                <option value="">Pilih Program Studi</option>
                {prodiOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <button
              onClick={fetchBeritaData}
              disabled={beritaLoading}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-500/10 active:scale-95 transition-all flex items-center gap-2"
            >
              {beritaLoading ? (
                <><span className="material-symbols-outlined text-[18px] animate-spin">sync</span> Memuat...</>
              ) : (
                <><span className="material-symbols-outlined text-[18px]">search</span> Tampilkan</>
              )}
            </button>
          </div>
        </div>

        {hasSearchedBerita && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h3 className="font-extrabold text-slate-700 text-base uppercase tracking-tight">Preview Peserta Ujian</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    Gelombang: {beritaFilterGelombang} | Prodi: {beritaFilterProdi}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowBeritaSettings(!showBeritaSettings)}
                    className={`px-4 py-2 bg-white border rounded-xl font-bold text-xs transition-all active:scale-95 flex items-center gap-2 shadow-sm ${
                      showBeritaSettings
                        ? 'border-slate-300 bg-slate-100 text-slate-700'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">settings</span>
                    {showBeritaSettings ? 'Sembunyikan Pengaturan' : 'Pengaturan Cetak'}
                  </button>

                  <button
                    onClick={handlePrintBeritaAcara}
                    className="px-6 py-2.5 bg-[#00a65a] hover:bg-[#008d4c] text-white rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center gap-2 shadow-md shadow-emerald-500/20 hover:shadow-lg transition-all active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[18px]">print</span>
                    Cetak Berita Acara
                  </button>
                </div>
              </div>

              {/* Form Parameter Cetak (Collapsible) */}
              {showBeritaSettings && (
                <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1.5">Materi Ujian</label>
                    <input
                      type="text"
                      value={beritaMateriUjian}
                      onChange={e => setBeritaMateriUjian(e.target.value)}
                      className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-emerald-500 transition-all shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1.5">Hari / Tanggal</label>
                    <input
                      type="date"
                      value={beritaHariTanggal}
                      onChange={e => setBeritaHariTanggal(e.target.value)}
                      className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-emerald-500 transition-all shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1.5">Jam Mulai</label>
                    <input
                      type="text"
                      placeholder="e.g. 08:00:00"
                      value={beritaJamMulai}
                      onChange={e => setBeritaJamMulai(e.target.value)}
                      className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-emerald-500 transition-all shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1.5">Jam Selesai</label>
                    <input
                      type="text"
                      placeholder="e.g. 21:00:00"
                      value={beritaJamSelesai}
                      onChange={e => setBeritaJamSelesai(e.target.value)}
                      className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-emerald-500 transition-all shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1.5">Kehadiran (Manual)</label>
                    <input
                      type="number"
                      placeholder={`Default: ${filteredBerita.length}`}
                      value={beritaHadirUjianCount}
                      onChange={e => setBeritaHadirUjianCount(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-emerald-500 transition-all shadow-sm"
                    />
                  </div>
                </div>
              )}

              <div className="p-0">
                <div className="flex flex-wrap items-center justify-between mb-4 gap-4 px-6 pt-4">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span>Show</span>
                    <select
                      value={beritaEntries}
                      onChange={(e) => {
                        setBeritaEntries(Number(e.target.value));
                        setBeritaCurrentPage(1);
                      }}
                      className="px-2 py-1 pr-6 border border-slate-300 rounded-lg outline-none bg-white appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:8px_8px] bg-no-repeat bg-[position:right_8px_center]"
                    >
                      <option value="10">10</option>
                      <option value="25">25</option>
                      <option value="50">50</option>
                    </select>
                    <span>entries</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span>Search:</span>
                    <input
                      type="text"
                      value={beritaSearch}
                      onChange={(e) => {
                        setBeritaSearch(e.target.value);
                        setBeritaCurrentPage(1);
                      }}
                      className="px-3 py-1 border border-slate-300 rounded-lg outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-[13px] text-left">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                        <th className="px-6 py-4 text-center font-bold text-[11px] uppercase tracking-wider border-r border-slate-100 w-16">No</th>
                        <th className="px-6 py-4 font-bold text-[11px] uppercase tracking-wider border-r border-slate-100">No Ujian</th>
                        <th className="px-6 py-4 font-bold text-[11px] uppercase tracking-wider border-r border-slate-100">Nama Lengkap</th>
                        <th className="px-6 py-4 font-bold text-[11px] uppercase tracking-wider">Program Studi Pilihan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {beritaLoading ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-10 text-center bg-slate-50 text-slate-400 font-semibold uppercase tracking-wider animate-pulse">Memuat data...</td>
                        </tr>
                      ) : filteredBerita.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-10 text-center bg-slate-50 text-slate-400">Tidak ada data tersedia.</td>
                        </tr>
                      ) : (
                        paginatedBerita.map((mhs, idx) => (
                          <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 text-center border-r border-slate-50 font-mono text-slate-500">{idx + 1}</td>
                            <td className="px-6 py-4 border-r border-slate-50 font-mono text-slate-600 font-bold">{mhs.no_ujian}</td>
                            <td className="px-6 py-4 border-r border-slate-50 font-extrabold text-slate-700 uppercase">{mhs.nama}</td>
                            <td className="px-6 py-4 font-bold uppercase text-slate-500">{mhs.pilihan || '-'}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-wrap items-center justify-between mt-4 text-sm px-6 pb-6">
                  <div className="text-slate-500">Showing {filteredBerita.length > 0 ? (beritaCurrentPage - 1) * beritaEntries + 1 : 0} to {Math.min(beritaCurrentPage * beritaEntries, filteredBerita.length)} of {filteredBerita.length} entries</div>
                  {totalPages > 1 && (
                    <div className="flex border border-slate-300 rounded-lg overflow-hidden font-semibold">
                      <button
                        disabled={beritaCurrentPage === 1}
                        onClick={() => setBeritaCurrentPage(prev => prev - 1)}
                        className={`px-3 py-1.5 border-r border-slate-300 transition-colors ${beritaCurrentPage === 1 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                      >
                        Previous
                      </button>
                      <button
                        disabled={beritaCurrentPage === totalPages}
                        onClick={() => setBeritaCurrentPage(prev => prev + 1)}
                        className={`px-3 py-1.5 transition-colors ${beritaCurrentPage === totalPages ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderRekapKelulusan = () => {
    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-500 text-slate-600 font-sans">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[24px] font-medium text-slate-800">Administrator <span className="text-sm font-normal text-slate-500 opacity-60 ml-2">Hi {adminName} Login {loginTime}</span></h2>
          <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400">
            <span className="material-symbols-outlined text-[14px]">home</span> Home <span className="material-symbols-outlined text-[14px]">chevron_right</span> Rekap Ujian
          </div>
        </div>

        {renderStatsCards()}

        <h3 className="text-[20px] font-normal mb-4 text-slate-800">Rekapitulasi Hasil Ujian</h3>

        <div className="bg-white border-t-[3px] border-[#00a65a] shadow-sm rounded-sm mb-4">
          <div className="p-3 flex flex-wrap items-center gap-3">
            <div className="w-full md:w-64">
              <select
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-sm focus:outline-none focus:border-[#00a65a] text-sm text-slate-600 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px_10px] bg-no-repeat bg-[position:right_10px_center]"
                value={wawancaraFilterGelombang}
                onChange={(e) => {
                  setWawancaraFilterGelombang(e.target.value);
                  setWawancaraCurrentPage(1);
                  if (e.target.value) {
                    setWawancaraLoading(true);
                    fetch(`${API_BASE_URL}/api/admin/wawancara?gelombang=${e.target.value}`)
                      .then(res => res.json())
                      .then(data => {
                        if (data.status === 'success') setWawancaraData(data.data);
                        setWawancaraLoading(false);
                      })
                      .catch(() => setWawancaraLoading(false));
                  }
                }}
              >
                <option value="">Pilih Gelombang</option>
                {gelombangOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {wawancaraData.length > 0 || wawancaraLoading ? (
          <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-slate-200 mt-4">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h4 className="text-[15px] font-bold text-slate-700">Gelombang: <span className="font-medium text-slate-500">{wawancaraFilterGelombang}</span></h4>
            </div>
            {renderKelulusanTable()}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-20 text-center border-2 border-dashed border-slate-100 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-700 mt-4">
            <span className="material-symbols-outlined text-6xl text-slate-200 mb-4">filter_alt</span>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[11px]">Silakan pilih gelombang untuk menampilkan data rekap</p>
          </div>
        )}
      </div>
    );
  };

  const renderPengumuman = () => {
    const filtered = getFilteredPengumumanData();
    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-500 text-slate-600 font-sans">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[24px] font-medium text-slate-800">Administrator <span className="text-sm font-normal text-slate-500 opacity-60 ml-2">Hi {adminName} Login {loginTime}</span></h2>
          <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400">
            <span className="material-symbols-outlined text-[14px]">home</span> Home <span className="material-symbols-outlined text-[14px]">chevron_right</span> Dashboard
          </div>
        </div>

        {renderStatsCards()}

        <div className="bg-white border-t-[3px] border-[#00a65a] shadow-sm rounded-sm mb-4">
          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              {/* Gelombang */}
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1.5">Gelombang</label>
                <select
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-sm focus:outline-none focus:border-[#00a65a] text-sm text-slate-600 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px_10px] bg-no-repeat bg-[position:right_10px_center]"
                  value={pengumumanFilterGelombang}
                  onChange={(e) => {
                    setPengumumanFilterGelombang(e.target.value);
                    setPengumumanData([]);
                    if (e.target.value) {
                      setPengumumanLoading(true);
                      fetch(`${API_BASE_URL}/api/admin/wawancara?gelombang=${e.target.value}`)
                        .then(res => res.json())
                        .then(data => {
                          if (data.status === 'success') setPengumumanData(data.data);
                          setPengumumanLoading(false);
                        })
                        .catch(() => setPengumumanLoading(false));
                    }
                  }}
                >
                  <option value="">Pilih Gelombang</option>
                  {gelombangOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* Program Studi */}
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1.5">Program Studi</label>
                <select
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-sm focus:outline-none focus:border-[#00a65a] text-sm text-slate-600 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px_10px] bg-no-repeat bg-[position:right_10px_center]"
                  value={pengumumanFilterProdi}
                  onChange={(e) => setPengumumanFilterProdi(e.target.value)}
                >
                  <option value="ALL">ALL</option>
                  {prodiOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* Status Kelulusan */}
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1.5">Status Kelulusan</label>
                <select
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-sm focus:outline-none focus:border-[#00a65a] text-sm text-slate-600 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px_10px] bg-no-repeat bg-[position:right_10px_center]"
                  value={pengumumanFilterStatus}
                  onChange={(e) => setPengumumanFilterStatus(e.target.value)}
                >
                  <option value="Lulus">Lulus</option>
                  <option value="Tidak Lulus">Tidak Lulus</option>
                  <option value="Cadangan">Cadangan</option>
                </select>
              </div>

              {/* Status Registrasi */}
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1.5">Status Registrasi</label>
                <select
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-sm focus:outline-none focus:border-[#00a65a] text-sm text-slate-600 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px_10px] bg-no-repeat bg-[position:right_10px_center]"
                  value={pengumumanFilterRegistrasi}
                  onChange={(e) => setPengumumanFilterRegistrasi(e.target.value)}
                >
                  <option value="Sudah">Sudah</option>
                  <option value="Belum">Belum</option>
                </select>
              </div>
            </div>

            <button
              onClick={handlePrintPengumuman}
              disabled={pengumumanLoading || pengumumanData.length === 0}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#00a65a] hover:bg-[#008d4c] disabled:bg-slate-300 text-white text-sm font-bold rounded-sm transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">print</span>
              Cetak Pengumuman
            </button>
          </div>
        </div>

        {/* Preview Table */}
        {pengumumanLoading ? (
          <div className="bg-white rounded-sm shadow-sm p-10 text-center">
            <div className="animate-spin size-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-3"></div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[11px]">Memuat data...</p>
          </div>
        ) : pengumumanData.length > 0 ? (
          <div className="bg-white shadow-sm rounded-sm overflow-hidden border border-slate-200">
            <div className="p-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-600">
                Preview Data Pengumuman 
                <span className="text-slate-400 font-normal ml-2">({filtered.length} peserta)</span>
              </h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-[13px]">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                    <th className="px-4 py-3 text-center font-bold text-[11px] uppercase tracking-wider border-r border-slate-100 w-12">No</th>
                    <th className="px-4 py-3 text-left font-bold text-[11px] uppercase tracking-wider border-r border-slate-100">No Ujian</th>
                    <th className="px-4 py-3 text-left font-bold text-[11px] uppercase tracking-wider border-r border-slate-100">Nama</th>
                    <th className="px-4 py-3 text-left font-bold text-[11px] uppercase tracking-wider border-r border-slate-100">Program Studi</th>
                    <th className="px-4 py-3 text-center font-bold text-[11px] uppercase tracking-wider border-r border-slate-100">Status</th>
                    <th className="px-4 py-3 text-center font-bold text-[11px] uppercase tracking-wider">Registrasi</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-slate-400 text-sm">Tidak ada data yang sesuai filter</td>
                    </tr>
                  ) : (
                    filtered.slice(0, 50).map((mhs: any, i: number) => (
                      <tr key={mhs.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3 text-center border-r border-slate-50 text-slate-500 font-mono">{i + 1}</td>
                        <td className="px-4 py-3 border-r border-slate-50 font-mono text-slate-500 whitespace-nowrap">{mhs.no_ujian}</td>
                        <td className="px-4 py-3 border-r border-slate-50 font-bold text-slate-700 uppercase whitespace-nowrap">{mhs.nama}</td>
                        <td className="px-4 py-3 border-r border-slate-50 uppercase text-slate-600 text-[12px] font-medium">{mhs.pilihan || '-'}</td>
                        <td className="px-4 py-3 border-r border-slate-50 text-center">
                          <span className={`text-[10px] uppercase font-black tracking-wider ${
                            (mhs.status || '').toLowerCase() === 'lulus' ? 'text-emerald-500' 
                            : (mhs.status || '').toLowerCase() === 'tidak lulus' ? 'text-rose-500' 
                            : (mhs.status || '').toLowerCase() === 'cadangan' ? 'text-amber-500' 
                            : 'text-slate-500'
                          }`}>
                            {mhs.status || 'Proses'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`text-[10px] uppercase font-black px-2.5 py-1 rounded-full border shadow-sm tracking-tighter whitespace-nowrap ${
                            mhs.status_registrasi === 'Sudah Registrasi'
                              ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                              : mhs.status_registrasi === 'Menunggu Verifikasi'
                                ? 'text-amber-700 bg-amber-50 border-amber-200'
                                : 'text-rose-700 bg-rose-50 border-rose-200'
                          }`}>
                            {mhs.status_registrasi || 'Belum Registrasi'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              {filtered.length > 50 && (
                <div className="p-3 bg-slate-50 text-center text-[11px] text-slate-400 font-bold uppercase tracking-wider border-t border-slate-100">
                  Menampilkan 50 dari {filtered.length} data. Cetak untuk melihat semua.
                </div>
              )}
            </div>
          </div>
        ) : pengumumanFilterGelombang ? (
          <div className="bg-white rounded-sm p-10 text-center border border-dashed border-slate-200 shadow-sm">
            <span className="material-symbols-outlined text-5xl text-slate-200 mb-3">search_off</span>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[11px]">Tidak ada data untuk gelombang ini</p>
          </div>
        ) : null}
      </div>
    );
  };

  const renderKelulusanTable = () => {
    return (
      <div className="p-0">
        <div className="flex flex-wrap items-center justify-between mb-4 gap-4 px-4 pt-4">
          <div className="flex items-center gap-2 text-sm">
            <span>Show</span>
            <select
              value={wawancaraEntries}
              onChange={(e) => {
                setWawancaraEntries(Number(e.target.value));
                setWawancaraCurrentPage(1);
              }}
              className="px-2 py-1 pr-6 border border-slate-300 rounded-sm outline-none bg-white appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:8px_8px] bg-no-repeat bg-[position:right_8px_center]"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
            <span>entries</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span>Search:</span>
            <input
              type="text"
              value={wawancaraSearch}
              onChange={(e) => {
                setWawancaraSearch(e.target.value);
                setWawancaraCurrentPage(1);
              }}
              className="px-2 py-1 border border-slate-300 rounded-sm outline-none focus:border-[#00a65a]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <th className="px-4 py-4 text-center font-bold text-[11px] uppercase tracking-wider border-r border-slate-100 w-12">No</th>
                <th className="px-4 py-4 text-left font-bold text-[11px] uppercase tracking-wider border-r border-slate-100">Nama</th>
                <th className="px-4 py-4 text-left font-bold text-[11px] uppercase tracking-wider border-r border-slate-100">No Ujian</th>
                <th className="px-4 py-4 text-left font-bold text-[11px] uppercase tracking-wider border-r border-slate-100">Pilihan</th>
                <th className="px-4 py-4 text-left font-bold text-[11px] uppercase tracking-wider border-r border-slate-100">No Telp</th>
                <th className="px-4 py-4 text-center font-bold text-[11px] uppercase tracking-wider border-r border-slate-100">Jumlah Benar</th>
                <th className="px-4 py-4 text-left font-bold text-[11px] uppercase tracking-wider border-r border-slate-100">Status Kesehatan</th>
                <th className="px-4 py-4 text-left font-bold text-[11px] uppercase tracking-wider border-r border-slate-100">Hasil Wawancara</th>
                <th className="px-4 py-4 text-center font-bold text-[11px] uppercase tracking-wider border-r border-slate-100">Status</th>
                {(view === 'proses_kelulusan' || view === 'rekap_kelulusan') && (
                  <th className="px-4 py-4 text-center font-bold text-[11px] uppercase tracking-wider border-r border-slate-100">Aksi</th>
                )}
                <th className="px-4 py-4 text-center font-bold text-[11px] uppercase tracking-wider">Registrasi</th>
              </tr>
            </thead>
            <tbody>
              {wawancaraLoading ? (
                <tr>
                  <td colSpan={11} className="px-4 py-4 text-center bg-slate-50 text-slate-500">Memuat data...</td>
                </tr>
              ) : paginatedWawancaraData.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-4 py-4 text-center bg-slate-50 text-slate-500">No data available in table</td>
                </tr>
              ) : (
                paginatedWawancaraData.map((mhs, i) => (
                  <tr key={mhs.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-4 text-center border-r border-slate-50 text-slate-500 font-mono">{(wawancaraCurrentPage - 1) * wawancaraEntries + i + 1}</td>
                    <td className="px-4 py-4 border-r border-slate-50 font-bold text-slate-700 uppercase whitespace-nowrap">{mhs.nama}</td>
                    <td className="px-4 py-4 border-r border-slate-50 font-mono text-slate-500 whitespace-nowrap">{mhs.no_ujian}</td>
                    <td className="px-4 py-4 border-r border-slate-50 uppercase whitespace-nowrap text-slate-600 font-medium">{mhs.pilihan || '-'}</td>
                    <td className="px-4 py-4 border-r border-slate-50 text-slate-500 whitespace-nowrap font-medium">{mhs.no_telp || '-'}</td>
                    <td className="px-4 py-4 border-r border-slate-50 text-slate-700 font-black text-center whitespace-nowrap">{mhs.jumlah_benar || '-'}</td>

                    <td className="px-4 py-4 border-r border-slate-50 uppercase text-[10px] font-black tracking-wide whitespace-nowrap">
                      {mhs.status_kesehatan ? (
                        <span className={mhs.status_kesehatan === 'Sehat' || mhs.status_kesehatan === 'Lulus' ? 'text-emerald-500' : mhs.status_kesehatan === 'Menunggu' ? 'text-amber-500' : 'text-rose-500'}>
                          {mhs.status_kesehatan === 'Menunggu' ? 'MENUNGGU KONFIRMASI' : mhs.status_kesehatan}
                        </span>
                      ) : (
                        <span className="text-rose-500">BELUM TES</span>
                      )}
                    </td>

                    <td className="px-4 py-4 border-r border-slate-50 uppercase text-[10px] font-black tracking-wide whitespace-nowrap">
                      {mhs.hasil_wawancara === 'BELUM UJIAN' ? (
                        <span className="text-rose-500">BELUM WAWANCARA</span>
                      ) : mhs.hasil_wawancara ? (
                        <span className={mhs.hasil_wawancara === 'LULUS' ? 'text-emerald-500' : 'text-indigo-500'}>
                          {mhs.hasil_wawancara}
                        </span>
                      ) : (
                        <span className="text-indigo-500">PRODI INI TIDAK ADA TES WAWANCARA</span>
                      )}
                    </td>

                    <td className="px-4 py-4 border-r border-slate-50 text-center uppercase text-[11px] font-black tracking-widest whitespace-nowrap">
                      <span className={mhs.status === 'Proses' ? 'text-rose-500 font-black' : mhs.status === 'Lulus' ? 'text-emerald-500 font-black' : 'text-slate-500 font-black'}>
                        {mhs.status === 'Proses' ? 'PROSES UJIAN' : mhs.status}
                      </span>
                    </td>

                    {(view === 'proses_kelulusan' || view === 'rekap_kelulusan') && (
                      <td className="px-4 py-4 border-r border-slate-50 text-center">
                        <div className="flex flex-col gap-1 items-center justify-center">
                          {view === 'proses_kelulusan' ? (
                            <button
                              onClick={() => {
                                setSelectedKelulusanStudent(mhs);
                                setStatusKelulusan(mhs.status === 'Proses' ? 'Lulus' : (mhs.status || 'Lulus'));
                                setNoWhatsappKelulusan(mhs.no_telp || '');
                                setShowProsesKelulusanModal(true);
                              }}
                              className="w-32 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded text-[10px] font-bold uppercase tracking-wider transition-colors shadow-sm animate-pulse-glow"
                            >
                              PROSES KELULUSAN
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedKelulusanStudent(mhs);
                                setStatusKelulusan(mhs.status || 'Lulus');
                                setNoWhatsappKelulusan(mhs.no_telp || '');
                                setShowProsesKelulusanModal(true);
                              }}
                              className="w-32 py-1.5 bg-[#3c8dbc] hover:bg-[#367fa9] text-white rounded text-[10px] font-bold uppercase tracking-wider transition-colors shadow-sm"
                            >
                              EDIT KELULUSAN
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setSelectedCbtResult(mhs);
                              setCbtResultDetails(mhs.details || []);
                              setBackView(view);
                              setView('detail_hasil_ujian');
                              window.scrollTo(0, 0);
                            }}
                            className="w-32 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold uppercase tracking-wider transition-colors shadow-sm"
                          >
                            DETAIL
                          </button>
                        </div>
                      </td>
                    )}

                    <td className="px-4 py-4 text-center">
                      <span className={`text-[10px] uppercase font-black px-2.5 py-1 rounded border shadow-sm tracking-tighter whitespace-nowrap ${mhs.status_registrasi === 'Sudah Registrasi'
                          ? 'text-emerald-700 bg-emerald-50 border-emerald-200' :
                          mhs.status_registrasi === 'Menunggu Verifikasi'
                            ? 'text-amber-700 bg-amber-50 border-amber-200'
                            : 'text-rose-600 bg-rose-50 border-rose-200 shadow-sm'
                        }`}>
                        {mhs.status_registrasi || 'BELUM REGISTRASI'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between mt-4 text-sm px-4 pb-4">
          <div className="text-slate-600">Showing {filteredWawancaraData.length > 0 ? (wawancaraCurrentPage - 1) * wawancaraEntries + 1 : 0} to {Math.min(wawancaraCurrentPage * wawancaraEntries, filteredWawancaraData.length)} of {filteredWawancaraData.length} entries</div>
          <div className="flex border border-slate-300 rounded-sm overflow-hidden">
            <button
              disabled={wawancaraCurrentPage === 1}
              onClick={() => setWawancaraCurrentPage(prev => prev - 1)}
              className={`px-3 py-1.5 border-r border-slate-300 transition-colors ${wawancaraCurrentPage === 1 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
            >
              Previous
            </button>
            <button
              disabled={wawancaraCurrentPage === totalWawancaraPages || totalWawancaraPages === 0}
              onClick={() => setWawancaraCurrentPage(prev => prev + 1)}
              className={`px-3 py-1.5 transition-colors ${wawancaraCurrentPage === totalWawancaraPages || totalWawancaraPages === 0 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderDetailHasilUjian = () => {
    if (!selectedCbtResult) return null;

    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-500 text-slate-600 font-sans">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[24px] font-medium text-slate-800">Administrator <span className="text-sm font-normal text-slate-500 opacity-60 ml-2">Hi {adminName} Login {loginTime}</span></h2>
          <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400">
            <span className="material-symbols-outlined text-[14px]">home</span> Home <span className="material-symbols-outlined text-[14px]">chevron_right</span> Detail Hasil Ujian
          </div>
        </div>

        {renderStatsCards()}

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
          <h3 className="text-[20px] font-normal text-slate-800">Detail Hasil Ujian - {selectedCbtResult.nama}</h3>
          <button
            onClick={() => setView(backView)}
            className="px-4 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded-sm text-sm font-semibold flex items-center gap-1 transition-colors"
          >
            Kembali
          </button>
        </div>

        <div className="bg-white shadow-lg rounded-xl overflow-hidden border-t-[3px] border-[#00a65a]">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span>Show</span>
              <select className="px-2 py-1 pr-6 border border-slate-300 rounded-sm outline-none bg-white appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:8px_8px] bg-no-repeat bg-[position:right_8px_center]">
                <option value="10">10</option>
                <option value="25">25</option>
              </select>
              <span>entries</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span>Search:</span>
              <input type="text" className="px-2 py-1 border border-slate-300 rounded-sm outline-none focus:border-[#00a65a]" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse border border-slate-200">
              <thead>
                <tr className="bg-slate-200 border-b border-slate-200 text-slate-700">
                  <th className="px-4 py-2 border-r border-slate-200 w-12 text-center font-black relative"><div className="flex items-center justify-between">No <span className="text-[10px] text-slate-400 opacity-50 absolute right-2">↕</span></div></th>
                  <th className="px-4 py-2 border-r border-slate-200 w-48 font-black relative"><div className="flex items-center justify-between">No Ujian <span className="text-[10px] text-slate-400 opacity-50 absolute right-2">↕</span></div></th>
                  <th className="px-4 py-2 border-r border-slate-200 font-black relative"><div className="flex items-center justify-between">Pertanyaan <span className="text-[10px] text-slate-400 opacity-50 absolute right-2">↕</span></div></th>
                  <th className="px-4 py-2 border-r border-slate-200 w-24 text-center font-black relative"><div className="flex items-center justify-between">Jawaban <span className="text-[10px] text-slate-400 opacity-50 absolute right-2">↕</span></div></th>
                  <th className="px-4 py-2 border-r border-slate-200 w-24 text-center font-black relative"><div className="flex items-center justify-between">Kunci <span className="text-[10px] text-slate-400 opacity-50 absolute right-2">↕</span></div></th>
                  <th className="px-4 py-2 text-center w-24 font-black relative"><div className="flex items-center justify-between">Status <span className="text-[10px] text-slate-400 opacity-50 absolute right-2">↕</span></div></th>
                </tr>
              </thead>
              <tbody>
                {cbtResultDetails.length > 0 ? cbtResultDetails.map((item, idx) => (
                  <tr key={idx} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 border-r border-slate-200 text-center bg-slate-100">{idx + 1}</td>
                    <td className="px-4 py-3 border-r border-slate-200 text-slate-600">{item.no_ujian}</td>
                    <td className="px-4 py-3 border-r border-slate-200">
                      <div
                        className="text-slate-700 html-content-large rich-text-content"
                        dangerouslySetInnerHTML={{ __html: item.pertanyaan }}
                      ></div>
                    </td>
                    <td className="px-4 py-3 border-r border-slate-200 text-center text-slate-600">{item.jawaban}</td>
                    <td className="px-4 py-3 border-r border-slate-200 text-center text-slate-600">{item.kunci}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {item.status === 'Betul' ? (
                          <span className="flex items-center gap-1 text-[#00a65a] font-bold text-[13px]">
                            <span className="material-symbols-outlined text-[16px]">check</span> Betul
                          </span>
                        ) : item.status === 'Menunggu Review' ? (
                          <span className="flex items-center gap-1 text-[#f39c12] font-bold text-[13px]">
                            <span className="material-symbols-outlined text-[16px]">pending_actions</span> Wawancara
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[#dd4b39] font-bold text-[13px]">
                            <span className="material-symbols-outlined text-[16px]">close</span> Salah
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-slate-400">No data available in table</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderInputHasilKesehatanModal = () => {
    if (!showInputHasilModal || !selectedKesehatanStudent) return null;

    return (
      <div className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 px-4">
        <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col animate-in zoom-in duration-300 max-h-[90vh]">
          {/* Header Section */}
          <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-white relative">
            <div className="flex items-center gap-6">
              <div className="size-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center shadow-inner ring-1 ring-blue-100">
                <span className="material-symbols-outlined text-[32px]">health_and_safety</span>
              </div>
              <div>
                <h3 className="font-extrabold text-slate-800 text-2xl uppercase tracking-tight">VERIFIKASI KESEHATAN</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1 flex items-center gap-2">
                  {selectedKesehatanStudent.nama}
                  <span className="text-slate-300">—</span>
                  <span className="text-blue-500 bg-blue-50 px-2 py-0.5 rounded-md">{selectedKesehatanStudent.no_ujian}</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowInputHasilModal(false)}
              className="size-12 flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full transition-all active:scale-90"
            >
              <span className="material-symbols-outlined text-[28px]">close</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-10 bg-white custom-scrollbar">
            <div className="max-w-3xl mx-auto w-full">
              {/* Data Hasil Pemeriksaan */}
              <div>
                <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-4">
                  <span className="material-symbols-outlined text-blue-500">assignment</span>
                  <h4 className="text-[13px] font-black text-slate-800 uppercase tracking-[0.2em]">Hasil Pemeriksaan Kesehatan</h4>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                  {[
                    { icon: 'tag', label: 'No Ujian', value: selectedKesehatanStudent.no_ujian || '-', color: 'emerald' },
                    { icon: 'waves', label: 'Gelombang', value: selectedKesehatanStudent.gelombang || '-', color: 'blue' },
                    { icon: 'person', label: 'Nama Peserta', value: selectedKesehatanStudent.nama || '-', color: 'slate', fullWidth: true },
                    { icon: 'school', label: 'Program Studi', value: selectedKesehatanStudent.pilihan || '-', color: 'indigo', fullWidth: true },
                    { icon: 'straighten', label: 'Tinggi Badan', value: `${tinggiBadan} cm`, color: 'blue' },
                    { icon: 'bloodtype', label: 'Gol. Darah', value: golonganDarah || '-', color: 'rose' },
                    { icon: 'visibility', label: 'Tes Warna', value: butaWarna || '-', color: 'amber' },
                    { icon: 'eye_tracking', label: 'Visus Mata', value: visus || '-', color: 'indigo' },
                    { icon: 'monitor_heart', label: 'Tekanan Darah', value: `${tekananDarah} mm/Hg`, color: 'emerald' },
                    { icon: 'history_edu', label: 'Riwayat Penyakit', value: riwayatPenyakit || 'TIDAK ADA RIWAYAT PENYAKIT', fullWidth: true, color: 'rose', isItalic: true }
                  ].map((item, idx) => (
                    <div key={idx} className={`${item.fullWidth ? 'col-span-2 md:col-span-3' : ''} p-5 bg-slate-50/50 border border-slate-100 rounded-[24px] hover:bg-white hover:shadow-xl hover:shadow-slate-100/50 transition-all duration-300`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`material-symbols-outlined text-[16px] text-${item.color}-500 opacity-60`}>{item.icon}</span>
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] block">{item.label}</label>
                      </div>
                      <div className={`text-[15px] font-black text-slate-700 ${item.isItalic ? 'italic opacity-60 font-bold' : ''}`}>{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  };

  const renderLaporan = () => {
    const laporanTabs = [
      { key: 'rekap_keseluruhan' as const, label: 'Rekap Keseluruhan', icon: 'summarize', color: 'blue' },
      { key: 'belum_registrasi' as const, label: 'Belum Registrasi', icon: 'person_off', color: 'amber' },

      { key: 'laporan_ujian_tulis' as const, label: 'Laporan Ujian Tulis', icon: 'quiz', color: 'indigo' },
      { key: 'laporan_tes_kesehatan' as const, label: 'Laporan Tes Kesehatan', icon: 'health_and_safety', color: 'rose' },
      { key: 'rekap_tes_kesehatan' as const, label: 'Rekap Tes Kesehatan', icon: 'assignment_turned_in', color: 'teal' },
    ];

    const usesPeriode = laporanView === 'rekap_keseluruhan' || laporanView === 'belum_registrasi';
    const usesGelombang = !usesPeriode;
    const usesProdi = laporanView !== 'rekap_tes_kesehatan';
    const rekapKeseluruhanProdiOrder = [
      'S2 Kesmas',
      'S1 Kesmas',
      'S1 Keperawatan',
      'S1 Kebidanan',
      'S1 Teknik Informatika',
      'S1 Sistem Informasi',
      'S1 Ilmu Hukum',
      'S1 Ilmu Komunikasi',
      'D3 Rekam Medis',
      'Profesi Bidan',
      'Profesi Ners',
    ];
    const normalizeRekapProdi = (prodi: string) => prodi
      .replace(/Kesehatan Masyarakat/gi, 'Kesmas')
      .replace(/\s+Program\s+.*/i, '')
      .trim();
    const rekapKeseluruhanProdiOptions = rekapKeseluruhanProdiOrder.filter((label) =>
      prodiOptions.some((prodi) => normalizeRekapProdi(prodi) === label)
    );
    const belumRegistrasiProdiOptions = [
      'D3 REKAM MEDIS', 'PROFESI NERS', 'PROFESI BIDAN', 'S1 ILMU HUKUM', 'S1 ILMU KOMUNIKASI', 
      'S1 TI PINDAHAN', 'S1 KESMAS PROGRAM REGULER', 'S1 KESMAS PROGRAM RPLA1', 'S1 KESMAS PROGRAM RPLA2', 
      'S1 TI PROGRAM REGULER', 'S1 TI PROGRAM RPLA1', 'S1 TI PROGRAM RPLA2', 'S1 SI PROGRAM REGULER', 
      'S1 SI PROGRAM RPLA1', 'S1 SI PROGRAM RPLA2', 'S2 KESMAS PROGRAM REGULER', 'S2 KESMAS PROGRAM RPLA2', 
      'S1 KEBIDANAN PROGRAM REGULER', 'S1 KEBIDANAN PROGRAM RPLA1', 'S1 KEBIDANAN PROGRAM RPLA2', 
      'S1 KEPERAWATAN PROGRAM REGULER', 'S1 KEPERAWATAN PROGRAM RPLA1', 'S1 KEPERAWATAN PROGRAM RPLA2', 
      'S1 ILMU KOMUNIKASI PINDAHAN', 'D4 MANAJEMEN INFORMASI KESEHATAN', 'S1 KEBIDANAN PROGRAM PINDAHAN', 
      'S1 KEPERAWATAN PINDAHAN'
    ];

    const ujianTulisProdiOptions = [
      'D3 KEBIDANAN', 'D3 REKAM MEDIK', 'D3 Rekam Medis', 'D4 Manajemen Informasi Kesehatan', 
      'ILMU KOMUNIKASI PINDAHAN', 'NERS', 'PROFESI BIDAN', 'PROFESI NERS', 'S1 ILMU HUKUM', 
      'S1 ILMU KOMUNIKASI', 'S1 ILMU KOMUNIKASI PINDAHAN', 'S1 KEBIDANAN', 'S1 Kebidanan Program Reguler', 
      'S1 KEBIDANAN PROGRAM RPLA1', 'S1 KEBIDANAN PROGRAM RPLA2', 'S1 KEPERAWATAN', 'S1 KEPERAWATAN B NON REGULER', 
      'S1 KEPERAWATAN PINDAHAN', 'S1 Keperawatan Program Reguler', 'S1 Keperawatan Program RPLA1', 
      'S1 KEPERAWATAN PROGRAM RPLA2', 'S1 KESMAS JALUR A NON REGULER', 'S1 KESMAS JALUR A REGULER', 
      'S1 KESMAS JALUR B NON REGULER', 'S1 KESMAS JALUR B REGULER', 'S1 Kesmas Program Reguler', 
      'S1 Kesmas Program RPLA1', 'S1 Kesmas Program RPLA2', 'S1 SI Program Reguler', 'S1 SI Program RPLA1', 
      'S1 SI Program RPLA2', 'S1 SISTEM INFORMASI', 'S1 SISTEM INFORMASI B NON REGULER', 
      'S1 SISTEM INFORMASI PINDAHAN', 'S1 SISTEM INFORMASI TRANSFER', 'S1 TEKNIK INFORMATIKA', 
      'S1 TEKNIK INFORMATIKA B NON REGULER', 'S1 TEKNIK INFORMATIKA PINDAHAN', 'S1 TEKNIK INFORMATIKA REGULER', 
      'S1 TEKNIK INFORMATIKA TRANSFER', 'S1 TI PINDAHAN', 'S1 TI Program Reguler', 'S1 TI Program RPLA1', 
      'S1 TI Program RPLA2', 'S2 KESMAS', 'S2 KESMAS PROGRAM REGULER', 'S2 Kesmas Program RPLA2'
    ];

    const laporanProdiOptions = 
      laporanView === 'rekap_keseluruhan' ? rekapKeseluruhanProdiOptions : 
      laporanView === 'belum_registrasi' ? belumRegistrasiProdiOptions : 
      (laporanView === 'laporan_ujian_tulis' || laporanView === 'laporan_tes_kesehatan') ? ujianTulisProdiOptions : 
      prodiOptions;

    const buttonLabels: Record<string, string> = {
      rekap_keseluruhan: 'Cetak',
      belum_registrasi: 'Cetak',

      laporan_ujian_tulis: 'Cetak Hasil Ujian Tulis',
      laporan_tes_kesehatan: 'Cetak Hasil Tes Kesehatan',
      rekap_tes_kesehatan: 'Cetak Rekapitulasi',
    };

    const titleLabels: Record<string, string> = {
      rekap_keseluruhan: 'Laporan SPMB Keseluruhan',
      belum_registrasi: 'Laporan SPMB Universitas Hang Tuah Pekanbaru',

      laporan_ujian_tulis: 'Laporan Hasil Ujian Tulis',
      laporan_tes_kesehatan: 'Laporan Hasil Tes Kesehatan',
      rekap_tes_kesehatan: 'Rekapitulasi Tes Kesehatan',
    };

    const filterLabel1 = usesPeriode ? 'Periode Penerimaan' : 'Gelombang';
    const filterLabel2 = 'Program Studi';
    const normalizeLaporanItem = (item: any) => {
      const detailsArray = Array.isArray(item.details) ? item.details : [];
      const hasDetails = detailsArray.length > 0;
      const benar = item.benar ?? item.jumlah_benar ?? (hasDetails ? detailsArray.filter((d: any) => d.status === 'Betul').length : null);
      const salah = item.salah ?? (hasDetails ? detailsArray.filter((d: any) => d.status !== 'Betul').length : null);
      
      let nilai = item.nilai ?? item.skor ?? item.total_score;
      if (hasDetails) {
        const total = detailsArray.length;
        const correct = detailsArray.filter((d: any) => d.status === 'Betul').length;
        nilai = total > 0 ? Math.round((correct / total) * 100) : 0;
      }

      return {
        ...item,
        no_ujian: item.no_ujian || item.exam_number || item.registration?.biodata?.exam_number || '-',
        nama: item.nama || item.registration?.name || '-',
        pilihan: item.pilihan || item.registration?.program_studi || '-',
        gelombang: item.gelombang || item.registration?.gelombang || '-',
        no_hp: item.no_hp || item.registration?.no_hp || item.no_telp || '-',
        benar: benar,
        salah: salah,
        nilai: nilai,
      };
    };

    const handleFetchLaporan = () => {
      setLaporanLoading(true);
      setLaporanData([]);

      let endpoint = '';
      const params = new URLSearchParams();

      if (usesPeriode) {
        params.append('periode', laporanFilterPeriode);
        if (laporanFilterProdi) params.append('prodi', laporanFilterProdi);
      } else {
        if (laporanFilterGelombang) params.append('gelombang', laporanFilterGelombang);
        if (usesProdi && laporanFilterProdi) params.append('prodi', laporanFilterProdi);
      }

      if (laporanView === 'rekap_keseluruhan') {
        endpoint = `${API_BASE_URL}/api/admin/wawancara?gelombang=${laporanFilterGelombang || ''}`;
        // use existing endpoint with fallback
        if (usesPeriode && !laporanFilterGelombang) {
          endpoint = `${API_BASE_URL}/api/admin/biodatas`;
        }
      } else if (laporanView === 'belum_registrasi') {
        endpoint = `${API_BASE_URL}/api/admin/biodatas`;
      } else if (laporanView === 'laporan_ujian_tulis') {
        endpoint = `${API_BASE_URL}/api/admin/wawancara?gelombang=${laporanFilterGelombang}&tpa_only=1`;
      } else if (laporanView === 'rekap_tes_kesehatan') {
        endpoint = `${API_BASE_URL}/api/admin/kesehatan?gelombang=${laporanFilterGelombang}`;
      } else {
        endpoint = `${API_BASE_URL}/api/admin/kesehatan?gelombang=${laporanFilterGelombang}&kesehatan_only=1`;
      }

      fetch(endpoint)
        .then(res => res.json())
        .then(data => {
          let result = (Array.isArray(data) ? data : (data.data || [])).map(normalizeLaporanItem);

          // Apply prodi filter
          if (usesProdi && laporanFilterProdi) {
            result = result.filter((m: any) => {
              const prodi = (m.pilihan || '').toLowerCase();
              return prodi.includes(laporanFilterProdi.toLowerCase());
            });
          }

          // Apply periode filter (gabungkan semua gelombang di tahun yang sama)
          if (usesPeriode && laporanFilterPeriode && laporanFilterPeriode !== 'Semua') {
            result = result.filter((m: any) => {
              const gel = (m.gelombang || '').toString();
              return gel.startsWith(laporanFilterPeriode);
            });
          }

          // Apply view-specific filtering
          if (laporanView === 'belum_registrasi') {
            result = result.filter((m: any) => m.is_finalized && m.status_registrasi !== 'Sudah Registrasi');
          }
          if (laporanView === 'laporan_ujian_tulis') {
            result = result.filter((m: any) => m.nilai !== null && m.nilai !== undefined && m.nilai !== '-');
          }
          if (laporanView === 'laporan_tes_kesehatan') {
            result = result.filter((m: any) => m.status_kesehatan !== null && m.status_kesehatan !== undefined);
          }


          setLaporanData(result);
          setLaporanLoading(false);
        })
        .catch(() => {
          setLaporanData([]);
          setLaporanLoading(false);
        });
    };

    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-500 text-slate-600 font-sans">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[24px] font-medium text-slate-800">Administrator <span className="text-sm font-normal text-slate-500 opacity-60 ml-2">Hi {adminName} Login {loginTime}</span></h2>
          <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400">
            <span className="material-symbols-outlined text-[14px]">home</span> Home <span className="material-symbols-outlined text-[14px]">chevron_right</span> Laporan
          </div>
        </div>

        {renderStatsCards()}

        {/* Laporan Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-5">
          <div className="flex border-b border-slate-100 overflow-x-auto">
            {laporanTabs.map(tab => {
              const isActive = laporanView === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => {
                    setLaporanView(tab.key);
                    setLaporanData([]);
                    setLaporanFilterProdi('');
                    setLaporanFilterPeriode('2026');
                    setLaporanFilterGelombang('');
                  }}
                  className={`flex items-center gap-2.5 px-6 py-4 text-[12px] font-bold uppercase tracking-wider whitespace-nowrap transition-all border-b-[3px] ${
                    isActive
                      ? 'border-[#00857A] text-[#00857A] bg-emerald-50/40'
                      : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Report Content Card */}
        <div className="bg-white border-t-[3px] border-[#00857A] shadow-sm rounded-sm">
          <div className="p-6">
            <h3 className="text-xl font-semibold text-slate-800 mb-5">{titleLabels[laporanView]}</h3>
            
            <div className="bg-white border border-slate-200 rounded-lg p-5 mb-5">
              <div className={`grid grid-cols-1 ${usesProdi ? 'md:grid-cols-2' : ''} gap-5`}>
                {/* Filter 1: Periode or Gelombang */}
                <div className={usesProdi ? '' : 'w-full md:max-w-md'}>
                  <label className="block text-sm font-bold text-slate-600 mb-2">{filterLabel1}</label>
                  {usesPeriode ? (
                    <select
                      className="w-full pl-3 pr-10 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00857A]/20 focus:border-[#00857A] text-sm text-slate-600 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px_10px] bg-no-repeat bg-[position:right_12px_center]"
                      value={laporanFilterPeriode}
                      onChange={(e) => setLaporanFilterPeriode(e.target.value)}
                    >
                      {laporanPeriodeOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <select
                      className="w-full pl-3 pr-10 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00857A]/20 focus:border-[#00857A] text-sm text-slate-600 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px_10px] bg-no-repeat bg-[position:right_12px_center]"
                      value={laporanFilterGelombang}
                      onChange={(e) => setLaporanFilterGelombang(e.target.value)}
                    >
                      <option value="">Pilih Gelombang</option>
                      {gelombangOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Filter 2: Program Studi */}
                {usesProdi && (
                  <div>
                    <label className="block text-sm font-bold text-slate-600 mb-2">{filterLabel2}</label>
                    <select
                      className="w-full pl-3 pr-10 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00857A]/20 focus:border-[#00857A] text-sm text-slate-600 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px_10px] bg-no-repeat bg-[position:right_12px_center]"
                      value={laporanFilterProdi}
                      onChange={(e) => setLaporanFilterProdi(e.target.value)}
                    >
                      <option value="">{laporanView === 'rekap_keseluruhan' ? '--Pilih Prodi--' : 'Semua Program Studi'}</option>
                      {laporanProdiOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleFetchLaporan}
                disabled={laporanLoading || (usesGelombang && !laporanFilterGelombang)}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#00857A] hover:bg-[#006e65] disabled:bg-slate-300 text-white text-sm font-bold rounded-lg transition-all shadow-sm active:scale-95 disabled:pointer-events-none"
              >
                <span className="material-symbols-outlined text-[18px]">search</span>
                Tampilkan Data
              </button>
              <button
                onClick={handlePrintLaporan}
                disabled={laporanLoading || laporanData.length === 0}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#00a65a] hover:bg-[#008d4c] disabled:bg-slate-300 text-white text-sm font-bold rounded-lg transition-all shadow-sm active:scale-95 disabled:pointer-events-none"
              >
                <span className="material-symbols-outlined text-[18px]">print</span>
                {buttonLabels[laporanView]}
              </button>
            </div>
          </div>
        </div>

        {/* Data Preview Section */}
        {laporanLoading ? (
          <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-12 mt-5 text-center">
            <div className="size-10 border-4 border-slate-100 border-t-[#00857A] rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm text-slate-500 font-medium">Memuat data laporan...</p>
          </div>
        ) : laporanData.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-slate-100 mt-5 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-700">
                Preview Data — <span className="text-[#00857A]">{laporanData.length} entri</span>
              </h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200/60 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="px-4 py-3 text-center w-12">No</th>
                    <th className="px-4 py-3">No Ujian</th>
                    <th className="px-4 py-3">Nama</th>
                    <th className="px-4 py-3">Program Studi</th>
                    {laporanView === 'rekap_keseluruhan' && <th className="px-4 py-3 text-center">Gelombang</th>}
                    {laporanView === 'rekap_keseluruhan' && <th className="px-4 py-3 text-center">Status</th>}
                    {laporanView === 'belum_registrasi' && <th className="px-4 py-3 text-center">Gelombang</th>}
                    {laporanView === 'belum_registrasi' && <th className="px-4 py-3 text-center">No HP</th>}

                    {laporanView === 'laporan_ujian_tulis' && <th className="px-4 py-3 text-center">Benar</th>}
                    {laporanView === 'laporan_ujian_tulis' && <th className="px-4 py-3 text-center">Salah</th>}
                    {laporanView === 'laporan_ujian_tulis' && <th className="px-4 py-3 text-center">Nilai</th>}
                    {laporanView === 'rekap_tes_kesehatan' && <th className="px-4 py-3 text-center">Status Kesehatan</th>}
                    {laporanView === 'rekap_tes_kesehatan' && <th className="px-4 py-3 text-center">Keterangan</th>}
                    {laporanView === 'laporan_tes_kesehatan' && <th className="px-4 py-3 text-center">Tinggi</th>}
                    {laporanView === 'laporan_tes_kesehatan' && <th className="px-4 py-3 text-center">Gol. Darah</th>}
                    {laporanView === 'laporan_tes_kesehatan' && <th className="px-4 py-3 text-center">Visus</th>}
                    {laporanView === 'laporan_tes_kesehatan' && <th className="px-4 py-3 text-center">Tensi</th>}
                    {laporanView === 'laporan_tes_kesehatan' && <th className="px-4 py-3 text-center">Buta Warna</th>}
                  </tr>
                </thead>
                <tbody>
                  {laporanData.map((item, idx) => (
                    <tr key={item.id || idx} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors text-slate-700 font-medium">
                      <td className="px-4 py-3 text-center text-slate-400">{idx + 1}</td>
                      <td className="px-4 py-3 font-mono text-blue-600 font-bold">{item.no_ujian || '-'}</td>
                      <td className="px-4 py-3 font-bold text-slate-800 uppercase">{item.nama || '-'}</td>
                      <td className="px-4 py-3">{item.pilihan || '-'}</td>
                      {laporanView === 'rekap_keseluruhan' && <td className="px-4 py-3 text-center font-bold">{item.gelombang || '-'}</td>}
                      {laporanView === 'rekap_keseluruhan' && (
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            (item.status || '').toLowerCase() === 'lulus' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                            (item.status || '').toLowerCase() === 'tidak lulus' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                            'bg-slate-50 text-slate-500 border border-slate-200'
                          }`}>{item.status || '-'}</span>
                        </td>
                      )}
                      {laporanView === 'belum_registrasi' && <td className="px-4 py-3 text-center font-bold">{item.gelombang || '-'}</td>}
                      {laporanView === 'belum_registrasi' && <td className="px-4 py-3 text-center">{item.no_hp || '-'}</td>}

                      {laporanView === 'laporan_ujian_tulis' && <td className="px-4 py-3 text-center font-bold text-emerald-600">{item.benar ?? '-'}</td>}
                      {laporanView === 'laporan_ujian_tulis' && <td className="px-4 py-3 text-center font-bold text-rose-500">{item.salah ?? '-'}</td>}
                      {laporanView === 'laporan_ujian_tulis' && <td className="px-4 py-3 text-center font-bold">{item.nilai ?? item.total_score ?? '-'}</td>}
                      {laporanView === 'rekap_tes_kesehatan' && (
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            !item.status_kesehatan ? 'bg-slate-50 text-slate-500 border border-slate-200' :
                            (item.status_kesehatan === 'Sehat' || item.status_kesehatan === 'Lulus') ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                            item.status_kesehatan === 'Menunggu' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                            'bg-rose-50 text-rose-600 border border-rose-100'
                          }`}>{item.status_kesehatan || 'Belum Tes'}</span>
                        </td>
                      )}
                      {laporanView === 'rekap_tes_kesehatan' && <td className="px-4 py-3 text-center">{item.keterangan_kesehatan || '-'}</td>}
                      {laporanView === 'laporan_tes_kesehatan' && <td className="px-4 py-3 text-center">{item.tinggi_badan || '-'}</td>}
                      {laporanView === 'laporan_tes_kesehatan' && <td className="px-4 py-3 text-center">{item.golongan_darah || '-'}</td>}
                      {laporanView === 'laporan_tes_kesehatan' && <td className="px-4 py-3 text-center">{item.visus || '-'}</td>}
                      {laporanView === 'laporan_tes_kesehatan' && <td className="px-4 py-3 text-center">{item.tekanan_darah || '-'}</td>}
                      {laporanView === 'laporan_tes_kesehatan' && <td className="px-4 py-3 text-center">{item.buta_warna || '-'}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </div>
    );
  };

  const renderStatDetailsModal = () => {
    if (!selectedStatCard) return null;

    let themeColor = 'blue';
    let iconName = 'school';
    let titleText = 'Detail Pendaftar';
    
    if (selectedStatCard === 'jalur_a') {
      themeColor = 'blue';
      iconName = 'school';
      titleText = 'Detail Pendaftar Jalur A (Reguler)';
    } else if (selectedStatCard === 'jalur_b') {
      themeColor = 'emerald';
      iconName = 'workspace_premium';
      titleText = 'Detail Pendaftar Jalur B (Beasiswa)';
    } else if (selectedStatCard === 'pasca') {
      themeColor = 'amber';
      iconName = 'history_edu';
      titleText = 'Detail Pendaftar Jalur Pascasarjana';
    } else if (selectedStatCard === 'kehadiran') {
      themeColor = 'rose';
      iconName = 'group';
      titleText = 'Detail Kehadiran Peserta Ujian CBT';
    }

    const colorClassesMap = {
      blue: {
        text: 'text-blue-600',
        bg: 'bg-blue-50',
        ring: 'ring-blue-100',
        badge: 'bg-blue-50 text-blue-600 border border-blue-200',
        headerBg: 'bg-blue-700',
        button: 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
      },
      emerald: {
        text: 'text-emerald-600',
        bg: 'bg-emerald-50',
        ring: 'ring-emerald-100',
        badge: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
        headerBg: 'bg-emerald-700',
        button: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
      },
      amber: {
        text: 'text-amber-600',
        bg: 'bg-amber-50',
        ring: 'ring-amber-100',
        badge: 'bg-amber-50 text-amber-600 border border-amber-200',
        headerBg: 'bg-amber-700',
        button: 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/20'
      },
      rose: {
        text: 'text-rose-600',
        bg: 'bg-rose-50',
        ring: 'ring-rose-100',
        badge: 'bg-rose-50 text-rose-600 border border-rose-200',
        headerBg: 'bg-rose-700',
        button: 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/20'
      }
    };
    const colorClasses = colorClassesMap[themeColor as keyof typeof colorClassesMap];

    const filtered = getFilteredStatDetails();
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / statDetailsEntries);
    const paginated = filtered.slice(
      (statDetailsCurrentPage - 1) * statDetailsEntries,
      statDetailsCurrentPage * statDetailsEntries
    );

    return (
      <div className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 px-4">
        <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col animate-in zoom-in duration-300 max-h-[90vh]">
          {/* Header Section */}
          <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-white relative">
            <div className="flex items-center gap-6">
              <div className={`size-16 ${colorClasses.bg} ${colorClasses.text} rounded-3xl flex items-center justify-center shadow-inner ring-1 ${colorClasses.ring}`}>
                <span className="material-symbols-outlined text-[32px]">{iconName}</span>
              </div>
              <div>
                <h3 className="font-extrabold text-slate-800 text-2xl uppercase tracking-tight">{titleText}</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1 flex items-center gap-2">
                  Total Data: <span className={`${colorClasses.text} font-black`}>{statDetailsData.length}</span>
                  {statDetailsData.length !== totalItems && (
                    <>
                      <span className="text-slate-300">—</span>
                      Filter: <span className="text-slate-600 font-black">{totalItems}</span>
                    </>
                  )}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedStatCard(null);
                setStatDetailsData([]);
              }}
              className="size-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 hover:border-slate-200 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Filtering and Toolbar */}
          <div className="px-10 py-5 bg-slate-50/50 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tampilkan</span>
              <select
                value={statDetailsEntries}
                onChange={(e) => {
                  setStatDetailsEntries(Number(e.target.value));
                  setStatDetailsCurrentPage(1);
                }}
                className="pl-3 pr-8 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 text-xs font-bold focus:ring-1 focus:ring-slate-300 focus:outline-none"
              >
                {[5, 10, 25, 50].map(val => (
                  <option key={val} value={val}>{val} Data</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari nama, prodi, atau hp..."
                  value={statDetailsSearch}
                  onChange={(e) => {
                    setStatDetailsSearch(e.target.value);
                    setStatDetailsCurrentPage(1);
                  }}
                  className="w-64 pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 text-xs font-bold focus:ring-2 focus:ring-slate-100 focus:border-slate-300 focus:outline-none"
                />
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[16px]">search</span>
              </div>
              <button
                onClick={handleExportCSV}
                disabled={statDetailsData.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-[#00857A] text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/10 hover:bg-[#006e65] transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                Export CSV
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="flex-1 overflow-y-auto px-10 py-6 min-h-[300px]">
            {statDetailsLoading ? (
              <div className="h-64 flex flex-col items-center justify-center gap-4">
                <div className="size-12 border-4 border-slate-100 border-t-slate-500 rounded-full animate-spin"></div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Menghubungkan ke Server...</p>
              </div>
            ) : paginated.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center gap-2 text-slate-400">
                <span className="material-symbols-outlined text-[48px] text-slate-300">folder_open</span>
                <p className="text-sm font-semibold">Tidak ada data ditemukan</p>
                <p className="text-[11px] text-slate-400 font-medium">Coba gunakan filter pencarian lainnya</p>
              </div>
            ) : (
              <div className="border border-slate-200/60 rounded-2xl overflow-hidden">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200/60 text-slate-500 font-bold uppercase tracking-wider">
                      <th className="px-6 py-4 w-16 text-center">No</th>
                      {selectedStatCard === 'kehadiran' ? (
                        <>
                          <th className="px-6 py-4">Nama Peserta</th>
                          <th className="px-6 py-4">No. Ujian</th>
                          <th className="px-6 py-4">Waktu Hadir</th>
                          <th className="px-6 py-4 text-center">Status</th>
                        </>
                      ) : (
                        <>
                          <th className="px-6 py-4">Nama Lengkap</th>
                          <th className="px-6 py-4">Program Studi</th>
                          <th className="px-6 py-4 text-center w-24">Gelombang</th>
                          <th className="px-6 py-4 text-center w-36">No. HP</th>
                          <th className="px-6 py-4 text-center w-36">Status</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((item, idx) => {
                      const number = (statDetailsCurrentPage - 1) * statDetailsEntries + idx + 1;
                      
                      if (selectedStatCard === 'kehadiran') {
                        const name = item.registration?.name || '-';
                        const examNumber = item.registration?.biodata?.exam_number || '-';
                        const time = item.attended_at ? new Date(item.attended_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : '-';
                        
                        return (
                          <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors font-semibold text-slate-700">
                            <td className="px-6 py-4 text-center text-slate-400">{number}</td>
                            <td className="px-6 py-4 font-bold text-slate-800">{name}</td>
                            <td className="px-6 py-4">
                              <span className="font-mono font-bold text-blue-600 bg-blue-50/50 rounded-lg px-2.5 py-1">
                                {examNumber}
                              </span>
                            </td>
                            <td className="px-6 py-4">{time}</td>
                            <td className="px-6 py-4 text-center">
                              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full font-bold text-[10px] uppercase">
                                Hadir
                              </span>
                            </td>
                          </tr>
                        );
                      } else {
                        const name = item.registration?.name || item.nama || '-';
                        const prodi = item.registration?.program_studi || item.program_studi || '-';
                        const gelombang = item.registration?.gelombang || item.gelombang || '-';
                        const phone = item.registration?.no_hp || item.no_hp || '-';
                        const isFinalized = !!item.is_finalized;
                        const waUrl = formatWhatsAppUrl(phone);

                        return (
                          <tr key={item.id || idx} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors font-semibold text-slate-700">
                            <td className="px-6 py-4 text-center text-slate-400">{number}</td>
                            <td className="px-6 py-4 font-bold text-slate-800">{name}</td>
                            <td className="px-6 py-4">{prodi}</td>
                            <td className="px-6 py-4 text-center tabular-nums font-bold text-slate-500">{gelombang}</td>
                            <td className="px-6 py-4 text-center">
                              {phone !== '-' ? (
                                <a
                                  href={waUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 hover:underline font-bold"
                                >
                                  <span className="material-symbols-outlined text-[14px]">chat</span>
                                  {phone}
                                </a>
                              ) : (
                                <span className="text-slate-400">-</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase ${
                                isFinalized 
                                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                                  : 'bg-amber-50 text-amber-600 border border-amber-100'
                              }`}>
                                {isFinalized ? 'Finalisasi' : 'Draft'}
                              </span>
                            </td>
                          </tr>
                        );
                      }
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Footer Section */}
          <div className="px-10 py-6 border-t border-slate-100 bg-white flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400">
              Menampilkan {Math.min(totalItems, (statDetailsCurrentPage - 1) * statDetailsEntries + 1)} sampai {Math.min(totalItems, statDetailsCurrentPage * statDetailsEntries)} dari {totalItems} entri
            </span>
            
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setStatDetailsCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={statDetailsCurrentPage === 1}
                  className="size-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                
                {Array.from({ length: totalPages }).map((_, pIdx) => {
                  const pNum = pIdx + 1;
                  const isCurrent = statDetailsCurrentPage === pNum;
                  return (
                    <button
                      key={pNum}
                      onClick={() => setStatDetailsCurrentPage(pNum)}
                      className={`size-8 rounded-lg flex items-center justify-center font-bold text-xs transition-all cursor-pointer ${
                        isCurrent 
                          ? 'bg-slate-800 text-white' 
                          : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setStatDetailsCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={statDetailsCurrentPage === totalPages}
                  className="size-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans overflow-hidden text-slate-700">

      {/* Custom Analog Time Picker */}
      {activeTimePicker && (
        <AnalogTimePicker
          isOpen={!!activeTimePicker}
          label={activeTimePicker.label}
          initialTime={(jadwalForm as any)[activeTimePicker.field]}
          onClose={() => setActiveTimePicker(null)}
          onSelect={(time) => setJadwalForm({ ...jadwalForm, [activeTimePicker.field]: time })}
        />
      )}
      {/* Custom Alert Modal (Style like the reference image) */}
      {notification && (
        <div className="fixed inset-0 z-[10000] flex items-start justify-center pt-[5vh] bg-black/20 backdrop-blur-[2px]">
          <div className="w-[400px] bg-[#1e1e2e] rounded-3xl shadow-[0_30px_70px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-8 pt-8 pb-4">
              <h3 className="text-white/60 text-xs font-bold mb-2 tracking-tight">CBT Administrator says</h3>
              <p className="text-white text-[15px] font-medium leading-relaxed">
                {notification.message}
              </p>
            </div>
            <div className="px-8 pb-8 pt-4 flex justify-end">
              <button
                onClick={() => {
                  if (notification.onConfirm) notification.onConfirm();
                  setNotification(null);
                }}
                className="px-8 py-2.5 bg-[#4f46e5] hover:bg-[#4338ca] text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detail Hasil CBT */}
      {renderInputHasilKesehatanModal()}
      {renderStatDetailsModal()}


      <aside className={`${isSidebarCollapsed ? 'w-20' : 'w-60'} bg-slate-900 border-r border-slate-800 flex flex-col text-slate-400 shrink-0 z-50 transition-all duration-300 shadow-xl relative`}>
        <div className="h-16 flex items-center justify-center bg-[#00857A] text-white font-black text-xl uppercase tracking-tighter overflow-hidden shrink-0 shadow-md z-10">{isSidebarCollapsed ? 'A' : 'Admin'}</div>
        <div className="p-6 flex flex-col items-center border-b border-slate-800 bg-slate-800/30 overflow-hidden shrink-0">
          <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'size-10' : 'size-20'} rounded-full overflow-hidden border-4 border-[#00857A] shadow-lg mb-3 bg-[#00857A]/20`}>
            <img src={`https://ui-avatars.com/api/?name=${adminName}&background=00857A&color=fff`} alt="Admin" className="size-full object-cover" />
          </div>
          {!isSidebarCollapsed && (
            <>
              <span className="text-white font-bold text-sm truncate w-full text-center">{adminName}</span>
              <div className="flex items-center gap-1.5 mt-1.5 px-3 py-1 bg-emerald-900/50 rounded-full border border-emerald-800/50"><div className="size-2 bg-emerald-400 rounded-full animate-pulse"></div><span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Online</span></div>
            </>
          )}
        </div>
        <nav className="flex-1 overflow-y-auto custom-sidebar-scroll py-4 px-3 space-y-1">
          <button onClick={() => setView('dashboard')} className={`w-full flex items-center px-4 py-3 rounded-xl text-[13px] transition-all ${view === 'dashboard' ? 'bg-emerald-900/40 text-emerald-400 font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white font-medium'}`}>
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-[20px]">dashboard</span>
              {!isSidebarCollapsed && <span className="tracking-wide">Dashboard</span>}
            </div>
          </button>

          <div className="w-full relative group/menu">
            <button onClick={() => { if (!isSidebarCollapsed) toggleMenu('setting'); }} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-[13px] transition-all ${expandedMenus.includes('setting') && !isSidebarCollapsed ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white font-medium'}`}>
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-[20px]">settings</span>
                {!isSidebarCollapsed && <span className="tracking-wide">Setting</span>}
              </div>
              {!isSidebarCollapsed && <span className={`material-symbols-outlined text-sm transition-transform ${expandedMenus.includes('setting') ? 'rotate-180' : ''}`}>expand_more</span>}
            </button>

            {isSidebarCollapsed && (
              <div className="fixed left-20 pl-2 w-52 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-[100] translate-y-[-45px]">
                <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-700 font-bold text-white text-[13px]">Setting</div>
                  <div className="p-2 space-y-1">
                    <button onClick={() => setView('jadwal_ujian')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[12px] font-medium transition-all ${view === 'jadwal_ujian' ? 'text-emerald-400 bg-emerald-900/40' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}>
                      <span className="material-symbols-outlined text-[16px] scale-75">radio_button_unchecked</span>
                      <span>Jadwal Ujian</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {expandedMenus.includes('setting') && !isSidebarCollapsed && (
              <div className="mt-1 space-y-1">
                <button onClick={() => setView('jadwal_ujian')} className={`w-full flex items-center gap-3 pl-12 py-2.5 rounded-lg text-[12px] font-medium transition-all ${view === 'jadwal_ujian' ? 'text-emerald-400 bg-emerald-900/40' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}>
                  <span className="material-symbols-outlined text-[16px] scale-75">radio_button_unchecked</span>
                  <span>Jadwal Ujian</span>
                </button>
              </div>
            )}
          </div>

          <div className="w-full relative group/menu">
            <button onClick={() => { if (!isSidebarCollapsed) toggleMenu('master'); }} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-[13px] transition-all ${expandedMenus.includes('master') && !isSidebarCollapsed ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white font-medium'}`}>
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-[20px]">edit_note</span>
                {!isSidebarCollapsed && <span className="tracking-wide">Master</span>}
              </div>
              {!isSidebarCollapsed && <span className={`material-symbols-outlined text-sm transition-transform ${expandedMenus.includes('master') ? 'rotate-180' : ''}`}>expand_more</span>}
            </button>

            {isSidebarCollapsed && (
              <div className="fixed left-20 pl-2 w-52 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-[100] translate-y-[-45px]">
                <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-700 font-bold text-white text-[13px]">Master</div>
                  <div className="p-2 space-y-1">
                    <button onClick={() => setView('tambah_soal')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[12px] font-medium transition-all ${view === 'tambah_soal' ? 'text-emerald-400 bg-emerald-900/40' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}>
                      <span className="material-symbols-outlined text-[16px] scale-75">radio_button_unchecked</span>
                      <span>Tambah Soal</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {expandedMenus.includes('master') && !isSidebarCollapsed && (
              <div className="mt-1 space-y-1">
                <button onClick={() => setView('tambah_soal')} className={`w-full flex items-center gap-3 pl-12 py-2.5 rounded-lg text-[12px] font-medium transition-all ${view === 'tambah_soal' ? 'text-emerald-400 bg-emerald-900/40' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}>
                  <span className="material-symbols-outlined text-[16px] scale-75">radio_button_unchecked</span>
                  <span>Tambah Soal</span>
                </button>
              </div>
            )}
          </div>

          <div className="w-full relative group/menu">
            <button onClick={() => { if (!isSidebarCollapsed) toggleMenu('soal'); }} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-[13px] transition-all ${expandedMenus.includes('soal') && !isSidebarCollapsed ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white font-medium'}`}>
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-[20px]">grid_view</span>
                {!isSidebarCollapsed && <span className="tracking-wide">Daftar Soal</span>}
              </div>
              {!isSidebarCollapsed && <span className={`material-symbols-outlined text-sm transition-transform ${expandedMenus.includes('soal') ? 'rotate-180' : ''}`}>expand_more</span>}
            </button>

            {isSidebarCollapsed && (
              <div className="fixed left-20 pl-2 w-52 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-[100] translate-y-[-45px]">
                <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-700 font-bold text-white text-[13px]">Daftar Soal</div>
                  <div className="p-2 space-y-1">
                    {['Jalur A', 'Soal Wawancara', 'Jalur B', 'Pasca', 'NERS', 'Profesi Bidan', 'STMIK'].map(jalur => (
                      <button key={jalur} onClick={() => setView(`daftar_${jalur.toLowerCase().replace(' ', '_')}`)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[12px] font-medium transition-all ${view === `daftar_${jalur.toLowerCase().replace(' ', '_')}` ? 'text-emerald-400 bg-emerald-900/40' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}>
                        <span className="material-symbols-outlined text-[16px] scale-75">radio_button_unchecked</span>
                        <span>{jalur}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {expandedMenus.includes('soal') && !isSidebarCollapsed && (
              <div className="mt-1 space-y-1">
                {['Jalur A', 'Soal Wawancara', 'Jalur B', 'Pasca', 'NERS', 'Profesi Bidan', 'STMIK'].map(jalur => (
                  <button key={jalur} onClick={() => setView(`daftar_${jalur.toLowerCase().replace(' ', '_')}`)} className={`w-full flex items-center gap-3 pl-12 py-2.5 rounded-lg text-[12px] font-medium transition-all ${view === `daftar_${jalur.toLowerCase().replace(' ', '_')}` ? 'text-emerald-400 bg-emerald-900/40' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}>
                    <span className="material-symbols-outlined text-[16px] scale-75">radio_button_unchecked</span>
                    <span>{jalur}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800 space-y-1">
            <div className="w-full relative group/menu">
              <button onClick={() => { if (!isSidebarCollapsed) toggleMenu('tes_kesehatan'); }} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-[13px] transition-all ${expandedMenus.includes('tes_kesehatan') && !isSidebarCollapsed ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white font-medium'}`}>
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-[20px]">medical_services</span>
                  {!isSidebarCollapsed && <span className="tracking-wide">Tes Kesehatan</span>}
                </div>
                {!isSidebarCollapsed && <span className={`material-symbols-outlined text-sm transition-transform ${expandedMenus.includes('tes_kesehatan') ? 'rotate-180' : ''}`}>expand_more</span>}
              </button>

              {isSidebarCollapsed && (
                <div className="fixed left-20 pl-2 w-52 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-[100] translate-y-[-45px]">
                  <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-700 font-bold text-white text-[13px]">Tes Kesehatan</div>
                    <div className="p-2 space-y-1">
                      <button onClick={() => setView('proses_kesehatan')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[12px] font-medium transition-all ${view === 'proses_kesehatan' ? 'text-emerald-400 bg-emerald-900/40' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}>
                        <span className="material-symbols-outlined text-[16px] scale-75">radio_button_unchecked</span>
                        <span>Proses Tes Kesehatan</span>
                      </button>
                      <button onClick={() => setView('rekap_kesehatan')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[12px] font-medium transition-all ${view === 'rekap_kesehatan' ? 'text-emerald-400 bg-emerald-900/40' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}>
                        <span className="material-symbols-outlined text-[16px] scale-75">radio_button_unchecked</span>
                        <span>Rekap Tes Kesehatan</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {expandedMenus.includes('tes_kesehatan') && !isSidebarCollapsed && (
                <div className="mt-1 space-y-1">
                  <button onClick={() => setView('proses_kesehatan')} className={`w-full flex items-center gap-3 pl-12 py-2.5 rounded-lg text-[12px] font-medium transition-all ${view === 'proses_kesehatan' ? 'text-emerald-400 bg-emerald-900/40' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}>
                    <span className="material-symbols-outlined text-[16px] scale-75">radio_button_unchecked</span>
                    <span>Proses Tes Kesehatan</span>
                  </button>
                  <button onClick={() => setView('rekap_kesehatan')} className={`w-full flex items-center gap-3 pl-12 py-2.5 rounded-lg text-[12px] font-medium transition-all ${view === 'rekap_kesehatan' ? 'text-emerald-400 bg-emerald-900/40' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}>
                    <span className="material-symbols-outlined text-[16px] scale-75">radio_button_unchecked</span>
                    <span>Rekap Tes Kesehatan</span>
                  </button>
                </div>
              )}
            </div>

            <div className="w-full relative group/menu">
              <button onClick={() => { if (!isSidebarCollapsed) toggleMenu('tes_wawancara'); }} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-[13px] transition-all ${expandedMenus.includes('tes_wawancara') && !isSidebarCollapsed ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white font-medium'}`}>
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-[20px]">chat</span>
                  {!isSidebarCollapsed && <span className="tracking-wide">Tes Wawancara</span>}
                </div>
                {!isSidebarCollapsed && <span className={`material-symbols-outlined text-sm transition-transform ${expandedMenus.includes('tes_wawancara') ? 'rotate-180' : ''}`}>expand_more</span>}
              </button>

              {isSidebarCollapsed && (
                <div className="fixed left-20 pl-2 w-52 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-[100] translate-y-[-45px]">
                  <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-700 font-bold text-white text-[13px]">Tes Wawancara</div>
                    <div className="p-2 space-y-1">
                      <button onClick={() => setView('proses_wawancara')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[12px] font-medium transition-all ${view === 'proses_wawancara' ? 'text-emerald-400 bg-emerald-900/40' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}>
                        <span className="material-symbols-outlined text-[16px] scale-75">radio_button_unchecked</span>
                        <span>Proses Tes Wawancara</span>
                      </button>
                      <button onClick={() => setView('rekap_wawancara')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[12px] font-medium transition-all ${view === 'rekap_wawancara' ? 'text-emerald-400 bg-emerald-900/40' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}>
                        <span className="material-symbols-outlined text-[16px] scale-75">radio_button_unchecked</span>
                        <span>Rekap Hasil Wawancara</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {expandedMenus.includes('tes_wawancara') && !isSidebarCollapsed && (
                <div className="mt-1 space-y-1">
                  <button onClick={() => setView('proses_wawancara')} className={`w-full flex items-center gap-3 pl-12 py-2.5 rounded-lg text-[12px] font-medium transition-all ${view === 'proses_wawancara' ? 'text-emerald-400 bg-emerald-900/40' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}>
                    <span className="material-symbols-outlined text-[16px] scale-75">radio_button_unchecked</span>
                    <span>Proses Tes Wawancara</span>
                  </button>
                  <button onClick={() => setView('rekap_wawancara')} className={`w-full flex items-center gap-3 pl-12 py-2.5 rounded-lg text-[12px] font-medium transition-all ${view === 'rekap_wawancara' ? 'text-emerald-400 bg-emerald-900/40' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}>
                    <span className="material-symbols-outlined text-[16px] scale-75">radio_button_unchecked</span>
                    <span>Rekap Hasil Wawancara</span>
                  </button>
                </div>
              )}
            </div>

            <div className="w-full relative group/menu">
              <button onClick={() => { if (!isSidebarCollapsed) toggleMenu('hasil_ujian'); }} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-[13px] transition-all ${expandedMenus.includes('hasil_ujian') && !isSidebarCollapsed ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white font-medium'}`}>
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-[20px]">assignment_turned_in</span>
                  {!isSidebarCollapsed && <span className="tracking-wide">Hasil Ujian</span>}
                </div>
                {!isSidebarCollapsed && <span className={`material-symbols-outlined text-sm transition-transform ${expandedMenus.includes('hasil_ujian') ? 'rotate-180' : ''}`}>expand_more</span>}
              </button>

              {isSidebarCollapsed && (
                <div className="fixed left-20 pl-2 w-52 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-[100] translate-y-[-45px]">
                  <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-700 font-bold text-white text-[13px]">Hasil Ujian</div>
                    <div className="p-2 space-y-1">
                      <button onClick={() => setView('proses_kelulusan')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[12px] font-medium transition-all ${view === 'proses_kelulusan' ? 'text-emerald-400 bg-emerald-900/40' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}>
                        <span className="material-symbols-outlined text-[16px] scale-75">radio_button_unchecked</span>
                        <span>Proses Kelulusan</span>
                      </button>
                      <button onClick={() => setView('rekap_kelulusan')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[12px] font-medium transition-all ${view === 'rekap_kelulusan' ? 'text-emerald-400 bg-emerald-900/40' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}>
                        <span className="material-symbols-outlined text-[16px] scale-75">radio_button_unchecked</span>
                        <span>Rekap Ujian</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {expandedMenus.includes('hasil_ujian') && !isSidebarCollapsed && (
                <div className="mt-1 space-y-1">
                  <button onClick={() => setView('proses_kelulusan')} className={`w-full flex items-center gap-3 pl-12 py-2.5 rounded-lg text-[12px] font-medium transition-all ${view === 'proses_kelulusan' ? 'text-emerald-400 bg-emerald-900/40' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}>
                    <span className="material-symbols-outlined text-[16px] scale-75">radio_button_unchecked</span>
                    <span>Proses Kelulusan</span>
                  </button>
                  <button onClick={() => setView('rekap_kelulusan')} className={`w-full flex items-center gap-3 pl-12 py-2.5 rounded-lg text-[12px] font-medium transition-all ${view === 'rekap_kelulusan' ? 'text-emerald-400 bg-emerald-900/40' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}>
                    <span className="material-symbols-outlined text-[16px] scale-75">radio_button_unchecked</span>
                    <span>Rekap Ujian</span>
                  </button>
                </div>
              )}
            </div>

            <div className="w-full relative group/menu" id="berita_acara_menu">
              <button onClick={() => { if (!isSidebarCollapsed) toggleMenu('berita_acara'); }} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-[13px] transition-all ${expandedMenus.includes('berita_acara') && !isSidebarCollapsed ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white font-medium'}`}>
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-[20px]">description</span>
                  {!isSidebarCollapsed && <span className="tracking-wide">Berita Acara</span>}
                </div>
                {!isSidebarCollapsed && <span className={`material-symbols-outlined text-sm transition-transform ${expandedMenus.includes('berita_acara') ? 'rotate-180' : ''}`}>expand_more</span>}
              </button>

              {isSidebarCollapsed && (
                <div className="fixed left-20 pl-2 w-52 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-[100] translate-y-[-45px]">
                  <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-700 font-bold text-white text-[13px]">Berita Acara</div>
                    <div className="p-2 space-y-1">
                      <button onClick={() => setView('absensi')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[12px] font-medium transition-all ${view === 'absensi' ? 'text-emerald-400 bg-emerald-900/40' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}>
                        <span className="material-symbols-outlined text-[16px] scale-75">radio_button_unchecked</span>
                        <span>Absensi</span>
                      </button>
                      <button onClick={() => setView('berita_acara_ujian')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[12px] font-medium transition-all ${view === 'berita_acara_ujian' ? 'text-emerald-400 bg-emerald-900/40' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}>
                        <span className="material-symbols-outlined text-[16px] scale-75">radio_button_unchecked</span>
                        <span>Berita Acara Ujian</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {expandedMenus.includes('berita_acara') && !isSidebarCollapsed && (
                <div className="mt-1 space-y-1">
                  <button onClick={() => setView('absensi')} className={`w-full flex items-center gap-3 pl-12 py-2.5 rounded-lg text-[12px] font-medium transition-all ${view === 'absensi' ? 'text-emerald-400 bg-emerald-900/40' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}>
                    <span className="material-symbols-outlined text-[16px] scale-75">radio_button_unchecked</span>
                    <span>Absensi</span>
                  </button>
                  <button onClick={() => setView('berita_acara_ujian')} className={`w-full flex items-center gap-3 pl-12 py-2.5 rounded-lg text-[12px] font-medium transition-all ${view === 'berita_acara_ujian' ? 'text-emerald-400 bg-emerald-900/40' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}>
                    <span className="material-symbols-outlined text-[16px] scale-75">radio_button_unchecked</span>
                    <span>Berita Acara Ujian</span>
                  </button>
                </div>
              )}
            </div>

            <div className="w-full relative group/menu" id="pengumuman_menu">
              <button onClick={() => { if (!isSidebarCollapsed) toggleMenu('pengumuman'); }} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-[13px] transition-all ${expandedMenus.includes('pengumuman') && !isSidebarCollapsed ? 'bg-slate-800 text-white font-bold' : view === 'pengumuman' ? 'bg-emerald-900/40 text-emerald-400 font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white font-medium'}`}>
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-[20px]">campaign</span>
                  {!isSidebarCollapsed && <span className="tracking-wide">Pengumuman</span>}
                </div>
                {!isSidebarCollapsed && <span className={`material-symbols-outlined text-sm transition-transform ${expandedMenus.includes('pengumuman') ? 'rotate-180' : ''}`}>expand_more</span>}
              </button>

              {isSidebarCollapsed && (
                <div className="fixed left-20 pl-2 w-52 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-[100] translate-y-[-45px]">
                  <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-700 font-bold text-white text-[13px]">Pengumuman</div>
                    <div className="p-2 space-y-1">
                      <button onClick={() => setView('pengumuman')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[12px] font-medium transition-all ${view === 'pengumuman' ? 'text-emerald-400 bg-emerald-900/40' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}>
                        <span className="material-symbols-outlined text-[16px] scale-75">radio_button_unchecked</span>
                        <span>Rekap Kelulusan</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {expandedMenus.includes('pengumuman') && !isSidebarCollapsed && (
                <div className="mt-1 space-y-1">
                  <button onClick={() => setView('pengumuman')} className={`w-full flex items-center gap-3 pl-12 py-2.5 rounded-lg text-[12px] font-medium transition-all ${view === 'pengumuman' ? 'text-emerald-400 bg-emerald-900/40' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}>
                    <span className="material-symbols-outlined text-[16px] scale-75">radio_button_unchecked</span>
                    <span>Rekap Kelulusan</span>
                  </button>
                </div>
              )}
            </div>

            <div className="w-full relative group/menu" id="laporan_menu">
              <button onClick={() => { if (!isSidebarCollapsed) toggleMenu('laporan'); }} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-[13px] transition-all ${expandedMenus.includes('laporan') && !isSidebarCollapsed ? 'bg-slate-800 text-white font-bold' : view === 'laporan' ? 'bg-emerald-900/40 text-emerald-400 font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white font-medium'}`}>
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-[20px]">analytics</span>
                  {!isSidebarCollapsed && <span className="tracking-wide">Laporan</span>}
                </div>
                {!isSidebarCollapsed && <span className={`material-symbols-outlined text-sm transition-transform ${expandedMenus.includes('laporan') ? 'rotate-180' : ''}`}>expand_more</span>}
              </button>

              {isSidebarCollapsed && (
                <div className="fixed left-20 pl-2 w-52 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-[100] translate-y-[-45px]">
                  <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-700 font-bold text-white text-[13px]">Laporan</div>
                    <div className="p-2 space-y-1">
                      {[
                        { key: 'rekap_keseluruhan', label: 'Rekap Keseluruhan' },
                        { key: 'belum_registrasi', label: 'Belum Registrasi' },

                        { key: 'laporan_ujian_tulis', label: 'Laporan Ujian Tulis' },
                        { key: 'laporan_tes_kesehatan', label: 'Laporan Tes Kesehatan' },
                        { key: 'rekap_tes_kesehatan', label: 'Rekap Tes Kesehatan' },
                      ].map(item => (
                        <button key={item.key} onClick={() => { setLaporanView(item.key as any); setView('laporan'); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[12px] font-medium transition-all ${view === 'laporan' && laporanView === item.key ? 'text-emerald-400 bg-emerald-900/40' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}>
                          <span className="material-symbols-outlined text-[16px] scale-75">radio_button_unchecked</span>
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {expandedMenus.includes('laporan') && !isSidebarCollapsed && (
                <div className="mt-1 space-y-1">
                  {[
                    { key: 'rekap_keseluruhan', label: 'Rekap Keseluruhan' },
                    { key: 'belum_registrasi', label: 'Belum Registrasi' },

                    { key: 'laporan_ujian_tulis', label: 'Laporan Ujian Tulis' },
                    { key: 'laporan_tes_kesehatan', label: 'Laporan Tes Kesehatan' },
                    { key: 'rekap_tes_kesehatan', label: 'Rekap Tes Kesehatan' },
                  ].map(item => (
                    <button key={item.key} onClick={() => { setLaporanView(item.key as any); setView('laporan'); }} className={`w-full flex items-center gap-3 pl-12 py-2.5 rounded-lg text-[12px] font-medium transition-all ${view === 'laporan' && laporanView === item.key ? 'text-emerald-400 bg-emerald-900/40' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}>
                      <span className="material-symbols-outlined text-[16px] scale-75">radio_button_unchecked</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </nav>
        <div className="p-4 border-t border-slate-800 bg-slate-900 shrink-0">
          <button onClick={onLogout} className="w-full flex items-center justify-center gap-4 py-3 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-600 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest overflow-hidden" title="Keluar"><span className="material-symbols-outlined text-[18px]">logout</span>{!isSidebarCollapsed && <span>Keluar Sistem</span>}</button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-[#00857A] shadow-md flex items-center justify-between px-8 text-white shrink-0 z-20 sticky top-0">
          <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="size-10 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors text-white"><span className="material-symbols-outlined">menu</span></button>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end mr-4 border-r border-white/20 pr-4"><span className="text-[9px] font-black uppercase tracking-widest text-emerald-100">Server Status</span><span className="text-xs font-bold text-white">{adminName}</span></div>
            <img src={`https://ui-avatars.com/api/?name=${adminName}&background=ffffff&color=00857A`} className="size-9 rounded-full shadow-sm" alt="" />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto overflow-x-hidden px-0 lg:px-2 py-3 lg:py-5 custom-content-scroll bg-slate-50/50">
          {view === 'dashboard' && renderDashboard()}
          {view === 'detail_spmb' && renderDetailSpmb()}
          {view === 'jadwal_ujian' && renderJadwal()}
          {view === 'tambah_soal' && renderTambahSoal()}
          {view === 'proses_kesehatan' && renderProsesKesehatan()}
          {view === 'rekap_kesehatan' && renderRekapKesehatan()}
          {view === 'proses_wawancara' && renderProsesWawancara()}
          {view === 'rekap_wawancara' && renderRekapWawancara()}
          {view === 'proses_kelulusan' && renderProsesKelulusan()}
          {view === 'rekap_kelulusan' && renderRekapKelulusan()}
          {view === 'detail_hasil_ujian' && renderDetailHasilUjian()}
          {view === 'absensi' && renderAbsensi()}
          {view === 'berita_acara_ujian' && renderBeritaAcara()}
          {view === 'pengumuman' && renderPengumuman()}
          {view === 'laporan' && renderLaporan()}
          {view === 'edit_soal' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex items-center gap-4 mb-8">
                <div className="size-12 bg-white text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm border border-emerald-100">
                  <span className="material-symbols-outlined text-[28px]">edit_note</span>
                </div>
                <div>
                  <h1 className="text-2xl font-black text-slate-800 tracking-tight">Edit Soal Ujian</h1>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Master Data / Edit Soal</p>
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
                <div className="px-10 py-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                  <h3 className="font-black text-slate-700 uppercase tracking-widest text-sm">Formulir Edit Soal</h3>
                  <button onClick={() => setView('dashboard')} className="text-slate-400 hover:text-slate-600 transition-colors">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                <form onSubmit={handleUpdateSoal} className="p-8 space-y-6 bg-slate-50/30">
                  {/* Group: Pertanyaan */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                    <h4 className="text-[11px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2 border-b border-slate-50 pb-3">
                      <span className="material-symbols-outlined text-[18px]">edit_square</span>
                      Konten Pertanyaan
                    </h4>
                    <div className="tinymce-editor-container border-2 border-slate-200 rounded-2xl overflow-hidden focus-within:border-emerald-500 transition-all">
                      <CKEditor
                        editor={ClassicEditor as any}
                        data={soalForm.pertanyaan}
                        onChange={(_, editor) => {
                          const data = editor.getData();
                          setSoalForm({ ...soalForm, pertanyaan: data });
                        }}
                        config={{
                          toolbar: [
                            'heading', '|',
                            'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', '|',
                            'insertTable', 'mediaEmbed', 'undo', 'redo'
                          ]
                        }}
                      />

                    </div>
                  </div>

                  {editingSoalId && (soalForm.soal_untuk !== 'Soal Wawancara') && (
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                      <h4 className="text-[11px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2 border-b border-slate-50 pb-3">
                        <span className="material-symbols-outlined text-[18px]">format_list_bulleted</span>
                        Opsi Pilihan Ganda
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {['pilihan_a', 'pilihan_b', 'pilihan_c', 'pilihan_d'].map((id) => {
                          const keyLetter = id.replace('pilihan_', '').toUpperCase();
                          const theme = 
                            keyLetter === 'A' ? { text: 'text-blue-600', bg: 'bg-blue-50/50', border: 'border-blue-100', focus: 'focus-within:border-blue-500 focus-within:ring-blue-500/5' } :
                            keyLetter === 'B' ? { text: 'text-indigo-600', bg: 'bg-indigo-50/50', border: 'border-indigo-100', focus: 'focus-within:border-indigo-500 focus-within:ring-indigo-500/5' } :
                            keyLetter === 'C' ? { text: 'text-purple-600', bg: 'bg-purple-50/50', border: 'border-purple-100', focus: 'focus-within:border-purple-500 focus-within:ring-purple-500/5' } :
                                                { text: 'text-pink-600', bg: 'bg-pink-50/50', border: 'border-pink-100', focus: 'focus-within:border-pink-500 focus-within:ring-pink-500/5' };
                          
                          return (
                            <div key={id} className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pilihan {keyLetter}</label>
                              <div className={`relative flex items-center bg-slate-50 border-2 border-slate-100 rounded-2xl transition-all ${theme.focus}`}>
                                <div className={`absolute left-3 size-8 rounded-xl ${theme.bg} ${theme.text} ${theme.border} border flex items-center justify-center font-black text-xs shadow-sm select-none`}>
                                  {keyLetter}
                                </div>
                                <input 
                                  type="text" 
                                  placeholder={`Masukkan Pilihan ${keyLetter}...`} 
                                  className="w-full pl-14 pr-5 py-3.5 bg-transparent outline-none border-none font-bold text-slate-700 text-[13px]" 
                                  value={(soalForm as any)[id]} 
                                  onChange={e => setSoalForm({ ...soalForm, [id]: e.target.value })} 
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Group: Atribut Soal */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                    <h4 className="text-[11px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2 border-b border-slate-50 pb-3">
                      <span className="material-symbols-outlined text-[18px]">tune</span>
                      Pengaturan Jawaban & Atribut
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      {editingSoalId && (soalForm.soal_untuk === 'Soal Wawancara' || soalList.find(s => s.id === editingSoalId)?.soal_untuk === 'Soal Wawancara') ? (
                        <>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Soal Untuk</label>
                            <input type="text" readOnly className="w-full px-5 py-3.5 bg-slate-100 border-2 border-slate-100 rounded-2xl outline-none font-bold text-slate-500 text-[13px]" value={soalForm.soal_untuk} />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kategori Wawancara</label>
                            <div className="relative flex items-center">
                              <select
                                className="w-full px-5 pr-12 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/5 outline-none appearance-none transition-all font-bold text-slate-700 text-[13px] cursor-pointer"
                                value={soalForm.kategori}
                                onChange={e => setSoalForm({ ...soalForm, kategori: e.target.value })}
                              >
                                <option value="Latar Belakang dan Motivasi">Latar Belakang dan Motivasi</option>
                                <option value="Tujuan dan Harapan">Tujuan dan Harapan</option>
                                <option value="Kemampuan dan Kesiapan">Kemampuan dan Kesiapan</option>
                              </select>
                              <span className="absolute right-4 pointer-events-none material-symbols-outlined text-slate-400 text-[18px]">keyboard_arrow_down</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Prodi</label>
                            <div className="relative flex items-center">
                              <select
                                className="w-full px-5 pr-12 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/5 outline-none appearance-none transition-all font-bold text-slate-700 text-[13px] cursor-pointer"
                                value={soalForm.prodi}
                                onChange={e => setSoalForm({ ...soalForm, prodi: e.target.value })}
                              >
                                <option value="">Semua Prodi (General)</option>
                                {prodiOptions.length > 0 ? (
                                  prodiOptions.map(p => (
                                    <option key={p} value={p}>{p}</option>
                                  ))
                                ) : (
                                  <>
                                    <option value="Magister Kesehatan Masyarakat">Magister Kesehatan Masyarakat</option>
                                    <option value="S1 Keperawatan">S1 Keperawatan</option>
                                    <option value="S1 Kebidanan">S1 Kebidanan</option>
                                  </>
                                )}
                              </select>
                              <span className="absolute right-4 pointer-events-none material-symbols-outlined text-slate-400 text-[18px]">keyboard_arrow_down</span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kunci Jawaban</label>
                            <div className="relative flex items-center">
                              <select className="w-full px-5 pr-12 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/5 outline-none appearance-none transition-all font-bold text-slate-700 text-[13px] cursor-pointer" value={soalForm.jawaban} onChange={e => setSoalForm({ ...soalForm, jawaban: e.target.value })}>
                                <option value="A">Pilihan A</option><option value="B">Pilihan B</option><option value="C">Pilihan C</option><option value="D">Pilihan D</option>
                              </select>
                              <span className="absolute right-4 pointer-events-none material-symbols-outlined text-slate-400 text-[18px]">keyboard_arrow_down</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tipe Soal</label>
                            <div className="relative flex items-center">
                              <select className="w-full px-5 pr-12 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/5 outline-none appearance-none transition-all font-bold text-slate-700 text-[13px] cursor-pointer" value={soalForm.type_soal} onChange={e => setSoalForm({ ...soalForm, type_soal: e.target.value })}>
                                <option value="TPA">TPA</option><option value="Bahasa Inggris">Bahasa Inggris</option>
                              </select>
                              <span className="absolute right-4 pointer-events-none material-symbols-outlined text-slate-400 text-[18px]">keyboard_arrow_down</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Soal Untuk</label>
                            <div className="relative flex items-center">
                              <select className="w-full px-5 pr-12 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/5 outline-none appearance-none transition-all font-bold text-slate-700 text-[13px] cursor-pointer" value={soalForm.soal_untuk} onChange={e => setSoalForm({ ...soalForm, soal_untuk: e.target.value })}>
                                <option value="Jalur A">Jalur A</option><option value="Jalur B">Jalur B</option><option value="Pasca">Pasca</option><option value="NERS">NERS</option><option value="Profesi Bidan">Profesi Bidan</option><option value="STMIK">STMIK</option><option value="Soal Wawancara">Soal Wawancara</option>
                              </select>
                              <span className="absolute right-4 pointer-events-none material-symbols-outlined text-slate-400 text-[18px]">keyboard_arrow_down</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Status</label>
                            <div className="relative flex items-center">
                              <select
                                className="w-full px-5 pr-12 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/5 outline-none appearance-none transition-all font-bold text-slate-700 text-[13px] cursor-pointer"
                                value={(soalForm as any).status}
                                onChange={e => setSoalForm({ ...soalForm, status: e.target.value })}
                              >
                                <option value="aktif">Aktif</option>
                                <option value="nonaktif">Nonaktif</option>
                              </select>
                              <span className="absolute right-4 pointer-events-none material-symbols-outlined text-slate-400 text-[18px]">keyboard_arrow_down</span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className={`px-12 py-4 ${isSaving ? 'bg-slate-400 cursor-not-allowed' : 'bg-amber-500 hover:bg-amber-600'} text-white rounded-2xl shadow-lg shadow-amber-500/20 font-black text-[11px] uppercase tracking-widest transition-all flex items-center gap-2 active:scale-95`}
                    >
                      {isSaving ? (
                        <>
                          <span className="material-symbols-outlined animate-spin text-[16px]">sync</span>
                          Memproses...
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[18px]">save</span>
                          Proses Edit
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {view.startsWith('daftar_') && (
            (() => {
              const jalurOptions = ['Jalur A', 'Soal Wawancara', 'Jalur B', 'Pasca', 'NERS', 'Profesi Bidan', 'STMIK'];
              const jalur = jalurOptions.find(j => `daftar_${j.toLowerCase().replace(' ', '_')}` === view) || view;
              return renderDaftarSoal(jalur);
            })()
          )}
        </main>
      </div>
      {/* Modal Proses Wawancara */}
      {showWawancaraModal && selectedWawancaraStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-300">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
              <h3 className="text-slate-800 font-bold text-lg">Proses Hasil Wawancara</h3>
              <button
                onClick={() => setShowWawancaraModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors text-xl font-bold flex items-center justify-center size-8 cursor-pointer"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 bg-white flex-1 overflow-y-auto custom-content-scroll">
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-800 font-bold text-sm mb-1.5">No Ujian</label>
                  <input
                    type="text"
                    readOnly
                    value={selectedWawancaraStudent.no_ujian || '-'}
                    className="w-full px-3 py-2 bg-[#eee] border border-slate-300 rounded text-[#555] text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-800 font-bold text-sm mb-1.5">Nama Mahasiswa</label>
                  <input
                    type="text"
                    readOnly
                    value={selectedWawancaraStudent.nama || '-'}
                    className="w-full px-3 py-2 bg-[#eee] border border-slate-300 rounded text-[#555] text-sm focus:outline-none uppercase"
                  />
                </div>

                <div>
                  <label className="block text-slate-800 font-bold text-sm mb-1.5">Pilihan</label>
                  <input
                    type="text"
                    readOnly
                    value={selectedWawancaraStudent.pilihan || wawancaraFilterProdi || '-'}
                    className="w-full px-3 py-2 bg-[#eee] border border-slate-300 rounded text-[#555] text-sm focus:outline-none"
                  />
                </div>

                <h4 className="text-[17px] font-bold text-[#00a65a] mt-4 mb-2">Jawaban Wawancara :</h4>
                <hr className="border-slate-200 mb-4" />

                {selectedWawancaraStudent.interview_answers && selectedWawancaraStudent.interview_answers.length > 0 ? (
                  <div className="space-y-4 mb-4">
                    {selectedWawancaraStudent.interview_answers.map((ans: any, idx: number) => (
                      <div key={ans.id} className="p-3.5 bg-slate-50 rounded border border-slate-200">
                        <div className="text-sm font-bold text-slate-800 mb-2 flex gap-2">
                          <span>{idx + 1}.</span>
                          <div dangerouslySetInnerHTML={{ __html: ans.pertanyaan }}></div>
                        </div>
                        <div className="p-3 bg-white rounded border border-slate-200 shadow-inner">
                          <p className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">{ans.jawaban}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-[#f39c12] text-white p-4 rounded mb-4 font-semibold text-[14px]">
                    Belum ada jawaban wawancara untuk No Ujian ini.
                  </div>
                )}

                <div className="mb-6">
                  <label className="block text-slate-800 font-bold text-sm mb-1.5">Hasil Wawancara</label>
                  <select
                    value={wawancaraStatus}
                    onChange={(e) => setWawancaraStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-700 font-medium text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="LULUS">Lulus</option>
                    <option value="TIDAK LULUS">Tidak Lulus</option>
                  </select>
                </div>

                <div className="flex justify-start mb-2">
                  <button
                    onClick={handleSaveWawancara}
                    className="px-4 py-2 bg-[#3c8dbc] hover:bg-[#367fa9] text-white rounded text-sm font-medium transition-colors shadow-sm cursor-pointer"
                    disabled={isSaving}
                  >
                    {isSaving ? 'Menyimpan...' : 'Simpan'}
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-200 bg-white flex justify-end shrink-0">
              <button
                onClick={() => setShowWawancaraModal(false)}
                className="px-4 py-2 text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded text-sm font-medium transition-colors cursor-pointer"
                disabled={isSaving}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Proses Kelulusan */}
      {showProsesKelulusanModal && selectedKelulusanStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-300">
            <div className="bg-emerald-600 p-4 flex items-center justify-between shadow-sm relative overflow-hidden shrink-0">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl"></div>
              <h3 className="text-white font-bold text-[15px] flex items-center gap-2 relative z-10">
                <span className="material-symbols-outlined text-[20px]">verified_user</span>
                Proses Kelulusan Calon Mahasiswa Baru
              </h3>
              <button
                onClick={() => setShowProsesKelulusanModal(false)}
                className="text-white/80 hover:text-white hover:bg-white/20 p-1 rounded-full transition-colors relative z-10"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-5 bg-slate-50 flex-1 overflow-y-auto custom-content-scroll">
              <div className="space-y-4">

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-0"></div>
                  <h4 className="text-[12px] font-black uppercase text-emerald-800 mb-3 tracking-wider flex items-center gap-1.5 relative z-10">
                    <span className="material-symbols-outlined text-[16px]">person</span> Data Mahasiswa
                  </h4>
                  <div className="grid grid-cols-2 gap-y-3 gap-x-4 relative z-10">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">No Ujian</label>
                      <div className="text-slate-800 text-[12px] font-bold bg-slate-50 px-2.5 py-1.5 rounded border border-slate-100 font-mono inline-block">{selectedKelulusanStudent.no_ujian || '-'}</div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Nama Mahasiswa</label>
                      <div className="text-slate-800 text-[12px] font-bold bg-slate-50 px-2.5 py-1.5 rounded border border-slate-100">{selectedKelulusanStudent.nama || '-'}</div>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Pilihan</label>
                      <div className="text-slate-800 text-[12px] font-bold bg-slate-50 px-2.5 py-1.5 rounded border border-slate-100">{selectedKelulusanStudent.pilihan || '-'}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-24 h-24 bg-blue-50 rounded-bl-full -z-0"></div>
                  <h4 className="text-[12px] font-black uppercase text-blue-800 mb-3 tracking-wider flex items-center gap-1.5 relative z-10">
                    <span className="material-symbols-outlined text-[16px]">fact_check</span> Hasil Tes Mahasiswa
                  </h4>
                  <div className="grid grid-cols-3 gap-3 relative z-10">
                    <div className="bg-blue-50/50 p-2 rounded-lg border border-blue-100 text-center">
                      <label className="block text-[9px] font-bold text-blue-600 uppercase tracking-wider mb-0.5">Jumlah Benar</label>
                      <div className="text-slate-800 font-black text-[15px]">{selectedKelulusanStudent.jumlah_benar || '-'}</div>
                    </div>
                    <div className="bg-amber-50/50 p-2 rounded-lg border border-amber-100 text-center flex flex-col justify-center">
                      <label className="block text-[9px] font-bold text-amber-600 uppercase tracking-wider mb-0.5">Kesehatan</label>
                      <div className={`font-black text-[11px] uppercase ${selectedKelulusanStudent.status_kesehatan === 'Sehat' || selectedKelulusanStudent.status_kesehatan === 'Lulus' ? 'text-emerald-600' : selectedKelulusanStudent.status_kesehatan === 'Menunggu' ? 'text-amber-600' : 'text-rose-600'}`}>
                        {selectedKelulusanStudent.status_kesehatan === 'Menunggu' ? 'MENUNGGU' : (selectedKelulusanStudent.status_kesehatan || 'BELUM TES')}
                      </div>
                    </div>
                    <div className="bg-indigo-50/50 p-2 rounded-lg border border-indigo-100 text-center flex flex-col justify-center">
                      <label className="block text-[9px] font-bold text-indigo-600 uppercase tracking-wider mb-0.5">Wawancara</label>
                      <div className={`font-black text-[11px] uppercase ${selectedKelulusanStudent.hasil_wawancara === 'LULUS' ? 'text-emerald-600' : selectedKelulusanStudent.hasil_wawancara === 'BELUM UJIAN' ? 'text-rose-600' : 'text-indigo-600'}`}>
                        {selectedKelulusanStudent.hasil_wawancara === 'BELUM UJIAN' ? 'BELUM' : (selectedKelulusanStudent.hasil_wawancara || 'TIDAK ADA')}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <h4 className="text-[12px] font-black uppercase text-slate-800 mb-3 tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">gavel</span> Keputusan Final
                  </h4>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Status Kelulusan Calon Mahasiswa *</label>
                      <div className="relative">
                        <select
                          value={statusKelulusan}
                          onChange={(e) => setStatusKelulusan(e.target.value)}
                          className="w-full pl-3 pr-10 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-700 font-bold text-[13px] shadow-sm"
                        >
                          <option value="Lulus">LULUS</option>
                          <option value="Tidak Lulus">TIDAK LULUS</option>
                          <option value="Cadangan">CADANGAN</option>
                          <option value="Lulus Di S1 Kesmas Jalur A Reguler">LULUS DI S1 KESMAS JALUR A REGULER</option>
                          <option value="Lulus Di S1 Kesmas Jalur B (Transfer)">LULUS DI S1 KESMAS JALUR B (TRANSFER)</option>
                          <option value="Lulus Di S1 Keperawatan">LULUS DI S1 KEPERAWATAN</option>
                          <option value="Lulus Di Profesi Ners">LULUS DI PROFESI NERS</option>
                          <option value="Lulus Di S1 Kebidanan">LULUS DI S1 KEBIDANAN</option>
                          <option value="Lulus Di Profesi Bidan">LULUS DI PROFESI BIDAN</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1.5">No. WhatsApp Calon Mahasiswa (Format 62)</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <span className="material-symbols-outlined text-emerald-500 text-[18px]">phone_in_talk</span>
                        </div>
                        <input
                          type="text"
                          value={noWhatsappKelulusan}
                          onChange={(e) => {
                            let val = e.target.value;
                            // Hanya izinkan angka
                            val = val.replace(/\D/g, '');
                            // Otomatis ubah 08xxx menjadi 628xxx
                            if (val.startsWith('08')) {
                              val = '628' + val.substring(2);
                            }
                            setNoWhatsappKelulusan(val);
                          }}
                          className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-700 font-medium text-[13px] shadow-sm"
                          placeholder="Contoh: 628123456789"
                        />
                      </div>
                      <p className="text-[10px] text-amber-600 mt-1.5 font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">info</span>
                        * Pastikan nomor menggunakan format 62 (contoh: 628123456789)
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-white flex justify-end gap-3 shrink-0">
              <button
                onClick={() => setShowProsesKelulusanModal(false)}
                className="px-6 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg font-bold text-[13px] transition-colors border border-slate-200"
              >
                Kembali
              </button>
              <button
                onClick={handleSaveKelulusan}
                disabled={isSaving}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[13px] transition-all flex items-center gap-2 shadow-md shadow-emerald-600/20 hover:shadow-lg hover:-translate-y-0.5"
              >
                {isSaving ? (
                  <><span className="material-symbols-outlined animate-spin text-[16px]">sync</span> Menyimpan...</>
                ) : (
                  <><span className="material-symbols-outlined text-[16px]">check_circle</span> Simpan Kelulusan</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-sidebar-scroll::-webkit-scrollbar { width: 4px; }
        .custom-sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-sidebar-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-content-scroll::-webkit-scrollbar { width: 8px; }
        .custom-content-scroll::-webkit-scrollbar-track { background: #f1f1f1; }
        .custom-content-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .tinymce-editor-container { min-height: 400px; }
        .html-content-large img { max-width: 100%; height: auto; display: block; margin-top: 10px; margin-bottom: 10px; }

      `}</style>

    </div>
  );
};

export default CbtAdminDashboard;
