import { useState } from 'react';
import { createPortal } from 'react-dom';

// Common links data with modern curated colors
const links = [
    { id: 'visi-misi', title: 'Visi Misi', icon: 'school', color: '#475569' },
    { id: 'program-studi', title: 'Program Studi', icon: 'home', color: '#0d9488' },
    { id: 'akreditasi', title: 'Akreditasi', icon: 'new_releases', color: '#4338ca' },
    { id: 'jadwal', title: 'Jadwal', icon: 'schedule', color: '#b45309' },
    { id: 'cara-daftar', title: 'Cara Daftar', isCustomInfo: true, color: '#334155' },
    { id: 'persyaratan', title: 'Persyaratan', icon: 'rss_feed', color: '#6d28d9' },
    { id: 'contact', title: 'Contact', icon: 'call', color: '#059669' },
    { title: 'Pengumuman', icon: 'campaign', color: '#ea580c', colStart: 'lg:col-start-2' },
    { id: 'peserta-ujian', title: 'Peserta Ujian', icon: 'person_add', color: '#475569' },
    { title: 'Panduan', isCustomYoutube: true, color: '#be123c', url: 'http://www.youtube.com/@UniversitasHangTuahPekanbaru' },
    { id: 'pertanyaan', title: 'Pertanyaan', icon: 'help', color: '#475569' },
    { title: 'Lokasi', icon: 'location_on', color: '#475569', url: 'https://maps.google.com/?q=Universitas+Hang+Tuah+Pekanbaru' },
];

/**
 * Helper component untuk merender icon
 */
function renderIcon(link: any, iconClass: string, infoClass: string, ytClass: string) {
    if (link.isCustomYoutube) {
        return (
            <div className={`flex justify-center items-center flex-col leading-none ${ytClass}`}>
                <span className="font-bold tracking-tighter" style={{ fontFamily: 'Impact, sans-serif' }}>You</span>
                <span className="font-bold tracking-tighter border-2 border-current px-1 rounded mt-0.5" style={{ fontFamily: 'Impact, sans-serif' }}>Tube</span>
            </div>
        );
    }
    if (link.isCustomInfo) {
        return (
            <div className={`flex justify-center items-center font-black ${infoClass}`} style={{ fontFamily: 'Arial, sans-serif' }}>
                i
            </div>
        );
    }
    return (
        <span className={`material-symbols-outlined ${iconClass}`}>
            {link.icon}
        </span>
    );
}

