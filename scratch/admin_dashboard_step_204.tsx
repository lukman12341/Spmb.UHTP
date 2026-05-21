Created At: 2026-05-20T10:42:37Z
Completed At: 2026-05-20T10:42:37Z
File Path: `file:///c:/Users/LENOVO/Documents/kerja%20praktik/spmb-landing/src/AdminDashboard.tsx`
Total Lines: 1080
Total Bytes: 60938
Showing lines 1 to 800
The following code has been modified to include a line number before every line, in the format: <line_number>: <original_line>. Please note that any changes targeting the original code should remove the line number, colon, and leading space.
1: import React, { useState, useEffect } from 'react';
2: 
3: interface Payment {
4:   id: number;
5:   tanggal_bayar: string;
6:   kode_pembayaran: string;
7:   nama_penyetor: string;
8:   jumlah_bayar: string;
9:   bukti_path: string;
10:   status: string;
11:   created_at: string;
12: }
13: 
14: interface AdminDashboardProps {
15:   onLogout: () => void;
16:   user: any;
17: }
18: 
19: const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, user }) => {
20:   const [payments, setPayments] = useState<Payment[]>([]);
21:   const [biodatas, setBiodatas] = useState<any[]>([]);
22:   const [isLoading, setIsLoading] = useState(true);
23:   const [selectedProof, setSelectedProof] = useState<string | null>(null);
24:   const [activeTab, setActiveTab] = useState<'payments' | 'students' | 'health' | 'registration'>('payments');
25:   const [selectedBiodata, setSelectedBiodata] = useState<any | null>(null);
26:   const [searchTerm, setSearchTerm] = useState('');
27:   const [statusFilter, setStatusFilter] = useState<'all' | 'finalized' | 'draft' | 'pending' | 'verified' | 'Menunggu' | 'Sehat' | 'Tidak Sehat' | 'Menunggu Verifikasi'>('all');
28:   const [showLogoutModal, setShowLogoutModal] = useState(false);
29: 
30:   // Health Verification States
31:   const [statusKesehatan, setStatusKesehatan] = useState('null');
32:   const [tinggiBadan, setTinggiBadan] = useState('');
33:   const [golonganDarah, setGolonganDarah] = useState('');
34:   const [butaWarna, setButaWarna] = useState('');
35:   const [visus, setVisus] = useState('');
36:   const [teka
<truncated 44329 bytes>
) : (
772:                       <span className="material-symbols-outlined text-4xl text-slate-300">person</span>
773:                     )}
774:                   </div>
775:                 </div>
776: 
777:                 {/* Personal & School */}
778:                 <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
779:                   <div className="space-y-6">
780:                      <section>
781:                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-2 mb-3">Info Pribadi</p>
782:                         <div className="space-y-3">
783:                           {[
784:                             { label: 'NISN', val: selectedBiodata.nisn },
785:                             { label: 'TTL', val: `${selectedBiodata.tempat_lahir}, ${selectedBiodata.tanggal_lahir}` },
786:                             { label: 'Gender', val: selectedBiodata.jenis_kelamin },
787:                             { label: 'Agama', val: selectedBiodata.agama },
788:                           ].map(item => (
789:                             <div key={item.label} className="flex flex-col">
790:                               <span className="text-[9px] font-bold text-slate-400 uppercase">{item.label}</span>
791:                               <span className="text-sm font-bold text-slate-700">{item.val || '-'}</span>
792:                             </div>
793:                           ))}
794:                         </div>
795:                      </section>
796:                   </div>
797: 
798:                   <div className="space-y-6">
799:                      <section>
800:                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-2 mb-3">Asal Sekolah</p>
The above content does NOT show the entire file contents. If you need to view any lines of the file which were not shown to complete your task, call this tool again to view those lines.
