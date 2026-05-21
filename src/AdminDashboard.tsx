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
        const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            examNumber.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || b.status_kesehatan === statusFilter;
        return matchesSearch && matchesStatus;
      });

      if (filtered.length === 0) {
        alert("Tidak ada data kesehatan untuk dieksport.");
        return;
      }

      const headers = [
        "Nama Pendaftar", "Nomor Ujian", "Tinggi Badan", "Gol. Darah", 
        "Tes Warna", "Visus Mata", "Tekanan Darah", "Riwayat Penyakit", "Status Kesehatan"
      ];
      const rows = filtered.map(b => [
        b.registration?.name || '-',
        b.exam_number || '-',
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
        const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            examNumber.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || b.status_registrasi === statusFilter;
        return matchesSearch && matchesStatus;
      });

      if (filtered.length === 0) {
        alert("Tidak ada data registrasi ulang untuk dieksport.");
        return;
      }

      const headers = ["Nama Pendaftar", "Nomor Ujian", "Status Registrasi"];
      const rows = filtered.map(b => [
        b.registration?.name || '-',
        b.exam_number || '-',
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
        return <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold shadow-sm uppercase tracking-wider">Lunas</span>;
      case 'rejected':
        return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold shadow-sm uppercase tracking-wider">Ditolak</span>;
      default:
        return <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold shadow-sm uppercase tracking-wider">Menunggu</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfdfe] font-sans relative overflow-hidden">
      
      {/* Background blobs for premium glassmorphism vibe */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] -translate-x-1/3 -translate-y-1/3 animate-pulse duration-5000"></div>
        <div className="absolute top-[20%] right-0 w-[700px] h-[700px] rounded-full bg-emerald-500/5 blur-[140px] translate-x-1/4"></div>
        <div className="absolute bottom-[10%] left-[15%] w-[500px] h-[500px] rounded-full bg-indigo-500/3 blur-[110px]"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-lg shadow-slate-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex items-center gap-3">
              <div className="size-11 bg-primary/20 rounded-2xl flex items-center justify-center text-primary border border-primary/20 shadow-inner">
                <span className="material-symbols-outlined shrink-0 text-[26px]">admin_panel_settings</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-extrabold text-white text-sm sm:text-base leading-none tracking-tight">{user?.name || 'Admin Portal'}</h1>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-md text-[8px] font-black uppercase tracking-widest leading-none">
                    Utama
                  </span>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{user?.email || 'SPMB UHTP'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={handleExportExcel}
                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-emerald-600/10 flex items-center justify-center hover:shadow-lg cursor-pointer"
                title="Download Excel"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
                <span className="hidden sm:inline">Export Excel</span>
              </button>

              <button 
                onClick={handleRefresh}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white active:scale-95 font-bold text-xs uppercase tracking-wider rounded-xl transition-all border border-slate-700 shadow-sm flex items-center justify-center cursor-pointer"
                title="Refresh Data"
              >
                <span className="material-symbols-outlined text-[18px]">refresh</span>
                <span className="hidden sm:inline">Refresh</span>
              </button>

              <button 
                onClick={() => setShowLogoutModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-850 text-rose-400 hover:bg-rose-950/30 hover:text-rose-300 hover:border-rose-900/50 active:scale-95 font-bold text-xs uppercase tracking-wider rounded-xl transition-all border border-slate-800 shadow-sm flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 tracking-tight leading-none">
              Dashboard Admin
            </h2>
            <p className="text-sm font-medium text-slate-400 mt-2">Manajemen pendaftaran dan verifikasi SPMB UHTP.</p>
          </div>
          
          {/* Tab Switcher */}
          <div className="flex flex-wrap bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80 shadow-inner">
            <button 
              onClick={() => { setActiveTab('payments'); setStatusFilter('all'); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all duration-300 ${activeTab === 'payments' ? 'bg-white text-primary shadow-md shadow-slate-200' : 'text-slate-500 hover:text-slate-850 hover:bg-slate-50'}`}
            >
              <span className="material-symbols-outlined text-[18px]">payments</span>
              Pembayaran
            </button>
            <button 
              onClick={() => { setActiveTab('students'); setStatusFilter('all'); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all duration-300 ${activeTab === 'students' ? 'bg-white text-primary shadow-md shadow-slate-200' : 'text-slate-500 hover:text-slate-850 hover:bg-slate-50'}`}
            >
              <span className="material-symbols-outlined text-[18px]">group</span>
              Pendaftar
            </button>
            <button 
              onClick={() => { setActiveTab('health'); setStatusFilter('all'); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all duration-300 ${activeTab === 'health' ? 'bg-white text-primary shadow-md shadow-slate-200' : 'text-slate-500 hover:text-slate-850 hover:bg-slate-50'}`}
            >
              <span className="material-symbols-outlined text-[18px]">health_and_safety</span>
              Kesehatan
            </button>
            <button 
              onClick={() => { setActiveTab('registration'); setStatusFilter('all'); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all duration-300 ${activeTab === 'registration' ? 'bg-white text-primary shadow-md shadow-slate-200' : 'text-slate-500 hover:text-slate-850 hover:bg-slate-50'}`}
            >
              <span className="material-symbols-outlined text-[18px]">app_registration</span>
              Registrasi
            </button>
          </div>
        </div>
        
        {/* Statistics Bento Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-10">
          {[
            { id: 'all', label: 'Total Pendaftar', val: stats.totalRegistered, icon: 'group', color: 'bg-blue-600 shadow-blue-500/20', tab: 'students' },
            { id: 'finalized', label: 'Sudah Finalisasi', val: stats.totalFinalized, icon: 'verified', color: 'bg-emerald-600 shadow-emerald-500/20', tab: 'students' },
            { id: 'draft', label: 'Belum Finalisasi', val: stats.totalDraft, icon: 'edit_document', color: 'bg-rose-600 shadow-rose-500/20', tab: 'students' },
            { id: 'pending', label: 'Menunggu Bayar', val: stats.totalPaymentsPending, icon: 'pending_actions', color: 'bg-amber-600 shadow-amber-500/20', tab: 'payments' },
            { id: 'verified', label: 'Bayar Terverifikasi', val: stats.totalPaymentsVerified, icon: 'payments', color: 'bg-indigo-600 shadow-indigo-500/20', tab: 'payments' }
          ].map((s) => (
            <button 
              key={s.id} 
              onClick={() => {
                setStatusFilter(s.id as any);
                setActiveTab(s.tab as any);
              }}
              className={`bg-white/80 backdrop-blur-md p-6 rounded-[28px] border transition-all duration-500 flex items-center gap-4 text-left group hover:-translate-y-1.5 hover:bg-white cursor-pointer ${
                statusFilter === s.id 
                  ? 'border-primary ring-4 ring-primary/5 shadow-xl shadow-primary/5' 
                  : 'border-slate-200/60 shadow-sm hover:border-primary/30 hover:shadow-xl hover:shadow-slate-200/40'
              }`}
            >
              <div className={`size-12 ${s.color} text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-500 shrink-0`}>
                <span className="material-symbols-outlined text-2.5xl">{s.icon}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate mb-0.5">{s.label}</p>
                <p className="text-2xl font-black text-slate-800 leading-none tracking-tight">{s.val}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Search & Active Filter Badge */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Filter Aktif:</span>
            <span className="px-3.5 py-1.5 bg-slate-100 border border-slate-200 text-slate-700 rounded-full text-xs font-black uppercase tracking-wider shadow-sm flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-primary animate-pulse"></span>
              {statusFilter === 'all' ? 'Semua Data' : statusFilter === 'finalized' ? 'Finalisasi' : statusFilter === 'draft' ? 'Draft' : statusFilter === 'pending' ? 'Menunggu Bayar' : 'Lunas Terverifikasi'}
            </span>
          </div>
          <div className="relative w-full sm:max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-slate-400 text-[20px]">search</span>
            </div>
            <input 
              type="text" 
              placeholder={`Cari nama, prodi, atau nomor...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/90 backdrop-blur-sm border border-slate-200 rounded-2xl py-3 pl-11 pr-4 text-xs font-semibold focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all shadow-sm hover:border-slate-300"
            />
          </div>
        </div>

        {activeTab === 'payments' ? (
          <div className="bg-white/95 backdrop-blur-md rounded-[32px] shadow-xl shadow-slate-900/5 border border-slate-200/60 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-widest font-bold">
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
                      <tr key={p.id} className="hover:bg-slate-50/40 transition-all duration-300">
                        <td className="px-6 py-4.5 font-semibold text-slate-500 text-xs">{p.tanggal_bayar}</td>
                        <td className="px-6 py-4.5">
                          <span className="px-2.5 py-1 bg-primary/5 text-primary border border-primary/10 rounded-lg font-mono font-bold text-xs">
                            {p.kode_pembayaran}
                          </span>
                        </td>
                        <td className="px-6 py-4.5 font-extrabold text-slate-800 uppercase tracking-tight">{p.nama_penyetor}</td>
                        <td className="px-6 py-4.5 font-black text-slate-700 text-right">Rp {p.jumlah_bayar}</td>
                        <td className="px-6 py-4">{getStatusBadge(p.status)}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={() => setSelectedProof(`${API_BASE_URL}/storage/${p.bukti_path}`)}
                              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-100 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 hover:scale-105"
                              title="Lihat Bukti"
                            >
                              <span className="material-symbols-outlined text-[16px]">visibility</span>
                              <span>Bukti</span>
                            </button>
                            {p.status === 'pending' && (
                              <>
                                <button 
                                  onClick={() => handleUpdateStatus(p.id, 'verified')}
                                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-100 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 hover:scale-105"
                                  title="Verifikasi Lunas"
                                >
                                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                                  <span>Lunas</span>
                                </button>
                                <button 
                                  onClick={() => handleUpdateStatus(p.id, 'rejected')}
                                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 hover:scale-105"
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
          <div className="bg-white/95 backdrop-blur-md rounded-[32px] shadow-xl shadow-slate-900/5 border border-slate-200/60 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-[11px] uppercase tracking-wider font-extrabold">
                    <th className="px-6 py-5">Nama Pendaftar</th>
                    <th className="px-6 py-5">Nomor Ujian</th>
                    <th className="px-6 py-5">Program Studi</th>
                    <th className="px-6 py-5">Status</th>
                    <th className="px-6 py-5 text-center">Aksi</th>
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
                        const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                            examNumber.toLowerCase().includes(searchTerm.toLowerCase());
                        
                        const isFinalized = (b.is_finalized === true || b.is_finalized === 1 || b.is_finalized === "1");
                        const matchesStatus = statusFilter === 'all' || 
                                            (statusFilter === 'finalized' && isFinalized) ||
                                            (statusFilter === 'draft' && !isFinalized);
                        
                        return matchesSearch && matchesStatus;
                      })
                      .map((b) => (
                      <tr key={b.registration_id} className="hover:bg-slate-50/40 transition-all duration-300">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="size-11 bg-primary/5 text-primary rounded-2xl flex items-center justify-center font-black text-sm shrink-0 uppercase border border-primary/10 shadow-sm">
                              {b.registration?.name?.charAt(0)}
                            </div>
                            <span className="font-extrabold text-slate-800 uppercase whitespace-nowrap tracking-tight">{b.registration?.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          {(b.is_finalized === true || b.is_finalized === 1 || b.is_finalized === "1") ? (
                            <span className="font-mono font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 shadow-sm">{b.exam_number}</span>
                          ) : (
                            <span className="bg-slate-100 text-slate-400 border border-slate-200/50 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">Draft / Belum Final</span>
                          )}
                        </td>
                        <td className="px-6 py-5 font-bold text-slate-500 text-xs whitespace-nowrap uppercase tracking-tight">{b.registration?.program_studi}</td>
                        <td className="px-6 py-5">
                          {(b.is_finalized === true || b.is_finalized === 1 || b.is_finalized === "1") ? (
                            <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm">Final</span>
                          ) : (
                            <span className="bg-amber-50 text-amber-700 border border-amber-200 px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm">Draft</span>
                          )}
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center justify-center">
                            <button 
                              onClick={() => setSelectedBiodata(b)}
                              className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 rounded-xl transition-all hover:scale-105 flex items-center gap-2 text-xs font-black uppercase tracking-wider shadow-sm"
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
          <div className="bg-white/95 backdrop-blur-md rounded-[32px] shadow-xl shadow-slate-900/5 border border-slate-200/60 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-[11px] uppercase tracking-wider font-extrabold">
                    <th className="px-6 py-5">Nama Pendaftar</th>
                    <th className="px-6 py-5">Nomor Ujian</th>
                    <th className="px-6 py-5">Status Kesehatan</th>
                    <th className="px-6 py-5 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {biodatas.filter(b => b.is_finalized).length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-medium">
                        <span className="material-symbols-outlined text-4xl mb-2 opacity-50">health_and_safety</span>
                        <p>Belum ada pendaftar yang memfinalisasi data.</p>
                      </td>
                    </tr>
                  ) : (
                    biodatas
                      .filter(b => {
                        if (!b.is_finalized) return false;
                        const name = b.registration?.name || '';
                        const examNumber = b.exam_number || '';
                        const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                            examNumber.toLowerCase().includes(searchTerm.toLowerCase());
                        const matchesStatus = statusFilter === 'all' || b.status_kesehatan === statusFilter;
                        return matchesSearch && matchesStatus;
                      })
                      .map((b) => (
                      <tr key={b.registration_id} className="hover:bg-slate-50/40 transition-all duration-300">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="size-11 bg-primary/5 text-primary rounded-2xl flex items-center justify-center font-black text-sm shrink-0 uppercase border border-primary/10 shadow-sm">
                              {b.registration?.name?.charAt(0)}
                            </div>
                            <span className="font-extrabold text-slate-800 uppercase whitespace-nowrap tracking-tight">{b.registration?.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <span className="font-mono font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 shadow-sm">{b.exam_number}</span>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`px-3.5 py-1.5 rounded-full text-[10px] font-black border shadow-sm tracking-wider ${!b.status_kesehatan ? 'bg-slate-50 text-slate-400 border-slate-200' :
                              (b.status_kesehatan === 'Sehat' || b.status_kesehatan === 'Lulus') ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                              (b.status_kesehatan === 'Menunggu') ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-rose-50 text-rose-700 border-rose-200'
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
                                className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-100 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 hover:scale-105"
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
                                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-100 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 hover:scale-105"
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
          <div className="bg-white/95 backdrop-blur-md rounded-[32px] shadow-xl shadow-slate-900/5 border border-slate-200/60 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-[11px] uppercase tracking-wider font-extrabold">
                    <th className="px-6 py-5">Nama Pendaftar</th>
                    <th className="px-6 py-5">Nomor Ujian</th>
                    <th className="px-6 py-5">Bukti Registrasi</th>
                    <th className="px-6 py-5">Status Registrasi</th>
                    <th className="px-6 py-5 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {biodatas.filter(b => b.status_registrasi).length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium">
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
                        const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                            examNumber.toLowerCase().includes(searchTerm.toLowerCase());
                        const matchesStatus = statusFilter === 'all' || b.status_registrasi === statusFilter;
                        return matchesSearch && matchesStatus;
                      })
                      .map((b) => (
                      <tr key={b.registration_id} className="hover:bg-slate-50/40 transition-all duration-300">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="size-11 bg-primary/5 text-primary rounded-2xl flex items-center justify-center font-black text-sm shrink-0 uppercase border border-primary/10 shadow-sm">
                              {b.registration?.name?.charAt(0)}
                            </div>
                            <span className="font-extrabold text-slate-800 uppercase whitespace-nowrap tracking-tight">{b.registration?.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <span className="font-mono font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 shadow-sm">{b.exam_number}</span>
                        </td>
                        <td className="px-6 py-4">
                          {b.bukti_registrasi_path ? (
                            <button 
                              onClick={() => setSelectedProof(`${API_BASE_URL}/storage/${b.bukti_registrasi_path}`)}
                              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-100 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 hover:scale-105 inline-flex"
                            >
                              <span className="material-symbols-outlined text-[16px]">visibility</span>
                              <span>Bukti</span>
                            </button>
                          ) : (
                            <span className="text-xs text-slate-400 italic font-medium">Belum Upload</span>
                          )}
                        </td>
                        <td className="px-6 py-5">
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border ${
                            b.status_registrasi === 'Sudah Registrasi' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                            b.status_registrasi === 'Menunggu Verifikasi' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-rose-50 text-rose-700 border-rose-200'
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
                                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-100 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 hover:scale-105 disabled:opacity-50"
                                  title="Verifikasi ACC"
                                >
                                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                                  <span>ACC</span>
                                </button>
                                <button 
                                  onClick={() => handleVerifyRegistrasi(b.id, 'Ditolak')}
                                  disabled={isLoading}
                                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 hover:scale-105 disabled:opacity-50"
                                  title="Tolak"
                                >
                                  <span className="material-symbols-outlined text-[16px]">cancel</span>
                                  <span>Tolak</span>
                                </button>
                              </>
                            )}
                            {b.status_registrasi !== 'Menunggu Verifikasi' && (
                               <span className="bg-slate-50 text-slate-400 border border-slate-200/60 px-3 py-1 rounded-full text-xs font-bold shadow-sm uppercase tracking-wider">Terverifikasi</span>
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

      {/* Student Detail Modal */}
      {selectedBiodata && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-300">
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setSelectedBiodata(null)}></div>
          
          <div className="relative w-full max-w-4xl bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col z-10 animate-in zoom-in-95 duration-200 max-h-[90vh]">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center gap-4">
                <div className="size-12 bg-primary text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg shadow-primary/20">
                  {selectedBiodata.registration?.name?.charAt(0)}
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 text-lg uppercase leading-tight">{selectedBiodata.registration?.name}</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Detail Data Calon Mahasiswa</p>
                </div>
              </div>
              <button onClick={() => setSelectedBiodata(null)} className="size-10 bg-slate-200 text-slate-600 rounded-2xl hover:bg-slate-300 transition-colors flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-8 overflow-y-auto space-y-10 custom-scrollbar">
              
              {/* Grid 3 Columns for main info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Photo */}
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-2">Pas Foto</p>
                  <div className="aspect-[3/4] bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-inner flex items-center justify-center">
                    {selectedBiodata.pas_photo_path ? (
                      <img src={`${API_BASE_URL}/storage/${selectedBiodata.pas_photo_path}`} className="w-full h-full object-cover" alt="Foto" />
                    ) : (
                      <span className="material-symbols-outlined text-4xl text-slate-300">person</span>
                    )}
                  </div>
                </div>

                {/* Personal & School */}
                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="space-y-6">
                     <section>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-2 mb-3">Info Pribadi</p>
                        <div className="space-y-3">
                          {[
                            { label: 'NISN', val: selectedBiodata.nisn },
                            { label: 'TTL', val: `${selectedBiodata.tempat_lahir}, ${selectedBiodata.tanggal_lahir}` },
                            { label: 'Gender', val: selectedBiodata.jenis_kelamin },
                            { label: 'Agama', val: selectedBiodata.agama },
                          ].map(item => (
                            <div key={item.label} className="flex flex-col">
                              <span className="text-[9px] font-bold text-slate-400 uppercase">{item.label}</span>
                              <span className="text-sm font-bold text-slate-700">{item.val || '-'}</span>
                            </div>
                          ))}
                        </div>
                     </section>
                  </div>

                  <div className="space-y-6">
                     <section>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-2 mb-3">Asal Sekolah</p>
                        <div className="space-y-3">
                          {[
                            { label: 'Sekolah', val: selectedBiodata.nama_sekolah },
                            { label: 'Jurusan', val: selectedBiodata.jurusan },
                            { label: 'Tahun Tamat', val: selectedBiodata.tahun_tamat },
                            { label: 'Rata-rata Nilai', val: selectedBiodata.nilai },
                          ].map(item => (
                            <div key={item.label} className="flex flex-col">
                              <span className="text-[9px] font-bold text-slate-400 uppercase">{item.label}</span>
                              <span className="text-sm font-bold text-slate-700">{item.val || '-'}</span>
                            </div>
                          ))}
                        </div>
                     </section>
                  </div>
                </div>
              </div>

              {/* Parents Section */}
              <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-200 pb-2 mb-5">Data Orang Tua</p>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-xs font-black text-slate-800 mb-3 uppercase tracking-wider">Ayah Kandung</h4>
                      <div className="space-y-2">
                        <p className="text-sm text-slate-600 font-bold">{selectedBiodata.nama_ayah}</p>
                        <p className="text-xs text-slate-500 font-medium">{selectedBiodata.pekerjaan_ayah}</p>
                        <p className="text-xs text-primary font-bold">{selectedBiodata.no_hp_ayah}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-800 mb-3 uppercase tracking-wider">Ibu Kandung</h4>
                      <div className="space-y-2">
                        <p className="text-sm text-slate-600 font-bold">{selectedBiodata.nama_ibu}</p>
                        <p className="text-xs text-slate-500 font-medium">{selectedBiodata.pekerjaan_ibu}</p>
                        <p className="text-xs text-primary font-bold">{selectedBiodata.no_hp_ibu}</p>
                      </div>
                    </div>
                 </div>
              </div>

              {/* Documents Grid */}
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-2 mb-5">Dokumen Persyaratan</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: 'KTP / KK', path: selectedBiodata.ktp_path },
                    { label: 'Ijazah', path: selectedBiodata.ijazah_path },
                    { label: 'Transkrip', path: selectedBiodata.transkrip_path },
                  ].map(doc => (
                    <div key={doc.label} className="p-4 border border-slate-100 rounded-2xl bg-white shadow-sm flex flex-col items-center gap-3">
                       <span className="material-symbols-outlined text-3xl text-slate-300">description</span>
                       <div className="text-center">
                          <p className="text-[10px] font-bold text-slate-700 uppercase">{doc.label}</p>
                          {doc.path ? (
                            <button 
                              onClick={() => setSelectedProof(`${API_BASE_URL}/storage/${doc.path}`)}
                              className="text-[9px] font-black text-primary hover:underline uppercase mt-1 block"
                            >
                              Lihat Berkas
                            </button>
                          ) : (
                            <p className="text-[9px] font-bold text-rose-400 uppercase mt-1">Belum Ada</p>
                          )}
                       </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            <div className="px-8 py-6 border-t border-slate-100 bg-slate-50 flex flex-wrap items-center justify-between gap-4 shrink-0">
               <div className="flex gap-2">
                  <button 
                    onClick={() => handleResetPassword(selectedBiodata.registration_id)}
                    className="px-4 py-2.5 bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-200 font-bold text-[10px] rounded-xl transition-all uppercase tracking-wider flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">lock_reset</span>
                    Reset Pass
                  </button>
                  {(selectedBiodata.is_finalized === true || selectedBiodata.is_finalized === 1 || selectedBiodata.is_finalized === "1") && (
                    <button 
                      onClick={() => handleRejectBiodata(selectedBiodata.id)}
                      className="px-4 py-2.5 bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 font-bold text-[10px] rounded-xl transition-all uppercase tracking-wider flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">cancel</span>
                      Tolak Berkas
                    </button>
                  )}
               </div>

               <div className="flex gap-2">
                  <button 
                    onClick={() => setSelectedBiodata(null)}
                    className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-100 transition-all uppercase tracking-wider"
                  >
                    Tutup
                  </button>
                  {(selectedBiodata.is_finalized === true || selectedBiodata.is_finalized === 1 || selectedBiodata.is_finalized === "1") && (
                    <button className="px-6 py-2.5 bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 uppercase tracking-wider flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px]">check_circle</span>
                      Sudah Final
                    </button>
                  )}
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Health Verification Modal */}
      {showHealthModal && selectedHealthStudent && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-300">
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setShowHealthModal(false)}></div>
          
          <div className="relative w-full max-w-4xl bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col z-10 animate-in zoom-in-95 duration-200 max-h-[90vh]">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center gap-4">
                <div className="size-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-[28px]">health_and_safety</span>
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 text-lg uppercase tracking-tight">Detail Hasil Kesehatan</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{selectedHealthStudent.nama} <span className="mx-2 opacity-30">|</span> {selectedHealthStudent.no_ujian}</p>
                </div>
              </div>
              <button onClick={() => setShowHealthModal(false)} className="p-2 bg-white text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-all active:scale-95 shadow-sm border border-slate-200">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Info Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-5 w-1 bg-primary rounded-full"></div>
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">Informasi Pemeriksaan</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { icon: 'straighten', label: 'Tinggi Badan', value: `${tinggiBadan || '-'} cm`, color: 'blue' },
                      { icon: 'bloodtype', label: 'Gol. Darah', value: golonganDarah || '-', color: 'rose' },
                      { icon: 'visibility', label: 'Tes Warna', value: butaWarna || '-', color: 'amber' },
                      { icon: 'eye_tracking', label: 'Visus Mata', value: visus || '-', color: 'indigo' },
                      { icon: 'monitor_heart', label: 'Tekanan Darah', value: `${tekananDarah || '-'} mm/Hg`, color: 'emerald' }
                    ].map((item, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-1 transition-all hover:bg-white hover:shadow-md hover:shadow-slate-100">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`material-symbols-outlined text-[14px] text-${item.color}-500 opacity-70`}>{item.icon}</span>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">{item.label}</span>
                        </div>
                        <span className="text-sm font-bold text-slate-700">{item.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-5 bg-rose-50/50 rounded-2xl border border-rose-100/50 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-rose-500">history_edu</span>
                      <span className="text-[9px] font-black text-rose-500 uppercase tracking-wider">Riwayat Penyakit</span>
                    </div>
                    <p className="text-sm font-medium text-slate-600 italic">
                      {riwayatPenyakit || 'Tidak ada riwayat penyakit yang dilaporkan.'}
                    </p>
                  </div>
                </div>

                {/* Verification Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-5 w-1 bg-primary rounded-full"></div>
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">Keputusan Verifikator</h4>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-4">Pilih Status Kesehatan Final</label>
                      <div className="grid grid-cols-2 gap-3">
                        {['Sehat', 'Tidak Sehat'].map(opt => (
                          <button
                            key={opt}
                            onClick={() => setStatusKesehatan(opt)}
                            className={`py-4 px-4 rounded-2xl border-2 font-black text-xs uppercase tracking-widest transition-all ${
                              statusKesehatan === opt 
                                ? opt === 'Sehat' 
                                  ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-lg shadow-emerald-100' 
                                  : 'bg-rose-50 border-rose-500 text-rose-700 shadow-lg shadow-rose-100'
                                : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6">
                      <button 
                        onClick={handleUpdateStatusKesehatan}
                        disabled={isLoading || !statusKesehatan || statusKesehatan === 'null'}
                        className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl transition-all flex items-center justify-center gap-3 ${
                          isLoading || !statusKesehatan || statusKesehatan === 'null'
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' 
                            : 'bg-primary text-white hover:bg-navy hover:-translate-y-1 active:scale-95 shadow-primary/20'
                        }`}
                      >
                        {isLoading ? 'Sedang Memproses...' : (
                          <>
                            <span className="material-symbols-outlined text-[20px]">save</span>
                            Simpan Verifikasi
                          </>
                        )}
                      </button>
                      <p className="text-center text-[10px] text-slate-400 mt-4 font-bold uppercase tracking-widest">*Pastikan data sudah sesuai sebelum menyimpan</p>
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
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-300">
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setSelectedProof(null)}></div>
          
          <div className="relative w-full max-w-3xl bg-white rounded-[24px] shadow-2xl overflow-hidden flex flex-col z-[120] animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-800">Pratinjau Dokumen</h3>
              <button onClick={() => setSelectedProof(null)} className="p-2 bg-slate-200 text-slate-600 rounded-full hover:bg-slate-300 transition-colors">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[75vh] flex items-center justify-center bg-slate-100/50">
              {selectedProof.endsWith('.pdf') ? (
                <iframe src={selectedProof} className="w-full h-[600px] border-0 rounded-xl" title="PDF Viewer" />
              ) : (
                <img src={selectedProof} alt="Bukti Pembayaran" className="max-w-full max-h-[70vh] rounded-xl object-contain shadow-sm border border-slate-200" />
              )}
            </div>
          </div>
        </div>
      )}
      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[28px] p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="size-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-[32px]">logout</span>
            </div>
            <h3 className="text-xl font-black text-slate-800 text-center mb-2 uppercase tracking-tight">Konfirmasi Keluar</h3>
            <p className="text-slate-500 text-center text-sm font-medium mb-8">Apakah Anda yakin ingin mengakhiri sesi administrasi ini?</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-6 py-3 bg-slate-100 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-200 transition-all uppercase tracking-wider"
              >
                Batal
              </button>
              <button 
                onClick={onLogout}
                className="flex-1 px-6 py-3 bg-rose-600 text-white font-bold text-xs rounded-xl hover:bg-rose-700 transition-all uppercase tracking-wider shadow-lg shadow-rose-600/20"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
