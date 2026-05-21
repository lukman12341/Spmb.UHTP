Created At: 2026-05-20T13:47:44Z
Completed At: 2026-05-20T13:47:44Z
File Path: `file:///c:/Users/LENOVO/Documents/kerja%20praktik/spmb-landing/src/AdminDashboard.tsx`
Total Lines: 1210
Total Bytes: 68908
Showing lines 1 to 30
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
The above content does NOT show the entire file contents. If you need to view any lines of the file which were not shown to complete your task, call this tool again to view those lines.