const prodiData = [
    { no: 1, nama: 'S2 Ilmu Kesehatan Masyarakat', izin: 'Izin DIKTI 9013/D/T/K.X/2011', gelar: 'Gelar MKM', lama: 'Lama Studi 2 Tahun', detail: '' },
    { no: 2, nama: 'S1 Kesehatan Masyarakat', izin: 'Izin DIKTI 11697/D/T/K-X/2012', gelar: 'Gelar SKM', lama: '', detail: 'Lama Studi 4 Tahun (Jalur A dan A Non) Dari Tamatan SMA\nLama Studi 2,5 Tahun (Jalur B dan B Non) Dari D3 Ke S1' },
    { no: 3, nama: 'S1 Keperawatan', izin: 'Izin DIKTI 13380/D/T/K-X/2012', gelar: 'Gelar S. Kep', lama: '', detail: 'Lama Studi 4 Tahun (Jalur Reguler) Dari Tamatan SMA/SMK\nLama Studi 2,5 Tahun (Jalur NON Reguler) Dari D3 Ke S1' },
    { no: 4, nama: 'Profesi Ners', izin: 'Izin DIKTI 138/E/O/2013', gelar: 'Gelar Ners', lama: 'Lama Studi 1 Tahun (Menerima Lulusan dari Kampus Lain)', detail: '' },
    { no: 5, nama: 'D3 RMIK', izin: 'Izin DIKTI 3759/D/T/K.X/2010', gelar: 'Gelar Amd. RMIK', lama: 'Lama Studi 3 Tahun', detail: '' },
    { no: 6, nama: 'D3 Kebidanan', izin: 'Izin DIKTI 9078/D/T/K.X/2011', gelar: 'Gelar Amd. Keb', lama: 'Lama Studi 3 Tahun', detail: '' },
    { no: 7, nama: 'S1 Kebidanan', izin: 'Izin DIKTI 73/E/O/2022', gelar: 'Gelar S.Keb', lama: 'Lama Studi 4 Tahun', detail: '' },
    { no: 8, nama: 'Profesi Bidan', izin: 'Izin DIKTI 73/E/O/2022', gelar: 'Gelar S.Keb', lama: 'Lama Studi 1 Tahun', detail: '' },
    { no: 9, nama: 'S1 Teknik Informatika', izin: 'Izin DIKTI 9012/D/T/K-X/2011', gelar: 'Gelar S.Kom', lama: 'Lama Studi 4 Tahun', detail: '' },
    { no: 10, nama: 'S1 Sistem Informasi', izin: 'Izin DIKTI 9012/D/T/K-X/2011', gelar: 'Gelar S.Kom', lama: 'Lama Studi 4 Tahun', detail: '' },
    { no: 11, nama: 'S1 Ilmu Hukum', izin: 'Izin DIKTI 73/E/O/2022', gelar: 'Gelar S.H', lama: 'Lama Studi 4 Tahun', detail: '' },
    { no: 12, nama: 'S1 Ilmu Komunikasi', izin: 'Izin DIKTI 73/E/O/2022', gelar: 'Gelar S.I.Kom', lama: 'Lama Studi 4 Tahun', detail: '' },
];

const akreditasiData = [
    { no: 1, nama: 'S2 Ilmu Kesehatan Masyarakat', akreditasi: 'Unggul' },
    { no: 2, nama: 'S1 Kesehatan Masyarakat', akreditasi: 'Baik Sekali' },
    { no: 3, nama: 'S1 Ilmu Keperawatan', akreditasi: 'B' },
    { no: 4, nama: 'S1 Kebidanan', akreditasi: 'Baik' },
    { no: 5, nama: 'Profesi Ners', akreditasi: 'B' },
    { no: 6, nama: 'Pendidikan Profesi Bidan', akreditasi: 'B' },
    { no: 7, nama: 'D3 RMIK', akreditasi: 'B' },
    { no: 8, nama: 'D3 Kebidanan', akreditasi: 'B' },
    { no: 9, nama: 'S1 Teknik Informatika', akreditasi: 'Baik Sekali' },
    { no: 10, nama: 'S1 Sistem Informasi', akreditasi: 'Baik Sekali' },
    { no: 11, nama: 'S1 Ilmu Hukum', akreditasi: 'Baik' },
    { no: 12, nama: 'S1 Ilmu Komunikasi', akreditasi: 'Baik' },
];

const caraDaftarData = [
    "Lakukan pendaftaran pada menu register pada Halaman Awal",
    "Masukan email dan password anda pada menu login sistem.",
    "Lakukan pembayaran uang formulir sesuai dengan pemberitahuan yang ada pada sistem, pemberitahuan tersebut meliputi :\n• Jumlah yang harus dibayar sesuai dengan program studi yang diambil pada saat register\n• No rekening yang akan ditransfer\n• Kode pembayaran yang harus anda tulis pada slip setoran\n• Kode pembayaran yang harus anda tulis pada slip transfer ATM, apabila anda melakukan transfer melalui ATM",
    "Lakukan konfirmasi pembayaran dengan mengupload bukti pembayaran anda",
    "Tunggu beberapa saat pembayaran anda akan divalidasi oleh bagian keuangan STIKES-STMIK Hang Tuah Pekanbaru",
    "Apabila pembayaran anda sudah di verifikasi oleh bagian keuangan, silahkan masuk ke tahap selanjutnya, yaitu mengisi biodata pribadi, data asal sekolah, biodata orang tua, dan upload persyaratan",
    "Langkah selanjutnya silahkan anda melakukan pengecekan lagi terhadap data yang telah diisi, apabila tidak ada lagi kesalahan data silahkan lakukan finalisasi",
    "Perlu diingat, apabila data yang sudah di finalisasi, data tersebut tidak akan bisa diubah lagi, selanjutnya silahkan cek kartu ujian anda"
];

