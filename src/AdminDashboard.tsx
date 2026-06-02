import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from './config';

interface Payment {
  id: number;
  tanggal_bayar: string;
  kode_pembayaran: string;
  nama_penyetor: string;
  jumlah_bayar: string;
  bukti_path: string;
  status: string;
  created_at: string;
}

interface AdminDashboardProps {
  onLogout: () => void;
  user: any;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, user }) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [biodatas, setBiodatas] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProof, setSelectedProof] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'payments' | 'students' | 'health' | 'registration'>('payments');
  const [selectedBiodata, setSelectedBiodata] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'finalized' | 'draft' | 'pending' | 'verified' | 'Menunggu' | 'Sehat' | 'Tidak Sehat' | 'Menunggu Verifikasi'>('all');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'profile' | 'parent' | 'document'>('profile');

  // Health Verification States
  const [statusKesehatan, setStatusKesehatan] = useState('null');
  const [tinggiBadan, setTinggiBadan] = useState('');
  const [golonganDarah, setGolonganDarah] = useState('');
  const [butaWarna, setButaWarna] = useState('');
  const [visus, setVisus] = useState('');
  const [tekananDarah, setTekananDarah] = useState('');
  const [riwayatPenyakit, setRiwayatPenyakit] = useState('');
  const [keteranganKesehatan, setKeteranganKesehatan] = useState('');
  const [showHealthModal, setShowHealthModal] = useState(false);
  const [selectedHealthStudent, setSelectedHealthStudent] = useState<any>(null);

  // Statistics calculation
  const stats = {
    totalRegistered: biodatas.length,
    totalFinalized: biodatas.filter(b => (b.is_finalized == 1 || b.is_finalized === true)).length,
    totalDraft: biodatas.filter(b => !(b.is_finalized == 1 || b.is_finalized === true)).length,
    totalPaymentsPending: payments.filter(p => p.status === 'pending').length,
    totalPaymentsVerified: payments.filter(p => p.status === 'verified').length
  };

  useEffect(() => {
    fetchPayments();
    fetchBiodatas();
  }, []);

  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/payments`);
      const data = await res.json();
      setPayments(data);
    } catch (error) {
      console.error('Failed to fetch payments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBiodatas = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/biodatas`);
      const data = await res.json();
      setBiodatas(data);
    } catch (error) {
      console.error('Failed to fetch biodatas:', error);
    }
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/payments/${id}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        // Refresh the list
        fetchPayments();
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleRefresh = async () => {
    await Promise.all([fetchPayments(), fetchBiodatas()]);
  };

  const handleUpdateStatusKesehatan = async () => {
    if (!selectedHealthStudent) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/kesehatan/${selectedHealthStudent.registration_id}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          status_kesehatan: statusKesehatan,
          tinggi_badan: tinggiBadan,
          golongan_darah: golonganDarah,
          buta_warna: butaWarna,
          visus: visus,
          tekanan_darah: tekananDarah,
          riwayat_penyakit: riwayatPenyakit,
          keterangan_kesehatan: keteranganKesehatan
        })
      });

      if (response.ok) {
        alert('Data kesehatan berhasil disimpan!');
        setShowHealthModal(false);
        fetchBiodatas(); // Refresh list
      }
    } catch (error) {
      console.error('Error updating health status:', error);
    } finally {
      setIsLoading(false);
    }
  };


  const handleExportExcel = () => {
    const downloadCSV = (headers: string[], rows: any[][], fileName: string) => {
      const csvContent = [
        headers.join(","),
        ...rows.map(r => r.map(val => {
          const stringVal = val === null || val === undefined ? '' : String(val);
          return `"${stringVal.replace(/"/g, '""')}"`;
        }).join(","))
      ].join("\n");

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `${fileName}_${new Date().toLocaleDateString().replace(/\//g, '-')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    if (activeTab === 'payments') {
      const filtered = payments.filter(p => {
        const matchesSearch = p.nama_penyetor.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.kode_pembayaran.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
        return matchesSearch && matchesStatus;
      });

      if (filtered.length === 0) {
        alert("Tidak ada data pembayaran untuk dieksport.");
        return;
      }

      const headers = ["Tanggal", "Kode Pembayaran", "Nama Penyetor", "Jumlah", "Status"];
      const rows = filtered.map(p => [
        p.tanggal_bayar,
        p.kode_pembayaran,
        p.nama_penyetor,
        p.jumlah_bayar.replace(/\./g, ''), // Clean currency format for Excel
        p.status.toUpperCase()
      ]);
      downloadCSV(headers, rows, "Laporan_Pembayaran_SPMB");
    } else if (activeTab === 'students') {
      const filtered = biodatas.filter(b => {
        const name = b.registration?.name || '';
        const examNumber = b.exam_number || '';
        const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            examNumber.toLowerCase().includes(searchTerm.toLowerCase());
        
        const isFinalized = (b.is_finalized === true || b.is_finalized === 1 || b.is_finalized === "1");
        const matchesStatus = statusFilter === 'all' || 
                            (statusFilter === 'finalized' && isFinalized) ||
                            (statusFilter === 'draft' && !isFinalized);
        
        return matchesSearch && matchesStatus;
      });

      if (filtered.length === 0) {
        alert("Tidak ada data pendaftar untuk dieksport.");
        return;
      }

      const headers = ["Nama Pendaftar", "Nomor Ujian", "Program Studi", "Status"];
      const rows = filtered.map(b => [
        b.registration?.name || '-',
        b.exam_number || 'BELUM FINAL',
        b.registration?.program_studi || '-',
        (b.is_finalized === true || b.is_finalized === 1 || b.is_finalized === "1") ? "FINAL" : "DRAFT"
      ]);
      downloadCSV(headers, rows, "Laporan_Pendaftar_SPMB");
    } else if (activeTab === 'health') {
      const filtered = biodatas.filter(b => {
        if (!b.is_finalized) return false;
        const name = b.registration?.name || '';
        const examNumber = b.exam_number || '';
        const programStudi = b.registration?.program_studi || '';
        const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            examNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            programStudi.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || b.status_kesehatan === statusFilter;
        return matchesSearch && matchesStatus;
      });

      if (filtered.length === 0) {
        alert("Tidak ada data kesehatan untuk dieksport.");
        return;
      }

      const headers = [
        "Nama Pendaftar", "Nomor Ujian", "Program Studi", "Tinggi Badan", "Gol. Darah", 
        "Tes Warna", "Visus Mata", "Tekanan Darah", "Riwayat Penyakit", "Status Kesehatan"
      ];
      const rows = filtered.map(b => [
        b.registration?.name || '-',
        b.exam_number || '-',
        b.registration?.program_studi || '-',
        b.tinggi_badan || '-',
        b.golongan_darah || '-',
        b.buta_warna || '-',
        b.visus || '-',
        b.tekanan_darah || '-',
        b.riwayat_penyakit || 'Tidak Ada',
        b.status_kesehatan || 'BELUM TES'
      ]);
      downloadCSV(headers, rows, "Laporan_Tes_Kesehatan_SPMB");
    } else if (activeTab === 'registration') {
      const filtered = biodatas.filter(b => {
        if (!b.status_registrasi) return false;
        const name = b.registration?.name || '';
        const examNumber = b.exam_number || '';
        const programStudi = b.registration?.program_studi || '';
        const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            examNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            programStudi.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || b.status_registrasi === statusFilter;
        return matchesSearch && matchesStatus;
      });

      if (filtered.length === 0) {
        alert("Tidak ada data registrasi ulang untuk dieksport.");
        return;
      }

      const headers = ["Nama Pendaftar", "Nomor Ujian", "Program Studi", "Status Registrasi"];
      const rows = filtered.map(b => [
        b.registration?.name || '-',
        b.exam_number || '-',
        b.registration?.program_studi || '-',
        b.status_registrasi || '-'
      ]);
      downloadCSV(headers, rows, "Laporan_Registrasi_Ulang_SPMB");
    }
  };

  const handleRejectBiodata = async (id: number) => {
    if (!window.confirm('Apakah Anda yakin ingin menolak berkas ini? Status akan kembali ke Draft dan Nomor Ujian akan dihapus.')) return;
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/biodatas/${id}/reject`, {
        method: 'POST',
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        alert('Berkas berhasil ditolak.');
        setSelectedBiodata(null);
        fetchBiodatas();
      }
    } catch (error) {
      console.error('Failed to reject biodata:', error);
    }
  };

  const handleVerifyRegistrasi = async (id: number, status: string) => {
    if (!window.confirm(`Yakin ingin mengupdate status registrasi menjadi ${status}?`)) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/registrasi/${id}/verify`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      
      if (response.ok) {
        alert('Status registrasi berhasil diupdate.');
        fetchBiodatas(); // Refresh data
      } else {
        alert('Gagal mengupdate status registrasi.');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan koneksi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (id: number) => {
    if (!window.confirm('Reset password user ini menjadi: uhtp12345?')) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users/${id}/reset-password`, {
        method: 'POST',
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        alert(data.message);
      }
    } catch (error) {
      console.error('Failed to reset password:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/50 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">Lunas</span>;
      case 'rejected':
        return <span className="bg-rose-50 text-rose-700 border border-rose-200/50 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">Ditolak</span>;
      default:
        return <span className="bg-amber-50 text-amber-700 border border-amber-200/50 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">Menunggu</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans">
      
      {/* Desktop Left Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 shrink-0 h-screen sticky top-0 hidden md:flex">
        {/* Brand Logo & Name */}
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="size-9 bg-primary/20 rounded-xl flex items-center justify-center text-primary border border-primary/20 shadow-inner">
            <span className="material-symbols-outlined shrink-0 text-xl">admin_panel_settings</span>
          </div>
          <div>
            <h2 className="font-extrabold text-white text-sm tracking-tight leading-none">SPMB UHTP</h2>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Admin Portal</p>
          </div>
        </div>

        {/* Admin Profile */}
        <div className="p-4 mx-4 my-4 bg-slate-800/40 border border-slate-800/80 rounded-2xl flex items-center gap-3">
          <div className="size-10 bg-primary/10 text-primary border border-primary/20 rounded-xl flex items-center justify-center font-bold text-base shrink-0">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-white text-xs truncate leading-none block">{user?.name || 'Administrator'}</span>
              <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-[8px] font-black uppercase tracking-widest leading-none shrink-0">
                Utama
              </span>
            </div>
            <span className="text-[9px] font-medium text-slate-400 truncate block mt-1">{user?.email || 'admin@uhtp.ac.id'}</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          {[
            { id: 'payments', label: 'Pembayaran', icon: 'payments' },
            { id: 'students', label: 'Pendaftar', icon: 'group' },
            { id: 'health', label: 'Kesehatan', icon: 'health_and_safety' },
            { id: 'registration', label: 'Registrasi', icon: 'app_registration' }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setStatusFilter('all');
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout at bottom */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-850 hover:bg-rose-950/20 text-rose-450 hover:text-rose-350 border border-slate-800 hover:border-rose-900/30 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <header className="md:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-45 border-b border-slate-800 shadow-md shrink-0">
        <div className="flex items-center gap-2.5">
          <button 
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>
          <span className="font-extrabold text-sm tracking-tight">SPMB UHTP</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleRefresh}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">refresh</span>
          </button>
          <button 
            onClick={handleExportExcel}
            className="p-1.5 text-emerald-450 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">download</span>
          </button>
        </div>
      </header>

      {/* Mobile Sidebar Drawer */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex animate-in fade-in duration-300">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsMobileSidebarOpen(false)}></div>
          <div className="relative w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 h-full animate-in slide-in-from-left duration-250">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-9 bg-primary/20 rounded-xl flex items-center justify-center text-primary border border-primary/20">
                  <span className="material-symbols-outlined shrink-0 text-xl">admin_panel_settings</span>
                </div>
                <div>
                  <h2 className="font-extrabold text-white text-sm tracking-tight leading-none">SPMB UHTP</h2>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Admin Portal</p>
                </div>
              </div>
              <button 
                onClick={() => setIsMobileSidebarOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-4 mx-4 my-4 bg-slate-800/40 border border-slate-800/80 rounded-2xl flex items-center gap-3">
              <div className="size-10 bg-primary/10 text-primary border border-primary/20 rounded-xl flex items-center justify-center font-bold text-base shrink-0">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-white text-xs truncate leading-none block">{user?.name || 'Administrator'}</span>
                  <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-[8px] font-black uppercase tracking-widest leading-none shrink-0">
                    Utama
                  </span>
                </div>
                <span className="text-[9px] font-medium text-slate-400 truncate block mt-1">{user?.email || 'admin@uhtp.ac.id'}</span>
              </div>
            </div>

            <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
              {[
                { id: 'payments', label: 'Pembayaran', icon: 'payments' },
                { id: 'students', label: 'Pendaftar', icon: 'group' },
                { id: 'health', label: 'Kesehatan', icon: 'health_and_safety' },
                { id: 'registration', label: 'Registrasi', icon: 'app_registration' }
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as any);
                      setStatusFilter('all');
                      setIsMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-primary text-white shadow-md shadow-primary/20'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="p-4 border-t border-slate-800">
              <button
                onClick={() => {
                  setIsMobileSidebarOpen(false);
                  setShowLogoutModal(true);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-850 hover:bg-rose-950/20 text-rose-450 hover:text-rose-355 border border-slate-800 hover:border-rose-900/30 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                <span>Keluar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Panel */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-100">
        
        {/* Desktop Header */}
        <header className="hidden md:flex bg-white border-b border-slate-200/80 px-8 py-5 items-center justify-between sticky top-0 z-30 shadow-sm shrink-0">
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight leading-none">
              Dashboard Admin
            </h1>
            <p className="text-xs font-medium text-slate-400 mt-1.5">Manajemen pendaftaran dan verifikasi SPMB UHTP.</p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={handleExportExcel}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm shadow-emerald-600/10 cursor-pointer"
              title="Download Excel"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>Export Excel</span>
            </button>

            <button 
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 active:scale-98 text-slate-650 font-bold text-xs uppercase tracking-wider rounded-xl transition-all border border-slate-200 shadow-sm cursor-pointer"
              title="Refresh Data"
            >
              <span className="material-symbols-outlined text-[16px]">refresh</span>
              <span>Refresh</span>
            </button>
          </div>
        </header>

        {/* Content Container */}
        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
          
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { id: 'all', label: 'Total Pendaftar', val: stats.totalRegistered, icon: 'group', iconColor: 'text-blue-600 bg-blue-150', bgNormal: 'bg-blue-50/40 hover:bg-blue-55 border-blue-200/50 text-blue-900', bgActive: 'bg-blue-100 border-blue-500 ring-2 ring-blue-500/20 text-blue-900 shadow-md', tab: 'students' },
              { id: 'finalized', label: 'Sudah Finalisasi', val: stats.totalFinalized, icon: 'verified', iconColor: 'text-emerald-600 bg-emerald-150', bgNormal: 'bg-emerald-50/40 hover:bg-emerald-55 border-emerald-200/50 text-emerald-900', bgActive: 'bg-emerald-100 border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-900 shadow-md', tab: 'students' },
              { id: 'draft', label: 'Belum Finalisasi', val: stats.totalDraft, icon: 'edit_document', iconColor: 'text-rose-600 bg-rose-155', bgNormal: 'bg-rose-50/40 hover:bg-rose-55 border-rose-200/50 text-rose-900', bgActive: 'bg-rose-100 border-rose-500 ring-2 ring-rose-500/20 text-rose-900 shadow-md', tab: 'students' },
              { id: 'pending', label: 'Menunggu Bayar', val: stats.totalPaymentsPending, icon: 'pending_actions', iconColor: 'text-amber-600 bg-amber-150', bgNormal: 'bg-amber-50/40 hover:bg-amber-55 border-amber-200/50 text-amber-900', bgActive: 'bg-amber-100 border-amber-500 ring-2 ring-amber-500/20 text-amber-900 shadow-md', tab: 'payments' },
              { id: 'verified', label: 'Bayar Terverifikasi', val: stats.totalPaymentsVerified, icon: 'payments', iconColor: 'text-indigo-650 bg-indigo-150', bgNormal: 'bg-indigo-50/40 hover:bg-indigo-55 border-indigo-200/50 text-indigo-900', bgActive: 'bg-indigo-100 border-indigo-500 ring-2 ring-indigo-500/20 text-indigo-900 shadow-md', tab: 'payments' }
            ].map((s) => {
              const isActive = statusFilter === s.id;
              return (
                <button 
                  key={s.id} 
                  onClick={() => {
                    setStatusFilter(s.id as any);
                    setActiveTab(s.tab as any);
                  }}
                  className={`p-5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between gap-3 group cursor-pointer ${
                    isActive ? s.bgActive : s.bgNormal
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate">{s.label}</span>
                    <div className={`size-8 ${s.iconColor} rounded-lg flex items-center justify-center shrink-0`}>
                      <span className="material-symbols-outlined text-[18px]">{s.icon}</span>
                    </div>
                  </div>
                  <p className="text-2xl font-bold leading-none tracking-tight">{s.val}</p>
                </button>
              );
            })}
          </div>

          {/* Filter Badge & Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Filter:</span>
              <span className="px-3 py-1 bg-slate-100 border border-slate-200 text-slate-700 rounded-full text-xs font-semibold uppercase tracking-wide flex items-center gap-1.5 shadow-sm">
                <span className="size-1.5 rounded-full bg-primary animate-pulse"></span>
                {statusFilter === 'all' ? 'Semua Data' : statusFilter === 'finalized' ? 'Finalisasi' : statusFilter === 'draft' ? 'Draft' : statusFilter === 'pending' ? 'Menunggu Bayar' : 'Lunas Terverifikasi'}
              </span>
            </div>

            <div className="relative w-full sm:max-w-xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-slate-400 text-[18px]">search</span>
              </div>
              <input 
                type="text" 
                placeholder={`Cari nama, prodi, atau nomor...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm hover:border-slate-350"
              />
            </div>
          </div>

          {/* Tab Content Panels */}
          {activeTab === 'payments' ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                      <th className="px-6 py-4">Tanggal</th>
                      <th className="px-6 py-4">Kode Pembayaran</th>
                      <th className="px-6 py-4">Nama Penyetor</th>
                      <th className="px-6 py-4 text-right">Jumlah</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {isLoading ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-medium">
                          <span className="material-symbols-outlined animate-spin text-3xl mb-2">refresh</span>
                          <p>Memuat data...</p>
                        </td>
                      </tr>
                    ) : payments.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-medium">
                          <span className="material-symbols-outlined text-4xl mb-2 opacity-50">inbox</span>
                          <p>Belum ada data pembayaran.</p>
                        </td>
                      </tr>
                    ) : (
                      payments
                        .filter(p => {
                          const matchesSearch = p.nama_penyetor.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                              p.kode_pembayaran.toLowerCase().includes(searchTerm.toLowerCase());
                          const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
                          return matchesSearch && matchesStatus;
                        })
                        .map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/20 transition-colors duration-150">
                          <td className="px-6 py-4 font-medium text-slate-500 text-xs">{p.tanggal_bayar}</td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200/60 rounded-md font-mono font-bold text-xs">
                              {p.kode_pembayaran}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-semibold text-slate-800">{p.nama_penyetor}</td>
                          <td className="px-6 py-4 font-bold text-slate-800 text-right">Rp {p.jumlah_bayar}</td>
                          <td className="px-6 py-4">{getStatusBadge(p.status)}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button 
                                onClick={() => setSelectedProof(`${API_BASE_URL}/storage/${p.bukti_path}`)}
                                className="px-2.5 py-1 text-blue-600 hover:text-blue-700 bg-blue-50/50 hover:bg-blue-100/60 border border-blue-200/50 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 active:scale-95"
                                title="Lihat Bukti"
                              >
                                <span className="material-symbols-outlined text-[16px]">visibility</span>
                                <span>Bukti</span>
                              </button>
                              {p.status === 'pending' && (
                                <>
                                  <button 
                                    onClick={() => handleUpdateStatus(p.id, 'verified')}
                                    className="px-2.5 py-1 text-emerald-600 hover:text-emerald-700 bg-emerald-50/50 hover:bg-emerald-100/60 border border-emerald-200/50 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 active:scale-95"
                                    title="Verifikasi Lunas"
                                  >
                                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                                    <span>Lunas</span>
                                  </button>
                                  <button 
                                    onClick={() => handleUpdateStatus(p.id, 'rejected')}
                                    className="px-2.5 py-1 text-rose-600 hover:text-rose-700 bg-rose-50/50 hover:bg-rose-100/60 border border-rose-200/50 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 active:scale-95"
                                    title="Tolak"
                                  >
                                    <span className="material-symbols-outlined text-[16px]">cancel</span>
                                    <span>Tolak</span>
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : activeTab === 'students' ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                      <th className="px-6 py-4">Nama Pendaftar</th>
                      <th className="px-6 py-4">Nomor Ujian</th>
                      <th className="px-6 py-4">Program Studi</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {biodatas.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium">
                          <span className="material-symbols-outlined text-4xl mb-2 opacity-50">person_off</span>
                          <p>Belum ada data pendaftar yang masuk.</p>
                        </td>
                      </tr>
                    ) : (
                      biodatas
                        .filter(b => {
                          const name = b.registration?.name || '';
                          const examNumber = b.exam_number || '';
                          const programStudi = b.registration?.program_studi || '';
                          const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                              examNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                              programStudi.toLowerCase().includes(searchTerm.toLowerCase());
                          
                          const isFinalized = (b.is_finalized === true || b.is_finalized === 1 || b.is_finalized === "1");
                          const matchesStatus = statusFilter === 'all' || 
                                              (statusFilter === 'finalized' && isFinalized) ||
                                              (statusFilter === 'draft' && !isFinalized);
                          
                          return matchesSearch && matchesStatus;
                        })
                        .map((b) => (
                        <tr key={b.registration_id} className="hover:bg-slate-50/20 transition-colors duration-150">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="size-9 bg-primary/10 text-primary border border-primary/20 rounded-xl flex items-center justify-center font-bold text-xs shrink-0">
                                {b.registration?.name?.charAt(0)}
                              </div>
                              <span className="font-semibold text-slate-800 whitespace-nowrap">{b.registration?.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {(b.is_finalized === true || b.is_finalized === 1 || b.is_finalized === "1") ? (
                              <span className="font-mono font-bold text-slate-700 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg text-xs">{b.exam_number}</span>
                            ) : (
                              <span className="bg-slate-50 text-slate-400 border border-slate-200/50 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">Draft</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase whitespace-nowrap">{b.registration?.program_studi}</td>
                          <td className="px-6 py-4">
                            {(b.is_finalized === true || b.is_finalized === 1 || b.is_finalized === "1") ? (
                              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/50 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">Final</span>
                            ) : (
                              <span className="bg-amber-50 text-amber-700 border border-amber-200/50 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">Draft</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center">
                              <button 
                                onClick={() => { setSelectedBiodata(b); setModalTab('profile'); }}
                                className="px-2.5 py-1 text-emerald-650 hover:text-emerald-700 bg-emerald-50/50 hover:bg-emerald-100/60 border border-emerald-200/50 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 active:scale-95"
                              >
                                <span className="material-symbols-outlined text-[16px]">visibility</span>
                                <span>Detail</span>
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
          ) : activeTab === 'health' ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                      <th className="px-6 py-4">Nama Pendaftar</th>
                      <th className="px-6 py-4">Nomor Ujian</th>
                      <th className="px-6 py-4">Program Studi</th>
                      <th className="px-6 py-4">Status Kesehatan</th>
                      <th className="px-6 py-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {biodatas.filter(b => b.is_finalized).length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium">
                          <span className="material-symbols-outlined text-4xl mb-2 opacity-50">health_and_safety</span>
                          <p>Belum ada pendaftar yang memfinalisasi data.</p>
                        </td>
                      </tr>
                    ) : (
                      biodatas
                        .filter(b => {
                          if (!b.is_finalized) return false;
                          
                          const programStudi = b.registration?.program_studi || '';
                          const pilihanLower = programStudi.toLowerCase();
                          
                          const isS1Kesmas = pilihanLower.includes('s1') && (pilihanLower.includes('kesmas') || pilihanLower.includes('kesehatan masyarakat') || pilihanLower.includes('ikm'));
                          const isS1Bidan = pilihanLower.includes('s1') && (pilihanLower.includes('bidan') || pilihanLower.includes('kebidanan'));
                          const isS1Keperawatan = pilihanLower.includes('s1') && (pilihanLower.includes('keperawatan') || pilihanLower.includes('kperwatan') || pilihanLower.includes('kpr'));
                          const isD3Rmik = pilihanLower.includes('d3') && (pilihanLower.includes('rmik') || pilihanLower.includes('rekam medis') || pilihanLower.includes('perekam medis') || pilihanLower.includes('mik'));
                          const isD4Rmik = pilihanLower.includes('d4') && (pilihanLower.includes('rmik') || pilihanLower.includes('mik') || pilihanLower.includes('rekam medis') || pilihanLower.includes('perekam medis') || pilihanLower.includes('manajemen informasi kesehatan'));
                          const isProfesiNers = pilihanLower.includes('profesi') && pilihanLower.includes('ners');
                          const isProfesiBidan = pilihanLower.includes('profesi') && (pilihanLower.includes('bidan') || pilihanLower.includes('kebidanan'));
                          
                          const hasHealthTest = isS1Kesmas || isS1Bidan || isS1Keperawatan || isD3Rmik || isD4Rmik || isProfesiNers || isProfesiBidan;
                          if (!hasHealthTest) return false;

                          const name = b.registration?.name || '';
                          const examNumber = b.exam_number || '';
                          const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                              examNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                              programStudi.toLowerCase().includes(searchTerm.toLowerCase());
                          const matchesStatus = statusFilter === 'all' || b.status_kesehatan === statusFilter;
                          return matchesSearch && matchesStatus;
                        })
                        .map((b) => (
                        <tr key={b.registration_id} className="hover:bg-slate-50/20 transition-colors duration-150">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="size-9 bg-primary/10 text-primary border border-primary/20 rounded-xl flex items-center justify-center font-bold text-xs shrink-0">
                                {b.registration?.name?.charAt(0)}
                              </div>
                              <span className="font-semibold text-slate-800 whitespace-nowrap">{b.registration?.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-mono font-bold text-slate-700 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg text-xs">{b.exam_number}</span>
                          </td>
                          <td className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase whitespace-nowrap">{b.registration?.program_studi}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border shadow-sm tracking-wider whitespace-nowrap ${!b.status_kesehatan ? 'bg-slate-50 text-slate-400 border-slate-200/50' :
                                (b.status_kesehatan === 'Sehat' || b.status_kesehatan === 'Lulus') ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50' : 
                                (b.status_kesehatan === 'Menunggu') ? 'bg-amber-50 text-amber-700 border-amber-200/50' : 'bg-rose-50 text-rose-700 border-rose-200/50'
                              }`}>
                              {b.status_kesehatan ? 
                                ((b.status_kesehatan === 'Sehat' || b.status_kesehatan === 'Lulus') ? 'SEHAT' : 
                                 (b.status_kesehatan === 'Tidak Sehat' || b.status_kesehatan === 'Tidak Lulus') ? 'TIDAK SEHAT' : 
                                 b.status_kesehatan.toUpperCase()) 
                               : 'BELUM TES'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              {b.bukti_kesehatan_path && (
                                <button 
                                  onClick={() => setSelectedProof(`${API_BASE_URL}/storage/${b.bukti_kesehatan_path}`)}
                                  className="px-2.5 py-1 text-indigo-650 hover:text-indigo-700 bg-indigo-50/50 hover:bg-indigo-100/60 border border-indigo-200/50 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 active:scale-95"
                                  title="Lihat Bukti"
                                >
                                  <span className="material-symbols-outlined text-[16px]">visibility</span>
                                  <span>Bukti</span>
                                </button>
                              )}
                              {b.status_kesehatan && (
                                <button 
                                  onClick={() => {
                                    setSelectedHealthStudent(b);
                                    setStatusKesehatan(b.status_kesehatan || 'null');
                                    setTinggiBadan(b.tinggi_badan || '');
                                    setGolonganDarah(b.golongan_darah || '');
                                    setButaWarna(b.buta_warna || '');
                                    setVisus(b.visus || '');
                                    setTekananDarah(b.tekanan_darah || '');
                                    setRiwayatPenyakit(b.riwayat_penyakit || '');
                                    setKeteranganKesehatan(b.keterangan_kesehatan || '');
                                    setShowHealthModal(true);
                                  }}
                                  className="px-2.5 py-1 text-blue-650 hover:text-blue-700 bg-blue-50/50 hover:bg-blue-100/60 border border-blue-200/50 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 active:scale-95"
                                >
                                  <span className="material-symbols-outlined text-[16px]">medical_information</span>
                                  <span>Verifikasi</span>
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
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                      <th className="px-6 py-4">Nama Pendaftar</th>
                      <th className="px-6 py-4">Nomor Ujian</th>
                      <th className="px-6 py-4">Program Studi</th>
                      <th className="px-6 py-4">Bukti Registrasi</th>
                      <th className="px-6 py-4">Status Registrasi</th>
                      <th className="px-6 py-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {biodatas.filter(b => b.status_registrasi).length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-medium">
                          <span className="material-symbols-outlined text-4xl mb-2 opacity-50">app_registration</span>
                          <p>Belum ada data registrasi ulang.</p>
                        </td>
                      </tr>
                    ) : (
                      biodatas
                        .filter(b => {
                          if (!b.status_registrasi) return false;
                          const name = b.registration?.name || '';
                          const examNumber = b.exam_number || '';
                          const programStudi = b.registration?.program_studi || '';
                          const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                              examNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                              programStudi.toLowerCase().includes(searchTerm.toLowerCase());
                          const matchesStatus = statusFilter === 'all' || b.status_registrasi === statusFilter;
                          return matchesSearch && matchesStatus;
                        })
                        .map((b) => (
                        <tr key={b.registration_id} className="hover:bg-slate-50/20 transition-colors duration-150">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="size-9 bg-primary/10 text-primary border border-primary/20 rounded-xl flex items-center justify-center font-bold text-xs shrink-0">
                                {b.registration?.name?.charAt(0)}
                              </div>
                              <span className="font-semibold text-slate-800 whitespace-nowrap">{b.registration?.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-mono font-bold text-slate-700 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg text-xs">{b.exam_number}</span>
                          </td>
                          <td className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase whitespace-nowrap">{b.registration?.program_studi}</td>
                          <td className="px-6 py-4">
                            {b.bukti_registrasi_path ? (
                              <button 
                                onClick={() => setSelectedProof(`${API_BASE_URL}/storage/${b.bukti_registrasi_path}`)}
                                className="px-2.5 py-1 text-blue-650 hover:text-blue-700 bg-blue-50/50 hover:bg-blue-100/60 border border-blue-200/50 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 active:scale-95 inline-flex"
                              >
                                <span className="material-symbols-outlined text-[16px]">visibility</span>
                                <span>Bukti</span>
                              </button>
                            ) : (
                              <span className="text-xs text-slate-400 italic font-medium">Belum Unggah</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm whitespace-nowrap ${
                              b.status_registrasi === 'Sudah Registrasi' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50' : 
                              b.status_registrasi === 'Menunggu Verifikasi' ? 'bg-amber-50 text-amber-700 border-amber-200/50' : 'bg-rose-50 text-rose-700 border-rose-200/50'
                            }`}>
                              {b.status_registrasi}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              {b.status_registrasi === 'Menunggu Verifikasi' && (
                                <>
                                  <button 
                                    onClick={() => handleVerifyRegistrasi(b.id, 'Sudah Registrasi')}
                                    disabled={isLoading}
                                    className="px-2.5 py-1 text-emerald-600 hover:text-emerald-700 bg-emerald-50/50 hover:bg-emerald-100/60 border border-emerald-200/50 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
                                    title="Verifikasi ACC"
                                  >
                                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                                    <span>ACC</span>
                                  </button>
                                  <button 
                                    onClick={() => handleVerifyRegistrasi(b.id, 'Ditolak')}
                                    disabled={isLoading}
                                    className="px-2.5 py-1 text-rose-600 hover:text-rose-700 bg-rose-50/50 hover:bg-rose-100/60 border border-rose-200/50 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
                                    title="Tolak"
                                  >
                                    <span className="material-symbols-outlined text-[16px]">cancel</span>
                                    <span>Tolak</span>
                                  </button>
                                </>
                              )}
                              {b.status_registrasi !== 'Menunggu Verifikasi' && (
                                 <span className="bg-slate-50 text-slate-450 border border-slate-200/60 px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm uppercase tracking-wider">Terverifikasi</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Student Detail Modal */}
      {selectedBiodata && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedBiodata(null)}></div>
          
          <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col z-10 animate-in zoom-in-95 duration-200 max-h-[85vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 shrink-0">
              <div className="flex items-center gap-3">
                <div className="size-10 bg-primary text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-sm">
                  {selectedBiodata.registration?.name?.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base uppercase leading-tight">{selectedBiodata.registration?.name}</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Detail Data Calon Mahasiswa</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedBiodata(null)} 
                className="size-8 bg-slate-200/60 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Modal Tab Switcher */}
            <div className="px-6 py-2 border-b border-slate-100 flex gap-4 bg-slate-50/30 overflow-x-auto shrink-0">
              {[
                { id: 'profile', label: 'Profil & Sekolah', icon: 'person' },
                { id: 'parent', label: 'Data Orang Tua', icon: 'family_history' },
                { id: 'document', label: 'Dokumen Persyaratan', icon: 'folder_open' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setModalTab(t.id as any)}
                  className={`flex items-center gap-1.5 py-2 px-3 border-b-2 font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                    modalTab === t.id 
                      ? 'border-primary text-primary' 
                      : 'border-transparent text-slate-400 hover:text-slate-650'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-white">
              {modalTab === 'profile' && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Photo Column */}
                  <div className="md:col-span-1 flex flex-col items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block self-start">Pas Foto</span>
                    <div className="w-full aspect-[3/4] max-w-[150px] bg-slate-55 rounded-xl overflow-hidden border border-slate-200 shadow-inner flex items-center justify-center">
                      {selectedBiodata.pas_photo_path ? (
                        <img src={`${API_BASE_URL}/storage/${selectedBiodata.pas_photo_path}`} className="w-full h-full object-cover" alt="Foto" />
                      ) : (
                        <span className="material-symbols-outlined text-4xl text-slate-350">person</span>
                      )}
                    </div>
                  </div>

                  {/* Details Column */}
                  <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                    <div className="space-y-4">
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Program Studi Pilihan</p>
                        <p className="text-sm font-semibold text-slate-700">{selectedBiodata.registration?.program_studi || '-'}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">NISN</p>
                        <p className="text-sm font-semibold text-slate-700">{selectedBiodata.nisn || '-'}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Tempat, Tanggal Lahir</p>
                        <p className="text-sm font-semibold text-slate-700">{[selectedBiodata.tempat_lahir, selectedBiodata.tanggal_lahir].filter(Boolean).join(', ') || '-'}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Jenis Kelamin</p>
                        <p className="text-sm font-semibold text-slate-700">{selectedBiodata.jenis_kelamin || '-'}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Agama</p>
                        <p className="text-sm font-semibold text-slate-700">{selectedBiodata.agama || '-'}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">No. Kontak / HP</p>
                        <p className="text-sm font-semibold text-slate-700">{selectedBiodata.no_hp || selectedBiodata.no_telp || '-'}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Alamat Lengkap</p>
                        <p className="text-xs font-semibold text-slate-750">{[selectedBiodata.alamat, selectedBiodata.kabupaten, selectedBiodata.provinsi].filter(Boolean).join(', ') || '-'}</p>
                      </div>
                    </div>

                    <div className="space-y-4 border-t sm:border-t-0 sm:border-l sm:pl-6 border-slate-100">
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Asal Sekolah</p>
                        <p className="text-sm font-semibold text-slate-700">{selectedBiodata.nama_sekolah || '-'}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Jurusan Sekolah</p>
                        <p className="text-sm font-semibold text-slate-700">{selectedBiodata.jurusan || '-'}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Tahun Lulus / Tamat</p>
                        <p className="text-sm font-semibold text-slate-700">{selectedBiodata.tahun_tamat || '-'}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Rata-rata Nilai</p>
                        <p className="text-sm font-semibold text-slate-700">{selectedBiodata.nilai || '-'}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Alamat Sekolah</p>
                        <p className="text-xs font-semibold text-slate-750">{[selectedBiodata.alamat_sekolah, selectedBiodata.kabupaten_sekolah, selectedBiodata.provinsi_sekolah].filter(Boolean).join(', ') || '-'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {modalTab === 'parent' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl">
                      <h4 className="text-xs font-bold text-slate-800 mb-3 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-slate-500">man</span>
                        <span>Data Ayah Kandung</span>
                      </h4>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[8px] font-bold text-slate-450 uppercase">Nama Ayah</p>
                          <p className="text-sm font-semibold text-slate-700">{selectedBiodata.nama_ayah || '-'}</p>
                        </div>
                        <div>
                          <p className="text-[8px] font-bold text-slate-450 uppercase">Pekerjaan</p>
                          <p className="text-xs font-semibold text-slate-600">{selectedBiodata.pekerjaan_ayah || '-'}</p>
                        </div>
                        <div>
                          <p className="text-[8px] font-bold text-slate-450 uppercase">No. Telepon / HP</p>
                          <p className="text-xs font-semibold text-primary">{selectedBiodata.no_hp_ayah || '-'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl">
                      <h4 className="text-xs font-bold text-slate-800 mb-3 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-slate-500">woman</span>
                        <span>Data Ibu Kandung</span>
                      </h4>
                      <div className="space-y-2">
                        <div>
                          <p className="text-[8px] font-bold text-slate-450 uppercase">Nama Ibu</p>
                          <p className="text-sm font-semibold text-slate-700">{selectedBiodata.nama_ibu || '-'}</p>
                        </div>
                        <div>
                          <p className="text-[8px] font-bold text-slate-450 uppercase">Pekerjaan</p>
                          <p className="text-xs font-semibold text-slate-600">{selectedBiodata.pekerjaan_ibu || '-'}</p>
                        </div>
                        <div>
                          <p className="text-[8px] font-bold text-slate-450 uppercase">No. Telepon / HP</p>
                          <p className="text-xs font-semibold text-primary">{selectedBiodata.no_hp_ibu || '-'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl">
                    <p className="text-[8px] font-bold text-slate-450 uppercase mb-1">Alamat Orang Tua</p>
                    <p className="text-xs font-semibold text-slate-700 leading-relaxed">
                      {[selectedBiodata.alamat_orang_tua, selectedBiodata.kabupaten_orang_tua, selectedBiodata.provinsi_orang_tua].filter(Boolean).join(', ') || '-'}
                    </p>
                  </div>
                </div>
              )}

              {modalTab === 'document' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: 'KTP / KK', path: selectedBiodata.ktp_path },
                    { label: 'Ijazah', path: selectedBiodata.ijazah_path },
                    { label: 'Transkrip Nilai', path: selectedBiodata.transkrip_path },
                  ].map(doc => (
                    <div key={doc.label} className="p-4 border border-slate-200/80 rounded-xl bg-slate-50/50 flex flex-col items-center gap-3">
                       <span className="material-symbols-outlined text-3xl text-slate-350">description</span>
                       <div className="text-center w-full">
                          <p className="text-xs font-semibold text-slate-700 uppercase">{doc.label}</p>
                          {doc.path ? (
                            <button 
                              onClick={() => setSelectedProof(`${API_BASE_URL}/storage/${doc.path}`)}
                              className="text-[10px] font-bold text-primary hover:underline uppercase mt-2.5 inline-flex items-center gap-0.5 justify-center w-full cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[12px]">visibility</span>
                              <span>Lihat Berkas</span>
                            </button>
                          ) : (
                            <p className="text-[10px] font-bold text-rose-500 uppercase mt-2.5">Belum Unggah</p>
                          )}
                       </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex flex-wrap items-center justify-between gap-4 shrink-0">
               <div className="flex gap-2">
                  <button 
                    onClick={() => handleResetPassword(selectedBiodata.registration_id)}
                    className="px-3.5 py-2 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200/80 font-bold text-[10px] rounded-xl transition-all uppercase tracking-wider flex items-center gap-1.5 active:scale-95 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px]">lock_reset</span>
                    <span>Reset Pass</span>
                  </button>
                  {(selectedBiodata.is_finalized === true || selectedBiodata.is_finalized === 1 || selectedBiodata.is_finalized === "1") && (
                    <button 
                      onClick={() => handleRejectBiodata(selectedBiodata.id)}
                      className="px-3.5 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-250/80 font-bold text-[10px] rounded-xl transition-all uppercase tracking-wider flex items-center gap-1.5 active:scale-95 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[14px]">cancel</span>
                      <span>Tolak Berkas</span>
                    </button>
                  )}
               </div>

               <div className="flex gap-2">
                  <button 
                    onClick={() => setSelectedBiodata(null)}
                    className="px-5 py-2 bg-white border border-slate-200 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-50 transition-all uppercase tracking-wider cursor-pointer"
                  >
                    Tutup
                  </button>
                  {(selectedBiodata.is_finalized === true || selectedBiodata.is_finalized === 1 || selectedBiodata.is_finalized === "1") && (
                    <button className="px-5 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/10 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span>
                      <span>Sudah Final</span>
                    </button>
                  )}
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Health Verification Modal */}
      {showHealthModal && selectedHealthStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowHealthModal(false)}></div>
          
          <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col z-10 animate-in zoom-in-95 duration-200 max-h-[85vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 shrink-0">
              <div className="flex items-center gap-3">
                <div className="size-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">health_and_safety</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm uppercase tracking-tight">Detail Hasil Kesehatan</h3>
                  <p className="text-[10px] font-bold text-slate-450 uppercase tracking-wider mt-0.5">{selectedHealthStudent.registration?.name} <span className="mx-1 text-slate-300">|</span> {selectedHealthStudent.exam_number}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowHealthModal(false)} 
                className="size-8 bg-slate-200/60 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Info Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-4 w-1 bg-primary rounded-full"></div>
                    <h4 className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">Hasil Pemeriksaan</h4>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: 'straighten', label: 'Tinggi Badan', value: `${tinggiBadan || '-'} cm`, color: 'text-blue-600 bg-blue-50/50 border-blue-100/50' },
                      { icon: 'bloodtype', label: 'Gol. Darah', value: golonganDarah || '-', color: 'text-rose-600 bg-rose-50/50 border-rose-100/50' },
                      { icon: 'visibility', label: 'Tes Warna', value: butaWarna || '-', color: 'text-amber-600 bg-amber-50/50 border-amber-100/50' },
                      { icon: 'eye_tracking', label: 'Visus Mata', value: visus || '-', color: 'text-indigo-600 bg-indigo-50/50 border-indigo-100/50' },
                      { icon: 'monitor_heart', label: 'Tekanan Darah', value: `${tekananDarah || '-'} mm/Hg`, color: 'text-emerald-600 bg-emerald-50/50 border-emerald-100/50' }
                    ].map((item, idx) => (
                      <div key={idx} className={`p-3 rounded-xl border flex flex-col gap-0.5 ${item.color}`}>
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="material-symbols-outlined text-[14px] opacity-70">{item.icon}</span>
                          <span className="text-[8px] font-bold uppercase tracking-wider opacity-85">{item.label}</span>
                        </div>
                        <span className="text-xs font-bold">{item.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-rose-50/30 rounded-xl border border-rose-100 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px] text-rose-500">history_edu</span>
                      <span className="text-[8px] font-bold text-rose-600 uppercase tracking-wider">Riwayat Penyakit</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-600 italic">
                      {riwayatPenyakit || 'Tidak ada riwayat penyakit yang dilaporkan.'}
                    </p>
                  </div>
                </div>

                {/* Verification Section */}
                <div className="space-y-4 border-t md:border-t-0 md:border-l md:pl-6 border-slate-100">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-4 w-1 bg-primary rounded-full"></div>
                    <h4 className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">Verifikasi</h4>
                  </div>

                  <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-5 space-y-4">
                    <div>
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Pilih Status Final</label>
                      <div className="grid grid-cols-2 gap-2">
                        {['Sehat', 'Tidak Sehat'].map(opt => (
                          <button
                            key={opt}
                            onClick={() => setStatusKesehatan(opt)}
                            className={`py-2.5 px-3 rounded-xl border-2 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                              statusKesehatan === opt 
                                ? opt === 'Sehat' 
                                  ? 'bg-emerald-50 border-emerald-500 text-emerald-700' 
                                  : 'bg-rose-50 border-rose-500 text-rose-700'
                                : 'bg-white border-slate-200 text-slate-400 hover:border-slate-350'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2">
                      <button 
                        onClick={handleUpdateStatusKesehatan}
                        disabled={isLoading || !statusKesehatan || statusKesehatan === 'null'}
                        className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                          isLoading || !statusKesehatan || statusKesehatan === 'null'
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' 
                            : 'bg-primary text-white hover:bg-navy hover:-translate-y-0.5 active:scale-95 shadow-primary/10'
                        }`}
                      >
                        {isLoading ? 'Sedang Memproses...' : (
                          <>
                            <span className="material-symbols-outlined text-[16px]">save</span>
                            <span>Simpan Verifikasi</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Proof Modal */}
      {selectedProof && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedProof(null)}></div>
          
          <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-xl overflow-hidden flex flex-col z-[210] animate-in zoom-in-95 duration-200">
            <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-sm text-slate-800">Pratinjau Dokumen</h3>
              <button 
                onClick={() => setSelectedProof(null)} 
                className="size-8 bg-slate-200/60 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[70vh] flex items-center justify-center bg-slate-100/50">
              {selectedProof.endsWith('.pdf') ? (
                <iframe src={selectedProof} className="w-full h-[550px] border-0 rounded-lg bg-white" title="PDF Viewer" />
              ) : (
                <img src={selectedProof} alt="Bukti" className="max-w-full max-h-[65vh] rounded-lg object-contain bg-white shadow-sm border border-slate-200" />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 max-w-xs w-full shadow-xl animate-in zoom-in-95 duration-200 text-center">
            <div className="size-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-[24px]">logout</span>
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1.5 uppercase tracking-wide">Konfirmasi Keluar</h3>
            <p className="text-slate-450 text-xs font-semibold mb-6">Apakah Anda yakin ingin mengakhiri sesi administrasi ini?</p>
            <div className="flex gap-2.5">
              <button 
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200/80 text-slate-600 font-bold text-xs rounded-xl transition-all uppercase tracking-wider cursor-pointer"
              >
                Batal
              </button>
              <button 
                onClick={onLogout}
                className="flex-1 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-all uppercase tracking-wider shadow-md shadow-rose-650/10 cursor-pointer"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
