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
 