const faqData = [
    {
        kategori: "Pertanyaan Umum",
        items: [
            {
                tanya: "Apa Perbedaan S1 IKM Jalur A Reguler dengan A Non Reguler ?",
                jawab: "Perbedaan antara S1 IKM jalur A Reguler dengan A Non Reguler terletak pada jadwal perkuliahan, yaitu :\n• S1 IKM jalur A Reguler perkuliahan di laksanakan dari hari senin sampai dengan hari kamis\n• S1 IKM jalur A Non Reguler perkuliahan di laksanakan dari hari jumat dan sabtu\n• Calon Mahasiswa untuk jalur A dan A Non Reguler dari tamatan SMA dan sederajat"
            },
            {
                tanya: "Apa Perbedaan S1 IKM Jalur B Reguler dengan B Non Reguler ?",
                jawab: "Perbedaan antara S1 IKM jalur B Reguler dengan B Non Reguler terletak pada latar belakang pendidikan sebelumnya dan jadwal perkuliahan."
            },
            {
                tanya: "Berapa Lama Masa Studi S1 IKM jalur B Reguler dan B Non Reguler ?",
                jawab: "Lama masa studi untuk S1 IKM jalur B Reguler maupun B Non Reguler kurang lebih 2,5 tahun."
            }
        ]
    },
    {
        kategori: "Pendaftaran",
        items: [
            {
                tanya: "Bolehkah Saya Mendaftar Kalau Ijazah Saya Belum Keluar ?",
                jawab: "Boleh, pendaftaran dapat dilakukan menggunakan Surat Keterangan Lulus (SKL) sementara sampai ijazah asli diterbitkan."
            },
            {
                tanya: "Bagaimana Cara Mendaftar di Universitas Hang Tuah Pekanbaru ?",
                jawab: "Pendaftaran dapat dilakukan secara online melalui website dengan mengakses menu register, atau mendaftar secara offline dengan datang langsung ke kampus."
            }
        ]
    }
];

