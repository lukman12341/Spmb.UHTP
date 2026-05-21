 import React, { useState, useEffect } from 'react';
 
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
   const [teka


































































































   };
 
 
   const handleExportExcel = () => {
     if (payments.length === 0) {
       alert("Tidak ada data untuk dieksport.");
       return;
     }
 
     // Create CSV content
     const headers = ["Tanggal", "Kode Pembayaran", "Nama Penyetor", "Jumlah", "Status"];
     const rows = payments.map(p => [
       p.tanggal_bayar,
       p.kode_pembayaran,
       p.nama_penyetor,
       p.jumlah_bayar.replace(/\./g, ''), // Clean currency format for Excel
       p.status.toUpperCase()
     ]);
 
     const csvContent = [
       headers.join(","),
       ...rows.map(r => r.join(","))
     ].join("\n");
 
     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
     const link = document.createElement("a");
     const url = URL.createObjectURL(blob);
     link.setAttribute("href", url);
     link.setAttribute("download", `Laporan_Pembayaran_SPMB_${new Date().toLocaleDateString()}.csv`);
     link.style.visibility = 'hidden';
     document.body.appendChild(link);
     link.click();
     document.body.removeChild(link);
   };
 
   const handleRejectBiodata = async (id: number) => {
     if (!window.confirm('Apakah Anda yakin ingin menolak berkas ini? Status akan kembali ke Draft dan Nomor Ujian akan dihapus.')) return;
     
     try {
       const res = await fetch(`http://localhost:8000/api/admin/biodatas/${id}/reject`, {
         method: 'POST',















































































               <div>
                 <h1 className="font-extrabold text-white text-base leading-tight tracking-tight">{user?.name || 'Admin Portal'}</h1>
                 <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{user?.email || 'SPMB UHTP'}</p>
               </div>
             </div>
 
             <div className="flex items-center gap-3">
               <button 
                 onClick={handleExportExcel}
                 className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 font-bold text-sm rounded-lg transition-colors shadow-sm"
                 title="Download Excel"
               >
                 <span className="material-symbols-outlined text-[18px]">download</span>
                 <span className="hidden sm:inline">Export Excel</span>
               </button>
 
               <button 
                 onClick={handleRefresh}
                 className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white font-bold text-sm rounded-lg transition-colors border border-slate-700 shadow-sm"
                 title="Refresh Data"
               >
                 <span className="material-symbols-outlined text-[18px]">refresh</span>
                 <span className="hidden sm:inline">Refresh</span>
               </button>
 
               <button 
                 onClick={() => setShowLogoutModal(true)}
                 className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white font-bold text-sm rounded-lg transition-colors border border-slate-700 shadow-sm"
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
         
         <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
           <div>
             <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight leading-tight">Dashboard Admin</h2>
             <p className="text-sm text-slate-500 mt-1">Manajemen pendaftaran dan verifikasi SPMB UHTP.</p>
           </div>
           
           {/* Tab Switcher */}
           <div className="flex bg-slate-200/50 p-1 rounded-2xl border border-slate-200">
             <button 
               onClick={() => { setActiveTab('payments'); setStatusFilter('all'); }}
               className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${activeTab === 'payments' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
             >
               <span className="material-symbols-outlined text-[18px]">payments</span>
               Pembayaran
             </button>
             <button 
               onClick={() => { setActiveTab('students'); setStatusFilter('all'); }}
               className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${activeTab === 'students' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
             >
               <span className="material-symbols-outlined text-[18px]">group</span>
               Data Pendaftar
             </button>
             <button 
               onClick={() => { setActiveTab('health'); setStatusFilter('all'); }}
               className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${activeTab === 'health' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
             >
               <span className="material-symbols-outlined text-[18px]">health_and_safety</span>
               Tes Kesehatan
             </button>
             <button 
               onClick={() => { setActiveTab('registration'); setStatusFilter('all'); }}
               className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${activeTab === 'registration' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
             >
               <span className="material-symbols-outlined text-[18px]">app_registration</span>
               Registrasi Ulang
             </button>
           </div>
         </div>
         
         {/* Statistics Cards */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
           {[
             { id: 'all', label: 'Total Pendaftar', val: stats.totalRegistered, icon: 'group', color: 'bg-blue-500', tab: 'students' },
             { id: 'finalized', label: 'Sudah Finalisasi', val: stats.totalFinalized, icon: 'verified', color: 'bg-emerald-500', tab: 'students' },
             { id: 'draft', label: 'Belum Finalisasi', val: stats.totalDraft, icon: 'edit_document', color: 'bg-rose-500', tab: 'students' },
             { id: 'pending', label: 'Menunggu Bayar', val: stats.totalPaymentsPending, icon: 'pending_actions', color: 'bg-amber-500', tab: 'payments' },
             { id: 'verified', label: 'Bayar Terverifikasi', val: stats.totalPaymentsVerified, icon: 'payments', color: 'bg-indigo-500', tab: 'payments' }
           ].map((s) => (
             <button 
               key={s.id} 
               onClick={() => {
                 setStatusFilter(s.id as any);
                 setActiveTab(s.tab as any);
               }}
               className={`bg-white p-5 rounded-[24px] border transition-all flex items-center gap-3 text-left group ${statusFilter === s.id ? 'border-primary ring-2 ring-primary/10 shadow-md' : 'border-slate-200 shadow-sm hover:border-primary/30 hover:shadow-md'}`}
             >
               <div className={`size-10 ${s.color} text-white rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform shrink-0`}>
                 <span className="material-symbols-outlined text-xl">{s.icon}</span>
               </div>
               <div className="min-w-0">
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider truncate">{s.label}</p>
                 <p className="text-lg font-black text-slate-800 leading-tight">{s.val}</p>
               </div>
             </button>
           ))}
         </div>
 
         {/* Search Bar - Smaller and Aligned Right */}
         <div className="mb-6 flex justify-end">
           <div className="relative w-full max-w-xs">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
               <span className="material-symbols-outlined text-slate-400 text-[20px]">search</span>
             </div>
             <input 
               type="text" 
               placeholder={`Cari pendaftar/ID...`}









             <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-widest font-bold">
                     <th className="px-6 py-4">Tanggal</th>
                     <th className="px-6 py-4">Kode Pembayaran</th>
                     <th className="px-6 py-4">Nama Penyetor</th>
                     <th className="px-6 py-4">Jumlah</th>
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
                         <p>Belum ada 






















                               title="Lihat Bukti"
                             >
                               <span className="material-symbols-outlined text-[18px]">visibility</span>
                             </button>
                             {p.status === 'pending' && (
                               <>
                                 <button 
                                   onClick={() => handleUpdateStatus(p.id, 'verified')}
                                   className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors flex items-center justify-center"
                                   title="Verifikasi Lunas"
                                 >
                                   <span className="material-symbols-outlined text-[18px]">check_circle</span>
                                 </button>
                                 <button 
                                   onClick={() => handleUpdateStatus(p.id, 'rejected')}
                                   className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center justify-center"
                                   title="Tolak"
                                 >
                                   <span className="material-symbols-outlined text-[18px]">cancel</span>
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





















































                         </td>
                         <td className="px-6 py-5 font-bold text-slate-500 text-[11px] whitespace-nowrap uppercase tracking-tight">{b.registration?.program_studi}</td>
                         <td className="px-6 py-5">
                           {(b.is_finalized === true || b.is_finalized === 1 || b.is_finalized === "1") ? (
                             <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">Final</span>
                           ) : (
                             <span className="bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">Draft</span>
                           )}
                         </td>
                         <td className="px-6 py-5">
                           <div className="flex items-center justify-center gap-2">
                             <button 
                               onClick={() => setSelectedBiodata(b)}
                               className="px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-200 rounded-xl transition-all flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest"
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
         ) : activeTab === 'health' ? (
           <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 overflow-hidden">



















































                              : 'BELUM TES'}
                           </span>
                         </td>
                         <td className="px-6 py-4">
                           <div className="flex items-center justify-center gap-2">
                             {b.bukti_kesehatan_path && (
                               <button 
                                 onClick={() => setSelectedProof(`http://localhost:8000/storage/${b.bukti_kesehatan_path}`)}
                                 className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors flex items-center justify-center"
                                 title="Lihat Bukti"
                               >
                                 <span className="material-symbols-outlined text-[18px]">visibility</span>
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
                                 className="px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-all flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-wider shadow-sm"
                               >
                                 <span className="material-symbols-outlined text-[16px]">medical_information</span>
                                 Verifikasi
                               </button>
                             )}
                           </div>
                         </td>
                       </tr>
                     ))
                   )}
                 </tbody>
               </table>

















































                             <button 
                               onClick={() => setSelectedProof(`http://localhost:8000/storage/${b.bukti_registrasi_path}`)}
                               className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                             >
                               <span className="material-symbols-outlined text-[16px]">visibility</span>
                               Lihat Bukti
                             </button>
                           ) : (
                             <span className="text-slate-400 italic">Tidak ada bukti</span>
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
                             {b.stat





                                   title="Verifikasi ACC"
                                 >
                                   <span className="material-symbols-outlined text-[16px]">check_circle</span>
                                   ACC
                                 </button>
                                 <button 
                                   onClick={() => handleVerifyRegistrasi(b.id, 'Ditolak')}
                                   disabled={isLoading}
                                   className="px-3 py-1.5 bg-rose-600 text-white hover:bg-rose-700 rounded-lg transition-all flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-wider shadow-sm disabled:opacity-50"
                                   title="Tolak"
                                 >
                                   <span className="material-symbols-outlined text-[16px]">cancel</span>
                                   Tolak
                                 </button>
                               </>
                             )}
                             {b.status_registrasi !== 'Menunggu Verifikasi' && (
                                <span className="text-[10px] font-bold text-slate-400 uppercase italic">Terverifikasi</span>
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
 
