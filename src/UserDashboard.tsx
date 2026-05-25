import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { KABUPATEN_LIST } from './data/kabupaten';
import { API_BASE_URL } from './config';

interface UserData {
  id?: number;
  name: string;
  program_studi: string;
  gelombang: string;
}

interface UserDashboardProps {
  onLogout: () => void;
  onOpenCbt: (photoUrl?: string) => void;
  user?: UserData | null;
}

const PROVINSI_LIST = [
  "ACEH", "BENGKULU", "DI Yogyakarta", "DIY", "DKI JAKARTA",
  "JAMBI", "JAWA BARAT", "JAWA TENGAH", "JAWA TIMUR", "KEPRI",
  "LAMPUNG", "RIAU", "SULAWESI TENGGARA", "SULAWESI UTARA",
  "SULTENG", "SUMATERA SELATAN", "SUMBAR", "SUMUT"
];

const UserDashboard: React.FC<UserDashboardProps> = ({ onLogout, onOpenCbt, user }) => {
  const birthDateRef = useRef<HTMLInputElement>(null);
  const paymentDateRef = useRef<HTMLInputElement>(null);
  const [isKonfirmasiModalOpen, setIsKonfirmasiModalOpen] = useState(false);
  const [isConfirmFinalizeModalOpen, setIsConfirmFinalizeModalOpen] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('belum_bayar');
  const [tanggalBayar, setTanggalBayar] = useState('');
  const [namaPenyetor, setNamaPenyetor] = useState('');
  const [buktiFile, setBuktiFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [verifiedPaymentDate, setVerifiedPaymentDate] = useState('');
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [isDataCompleted, setIsDataCompleted] = useState(false);
  const [isFinalized, setIsFinalized] = useState(false);
  const [examNumber, setExamNumber] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [visibleSections, setVisibleSections] = useState({
    biodata: false, sekolah: false, orangtua: false, upload: false
  });
  const [showPemberitahuanPribadi, setShowPemberitahuanPribadi] = useState(true);
  const [showPemberitahuanSekolah, setShowPemberitahuanSekolah] = useState(true);
  const [showPemberitahuanOrangTua, setShowPemberitahuanOrangTua] = useState(true);
  const [showPemberitahuanUpload, setShowPemberitahuanUpload] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Form States
  const [formPribadi, setFormPribadi] = useState({
    nisn: '', tempat_lahir: '', tanggal_lahir: '', jenis_kelamin: 'Laki-Laki',
    agama: 'Islam', alamat: '', kabupaten: '', provinsi: '', no_telp: '', no_hp: ''
  });

  const [formSekolah, setFormSekolah] = useState({
    nama_sekolah: '', jurusan: '', tahun_tamat: '', nilai: '',
    alamat_sekolah: '', kabupaten: '', provinsi: ''
  });

  const [formOrangTua, setFormOrangTua] = useState({
    nama_ayah: '', nama_ibu: '', pekerjaan_ayah: '', pekerjaan_ibu: '',
    alamat: '', kabupaten: '', provinsi: '', no_hp_ayah: '', no_hp_ibu: ''
  });

  const [formFiles, setFormFiles] = useState({
    pas_photo: null as File | null,
    ktp: null as File | null,
    ijazah: null as File | null,
    transkrip: null as File | null
  });

  const [existingFiles, setExistingFiles] = useState({
    pas_photo: null as string | null,
    ktp: null as string | null,
    ijazah: null as string | null,
    transkrip: null as string | null
  });

  const name = user?.name || 'SUHAILA TAHIRAH';
  const programStudi = user?.program_studi || 'S1 Kebidanan Program Reguler';
  const gelombang = user?.gelombang || '20263';

  // Create a unique payment code using the user's ID to prevent data clashes
  const userIdSuffix = user?.id ? user.id.toString().padStart(3, '0') : '000';
  const paymentCode = `${gelombang}-${userIdSuffix}`;

  const fetchBiodata = useCallback(async () => {
    if (!user?.id) return;

    // CRITICAL: Reset all submitted states and photo URL before fetching new data
    setIsDataCompleted(false);
    setIsFinalized(false);
    setExamNumber('');
    setPhotoUrl('');
    setExistingFiles({ pas_photo: null, ktp: null, ijazah: null, transkrip: null });

    // Also reset form data to default
    setFormPribadi({
      nisn: '', tempat_lahir: '', tanggal_lahir: '', jenis_kelamin: 'Laki-Laki',
      agama: 'Islam', alamat: '', kabupaten: '', provinsi: '', no_telp: '', no_hp: ''
    });
    setFormSekolah({
      nama_sekolah: '', jurusan: '', tahun_tamat: '', nilai: '',
      alamat_sekolah: '', kabupaten: '', provinsi: ''
    });
    setFormOrangTua({
      nama_ayah: '', nama_ibu: '', pekerjaan_ayah: '', pekerjaan_ibu: '',
      alamat: '', kabupaten: '', provinsi: '', no_hp_ayah: '', no_hp_ibu: ''
    });

    try {
      const response = await fetch(`${API_BASE_URL}/api/biodata/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setFormPribadi({
          nisn: data.nisn || '', tempat_lahir: data.tempat_lahir || '', tanggal_lahir: data.tanggal_lahir || '',
          jenis_kelamin: data.jenis_kelamin || 'Laki-Laki', agama: data.agama || 'Islam',
          alamat: data.alamat || '', kabupaten: data.kabupaten || '', provinsi: data.provinsi || '',
          no_telp: data.no_telp || '', no_hp: data.no_hp || ''
        });
        setFormSekolah({
          nama_sekolah: data.nama_sekolah || '', jurusan: data.jurusan || '', tahun_tamat: data.tahun_tamat || '',
          nilai: data.nilai || '', alamat_sekolah: data.alamat_sekolah || '',
          kabupaten: data.kabupaten_sekolah || '', provinsi: data.provinsi_sekolah || ''
        });
        setFormOrangTua({
          nama_ayah: data.nama_ayah || '', nama_ibu: data.nama_ibu || '',
          pekerjaan_ayah: data.pekerjaan_ayah || '', pekerjaan_ibu: data.pekerjaan_ibu || '',
          alamat: data.alamat_orang_tua || '', kabupaten: data.kabupaten_orang_tua || '',
          provinsi: data.provinsi_orang_tua || '', no_hp_ayah: data.no_hp_ayah || '', no_hp_ibu: data.no_hp_ibu || ''
        });
        if (data.pas_photo_path) {
          setPhotoUrl(`${API_BASE_URL}/storage/${data.pas_photo_path}`);
        }

        setExistingFiles({
          pas_photo: data.pas_photo_path || null,
          ktp: data.ktp_path || null,
          ijazah: data.ijazah_path || null,
          transkrip: data.transkrip_path || null
        });

        if (data.is_finalized) {
          setIsFinalized(true);
          setExamNumber(data.exam_number);
          setIsDataCompleted(true);
        } else {
          // Thorough check for all required fields
          const isPribadiDone = !!(data.nisn && data.tempat_lahir && data.tanggal_lahir && data.alamat && data.kabupaten && data.provinsi && data.no_hp);
          const isSekolahDone = !!(data.nama_sekolah && data.jurusan && data.tahun_tamat && data.nilai && data.alamat_sekolah && data.kabupaten_sekolah && data.provinsi_sekolah);
          const isOrangTuaDone = !!(data.nama_ayah && data.nama_ibu && data.pekerjaan_ayah && data.pekerjaan_ibu && data.alamat_orang_tua && data.kabupaten_orang_tua && data.provinsi_orang_tua && data.no_hp_ayah);
          const isUploadDone = !!(data.pas_photo_path && data.ktp_path && data.ijazah_path);

          if (isPribadiDone && isSekolahDone && isOrangTuaDone && isUploadDone) {
            setIsDataCompleted(true);
          } else {
            setIsDataCompleted(false);
          }
        }
      } else {
        // If 404 or other error, we ensure we stay at clean state
        setIsDataCompleted(false);
      }
    } catch (error) {
      console.error('Failed to fetch biodata', error);
      setIsDataCompleted(false);
    }
  }, [user?.id]);

  const checkPaymentStatus = useCallback(async () => {
    // Reset payment status to default before fetching new one
    setPaymentStatus('belum_bayar');
    setVerifiedPaymentDate('');

    try {
      const res = await fetch(`${API_BASE_URL}/api/payment/status/${paymentCode}`);
      const data = await res.json();
      if (data && data.status) {
        setPaymentStatus(data.status);
        if (data.tanggal_bayar) {
          setVerifiedPaymentDate(data.tanggal_bayar);
        }
      }
    } catch (error) {
      console.error('Failed to fetch payment status', error);
    }
  }, [paymentCode]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const init = async () => {
      setIsInitialLoading(true);
      await Promise.all([checkPaymentStatus(), fetchBiodata()]);
      setIsInitialLoading(false);
    };
    init();
  }, [paymentCode, checkPaymentStatus, fetchBiodata]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setBuktiFile(e.target.files[0]);
    }
  };

  const handleSubmitPembayaran = async () => {
    if (!tanggalBayar || !namaPenyetor || !buktiFile) {
      setSubmitMessage({ type: 'error', text: 'Semua field wajib diisi termasuk bukti transfer.' });
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage(null);

    const formData = new FormData();
    formData.append('tanggal_bayar', tanggalBayar);
    formData.append('kode_pembayaran', paymentCode);
    formData.append('nama_penyetor', namaPenyetor);
    formData.append('jumlah_bayar', '375.000');
    formData.append('bukti_file', buktiFile);

    try {
      const response = await fetch(`${API_BASE_URL}/api/payment`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitMessage({ type: 'success', text: 'Bukti pembayaran berhasil diunggah! Menunggu verifikasi.' });
        checkPaymentStatus(); // Refresh status immediately
        setTimeout(() => {
          setIsKonfirmasiModalOpen(false);
          setSubmitMessage(null);
          setTanggalBayar('');
          setNamaPenyetor('');
          setBuktiFile(null);
        }, 2000);
      } else {
        setSubmitMessage({ type: 'error', text: data.message || 'Terjadi kesalahan saat mengunggah bukti.' });
      }
    } catch {
      setSubmitMessage({ type: 'error', text: 'Koneksi ke server gagal.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitBiodata = async () => {
    if (!user?.id) return;

    // VALIDATION LOGIC
    setSubmitMessage(null);

    // Define required fields for each tab
    if (activeTab === 'biodata') {
      const required = ['nisn', 'tempat_lahir', 'tanggal_lahir', 'alamat', 'kabupaten', 'provinsi', 'no_hp'];
      const missing = required.filter(field => !formPribadi[field as keyof typeof formPribadi]);
      if (missing.length > 0) {
        setSubmitMessage({ type: 'error', text: 'Mohon lengkapi semua data biodata pribadi sebelum menyimpan.' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      // NISN Validation: Must be 10 digits if not '-'
      if (formPribadi.nisn !== '-' && formPribadi.nisn.length !== 10) {
        setSubmitMessage({ type: 'error', text: 'NISN harus berjumlah 10 digit (atau isi "-" jika tamatan D3)!' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    } else if (activeTab === 'sekolah') {
      const required = ['nama_sekolah', 'jurusan', 'tahun_tamat', 'nilai', 'alamat_sekolah', 'kabupaten', 'provinsi'];
      const missing = required.filter(field => !formSekolah[field as keyof typeof formSekolah]);
      if (missing.length > 0) {
        setSubmitMessage({ type: 'error', text: 'Mohon lengkapi data asal sekolah secara lengkap.' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    } else if (activeTab === 'orangtua') {
      const required = ['nama_ayah', 'nama_ibu', 'pekerjaan_ayah', 'pekerjaan_ibu', 'alamat', 'kabupaten', 'provinsi', 'no_hp_ayah'];
      const missing = required.filter(field => !formOrangTua[field as keyof typeof formOrangTua]);
      if (missing.length > 0) {
        setSubmitMessage({ type: 'error', text: 'Mohon lengkapi data orang tua secara lengkap.' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    } else if (activeTab === 'upload') {
      // Check if files are selected OR already exist on server
      if (!formFiles.pas_photo && !existingFiles.pas_photo) {
        setSubmitMessage({ type: 'error', text: 'Pas Photo wajib diunggah.' });
        return;
      }
      if (!formFiles.ktp && !existingFiles.ktp) {
        setSubmitMessage({ type: 'error', text: 'Scan KTP wajib diunggah.' });
        return;
      }
      if (!formFiles.ijazah && !existingFiles.ijazah) {
        setSubmitMessage({ type: 'error', text: 'Scan Ijazah/SKL wajib diunggah.' });
        return;
      }
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('registration_id', user.id.toString());

    // Append Form Pribadi
    Object.entries(formPribadi).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // Append Form Sekolah
    Object.entries(formSekolah).forEach(([key, value]) => {
      if (key === 'kabupaten') formData.append('kabupaten_sekolah', value);
      else if (key === 'provinsi') formData.append('provinsi_sekolah', value);
      else formData.append(key, value);
    });

    // Append Form Orang Tua
    Object.entries(formOrangTua).forEach(([key, value]) => {
      if (key === 'kabupaten') formData.append('kabupaten_orang_tua', value);
      else if (key === 'provinsi') formData.append('provinsi_orang_tua', value);
      else if (key === 'alamat') formData.append('alamat_orang_tua', value);
      else formData.append(key, value);
    });

    // Append Files
    if (formFiles.pas_photo) formData.append('pas_photo', formFiles.pas_photo);
    if (formFiles.ktp) formData.append('ktp', formFiles.ktp);
    if (formFiles.ijazah) formData.append('ijazah', formFiles.ijazah);
    if (formFiles.transkrip) formData.append('transkrip', formFiles.transkrip);

    try {
      const response = await fetch(`${API_BASE_URL}/api/biodata`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      const data = await response.json();
      if (response.ok) {
        setSubmitMessage({ type: 'success', text: 'Data berhasil disimpan!' });

        // Update local photo URL if uploaded
        if (data.data) {
          if (data.data.pas_photo_path) setPhotoUrl(`${API_BASE_URL}/storage/${data.data.pas_photo_path}`);
          setExistingFiles({
            pas_photo: data.data.pas_photo_path || existingFiles.pas_photo,
            ktp: data.data.ktp_path || existingFiles.ktp,
            ijazah: data.data.ijazah_path || existingFiles.ijazah,
            transkrip: data.data.transkrip_path || existingFiles.transkrip
          });
        }

        // Logic to check if ALL sections are now complete
        const isBiodataDone = !!(formPribadi.nisn && formPribadi.tempat_lahir && formPribadi.tanggal_lahir && formPribadi.alamat && formPribadi.kabupaten && formPribadi.provinsi && formPribadi.no_hp);
        const isSekolahDone = !!(formSekolah.nama_sekolah && formSekolah.jurusan && formSekolah.tahun_tamat && formSekolah.nilai && formSekolah.alamat_sekolah && formSekolah.kabupaten && formSekolah.provinsi);
        const isOrangTuaDone = !!(formOrangTua.nama_ayah && formOrangTua.nama_ibu && formOrangTua.pekerjaan_ayah && formOrangTua.pekerjaan_ibu && formOrangTua.alamat && formOrangTua.kabupaten && formOrangTua.provinsi && formOrangTua.no_hp_ayah);
        const isUploadDone = !!((formFiles.pas_photo || existingFiles.pas_photo) &&
          (formFiles.ktp || existingFiles.ktp) &&
          (formFiles.ijazah || existingFiles.ijazah));

        if (isBiodataDone && isSekolahDone && isOrangTuaDone && isUploadDone) {
          setIsDataCompleted(true);
          setActiveTab(null);
        } else {
          // If not all done, just stay on the same tab but show success or close tab
          setTimeout(() => {
            setSubmitMessage(null);
            setActiveTab(null); // Close the current form to see progress checkmarks
          }, 1500);
        }
      } else {
        let errorMsg = data.message || 'Gagal menyimpan data.';
        if (data.errors) {
          const firstError = Object.values(data.errors)[0];
          if (Array.isArray(firstError)) errorMsg = firstError[0];
        }
        setSubmitMessage({ type: 'error', text: errorMsg });
      }
    } catch {
      setSubmitMessage({ type: 'error', text: 'Gagal terhubung ke server.' });
    } finally {
      setIsSubmitting(false);
    }
  };



  const handlePrint = () => {
    // We add a class to the body to identify what we are printing
    document.body.classList.add('printing-receipt');
    window.print();
    // Remove class after print dialog closes
    setTimeout(() => {
      document.body.classList.remove('printing-receipt');
    }, 1000);
  };

  const handlePrintExamCard = () => {
    document.body.classList.add('printing-exam-card');
    window.print();
    setTimeout(() => {
      document.body.classList.remove('printing-exam-card');
    }, 1000);
  };

  const handleFinalize = async () => {
    if (!user?.id) return;

    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomLetters = chars.charAt(Math.floor(Math.random() * chars.length)) +
      chars.charAt(Math.floor(Math.random() * chars.length));
    const newExamNumber = `${gelombang}${randomLetters}-${randomDigits}`;

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/biodata/finalize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          registration_id: user.id,
          exam_number: newExamNumber
        })
      });

      if (response.ok) {
        setExamNumber(newExamNumber);
        setIsFinalized(true);
        setIsConfirmFinalizeModalOpen(false);
        window.scrollTo(0, 0);
      } else {
        const data = await response.json();
        alert(data.message || 'Gagal melakukan finalisasi.');
      }
    } catch {
      alert('Koneksi ke server gagal.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to check if file is an image
  const isImageFile = (url: string) => {
    if (!url) return false;
    const extension = url.split('.').pop()?.toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '');
  };


  const renderPortals = () => createPortal(
    <>
      {/* Finalization Confirmation Modal */}
      {isConfirmFinalizeModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsConfirmFinalizeModalOpen(false)}></div>
          <div className="bg-white rounded-[32px] w-full max-w-md p-8 relative z-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="size-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-[32px]">warning</span>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Finalisasi Data?</h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-8">
              Apakah anda yakin data sudah benar? Setelah finalisasi, <span className="font-bold text-rose-500">data tidak dapat diubah lagi</span> dan Anda akan mendapatkan Nomor Ujian.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsConfirmFinalizeModalOpen(false)}
                className="flex-1 px-6 py-3 border border-slate-200 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-50 transition-colors uppercase tracking-wider"
              >
                Batal
              </button>
              <button
                onClick={handleFinalize}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-primary text-white font-bold text-xs rounded-xl hover:bg-navy transition-all uppercase tracking-wider shadow-lg shadow-primary/20 disabled:opacity-50"
              >
                {isSubmitting ? 'Memproses...' : 'Ya, Finalisasi'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Receipt */}
      <div id="printable-receipt" className="hidden-on-screen">
        <div className="receipt-container">
          <div className="receipt-header">
            <img src="/logo-uhtp.png" alt="Logo UHTP" className="receipt-logo" />
            <div className="receipt-title-box">
              <h1 className="receipt-main-title">KWITANSI PEMBAYARAN FORMULIR</h1>
              <h2 className="receipt-sub-title text-black">SELEKSI PENERIMAAN MAHASISWA BARU (SPMB) UNIVERSITAS HANG TUAH PEKANBARU</h2>
              <h3 className="receipt-ta">TA. 2026/2027</h3>
            </div>
          </div>

          <div className="receipt-divider"></div>

          <table className="receipt-table">
            <tbody>
              <tr>
                <td className="receipt-label">Sudah terima dari</td>
                <td className="receipt-colon">:</td>
                <td className="receipt-value uppercase font-bold">{name}</td>
              </tr>
              <tr>
                <td className="receipt-label">Program Studi</td>
                <td className="receipt-colon">:</td>
                <td className="receipt-value">{programStudi}</td>
              </tr>
              <tr>
                <td className="receipt-label">Gelombang</td>
                <td className="receipt-colon">:</td>
                <td className="receipt-value">{gelombang}</td>
              </tr>
              <tr>
                <td className="receipt-label">Jumlah Bayar</td>
                <td className="receipt-colon">:</td>
                <td className="receipt-value font-bold">Rp. 375.000</td>
              </tr>
              <tr>
                <td className="receipt-label">Kode Pembayaran</td>
                <td className="receipt-colon">:</td>
                <td className="receipt-value font-bold">{paymentCode}</td>
              </tr>
              <tr>
                <td className="receipt-label">Tanggal Bayar</td>
                <td className="receipt-colon">:</td>
                <td className="receipt-value">{verifiedPaymentDate}</td>
              </tr>
            </tbody>
          </table>

          <div className="receipt-footer-box">
            <div className="signature-box">
              <p>Pekanbaru, {verifiedPaymentDate}</p>
              <p>Bagian Keuangan</p>
              <div className="signature-space">
                <div className="stamp-placeholder">LUNAS</div>
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/3a/Jon_Snow_Signature.png" alt="Signature" className="signature-img" />
              </div>
              <p className="signature-name font-bold">Verdy Sando, S.Sos., MKM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Printable Exam Card (Official Style) */}
      <div id="printable-exam-card" className="hidden-on-screen">
        <div className="exam-card-premium">
          {/* Header Premium */}
          <div className="card-header-premium">
            <div className="header-logo-box">
              <img src="/logo-uhtp.png" alt="Logo UHTP" />
            </div>
            <div className="header-text-box">
              <h2>KARTU PESERTA UJIAN</h2>
              <p>Universitas Hang Tuah Pekanbaru • TA 2026/2027</p>
            </div>
          </div>

          <div className="card-content-premium">
            {/* Profile Section */}
            <div className="profile-section-premium">
              <div className="photo-container-premium">
                {photoUrl ? (
                  <img src={photoUrl} alt="Pas Photo" />
                ) : (
                  <div className="text-[10px] font-bold text-slate-400">FOTO 3X4</div>
                )}
              </div>

              <div className="details-grid-premium">
                <div className="detail-item-premium">
                  <span className="detail-label-premium">Nomor Ujian</span>
                  <span className="detail-value-premium highlight">{examNumber}</span>
                </div>
                <div className="detail-item-premium">
                  <span className="detail-label-premium">Nama Lengkap</span>
                  <span className="detail-value-premium">{name.toUpperCase()}</span>
                </div>
                <div className="detail-item-premium">
                  <span className="detail-label-premium">Program Studi</span>
                  <span className="detail-value-premium">{programStudi}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="detail-item-premium">
                    <span className="detail-label-premium">Gelombang</span>
                    <span className="detail-value-premium">{gelombang}</span>
                  </div>
                  <div className="detail-item-premium">
                    <span className="detail-label-premium">Tempat Lahir</span>
                    <span className="detail-value-premium">{formPribadi.tempat_lahir}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions Section */}
            <div className="instructions-section-premium">
              <div className="instructions-title-premium">
                <span className="material-symbols-outlined text-[18px]">info</span>
                <span>Instruksi Pelaksanaan Ujian</span>
              </div>
              <ol className="instructions-list-premium">
                <li>Ujian dilaksanakan secara online setiap hari pukul 08:00 - 21:00 WIB.</li>
                <li>Alamat Website Ujian: <strong>spmb.htp.ac.id/spmbonline</strong></li>
                <li>Gunakan <strong>Nomor Ujian</strong> sebagai Username dan Password.</li>
                <li>Informasi kelulusan dapat dilihat pada dashboard portal masing-masing.</li>
                <li>Kendala teknis hubungi: Mardeni (082387639898) / Yulanda (08117561513).</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowLogoutModal(false)}></div>
          <div className="relative bg-white rounded-[32px] w-full max-w-sm p-8 z-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="size-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-[32px]">logout</span>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Konfirmasi Keluar</h3>
            <p className="text-sm text-slate-500 mb-8 leading-relaxed">
              Apakah Anda yakin ingin keluar dari sistem pendaftaran?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-6 py-3 border border-slate-200 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-50 transition-colors uppercase tracking-wider"
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
    </>,
    document.body
  );

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="size-16 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest animate-pulse">Memuat Data...</p>
      </div>
    );
  }

  if (isFinalized) {
    return (
      <div className="min-h-screen bg-white font-sans pb-20 selection:bg-primary/10">
        {/* Simple & Clean Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-50 print:hidden">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button
                onClick={() => setIsFinalized(false)}
                className="size-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center hover:bg-slate-100 text-slate-600 transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              </button>
              <h1 className="font-bold text-slate-700 text-sm hidden sm:block uppercase tracking-tight">Portal Peserta Ujian</h1>
            </div>
            <button
              onClick={() => setShowLogoutModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl text-[11px] font-bold transition-all hover:bg-rose-100 active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
              <span>KELUAR</span>
            </button>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-6 py-10 print:p-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Main Content: Exam Card (Left Column) */}
            <div className="lg:col-span-8 space-y-8">
              {/* Page Titles */}
              <div className="text-left space-y-1">
                <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">KARTU PESERTA UJIAN</h2>
                <p className="text-primary font-bold text-xs uppercase tracking-widest">Universitas Hang Tuah Pekanbaru</p>
              </div>

              {/* Premium Exam Card (Screen Version) */}
              <div className="exam-card-premium rounded-[32px] shadow-xl border-none overflow-hidden animate-in fade-in zoom-in duration-500">
                <div className="card-header-premium">
                  <div className="header-logo-box">
                    <img src="/logo-uhtp.png" alt="Logo UHTP" />
                  </div>
                  <div className="header-text-box">
                    <h2>KARTU PESERTA UJIAN</h2>
                    <p>Universitas Hang Tuah Pekanbaru • TA 2026/2027</p>
                  </div>
                </div>

                <div className="card-content-premium">
                  <div className="profile-section-premium flex-col md:flex-row">
                    <div className="photo-container-premium mx-auto md:mx-0 shadow-lg">
                      {photoUrl ? (
                        isImageFile(photoUrl) ? (
                          <img src={photoUrl} alt="Pas Photo" className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-slate-400 p-4 text-center">
                            <span className="material-symbols-outlined text-4xl">description</span>
                            <span className="text-[10px] font-bold uppercase">FILE ATTACHED</span>
                          </div>
                        )
                      ) : (
                        <div className="flex flex-col items-center gap-2 opacity-30">
                          <span className="material-symbols-outlined text-4xl">person</span>
                          <span className="text-[10px] font-bold">FOTO 3X4</span>
                        </div>
                      )}
                    </div>

                    <div className="details-grid-premium">
                      <div className="detail-item-premium">
                        <span className="detail-label-premium">Nomor Ujian</span>
                        <span className="detail-value-premium highlight">{examNumber}</span>
                      </div>
                      <div className="detail-item-premium">
                        <span className="detail-label-premium">Nama Lengkap</span>
                        <span className="detail-value-premium text-lg">{name.toUpperCase()}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                        <div className="detail-item-premium">
                          <span className="detail-label-premium">Program Studi</span>
                          <span className="detail-value-premium">{programStudi}</span>
                        </div>
                        <div className="detail-item-premium">
                          <span className="detail-label-premium">Gelombang</span>
                          <span className="detail-value-premium">{gelombang}</span>
                        </div>
                      </div>
                      <div className="detail-item-premium">
                        <span className="detail-label-premium">Tempat Lahir</span>
                        <span className="detail-value-premium">{formPribadi.tempat_lahir}</span>
                      </div>
                    </div>
                  </div>

                  {/* Clean Action Buttons */}
                  <div className="pt-6 flex flex-wrap gap-4 print:hidden">
                    <button
                      onClick={handlePrintExamCard}
                      className="flex-1 min-w-[180px] bg-primary hover:bg-navy text-white font-bold py-3.5 px-6 rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2 shadow-md shadow-primary/10"
                    >
                      <span className="material-symbols-outlined text-[18px]">print</span>
                      <span className="text-xs">CETAK KARTU</span>
                    </button>
                    <button
                      onClick={() => onOpenCbt(photoUrl)}
                      className="flex-1 min-w-[180px] bg-slate-800 hover:bg-slate-900 text-white font-bold py-3.5 px-6 rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2 shadow-md shadow-slate-900/10"
                    >
                      <span className="material-symbols-outlined text-[18px]">computer</span>
                      <span className="text-xs">UJIAN ONLINE</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Content: Instructions & Help (Right Column) */}
            <aside className="lg:col-span-4 space-y-6 print:hidden">

              {/* Premium Light Instructions Card */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-7 shadow-sm relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute -bottom-10 -right-10 size-40 bg-primary/5 rounded-full blur-2xl"></div>

                <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-5 relative z-10">
                  <div className="size-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px] font-bold">rule</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm tracking-wide">Panduan Ujian</h4>
                    <p className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">Penting diperhatikan</p>
                  </div>
                </div>

                <div className="space-y-5 relative z-10">
                  {[
                    { icon: 'schedule', title: 'Waktu Ujian', text: 'Secara ONLINE pukul 08:00 - 21:00 WIB.' },
                    { icon: 'passkey', title: 'Login Kredensial', text: 'Gunakan NOMOR UJIAN sebagai Username & Password.' },
                    { icon: 'campaign', title: 'Pengumuman', text: 'Pantau kelulusan di portal resmi UHTP secara berkala.' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-start group">
                      <div className="size-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-primary/10 group-hover:border-primary/20 group-hover:text-primary transition-all">
                        <span className="material-symbols-outlined text-slate-500 text-[16px] group-hover:text-primary transition-colors">{item.icon}</span>
                      </div>
                      <div className="pt-0.5">
                        <p className="text-[11px] font-bold text-slate-700 mb-0.5">{item.title}</p>
                        <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 relative z-10">
                  <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 p-4 rounded-2xl">
                    <span className="material-symbols-outlined text-amber-600 text-[16px] mt-0.5 font-bold">lock</span>
                    <p className="text-amber-800 font-semibold text-[10px] leading-relaxed">
                      Biodata Anda telah difinalisasi. Seluruh data sudah dikunci dan aman.
                    </p>
                  </div>
                </div>
              </div>

              {/* Elegant Help Card - Fixed Contrast */}
              <div className="bg-gradient-to-br from-teal-50 to-teal-100/50 border border-teal-100/80 rounded-3xl p-6 text-slate-800 shadow-sm relative overflow-hidden">
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-teal-950 text-sm mb-1">Kendala Teknis?</h4>
                    <p className="text-[10px] text-teal-700 font-semibold">Tim IT kami siap membantu.</p>
                  </div>
                  <a href="https://wa.me/628117561513" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#00857a] hover:bg-teal-700 text-white hover:text-white px-5 py-2.5 rounded-xl text-[11px] font-black uppercase transition-all shadow-md shadow-teal-600/10 shrink-0 active:scale-95">
                    <i className="fab fa-whatsapp text-sm"></i>
                    <span>Hubungi</span>
                  </a>
                </div>
              </div>

              {/* Minimalist Footer inside Sidebar */}
              <div className="pt-4 text-center">
                <p className="text-slate-400 text-[9px] font-medium tracking-widest mb-3 uppercase">Universitas Hang Tuah Pekanbaru</p>
                <div className="flex justify-center gap-2">
                  {['facebook-f', 'instagram', 'twitter'].map(id => (
                    <a key={id} href="#" className="size-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#0f766e] hover:border-teal-300 hover:bg-teal-50 transition-all shadow-sm">
                      <i className={`fab fa-${id} text-[11px]`}></i>
                    </a>
                  ))}
                </div>
              </div>

            </aside>
          </div>
        </div>

        {/* Enhanced WhatsApp Button */}
        <a href="https://wa.me/628117561513" target="_blank" rel="noopener noreferrer" className="fixed bottom-8 right-8 z-50 print:hidden group">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500 rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
            <div className="bg-emerald-500 text-white p-4 rounded-3xl shadow-2xl flex items-center justify-center relative hover:scale-110 active:scale-95 transition-all">
              <i className="fab fa-whatsapp text-3xl"></i>
            </div>
          </div>
        </a>
        {/* render portals */}
        {renderPortals()}

        {/* Extra Safety: Logout Confirmation Modal for Finalized Screen */}
        {showLogoutModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowLogoutModal(false)}></div>
            <div className="relative bg-white rounded-[32px] w-full max-w-sm p-8 z-10 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="size-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[32px]">logout</span>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Konfirmasi Keluar</h3>
              <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                Apakah Anda yakin ingin keluar dari sistem pendaftaran?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 px-6 py-3 border border-slate-200 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-50 transition-colors uppercase tracking-wider"
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
  }

  return (
    <div className="min-h-screen pb-10 bg-white font-sans selection:bg-primary/20 relative print:bg-white print:pb-0">

      {/* Header / Navbar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-18">
            {/* Logo / Brand */}
            <div className="flex items-center gap-3">
              <div className="size-9 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                <span className="material-symbols-outlined shrink-0 text-[22px]">school</span>
              </div>
              <div>
                <h1 className="font-bold text-slate-800 text-base leading-tight tracking-tight uppercase">SPMB UHTP</h1>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={checkPaymentStatus}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 text-slate-600 hover:bg-slate-100 font-bold text-xs rounded-lg transition-colors border border-slate-200"
                title="Perbarui Status"
              >
                <span className="material-symbols-outlined text-[16px]">refresh</span>
                <span className="hidden sm:inline text-[11px] uppercase tracking-wider">Perbarui</span>
              </button>

              <button
                onClick={() => setShowLogoutModal(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold text-xs rounded-lg transition-colors border border-rose-100"
              >
                <span className="material-symbols-outlined text-[16px]">logout</span>
                <span className="hidden sm:inline text-[11px] uppercase tracking-wider">Keluar</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 print:py-0 print:px-0 print:max-w-none">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column - Sidebar Info (4 columns) */}
          <aside className="lg:col-span-4 space-y-6">

            {/* Profile Summary Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="size-14 bg-primary text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg shadow-primary/20">
                  {name.charAt(0)}
                </div>
                <div>
                  <h2 className="font-bold text-slate-800 text-lg leading-tight">{name.toUpperCase()}</h2>
                  <p className="text-xs font-medium text-slate-500">ID: {paymentCode}</p>
                </div>
              </div>

              <div className="space-y-4 border-t border-slate-50 pt-5">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-slate-400 text-lg">bookmark</span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Program Studi</p>
                    <p className="text-xs font-bold text-slate-700 truncate">{programStudi}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-slate-400 text-lg">calendar_month</span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gelombang</p>
                    <p className="text-xs font-bold text-slate-700">{gelombang}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Subtle Progress Tracker */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <h3 className="font-bold text-slate-800 text-sm mb-5 flex items-center gap-2">
                <span className="size-2 bg-primary rounded-full"></span>
                Alur Pendaftaran
              </h3>

              <div className="relative pl-6 space-y-8 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                {/* Step 1 */}
                <div className="relative">
                  <div className="absolute -left-[23px] top-0.5 size-4 rounded-full bg-emerald-500 border-2 border-white ring-1 ring-emerald-500 flex items-center justify-center z-10">
                    <span className="material-symbols-outlined text-[10px] text-white font-bold">check</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800">Registrasi Akun</h4>
                  <p className="text-[10px] text-slate-400 font-medium">Selesai diverifikasi</p>
                </div>

                {/* Step 2 */}
                <div className="relative">
                  <div className={`absolute -left-[23px] top-0.5 size-4 rounded-full ${paymentStatus === 'verified' ? 'bg-emerald-500' : (paymentStatus === 'pending' ? 'bg-amber-400' : 'bg-slate-200')} border-2 border-white ring-1 ${paymentStatus === 'verified' ? 'ring-emerald-500' : (paymentStatus === 'pending' ? 'ring-amber-400' : 'ring-slate-200')} flex items-center justify-center z-10`}>
                    {paymentStatus === 'verified' && <span className="material-symbols-outlined text-[10px] text-white font-bold">check</span>}
                  </div>
                  <h4 className={`text-xs font-bold ${paymentStatus === 'verified' ? 'text-slate-800' : 'text-slate-600'}`}>Pembayaran Formulir</h4>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {paymentStatus === 'verified' ? 'Lunas & Diverifikasi' : (paymentStatus === 'pending' ? 'Menunggu Konfirmasi' : 'Silakan lakukan transfer')}
                  </p>
                </div>

                {/* Step 3 */}
                <div className={`relative ${paymentStatus !== 'verified' ? 'opacity-50' : ''}`}>
                  <div className={`absolute -left-[23px] top-0.5 size-4 rounded-full ${(isDataCompleted || isFinalized) ? 'bg-emerald-500 ring-emerald-500' : (paymentStatus === 'verified' ? 'bg-amber-400 ring-amber-400' : 'bg-slate-200 ring-slate-200')} border-2 border-white ring-1 z-10 flex items-center justify-center`}>
                    {(isDataCompleted || isFinalized) && <span className="material-symbols-outlined text-[10px] text-white font-bold">check</span>}
                  </div>
                  <h4 className="text-xs font-bold text-slate-800">Pengisian Berkas</h4>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {isFinalized ? 'Data Terfinalisasi' : (isDataCompleted ? 'Data Lengkap' : (paymentStatus === 'verified' ? 'Silakan lengkapi data' : 'Langkah selanjutnya'))}
                  </p>
                </div>
              </div>
            </div>

            {/* Help Contact */}
            <a href="https://wa.me/628117561513" target="_blank" rel="noopener noreferrer" className="block bg-emerald-50 border border-emerald-100 rounded-2xl p-4 hover:bg-emerald-100 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="size-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-xl">headset_mic</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-emerald-800">Butuh Bantuan?</p>
                  <p className="text-[10px] font-medium text-emerald-600">Hubungi CP Yulanda (WhatsApp)</p>
                </div>
              </div>
            </a>

          </aside>

          {/* Right Column - Main Actions (8 columns) */}
          <div className="lg:col-span-8 space-y-6">

            {/* Welcome Banner */}
            <div className="w-full bg-white border border-slate-200 rounded-3xl p-8 flex flex-col sm:flex-row items-center gap-6 shadow-sm overflow-hidden relative">
              <div className="absolute -right-10 -top-10 size-40 bg-primary/5 rounded-full blur-3xl"></div>
              <div className="size-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[32px]">waving_hand</span>
              </div>
              <div className="text-center sm:text-left relative z-10">
                <h2 className="text-2xl font-bold text-slate-800 mb-1">Selamat Datang di Portal SPMB</h2>
                <p className="text-sm text-slate-500 leading-relaxed max-w-lg">
                  Terima kasih telah mendaftar di Universitas Hang Tuah Pekanbaru.
                  {paymentStatus === 'verified' ? ' Pembayaran Anda telah kami verifikasi. Silakan lengkapi data Anda di bawah ini.' : ' Silakan ikuti langkah di bawah untuk menyelesaikan proses pendaftaran.'}
                </p>
              </div>
            </div>

            {/* Kelengkapan Berkas Section (Only show when verified) */}
            {paymentStatus === 'verified' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                  <h3 className="font-bold text-slate-800 text-base">Isi Kelengkapan Data Calon Mahasiswa</h3>
                  <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-full uppercase tracking-wider">Langkah 3</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    {
                      id: 'biodata',
                      label: 'BIODATA PRIBADI',
                      icon: 'badge',
                      bgActive: 'bg-[#3498db] ring-[#3498db]/20 shadow-[#3498db]/25',
                      bgInactive: 'bg-[#3498db]/80 hover:bg-[#3498db]'
                    },
                    {
                      id: 'sekolah',
                      label: 'ASAL SEKOLAH',
                      icon: 'school',
                      bgActive: 'bg-[#2ecc71] ring-[#2ecc71]/20 shadow-[#2ecc71]/25',
                      bgInactive: 'bg-[#2ecc71]/80 hover:bg-[#2ecc71]'
                    },
                    {
                      id: 'orangtua',
                      label: 'BIODATA ORANG TUA',
                      icon: 'groups',
                      bgActive: 'bg-[#e74c3c] ring-[#e74c3c]/20 shadow-[#e74c3c]/25',
                      bgInactive: 'bg-[#e74c3c]/80 hover:bg-[#e74c3c]'
                    },
                    {
                      id: 'upload',
                      label: 'UNGGAH SYARAT',
                      icon: 'cloud_upload',
                      bgActive: 'bg-[#f39c12] ring-[#f39c12]/20 shadow-[#f39c12]/25',
                      bgInactive: 'bg-[#f39c12]/80 hover:bg-[#f39c12]'
                    }
                  ].map((cat) => {
                    const isActive = isDataCompleted ? visibleSections[cat.id as keyof typeof visibleSections] : activeTab === cat.id;

                    // Logic for individual section completion
                    let isSectionDone = false;
                    if (isFinalized) {
                      isSectionDone = true;
                    } else {
                      // Only show checkmark if tab is not active (tunggu lengkap dan berhasil)
                      // OR if we are in completed state view
                      const isTabActive = activeTab === cat.id;

                      if (cat.id === 'biodata') {
                        isSectionDone = !isTabActive && !!(formPribadi.nisn && formPribadi.tempat_lahir && formPribadi.tanggal_lahir && formPribadi.alamat && formPribadi.kabupaten && formPribadi.provinsi && formPribadi.no_hp);
                      } else if (cat.id === 'sekolah') {
                        isSectionDone = !isTabActive && !!(formSekolah.nama_sekolah && formSekolah.jurusan && formSekolah.tahun_tamat && formSekolah.nilai && formSekolah.alamat_sekolah && formSekolah.kabupaten && formSekolah.provinsi);
                      } else if (cat.id === 'orangtua') {
                        isSectionDone = !isTabActive && !!(formOrangTua.nama_ayah && formOrangTua.nama_ibu && formOrangTua.pekerjaan_ayah && formOrangTua.pekerjaan_ibu && formOrangTua.alamat && formOrangTua.kabupaten && formOrangTua.provinsi && formOrangTua.no_hp_ayah);
                      } else if (cat.id === 'upload') {
                        isSectionDone = !isTabActive && !!((formFiles.pas_photo || existingFiles.pas_photo) && (formFiles.ktp || existingFiles.ktp) && (formFiles.ijazah || existingFiles.ijazah));
                      }
                    }

                    return (
                      <button
                        key={cat.id}
                        onClick={() => {
                          if (examNumber) {
                            alert("Biodata Anda sudah difinalisasi, tidak bisa melakukan perubahan data lagi.");
                            return;
                          }
                          if (isDataCompleted) {
                            setVisibleSections(prev => ({ ...prev, [cat.id]: !prev[cat.id as keyof typeof prev] }));
                          } else {
                            setActiveTab(activeTab === cat.id ? null : cat.id);
                          }
                        }}
                        className={`flex flex-col items-center justify-center p-6 rounded-2xl border border-transparent transition-all shadow-md group ${isActive ? `${cat.bgActive} ring-4 ring-offset-2 ring-slate-100 scale-[1.02]` : `${cat.bgInactive} hover:scale-[1.01] hover:shadow-lg`} text-white relative overflow-hidden`}
                      >
                        <div className={`absolute top-0 left-0 w-full h-1 bg-white/20 ${isActive ? 'block' : 'hidden'}`}></div>
                        <span className="material-symbols-outlined text-[32px] mb-3 group-hover:scale-110 transition-transform">{cat.icon}</span>
                        <span className="text-[11px] font-black uppercase tracking-tight text-center">{cat.label}</span>

                        {/* Section completion checkmark */}
                        {isSectionDone && (
                          <div className="absolute top-2 left-2 size-5 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                            <span className="material-symbols-outlined text-[12px] font-bold">check</span>
                          </div>
                        )}

                        {isDataCompleted && (
                          <div className="absolute top-2 right-2 size-5 bg-white/20 rounded-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-[14px]">
                              {visibleSections[cat.id as keyof typeof visibleSections] ? 'expand_less' : 'expand_more'}
                            </span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>


                {/* Completed State View */}
                {isDataCompleted && !isFinalized && (
                  <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex justify-center mb-10">
                      <button
                        onClick={() => {
                          if (examNumber) {
                            setIsFinalized(true);
                          } else {
                            setIsConfirmFinalizeModalOpen(true);
                          }
                        }}
                        className="bg-primary hover:bg-navy text-white font-bold py-3 px-10 rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-95 flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-[18px]">verified</span>
                        TAHAP SELANJUTNYA
                      </button>
                    </div>

                    <div className="space-y-8">
                      {/* Biodata Pribadi */}
                      {visibleSections.biodata && (
                        <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-[22px] text-slate-800">Biodata Pribadi</h4>
                            <button
                              onClick={() => {
                                if (examNumber) {
                                  alert("Biodata Anda sudah difinalisasi, tidak bisa melakukan perubahan data lagi.");
                                  return;
                                }
                                setIsDataCompleted(false);
                                setActiveTab('biodata');
                              }}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-[11px] font-bold transition-all"
                            >
                              <span className="material-symbols-outlined text-[16px]">edit</span>
                              {formPribadi.nisn ? 'UBAH DATA' : 'ISI DATA'}
                            </button>
                          </div>
                          {showPemberitahuanPribadi && (
                            <div className="bg-[#fff3cd] border border-[#ffeeba] text-[#856404] p-4 mb-4 rounded relative animate-out fade-out zoom-out-95 duration-200">
                              <button onClick={() => setShowPemberitahuanPribadi(false)} className="absolute top-4 right-4 text-[#856404]/50 hover:text-[#856404]">
                                <span className="material-symbols-outlined text-[16px]">close</span>
                              </button>
                              <p className="font-bold text-sm mb-1">Pemberitahuan</p>
                              <p className="text-sm">Isi biodata lengkap anda di bawah ini, kelengkapan biodata ini untuk verifikasi peserta untuk mengikuti ujian.</p>
                            </div>
                          )}
                          {formPribadi.nisn ? (
                            <p className="text-[15px] text-[#333]">Anda sudah menginputkan biodata pribadi</p>
                          ) : (
                            <p className="text-[15px] text-slate-400 italic">Biodata pribadi belum diisi.</p>
                          )}
                        </div>
                      )}

                      {/* Asal Sekolah */}
                      {visibleSections.sekolah && (
                        <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-[22px] text-slate-800">Asal Sekolah</h4>
                            <button
                              onClick={() => {
                                if (examNumber) {
                                  alert("Biodata Anda sudah difinalisasi, tidak bisa melakukan perubahan data lagi.");
                                  return;
                                }
                                setIsDataCompleted(false);
                                setActiveTab('sekolah');
                              }}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-[11px] font-bold transition-all"
                            >
                              <span className="material-symbols-outlined text-[16px]">edit</span>
                              {formSekolah.nama_sekolah ? 'UBAH DATA' : 'ISI DATA'}
                            </button>
                          </div>
                          {showPemberitahuanSekolah && (
                            <div className="bg-[#fff3cd] border border-[#ffeeba] text-[#856404] p-4 mb-4 rounded relative animate-out fade-out zoom-out-95 duration-200">
                              <button onClick={() => setShowPemberitahuanSekolah(false)} className="absolute top-4 right-4 text-[#856404]/50 hover:text-[#856404]">
                                <span className="material-symbols-outlined text-[16px]">close</span>
                              </button>
                              <p className="font-bold text-sm mb-1">Pemberitahuan</p>
                              <p className="text-sm">Isi data sekolah anda secara lengkap pada form dibawah ini, panitia SPMB tidak akan memverifikasi data CAMABA yang tidak lengkap</p>
                            </div>
                          )}
                          {formSekolah.nama_sekolah ? (
                            <p className="text-[15px] text-[#333]">Anda sudah menginputkan data asal sekolah</p>
                          ) : (
                            <p className="text-[15px] text-slate-400 italic">Data asal sekolah belum diisi.</p>
                          )}
                        </div>
                      )}

                      {/* Biodata Orang Tua */}
                      {visibleSections.orangtua && (
                        <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-[22px] text-slate-800">Biodata Orang Tua</h4>
                            <button
                              onClick={() => {
                                if (examNumber) {
                                  alert("Biodata Anda sudah difinalisasi, tidak bisa melakukan perubahan data lagi.");
                                  return;
                                }
                                setIsDataCompleted(false);
                                setActiveTab('orangtua');
                              }}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-[11px] font-bold transition-all"
                            >
                              <span className="material-symbols-outlined text-[16px]">edit</span>
                              {formOrangTua.nama_ayah ? 'UBAH DATA' : 'ISI DATA'}
                            </button>
                          </div>
                          {showPemberitahuanOrangTua && (
                            <div className="bg-[#fff3cd] border border-[#ffeeba] text-[#856404] p-4 mb-4 rounded relative animate-out fade-out zoom-out-95 duration-200">
                              <button onClick={() => setShowPemberitahuanOrangTua(false)} className="absolute top-4 right-4 text-[#856404]/50 hover:text-[#856404]">
                                <span className="material-symbols-outlined text-[16px]">close</span>
                              </button>
                              <p className="font-bold text-sm mb-1">Pemberitahuan</p>
                              <p className="text-sm">Isi biodata orang tua anda secara lengkap</p>
                            </div>
                          )}
                          {formOrangTua.nama_ayah ? (
                            <p className="text-[15px] text-[#333]">Anda sudah menginputkan biodata orang tua</p>
                          ) : (
                            <p className="text-[15px] text-slate-400 italic">Biodata orang tua belum diisi.</p>
                          )}
                        </div>
                      )}

                      {/* Upload Persyaratan */}
                      {visibleSections.upload && (
                        <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-[22px] text-slate-800">Unggah Persyaratan</h4>
                            <button
                              onClick={() => {
                                if (examNumber) {
                                  alert("Biodata Anda sudah difinalisasi, tidak bisa melakukan perubahan data lagi.");
                                  return;
                                }
                                setIsDataCompleted(false);
                                setActiveTab('upload');
                              }}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-[11px] font-bold transition-all"
                            >
                              <span className="material-symbols-outlined text-[16px]">edit</span>
                              {photoUrl ? 'UBAH DATA' : 'ISI DATA'}
                            </button>
                          </div>
                          {showPemberitahuanUpload && (
                            <div className="bg-[#fff3cd] border border-[#ffeeba] text-[#856404] p-4 mb-4 rounded relative animate-out fade-out zoom-out-95 duration-200">
                              <button onClick={() => setShowPemberitahuanUpload(false)} className="absolute top-4 right-4 text-[#856404]/50 hover:text-[#856404]">
                                <span className="material-symbols-outlined text-[16px]">close</span>
                              </button>
                              <p className="font-bold text-sm mb-1">Pemberitahuan</p>
                              <p className="text-sm">Unggah persyaratan sesuai program studi yang Anda ambil, panitia tidak akan memverifikasi berkas yang tidak lengkap</p>
                            </div>
                          )}
                          {photoUrl ? (
                            <p className="text-[15px] text-[#333]">Anda sudah mengunggah kelengkapan berkas</p>
                          ) : (
                            <p className="text-[15px] text-slate-400 italic">Berkas persyaratan belum diunggah.</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Form Content Area (Only show if a tab is selected) */}
                {!isDataCompleted && activeTab && (
                  <div className="bg-white border border-slate-200 rounded-3xl p-8 pb-40 shadow-sm animate-in fade-in zoom-in-95 duration-300">

                    {submitMessage && (
                      <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${submitMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                        <span className="material-symbols-outlined">{submitMessage.type === 'success' ? 'check_circle' : 'error'}</span>
                        <p className="text-sm font-bold">{submitMessage.text}</p>
                      </div>
                    )}

                    {activeTab === 'biodata' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                          <h4 className="text-lg font-bold text-slate-800">Biodata Pribadi</h4>
                          <button
                            onClick={() => {
                              setActiveTab(null);
                            }}
                            className="text-slate-400 hover:text-rose-500 transition-colors"
                          >
                            <span className="material-symbols-outlined">close</span>
                          </button>
                        </div>
                        <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3">
                          <span className="material-symbols-outlined text-amber-500">info</span>
                          <p className="text-xs text-amber-800 leading-relaxed">Isi biodata lengkap anda di bawah ini, kelengkapan biodata ini untuk verifikasi peserta untuk mengikuti ujian.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="md:col-span-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">NISN</label>
                            <input 
                               type="text" 
                               value={formPribadi.nisn} 
                               onChange={(e) => {
                                 const val = e.target.value;
                                 if (val === '-' || /^\d*$/.test(val)) {
                                   if (val.length <= 10) {
                                     setFormPribadi({ ...formPribadi, nisn: val });
                                   }
                                 }
                               }} 
                               placeholder="Masukkan NISN" 
                               className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200 hover:border-slate-300" 
                             />
                            <p className="text-[9px] text-slate-400 font-semibold mt-1 ml-1">*Untuk Tamatan D3 isi dengan tanda -</p>
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Tempat Lahir</label>
                            <input type="text" value={formPribadi.tempat_lahir} onChange={(e) => setFormPribadi({ ...formPribadi, tempat_lahir: e.target.value })} placeholder="Tempat Lahir" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200 hover:border-slate-300" />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Tanggal Lahir</label>
                             <div className="relative">
                               <input 
                                 ref={birthDateRef}
                                 type="date" 
                                 value={formPribadi.tanggal_lahir} 
                                 onChange={(e) => setFormPribadi({ ...formPribadi, tanggal_lahir: e.target.value })} 
                                 className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200 hover:border-slate-300 pr-12 appearance-none" 
                               />
                               <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                 <span className="material-symbols-outlined text-slate-400 text-[20px]">calendar_month</span>
                                </div>
                               <button 
                                 type="button"
                                 onClick={() => {
                                   try { birthDateRef.current?.showPicker(); } catch { birthDateRef.current?.focus(); }
                                 }}
                                 className="absolute inset-0 w-full h-full bg-transparent border-none cursor-pointer"
                                 aria-label="Pilih Tanggal"
                               />
                             </div>
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Jenis Kelamin</label>
                            <div className="relative">
                              <select value={formPribadi.jenis_kelamin} onChange={(e) => setFormPribadi({ ...formPribadi, jenis_kelamin: e.target.value })} className="appearance-none w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200 pr-10 cursor-pointer hover:border-slate-300">
                                <option>Laki-Laki</option>
                                <option>Perempuan</option>
                              </select>
                              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[20px]">keyboard_arrow_down</span>
                            </div>
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Agama</label>
                            <div className="relative">
                              <select value={formPribadi.agama} onChange={(e) => setFormPribadi({ ...formPribadi, agama: e.target.value })} className="appearance-none w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200 pr-10 cursor-pointer hover:border-slate-300">
                                <option>Islam</option>
                                <option>Kristen</option>
                                <option>Katolik</option>
                                <option>Budha</option>
                                <option>Hindu</option>
                              </select>
                              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[20px]">keyboard_arrow_down</span>
                            </div>
                          </div>
                          <div className="md:col-span-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Alamat</label>
                            <input type="text" value={formPribadi.alamat} onChange={(e) => setFormPribadi({ ...formPribadi, alamat: e.target.value })} placeholder="Alamat Sesuai KTP" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200 hover:border-slate-300" />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Pilih Kabupaten</label>
                            <div className="relative">
                              <select value={formPribadi.kabupaten} onChange={(e) => setFormPribadi({ ...formPribadi, kabupaten: e.target.value })} className="appearance-none w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200 pr-10 cursor-pointer hover:border-slate-300">
                                <option value="">Pilih Kabupaten</option>
                                {KABUPATEN_LIST.map(k => <option key={k} value={k}>{k}</option>)}
                              </select>
                              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[20px]">keyboard_arrow_down</span>
                            </div>
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Pilih Provinsi</label>
                            <div className="relative">
                              <select value={formPribadi.provinsi} onChange={(e) => setFormPribadi({ ...formPribadi, provinsi: e.target.value })} className="appearance-none w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200 pr-10 cursor-pointer hover:border-slate-300">
                                <option value="">Pilih Provinsi</option>
                                {PROVINSI_LIST.map(p => <option key={p} value={p}>{p}</option>)}
                              </select>
                              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[20px]">keyboard_arrow_down</span>
                            </div>
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">No. Telepon</label>
                            <input type="text" value={formPribadi.no_telp} onChange={(e) => setFormPribadi({ ...formPribadi, no_telp: e.target.value })} placeholder="No. Telepon" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200 hover:border-slate-300" />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">No. Handphone</label>
                            <input type="text" value={formPribadi.no_hp} onChange={(e) => setFormPribadi({ ...formPribadi, no_hp: e.target.value })} placeholder="No. Handphone" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200 hover:border-slate-300" />
                          </div>
                          <div className="flex items-end gap-3">
                            <button onClick={handleSubmitBiodata} disabled={isSubmitting} className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md shadow-emerald-100 disabled:opacity-50">
                              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                            </button>
                            <button
                              onClick={() => {
                                setActiveTab(null);
                              }}
                              className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-3 px-8 rounded-xl transition-all"
                            >
                              Batal
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'sekolah' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                          <h4 className="text-lg font-bold text-slate-800">Asal Sekolah</h4>
                          <button
                            onClick={() => {
                              setActiveTab(null);
                            }}
                            className="text-slate-400 hover:text-rose-500 transition-colors"
                          >
                            <span className="material-symbols-outlined">close</span>
                          </button>
                        </div>
                        <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3">
                          <span className="material-symbols-outlined text-amber-500">info</span>
                          <p className="text-xs text-amber-800 leading-relaxed">Isi data sekolah anda secara lengkap pada form dibawah ini, panitia SPMB tidak akan memverifikasi data CAMABA yang tidak lengkap</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="md:col-span-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Asal Sekolah</label>
                            <input type="text" value={formSekolah.nama_sekolah} onChange={(e) => setFormSekolah({ ...formSekolah, nama_sekolah: e.target.value })} placeholder="Asal Sekolah" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200 hover:border-slate-300" />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Jurusan</label>
                            <input type="text" value={formSekolah.jurusan} onChange={(e) => setFormSekolah({ ...formSekolah, jurusan: e.target.value })} placeholder="Jurusan" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200 hover:border-slate-300" />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Tahun Tamat</label>
                            <input type="text" value={formSekolah.tahun_tamat} onChange={(e) => setFormSekolah({ ...formSekolah, tahun_tamat: e.target.value })} placeholder="Tahun Tamat" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200 hover:border-slate-300" />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Nilai</label>
                            <input type="text" value={formSekolah.nilai} onChange={(e) => setFormSekolah({ ...formSekolah, nilai: e.target.value })} placeholder="Nilai" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200 hover:border-slate-300" />
                          </div>
                          <div className="md:col-span-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Alamat Sekolah</label>
                            <input type="text" value={formSekolah.alamat_sekolah} onChange={(e) => setFormSekolah({ ...formSekolah, alamat_sekolah: e.target.value })} placeholder="Alamat Sekolah" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200 hover:border-slate-300" />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Pilih Kabupaten</label>
                            <div className="relative">
                              <select value={formSekolah.kabupaten} onChange={(e) => setFormSekolah({ ...formSekolah, kabupaten: e.target.value })} className="appearance-none w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200 pr-10 cursor-pointer hover:border-slate-300">
                                <option value="">Pilih Kabupaten</option>
                                {KABUPATEN_LIST.map(k => <option key={k} value={k}>{k}</option>)}
                              </select>
                              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[20px]">keyboard_arrow_down</span>
                            </div>
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Pilih Provinsi</label>
                            <div className="relative">
                              <select value={formSekolah.provinsi} onChange={(e) => setFormSekolah({ ...formSekolah, provinsi: e.target.value })} className="appearance-none w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200 pr-10 cursor-pointer hover:border-slate-300">
                                <option value="">Pilih Provinsi</option>
                                {PROVINSI_LIST.map(p => <option key={p} value={p}>{p}</option>)}
                              </select>
                              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[20px]">keyboard_arrow_down</span>
                            </div>
                          </div>
                          <div className="flex items-end gap-3">
                            <button onClick={handleSubmitBiodata} disabled={isSubmitting} className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md shadow-emerald-100 disabled:opacity-50">
                              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                            </button>
                            <button
                              onClick={() => {
                                setActiveTab(null);
                              }}
                              className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-3 px-8 rounded-xl transition-all"
                            >
                              Batal
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'orangtua' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                          <h4 className="text-lg font-bold text-slate-800">Biodata Orang Tua</h4>
                          <button
                            onClick={() => {
                              setActiveTab(null);
                            }}
                            className="text-slate-400 hover:text-rose-500 transition-colors"
                          >
                            <span className="material-symbols-outlined">close</span>
                          </button>
                        </div>
                        <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3">
                          <span className="material-symbols-outlined text-amber-500">info</span>
                          <p className="text-xs text-amber-800 leading-relaxed">Isi biodata orang tua anda secara lengkap</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Nama Ayah</label>
                            <input type="text" value={formOrangTua.nama_ayah} onChange={(e) => setFormOrangTua({ ...formOrangTua, nama_ayah: e.target.value })} placeholder="Nama Ayah" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200 hover:border-slate-300" />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Nama Ibu</label>
                            <input type="text" value={formOrangTua.nama_ibu} onChange={(e) => setFormOrangTua({ ...formOrangTua, nama_ibu: e.target.value })} placeholder="Nama Ibu" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200 hover:border-slate-300" />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Pekerjaan Ayah</label>
                            <input type="text" value={formOrangTua.pekerjaan_ayah} onChange={(e) => setFormOrangTua({ ...formOrangTua, pekerjaan_ayah: e.target.value })} placeholder="Pekerjaan Ayah" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200 hover:border-slate-300" />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Pekerjaan Ibu</label>
                            <input type="text" value={formOrangTua.pekerjaan_ibu} onChange={(e) => setFormOrangTua({ ...formOrangTua, pekerjaan_ibu: e.target.value })} placeholder="Pekerjaan Ibu" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200 hover:border-slate-300" />
                          </div>
                          <div className="md:col-span-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Alamat Orang Tua</label>
                            <input type="text" value={formOrangTua.alamat} onChange={(e) => setFormOrangTua({ ...formOrangTua, alamat: e.target.value })} placeholder="Alamat Orang Tua" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200 hover:border-slate-300" />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Pilih Kabupaten</label>
                            <div className="relative">
                              <select value={formOrangTua.kabupaten} onChange={(e) => setFormOrangTua({ ...formOrangTua, kabupaten: e.target.value })} className="appearance-none w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200 pr-10 cursor-pointer hover:border-slate-300">
                                <option value="">Pilih Kabupaten</option>
                                {KABUPATEN_LIST.map(k => <option key={k} value={k}>{k}</option>)}
                              </select>
                              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[20px]">keyboard_arrow_down</span>
                            </div>
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Pilih Provinsi</label>
                            <div className="relative">
                              <select value={formOrangTua.provinsi} onChange={(e) => setFormOrangTua({ ...formOrangTua, provinsi: e.target.value })} className="appearance-none w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200 pr-10 cursor-pointer hover:border-slate-300">
                                <option value="">Pilih Provinsi</option>
                                {PROVINSI_LIST.map(p => <option key={p} value={p}>{p}</option>)}
                              </select>
                              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[20px]">keyboard_arrow_down</span>
                            </div>
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">No. Hp Ayah</label>
                            <input type="text" value={formOrangTua.no_hp_ayah} onChange={(e) => setFormOrangTua({ ...formOrangTua, no_hp_ayah: e.target.value })} placeholder="No. Hp Ayah" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200 hover:border-slate-300" />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">No. Hp Ibu</label>
                            <input type="text" value={formOrangTua.no_hp_ibu} onChange={(e) => setFormOrangTua({ ...formOrangTua, no_hp_ibu: e.target.value })} placeholder="No. Hp Ibu" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200 hover:border-slate-300" />
                          </div>
                          <div className="flex items-end gap-3">
                            <button onClick={handleSubmitBiodata} disabled={isSubmitting} className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md shadow-emerald-100 disabled:opacity-50">
                              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                            </button>
                            <button
                              onClick={() => {
                                setActiveTab(null);
                              }}
                              className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-3 px-8 rounded-xl transition-all"
                            >
                              Batal
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'upload' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                          <h4 className="text-lg font-bold text-slate-800">Unggah Persyaratan</h4>
                          <button
                            onClick={() => {
                              setActiveTab(null);
                            }}
                            className="text-slate-400 hover:text-rose-500 transition-colors"
                          >
                            <span className="material-symbols-outlined">close</span>
                          </button>
                        </div>
                        <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3">
                          <span className="material-symbols-outlined text-amber-500">info</span>
                          <p className="text-xs text-amber-800 leading-relaxed">Unggah persyaratan sesuai program studi yang Anda ambil, panitia tidak akan memverifikasi berkas yang tidak lengkap</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {/* Pas Photo */}
                          <div className={`p-5 rounded-2xl border-2 border-dashed transition-all ${existingFiles.pas_photo ? 'bg-emerald-50/30 border-emerald-200' : 'bg-slate-50 border-slate-200 hover:border-primary/40'}`}>
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-4">
                                <div className={`size-10 rounded-lg flex items-center justify-center shadow-sm ${existingFiles.pas_photo ? 'bg-emerald-500 text-white' : 'bg-white text-primary'}`}>
                                  <span className="material-symbols-outlined">image</span>
                                </div>
                                <div>
                                  <h5 className="text-xs font-bold text-slate-800">Pas Photo</h5>
                                  <p className="text-[9px] text-slate-400 font-semibold">File: (.jpg, .png) maksimal 5MB</p>
                                </div>
                              </div>
                              {existingFiles.pas_photo && (
                                <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[9px] font-black uppercase">
                                  <span className="material-symbols-outlined text-[12px]">check_circle</span>
                                  Terunggah
                                </span>
                              )}
                            </div>
                            <input type="file" accept=".jpg,.jpeg,.png" onChange={(e) => setFormFiles({ ...formFiles, pas_photo: e.target.files ? e.target.files[0] : null })} className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer" />
                          </div>

                          {/* KTP */}
                          <div className={`p-5 rounded-2xl border-2 border-dashed transition-all ${existingFiles.ktp ? 'bg-emerald-50/30 border-emerald-200' : 'bg-slate-50 border-slate-200 hover:border-primary/40'}`}>
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-4">
                                <div className={`size-10 rounded-lg flex items-center justify-center shadow-sm ${existingFiles.ktp ? 'bg-emerald-500 text-white' : 'bg-white text-primary'}`}>
                                  <span className="material-symbols-outlined">identity_platform</span>
                                </div>
                                <div>
                                  <h5 className="text-xs font-bold text-slate-800">KTP</h5>
                                  <p className="text-[9px] text-slate-400 font-semibold">File: (.jpg, .png) maksimal 5MB</p>
                                </div>
                              </div>
                              {existingFiles.ktp && (
                                <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[9px] font-black uppercase">
                                  <span className="material-symbols-outlined text-[12px]">check_circle</span>
                                  Terunggah
                                </span>
                              )}
                            </div>
                            <input type="file" accept=".jpg,.jpeg,.png" onChange={(e) => setFormFiles({ ...formFiles, ktp: e.target.files ? e.target.files[0] : null })} className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer" />
                          </div>

                          {/* Ijazah */}
                          <div className={`p-5 rounded-2xl border-2 border-dashed transition-all ${existingFiles.ijazah ? 'bg-emerald-50/30 border-emerald-200' : 'bg-slate-50 border-slate-200 hover:border-primary/40'}`}>
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-4">
                                <div className={`size-10 rounded-lg flex items-center justify-center shadow-sm ${existingFiles.ijazah ? 'bg-emerald-500 text-white' : 'bg-white text-primary'}`}>
                                  <span className="material-symbols-outlined">description</span>
                                </div>
                                <div>
                                  <h5 className="text-xs font-bold text-slate-800">Ijazah / SKL</h5>
                                  <p className="text-[9px] text-slate-400 font-semibold">File: (.jpg, .png) maksimal 5MB</p>
                                </div>
                              </div>
                              {existingFiles.ijazah && (
                                <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[9px] font-black uppercase">
                                  <span className="material-symbols-outlined text-[12px]">check_circle</span>
                                  Terunggah
                                </span>
                              )}
                            </div>
                            <input type="file" accept=".jpg,.jpeg,.png" onChange={(e) => setFormFiles({ ...formFiles, ijazah: e.target.files ? e.target.files[0] : null })} className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer" />
                          </div>

                          {/* Transkrip */}
                          <div className={`p-5 rounded-2xl border-2 border-dashed transition-all ${existingFiles.transkrip ? 'bg-emerald-50/30 border-emerald-200' : 'bg-slate-50 border-slate-200 hover:border-primary/40'}`}>
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-4">
                                <div className={`size-10 rounded-lg flex items-center justify-center shadow-sm ${existingFiles.transkrip ? 'bg-emerald-500 text-white' : 'bg-white text-primary'}`}>
                                  <span className="material-symbols-outlined">assignment</span>
                                </div>
                                <div>
                                  <h5 className="text-xs font-bold text-slate-800">Transkrip Nilai</h5>
                                  <p className="text-[9px] text-slate-400 font-semibold">File: (.jpg, .png) maksimal 5MB</p>
                                </div>
                              </div>
                              {existingFiles.transkrip && (
                                <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[9px] font-black uppercase">
                                  <span className="material-symbols-outlined text-[12px]">check_circle</span>
                                  Terunggah
                                </span>
                              )}
                            </div>
                            <input type="file" accept=".jpg,.jpeg,.png" onChange={(e) => setFormFiles({ ...formFiles, transkrip: e.target.files ? e.target.files[0] : null })} className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer" />
                          </div>

                          <div className="md:col-span-2 flex justify-end gap-3">
                            <button onClick={handleSubmitBiodata} disabled={isSubmitting} className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-12 rounded-xl transition-all shadow-md shadow-emerald-100 disabled:opacity-50">
                              {isSubmitting ? 'Menyimpan...' : 'Simpan Berkas'}
                            </button>
                            <button
                              onClick={() => {
                                setActiveTab(null);
                              }}
                              className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-3 px-8 rounded-xl transition-all"
                            >
                              Batal
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {!activeTab && (
              <div className="space-y-8 mt-10">
                {/* Row 1: Payment Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Payment Card */}
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-6">
                      <div className="size-11 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-xl">payments</span>
                      </div>
                      {paymentStatus === 'verified' && <span className="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider">Terverifikasi</span>}
                      {paymentStatus === 'pending' && <span className="bg-amber-100 text-amber-700 px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider">Menunggu</span>}
                      {paymentStatus === 'belum_bayar' && <span className="bg-slate-100 text-slate-500 px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider">Belum Bayar</span>}
                    </div>

                    <h3 className="font-bold text-slate-800 text-base mb-1">Tagihan Pendaftaran</h3>
                    <p className="text-2xl font-bold text-slate-800 mb-6">Rp 375.000</p>

                    {paymentStatus === 'verified' ? (
                      <button onClick={handlePrint} className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-primary/10">
                        <span className="material-symbols-outlined text-[18px]">print</span>
                        Cetak Kwitansi
                      </button>
                    ) : (
                      paymentStatus === 'pending' ? (
                        <div className="w-full bg-slate-50 text-slate-400 font-bold py-3 rounded-xl text-center text-xs border border-slate-100">
                          Menunggu Verifikasi
                        </div>
                      ) : (
                        <button onClick={() => setIsKonfirmasiModalOpen(true)} className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all">
                          <span className="material-symbols-outlined text-[18px]">upload_file</span>
                          Konfirmasi Bayar
                        </button>
                      )
                    )}
                  </div>

                  {/* Bank Details Card */}
                  <div className="bg-[#1e293b] rounded-3xl p-6 text-white shadow-xl shadow-slate-200/50 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="size-9 bg-white/10 rounded-lg flex items-center justify-center">
                          <span className="material-symbols-outlined text-lg">account_balance</span>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Metode Transfer</p>
                      </div>
                      <p className="text-xs font-bold text-slate-200 mb-1">YAYASAN HANG TUAH PEKANBARU</p>
                      <p className="text-xl font-black text-white mb-2">00323-01-30-000028-7</p>
                    </div>
                    <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Bank BTN Syariah</span>
                      <div className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded text-[9px] font-bold border border-emerald-500/30">Kode Bayar: {paymentCode}</div>
                    </div>
                  </div>
                </div>

                {/* Row 2: Instructions & Help Center Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Instruksi Penting */}
                  <div className="lg:col-span-7 bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm hover:shadow-xl hover:shadow-slate-200/20 transition-all duration-500 relative overflow-hidden group">
                    <div className="absolute -right-10 -top-10 size-40 bg-rose-50 rounded-full blur-3xl group-hover:bg-rose-100/50 transition-colors"></div>

                    <div className="flex items-center gap-4 mb-8 relative z-10">
                      <div className="size-12 bg-rose-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/30">
                        <i className="fa-solid fa-circle-info text-[22px]"></i>
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider">Instruksi Penting</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Harap diperhatikan</p>
                      </div>
                    </div>

                    <div className="space-y-4 relative z-10">
                      {[
                        { num: '1', text: `Wajib tulis kode bayar <strong class="text-rose-600 font-black underline decoration-rose-200 underline-offset-4">${paymentCode}</strong> pada slip setoran jika Anda melakukan setor tunai di Bank.` },
                        { num: '2', text: 'Sertakan tulisan kode bayar pada struk transfer ATM atau screenshot M-Banking sebelum diunggah.' }
                      ].map((item, idx) => (
                        <div key={idx} className="p-5 bg-slate-50/50 hover:bg-white hover:shadow-md hover:shadow-slate-200/40 border border-slate-100 rounded-2xl flex gap-5 transition-all duration-300 group/item">
                          <span className="size-8 shrink-0 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-xs font-black text-rose-500 shadow-sm group-hover/item:bg-rose-500 group-hover/item:text-white group-hover/item:border-rose-500 transition-all">{item.num}</span>
                          <p className="text-[13px] text-slate-600 leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: item.text }}></p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Help Center Section */}
                  <div className="lg:col-span-5 bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm flex flex-col hover:shadow-xl hover:shadow-slate-200/20 transition-all duration-500 relative overflow-hidden group">
                    <div className="absolute -right-10 -bottom-10 size-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>

                    <div className="flex items-center gap-4 mb-8 relative z-10">
                      <div className="size-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
                        <i className="fa-solid fa-headset text-[22px]"></i>
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider">Pusat Bantuan</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Siap Melayani</p>
                      </div>
                    </div>

                    <div className="space-y-3 flex-1 relative z-10">
                      {[
                        { name: 'Admin Mardeni', role: 'Teknis & Sistem', wa: '6282387639898' },
                        { name: 'Admin Yulanda', role: 'Pendaftaran & Berkas', wa: '628117561513' }
                      ].map((admin, idx) => (
                        <a key={idx} href={`https://wa.me/${admin.wa}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group/item bg-slate-50/30">
                          <div className="flex items-center gap-4">
                            <div className="size-10 bg-white shadow-sm border border-slate-100 text-emerald-500 rounded-xl flex items-center justify-center group-hover/item:bg-emerald-500 group-hover/item:text-white group-hover/item:border-emerald-500 transition-all">
                              <i className="fab fa-whatsapp text-lg"></i>
                            </div>
                            <div>
                              <p className="text-xs font-black text-slate-700">{admin.name}</p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="size-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{admin.role}</p>
                              </div>
                            </div>
                          </div>
                          <span className="material-symbols-outlined text-slate-300 group-hover/item:text-primary group-hover/item:translate-x-1 transition-all text-lg">arrow_forward_ios</span>
                        </a>
                      ))}
                    </div>
                    <div className="mt-6 pt-5 border-t border-slate-50 relative z-10">
                      <div className="bg-primary/5 rounded-xl px-4 py-3 flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[14px]">schedule</span>
                        <p className="text-[10px] text-primary/80 font-bold uppercase tracking-tight text-center">Tersedia: 08:00 - 16:00 WIB</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Row 3: Video Tutorial */}
                <div className="bg-slate-900 rounded-[32px] overflow-hidden shadow-2xl shadow-slate-900/20 border border-slate-800 group">
                  <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-8 py-5 flex items-center justify-between border-b border-slate-800">
                    <div className="flex items-center gap-4">
                      <div className="size-10 bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center border border-red-500/20">
                        <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">play_circle</span>
                      </div>
                      <div>
                        <span className="text-xs font-black text-white uppercase tracking-widest">Video Panduan Pendaftaran</span>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Universitas Hang Tuah Pekanbaru</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full">
                      <span className="size-1.5 bg-red-500 rounded-full animate-pulse"></span>
                      <span className="text-[9px] font-black text-red-500 uppercase">Tutorial</span>
                    </div>
                  </div>
                  <div className="relative aspect-video bg-black">
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src="https://www.youtube.com/embed/ghTNfJnyRQg?rel=0"
                      title="YouTube"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>

                {/* Row 4: Simple Footer Inside Content */}
                <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex items-center gap-6">
                    <img src="/logo-uhtp.png" alt="Logo" className="h-10 opacity-40 grayscale hover:grayscale-0 transition-all duration-500" />
                    <div>
                      <p className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Universitas Hang Tuah Pekanbaru</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Unggul & Terpercaya</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    {[
                      { id: 'facebook', color: 'hover:text-blue-600' },
                      { id: 'instagram', color: 'hover:text-pink-600' },
                      { id: 'twitter', color: 'hover:text-sky-500' },
                      { id: 'youtube', color: 'hover:text-red-600' }
                    ].map(social => (
                      <a key={social.id} href="#" className={`size-10 rounded-2xl border border-slate-200 flex items-center justify-center text-slate-400 ${social.color} hover:border-current hover:bg-slate-50 transition-all duration-300 shadow-sm hover:shadow-md`}>
                        <i className={`fab fa-${social.id} text-sm`}></i>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      {/* Footer Minimalist */}
      <footer className="py-10 text-center">
        <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">© 2016 - 2026 Universitas Hang Tuah Pekanbaru</p>
      </footer>

      {/* Modern Premium Payment Confirmation Modal */}
      {isKonfirmasiModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-300">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsKonfirmasiModalOpen(false)}></div>

          <div className="relative w-full max-w-lg bg-white rounded-[24px] shadow-2xl overflow-hidden border border-slate-100 flex flex-col z-10 animate-in zoom-in-95 duration-200 max-h-[90vh]">

            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="size-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-xl">cloud_upload</span>
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 text-lg">Konfirmasi Pembayaran</h3>
                  <p className="text-xs font-medium text-slate-500">Unggah bukti transfer Anda</p>
                </div>
              </div>
              <button
                onClick={() => setIsKonfirmasiModalOpen(false)}
                className="size-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto grow space-y-5">

              <div className="bg-blue-50 border border-blue-100 text-blue-800 px-4 py-3 rounded-xl flex items-start gap-3">
                <span className="material-symbols-outlined text-blue-500 shrink-0 mt-0.5">info</span>
                <p className="text-xs font-medium leading-relaxed">
                  Pastikan menulis Kode Pembayaran <strong className="font-mono bg-white px-1 py-0.5 rounded shadow-sm text-blue-700">{paymentCode}</strong> pada slip setoran atau struk ATM sebelum diunggah.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5 min-w-0">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">Tanggal Bayar</label>
                   <div className="relative">
                     <input 
                       ref={paymentDateRef}
                       type="date" 
                       value={tanggalBayar} 
                       onChange={(e) => setTanggalBayar(e.target.value)} 
                       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-medium transition-all pr-12 appearance-none" 
                     />
                     <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <span className="material-symbols-outlined text-slate-400 text-[20px]">calendar_month</span>
                     </div>
                     <button 
                       type="button"
                       onClick={() => {
                         try { paymentDateRef.current?.showPicker(); } catch { paymentDateRef.current?.focus(); }
                       }}
                       className="absolute inset-0 w-full h-full bg-transparent border-none cursor-pointer"
                       aria-label="Pilih Tanggal Bayar"
                     />
                   </div>
                </div>
                <div className="space-y-1.5 min-w-0">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">Kode Pembayaran</label>
                  <input type="text" defaultValue={paymentCode} readOnly className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl focus:outline-none text-sm font-medium transition-all cursor-not-allowed" />
                </div>
              </div>

              <div className="space-y-1.5 min-w-0">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">Nama Penyetor</label>
                <input type="text" value={namaPenyetor} onChange={(e) => setNamaPenyetor(e.target.value)} placeholder="Masukkan nama penyetor" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-medium transition-all" />
              </div>

              <div className="space-y-1.5 min-w-0">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">Unggah Bukti</label>
                <div className={`relative border-2 ${buktiFile ? 'border-primary bg-primary/5' : 'border-dashed border-slate-200 bg-slate-50'} rounded-xl hover:bg-slate-100 transition-colors cursor-pointer flex flex-col items-center justify-center p-6 group`}>
                  <input type="file" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*,.pdf" />
                  {buktiFile ? (
                    <>
                      <span className="material-symbols-outlined text-primary text-3xl mb-2">check_circle</span>
                      <p className="text-sm font-bold text-primary text-center truncate max-w-xs">{buktiFile.name}</p>
                      <p className="text-xs text-primary/70 mt-1">File berhasil dipilih</p>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors text-3xl mb-2">image</span>
                      <p className="text-sm font-bold text-slate-700">Pilih atau letakkan file di sini</p>
                      <p className="text-xs text-slate-500 mt-1">Format: JPG, PNG, PDF (Maks 5MB)</p>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-1.5 min-w-0">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">Jumlah Di Bayar</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">Rp</span>
                  <input type="text" defaultValue="375.000" readOnly className="w-full pl-11 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 cursor-not-allowed" />
                </div>
              </div>

              {submitMessage && (
                <div className={`px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-bold ${submitMessage.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                  <span className="material-symbols-outlined text-[18px]">
                    {submitMessage.type === 'success' ? 'check_circle' : 'error'}
                  </span>
                  {submitMessage.text}
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-slate-100 shrink-0 bg-slate-50 flex justify-end gap-3 rounded-b-[24px]">
              <button
                onClick={() => setIsKonfirmasiModalOpen(false)}
                className="px-5 py-2.5 rounded-xl font-bold text-sm text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button onClick={handleSubmitPembayaran} disabled={isSubmitting} className="px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0">
                {isSubmitting ? 'Mengirim...' : 'Kirim Bukti'}
                {!isSubmitting && <span className="material-symbols-outlined text-[18px]">send</span>}
              </button>
            </div>

          </div>
        </div>
      )}

      {renderPortals()}
    </div>
  );
};

export default UserDashboard;