// ==========================================
// Colorful Bento Cards (Pilihan User)
// Menggabungkan kotak putih bersih dengan aksen warna ikon yang sangat kuat.
// ==========================================
export function IconBarOption3() {
    const [activeModal, setActiveModal] = useState<string | null>(null);

    const handleLinkClick = (e: React.MouseEvent, id?: string) => {
        if (id) {
            e.preventDefault();
            setActiveModal(id);
        }
    };

    const renderModalContent = () => {
        switch (activeModal) {
            case 'visi-misi':
                return (
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                                    <span className="material-symbols-outlined">visibility</span>
                                </div>
                                <h4 className="text-xl font-bold text-slate-900">Visi</h4>
                            </div>
                            <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs">
                                <p className="text-slate-600 leading-relaxed text-lg font-medium italic italic">
                                    "Terwujudnya Universitas Unggul dan menghasilkan lulusan sesuai kompetensi yang mampu bersaing ditingkat Asia Tenggara tahun 2036"
                                </p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                                    <span className="material-symbols-outlined">flag</span>
                                </div>
                                <h4 className="text-xl font-bold text-slate-900">Misi</h4>
                            </div>
                            <div className="grid gap-3">
                                {[
                                    "Melaksanakan proses pembelajaran yang berkualitas baik pada tenaga pendidik dan mahasiswa agar memiliki daya saing yang tinggi;",
                                    "Melaksanakan penelitian yang berkualitas, inovatif dan teruji sesuai kompetensi keilmuan;",
                                    "Melaksanakan pengabdian masyarakat sebagai implementasi hasil penelitian dan kepedulian lainnya;",
                                    "Melaksanakan pengabdian masyarakat berbasis karya ilmiah civitas akademika baik terstruktur maupun insidentil;",
                                    "Melakukan Kerjasama dengan berbagai stakeholder seperti pemerintah, swasta, PT dan instansi terkait dalam menunjang kompetensi lulusan;"
                                ].map((misi, idx) => (
                                    <div key={idx} className="flex items-start gap-4 p-4 bg-white border border-slate-100 rounded-xl hover:border-slate-200 transition-colors">
                                        <div className="flex-shrink-0 size-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold">
                                            {idx + 1}
                                        </div>
                                        <p className="text-slate-600 leading-relaxed text-[15px]">{misi}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 'program-studi':
                return (
                    <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                                    <th className="p-5 font-bold text-[11px] uppercase tracking-widest text-center">No</th>
                                    <th className="p-5 font-bold text-[11px] uppercase tracking-widest">Program Studi</th>
                                    <th className="p-5 font-bold text-[11px] uppercase tracking-widest">Izin DIKTI</th>
                                    <th className="p-5 font-bold text-[11px] uppercase tracking-widest">Gelar</th>
                                    <th className="p-5 font-bold text-[11px] uppercase tracking-widest">Lama Studi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {prodiData.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="p-5 text-center text-slate-400 font-medium text-sm">{item.no}</td>
                                        <td className="p-5 font-bold text-slate-800 text-[15px]">{item.nama}</td>
                                        <td className="p-5 text-slate-500 text-xs font-medium">{item.izin}</td>
                                        <td className="p-5">
                                            <span className="px-3 py-1 bg-slate-100 text-slate-600 font-bold rounded-full text-[10px] uppercase tracking-tight border border-slate-200">
                                                {item.gelar}
                                            </span>
                                        </td>
                                        <td className="p-5 text-slate-600 text-[13px] leading-relaxed">
                                            {item.lama && <div className="font-semibold text-slate-700">{item.lama}</div>}
                                            {item.detail && (
                                                <div className="mt-1 text-slate-500 space-y-1">
                                                    {item.detail.split('\n').map((line, i) => (
                                                        <div key={i} className="flex items-start gap-2">
                                                            <span className="text-slate-300 mt-1">•</span>
                                                            <span>{line.replace('• ', '')}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
            case 'akreditasi':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {akreditasiData.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-5 bg-white border border-slate-200 rounded-2xl hover:border-slate-300 transition-all duration-300 group">
                                <div className="flex items-center gap-4">
                                    <div className="size-8 rounded-lg bg-slate-100 text-slate-400 font-bold text-xs flex items-center justify-center">
                                        {item.no}
                                    </div>
                                    <span className="font-bold text-slate-800 text-[15px]">{item.nama}</span>
                                </div>
                                <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg border ${
                                    item.akreditasi === 'Unggul' || item.akreditasi === 'Baik Sekali'
                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                    : 'bg-slate-50 text-slate-600 border-slate-100'
                                }`}>
                                    {item.akreditasi}
                                </span>
                            </div>
                        ))}
                    </div>
                );
            case 'jadwal':
                return (
                    <div className="flex flex-col items-center justify-center py-12 px-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                        <div className="size-20 bg-slate-200 text-slate-600 rounded-full flex items-center justify-center mb-6">
                            <span className="material-symbols-outlined text-[40px]">calendar_month</span>
                        </div>
                        <h4 className="text-2xl font-bold text-slate-800 mb-3 tracking-tight">Jadwal Segera Diumumkan</h4>
                        <p className="text-slate-600 text-base max-w-md mx-auto leading-relaxed">
                            Saat ini jadwal penerimaan mahasiswa baru sedang dalam tahap penyusunan. Pantau terus informasi terbaru melalui portal ini!
                        </p>
                    </div>
                );
            case 'cara-daftar':
                return (
                    <div className="space-y-6 relative py-4">
                        <div className="absolute left-[30px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-rose-200 via-rose-300 to-rose-200 hidden md:block opacity-50"></div>
                        {caraDaftarData.map((step, idx) => (
                            <div key={idx} className="relative flex flex-col md:flex-row gap-5 items-start md:items-center bg-white p-5 rounded-box border border-slate-100 shadow-[0_2px_10px_-3px_rgba(225,29,72,0.05)] hover:shadow-[0_8px_30px_rgb(225,29,72,0.1)] hover:border-rose-200 transition-all duration-300 group rounded-2xl">
                                <div className="flex-shrink-0 z-10 w-[52px] h-[52px] bg-rose-50 border-2 border-rose-200 text-rose-600 rounded-2xl flex items-center justify-center font-black text-xl group-hover:bg-rose-500 group-hover:text-white group-hover:border-rose-500 group-hover:-rotate-6 transition-all shadow-sm">
                                    {idx + 1}
                                </div>
                                <div className="flex-1 text-slate-700 text-[15px] sm:text-base pr-2 leading-relaxed">
                                    {step.split('\n').map((line, i) => (
                                        <div key={i} className={`${i > 0 ? 'ml-2 sm:ml-4 mt-2 text-slate-500 flex items-start gap-2.5 text-sm' : 'font-bold text-slate-800'}`}>
                                            {i > 0 && <span className="text-rose-400 mt-0.5 flex-shrink-0 material-symbols-outlined text-[16px]">chevron_right</span>}
                                            <span className={i > 0 ? "flex-1 pt-0.5 font-medium" : ""}>{line.replace('• ', '')}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 'contact':
                return (
                    <div className="space-y-8">
                        <div className="p-6 bg-white border border-slate-200 rounded-2xl space-y-4">
                            <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <span className="material-symbols-outlined text-slate-400">info</span>
                                Hubungi Kami
                            </h4>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pendaftaran Online</div>
                                    <div className="text-slate-700 font-bold">Melalui Website Resmi</div>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pendaftaran Offline</div>
                                    <div className="text-slate-700 font-bold">Datang Langsung Ke Kampus</div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                            <h4 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3">Pendaftaran</h4>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 text-slate-700">
                                    <div className="size-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                                        <span className="material-symbols-outlined text-[18px]">person</span>
                                    </div>
                                    <span className="font-medium text-[15px]">Yulanda : <a href="tel:08117561513" className="font-bold text-teal-600 hover:text-teal-700 transition-colors">0811-7561-513</a></span>
                                </li>
                                <li className="flex items-center gap-3 text-slate-700">
                                    <div className="size-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                                        <span className="material-symbols-outlined text-[18px]">person</span>
                                    </div>
                                    <span className="font-medium text-[15px]">Gatot : <a href="tel:082172595019" className="font-bold text-teal-600 hover:text-teal-700 transition-colors">0821-7259-5019</a></span>
                                </li>
                                <li className="flex items-center gap-3 pt-1">
                                    <a href="#" className="size-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-colors" title="Facebook">
                                        <span className="font-bold font-serif text-lg">f</span>
                                    </a>
                                    <a href="#" className="size-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2] transition-colors" title="Twitter">
                                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                                    </a>
                                    <a href="#" className="size-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-gradient-to-tr hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] hover:text-white hover:border-transparent transition-all" title="Instagram">
                                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.981 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                                        </svg>
                                    </a>
                                    <a href="#" className="size-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] transition-colors" title="LinkedIn">
                                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                                    </a>
                                    <a href="#" className="size-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-[#DB4437] hover:text-white hover:border-[#DB4437] transition-colors" title="Google Plus">
                                        <span className="font-bold text-[14px]">G+</span>
                                    </a>
                                </li>
                                <li className="flex items-center gap-3 text-slate-700 pt-1">
                                    <div className="size-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                                        <span className="material-symbols-outlined text-[18px]">mail</span>
                                    </div>
                                    <span className="font-medium text-[15px]">Email : <a href="mailto:spmb@htp.ac.id" className="font-bold text-teal-600 hover:text-teal-700 transition-colors">spmb@htp.ac.id</a></span>
                                </li>
                            </ul>
                        </div>
                    </div>
                );
            case 'peserta-ujian':
                return (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <span>Show</span>
                                <select className="border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-700 font-medium bg-slate-50">
                                    <option>100</option>
                                    <option>50</option>
                                    <option>25</option>
                                    <option>10</option>
                                </select>
                                <span>entries</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600 w-full sm:w-auto">
                                <span>Search:</span>
                                <input type="text" className="border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-full sm:w-48 transition-all" />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[700px]">
                                <thead>
                                    <tr className="bg-slate-50/80 text-slate-600 border-b-2 border-slate-200 text-sm">
                                        <th className="px-4 py-3 font-bold w-16 cursor-pointer hover:bg-slate-100 group/th transition-colors">
                                            <div className="flex items-center justify-between">
                                                No
                                                <div className="flex flex-col opacity-50 space-y-[-8px]">
                                                    <span className="material-symbols-outlined text-[14px]">arrow_drop_up</span>
                                                    <span className="material-symbols-outlined text-[14px]">arrow_drop_down</span>
                                                </div>
                                            </div>
                                        </th>
                                        <th className="px-4 py-3 font-bold cursor-pointer hover:bg-slate-100 group/th transition-colors">
                                            <div className="flex items-center justify-between">
                                                Nama
                                                <div className="flex flex-col opacity-50 space-y-[-8px]">
                                                    <span className="material-symbols-outlined text-[14px]">arrow_drop_up</span>
                                                    <span className="material-symbols-outlined text-[14px]">arrow_drop_down</span>
                                                </div>
                                            </div>
                                        </th>
                                        <th className="px-4 py-3 font-bold cursor-pointer hover:bg-slate-100 group/th transition-colors">
                                            <div className="flex items-center justify-between">
                                                Pilihan
                                                <div className="flex flex-col opacity-50 space-y-[-8px]">
                                                    <span className="material-symbols-outlined text-[14px]">arrow_drop_up</span>
                                                    <span className="material-symbols-outlined text-[14px]">arrow_drop_down</span>
                                                </div>
                                            </div>
                                        </th>
                                        <th className="px-4 py-3 font-bold cursor-pointer hover:bg-slate-100 group/th transition-colors">
                                            <div className="flex items-center justify-between">
                                                Gel
                                                <div className="flex flex-col opacity-50 space-y-[-8px]">
                                                    <span className="material-symbols-outlined text-[14px]">arrow_drop_up</span>
                                                    <span className="material-symbols-outlined text-[14px]">arrow_drop_down</span>
                                                </div>
                                            </div>
                                        </th>
                                        <th className="px-4 py-3 font-bold cursor-pointer hover:bg-slate-100 group/th transition-colors">
                                            <div className="flex items-center justify-between">
                                                No. Ujian
                                                <div className="flex flex-col opacity-50 space-y-[-8px]">
                                                    <span className="material-symbols-outlined text-[14px]">arrow_drop_up</span>
                                                    <span className="material-symbols-outlined text-[14px]">arrow_drop_down</span>
                                                </div>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td colSpan={5} className="px-4 py-8 text-center text-slate-500 bg-slate-50/30 text-[15px] font-medium border-b border-slate-100">
                                            No data available in table
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[13px] text-slate-500 bg-slate-50/30">
                            <div>Showing 0 to 0 of 0 entries</div>
                            <div className="flex items-center rounded-lg border border-slate-200 overflow-hidden bg-white shadow-sm">
                                <button className="px-4 py-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors border-r border-slate-200 disabled:opacity-50" disabled>Previous</button>
                                <button className="px-4 py-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors disabled:opacity-50" disabled>Next</button>
                            </div>
                        </div>
                        
                        <div className="px-5 py-5 bg-white flex items-center justify-between shadow-inner">
                            <p className="font-bold text-slate-700 text-[16px]">Jumlah Data : <span className="font-black text-slate-900 bg-slate-100 px-2 py-1 rounded-md">1469 Data</span></p>
                            
                            <div className="hidden sm:flex h-2.5 w-64 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                                <div className="w-1/3 bg-slate-400 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                );
            case 'pertanyaan':
                return (
                    <div className="space-y-8">
                        {faqData.map((kategori, catIdx) => (
                            <div key={catIdx} className="space-y-4">
                                <h4 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-2">
                                    {kategori.kategori}
                                </h4>
                                <div className="space-y-3">
                                    {kategori.items.map((item, itemIdx) => (
                                        <details key={itemIdx} className="group bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                                            <summary className="list-none [&::-webkit-details-marker]:hidden flex items-center justify-between gap-4 p-4 font-semibold text-slate-700 cursor-pointer hover:bg-slate-50 transition-colors">
                                                <span className="text-[15px]">{item.tanya}</span>
                                                <span className="relative flex-shrink-0 ml-1.5 w-6 h-6 flex items-center justify-center bg-slate-100 rounded-full group-open:bg-primary/10 transition-colors">
                                                    <span className="absolute bg-slate-500 group-open:bg-primary w-3 h-[2px] rounded-full transition-all duration-300" />
                                                    <span className="absolute bg-slate-500 group-open:bg-primary w-[2px] h-3 rounded-full transition-all duration-300 group-open:rotate-90 group-open:opacity-0" />
                                                </span>
                                            </summary>
                                            <div className="px-5 pb-5 pt-1 text-slate-600 text-[14px] leading-relaxed border-t border-slate-100 bg-slate-50/50">
                                                {item.jawab.split('\n').map((line, i) => (
                                                    <div key={i} className={line.startsWith('•') ? "ml-3 mt-1.5 flex items-start gap-2" : "mt-2 font-medium text-slate-700"}>
                                                        {line.startsWith('•') ? (
                                                            <>
                                                                <span className="text-primary mt-1 text-[10px]">●</span>
                                                                <span>{line.replace('• ', '')}</span>
                                                            </>
                                                        ) : (
                                                            line
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </details>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                );
            default:
                return null;
        }
    };

    const getActiveTitle = () => {
        switch (activeModal) {
            case 'visi-misi': return 'Visi Misi Universitas';
            case 'program-studi': return 'Program Studi Universitas Hang Tuah Pekanbaru';
            case 'akreditasi': return 'Akreditasi Program Studi';
            case 'jadwal': return 'Jadwal Penerimaan Mahasiswa Baru';
            case 'cara-daftar': return 'Cara Mendaftar Penerimaan Mahasiswa Baru';
            case 'contact': return 'Hubungi Kami';
            case 'peserta-ujian': return 'Peserta Ujian Gelombang Yang Mendaftar Online Universitas Hang Tuah';
            case 'pertanyaan': return 'Frequently Asked Question';
            default: return 'Informasi';
        }
    };

    return (
        <div className="w-full">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 auto-rows-[85px] md:auto-rows-[100px] gap-3 md:gap-4">
                {links.map((link, idx) => {
                    // Define bento spans
                    let spanClass = "";
                    if (link.id === 'program-studi') spanClass = "md:col-span-2 md:row-span-2"; // Featured
                    else if (link.id === 'visi-misi') spanClass = "md:col-span-2"; // Wide
                    else if (link.id === 'jadwal') spanClass = "md:row-span-2"; // Tall
                    else if (link.id === 'cara-daftar') spanClass = "md:col-span-2"; // Wide
                    
                    return (
                        <a
                            key={idx}
                            href={link.url || "#"}
                            target={link.url ? "_blank" : undefined}
                            rel={link.url ? "noopener noreferrer" : undefined}
                            onClick={(e) => {
                                if (!link.url) {
                                    e.preventDefault();
                                    handleLinkClick(e, link.id);
                                }
                            }}
                            className={`
                                group relative flex flex-col justify-center p-3 md:p-4 
                                bg-white rounded-xl border border-slate-100 shadow-sm
                                hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 
                                hover:-translate-y-1 transition-all duration-300 ease-out
                                overflow-hidden ${spanClass}
                            `}
                        >


                            <div
                                style={{ 
                                    backgroundColor: `${link.color}10`, 
                                    color: link.color 
                                }}
                                className="flex-shrink-0 size-7 md:size-8 rounded-lg flex items-center justify-center group-hover:scale-105 transition-all duration-300 mb-2"
                            >
                                {renderIcon(link, 'text-[15px]', 'text-[17px]', 'text-[7px]')}
                            </div>

                            <div className="relative z-10">
                                <span className="block text-[10px] md:text-[11px] font-bold text-slate-700 group-hover:text-primary transition-colors tracking-tight leading-tight uppercase mb-1">
                                    {link.title}
                                </span>
                                <div className="flex items-center gap-1 text-slate-400">
                                    <span className="text-[8px] font-bold uppercase tracking-wider">{link.url ? 'Link' : 'Detail'}</span>
                                    <span className="material-symbols-outlined text-[10px]">arrow_forward</span>
                                </div>
                            </div>
                        </a>
                    );
                })}
            </div>

            {/* Modal Overlay Premium */}
            {activeModal && createPortal(
                <div 
                    className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 md:p-8 bg-slate-900/60 backdrop-blur-md transition-opacity animate-in fade-in duration-500"
                    onClick={() => setActiveModal(null)}
                >
                    <div 
                        className="bg-white w-full h-full max-h-[90vh] sm:h-auto sm:max-h-[85vh] sm:rounded-[2rem] rounded-3xl shadow-2xl flex flex-col overflow-hidden max-w-5xl relative animate-in zoom-in-95 slide-in-from-bottom-4 duration-500"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Decorative Top Line */}
                        <div 
                            className="h-2 w-full" 
                            style={{ backgroundColor: links.find(l => l.id === activeModal)?.color || '#3b82f6' }}
                        ></div>
                        {/* Modal Header */}
                        <div className="px-6 py-5 sm:px-8 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10 shadow-[0_4px_20px_-15px_rgba(0,0,0,0.1)]">
                            <div className="flex items-center gap-4 pr-4">
                                <div 
                                    className="hidden sm:flex size-12 rounded-2xl items-center justify-center text-white shadow-lg shadow-current/30" 
                                    style={{ 
                                        backgroundColor: links.find(l => l.id === activeModal)?.color || '#3b82f6',
                                        color: links.find(l => l.id === activeModal)?.color || '#3b82f6' // for shadow
                                    }}
                                >
                                    <div className="text-white flex items-center justify-center">
                                        {links.find(l => l.id === activeModal)?.icon 
                                            ? <span className="material-symbols-outlined text-[28px]">{links.find(l => l.id === activeModal)?.icon}</span>
                                            : <span className="font-black text-3xl" style={{ fontFamily: 'Arial, sans-serif' }}>i</span>
                                        }
                                    </div>
                                </div>
                                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight leading-tight">
                                    {getActiveTitle()}
                                </h3>
                            </div>
                            <button 
                                onClick={() => setActiveModal(null)}
                                className="flex-shrink-0 p-2.5 rounded-full bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-600 transition-colors"
                            >
                                <span className="material-symbols-outlined font-bold">close</span>
                            </button>
                        </div>
                        {/* Modal Body */}
                        <div className="px-5 sm:px-8 py-6 sm:py-8 overflow-y-auto w-full custom-scrollbar flex-1 bg-slate-50/30">
                            {renderModalContent()}
                        </div>
                        {/* Modal Footer */}
                        <div className="px-6 py-5 sm:px-8 border-t border-slate-100 bg-white flex justify-end">
                            <button 
                                onClick={() => setActiveModal(null)}
                                className="px-8 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors active:scale-95 text-[15px]"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
