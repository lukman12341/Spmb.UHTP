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
    "Masukkan email dan password Anda pada menu login sistem.",
    "Lakukan pembayaran uang formulir sesuai dengan pemberitahuan yang ada pada sistem, pemberitahuan tersebut meliputi :\n• Jumlah yang harus dibayar sesuai dengan program studi yang diambil pada saat register\n• No rekening yang akan ditransfer\n• Kode pembayaran yang harus Anda tulis pada slip setoran\n• Kode pembayaran yang harus Anda tulis pada slip transfer ATM, apabila Anda melakukan transfer melalui ATM",
    "Lakukan konfirmasi pembayaran dengan mengunggah bukti pembayaran Anda",
    "Tunggu beberapa saat, pembayaran Anda akan divalidasi oleh bagian keuangan Universitas Hang Tuah Pekanbaru",
    "Apabila pembayaran Anda sudah diverifikasi oleh bagian keuangan, silakan masuk ke tahap selanjutnya, yaitu mengisi biodata pribadi, data asal sekolah, biodata orang tua, dan unggah persyaratan",
    "Langkah selanjutnya, silakan Anda melakukan pengecekan lagi terhadap data yang telah diisi. Apabila tidak ada lagi kesalahan data, silakan lakukan finalisasi",
    "Perlu diingat, apabila data sudah difinalisasi, data tersebut tidak akan bisa diubah lagi. Selanjutnya, silakan cek kartu ujian Anda"
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
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 auto-rows-[120px] md:auto-rows-[130px] gap-4 md:gap-5">
                {links.map((link, idx) => {
                    // Define bento spans and descriptions
                    let spanClass = "";
                    let isFeatured = false;
                    let desc = "";

                    if (link.id === 'program-studi') {
                        spanClass = "col-span-2 md:col-span-2 md:row-span-2";
                        isFeatured = true;
                        desc = "Temukan berbagai pilihan program studi unggulan yang sesuai dengan minat dan passion Anda untuk masa depan.";
                    } else if (link.id === 'visi-misi') {
                        spanClass = "col-span-2 md:col-span-2";
                        desc = "Mengenal lebih dekat visi, misi, dan tujuan universitas.";
                    } else if (link.id === 'jadwal') {
                        spanClass = "md:row-span-2";
                        desc = "Cek tanggal penting jadwal pendaftaran.";
                    } else if (link.id === 'cara-daftar') {
                        spanClass = "col-span-2 md:col-span-2";
                        desc = "Panduan langkah demi langkah proses pendaftaran.";
                    }

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
                                group relative flex flex-col p-5 md:p-6 
                                bg-white rounded-3xl border border-slate-100 shadow-sm
                                hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30 
                                hover:-translate-y-1.5 transition-all duration-500 ease-out
                                overflow-hidden ${spanClass} ${isFeatured ? 'justify-end' : 'justify-between'}
                            `}
                        >
                            {/* Background Elements for Featured Item */}
                            {isFeatured && (
                                <>
                                    <div className="absolute inset-0 opacity-[0.03] bg-gradient-to-br from-primary to-transparent transition-opacity group-hover:opacity-[0.06]"></div>
                                    <div className="absolute -right-8 -bottom-8 opacity-5 text-primary group-hover:opacity-10 transition-all duration-700 transform group-hover:scale-110 group-hover:-rotate-12 pointer-events-none">
                                        {renderIcon(link, 'text-[160px]', 'text-[160px]', 'text-[100px]')}
                                    </div>
                                </>
                            )}

                            <div
                                style={{ 
                                    backgroundColor: isFeatured ? link.color : `${link.color}15`, 
                                    color: isFeatured ? '#fff' : link.color 
                                }}
                                className={`
                                    flex-shrink-0 flex items-center justify-center rounded-2xl transition-transform duration-500
                                    ${isFeatured ? 'size-14 mb-4 shadow-xl shadow-primary/20 group-hover:scale-110' : 'size-12 mb-2 group-hover:scale-110'}
                                `}
                            >
                                {renderIcon(link, isFeatured ? 'text-[28px]' : 'text-[24px]', isFeatured ? 'text-[28px]' : 'text-[24px]', isFeatured ? 'text-[12px]' : 'text-[10px]')}
                            </div>

                            <div className="relative z-10 flex flex-col flex-1 justify-end">
                                <span className={`block font-extrabold text-slate-800 group-hover:text-primary transition-colors tracking-tight leading-tight mb-1.5 ${isFeatured ? 'text-xl md:text-2xl' : 'text-[15px]'}`}>
                                    {link.title}
                                </span>
                                {desc && (
                                    <p className={`text-slate-500 leading-relaxed font-medium mb-4 ${isFeatured ? 'text-[15px] line-clamp-3' : 'text-[13px] line-clamp-1'}`}>
                                        {desc}
                                    </p>
                                )}
                                <div className={`flex items-center gap-1.5 text-slate-400 group-hover:text-primary transition-colors ${!desc && 'mt-2'}`}>
                                    <span className="text-[10px] font-bold uppercase tracking-widest">{link.url ? 'Buka Tautan' : 'Lihat Detail'}</span>
                                    <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1.5 transition-transform duration-300">arrow_forward</span>
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
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}

// ==========================================
// Minimalist Uniform Grid Layout (Option A)
// All cards have the exact same size, structured alignment, and brand colors.
// ==========================================

const cleanLinks = [
    { id: 'visi-misi', title: 'Visi Misi', icon: 'school', desc: 'Mengenal visi, misi, dan tujuan strategis Universitas Hang Tuah.' },
    { id: 'program-studi', title: 'Program Studi', icon: 'home_work', desc: 'Daftar pilihan program studi unggulan D3, S1, S2, dan Profesi.' },
    { id: 'akreditasi', title: 'Akreditasi', icon: 'verified', desc: 'Status akreditasi resmi program studi dari BAN-PT.' },
    { id: 'jadwal', title: 'Jadwal PMB', icon: 'calendar_month', desc: 'Pantau jadwal pendaftaran, seleksi, dan pengumuman.' },
    { id: 'cara-daftar', title: 'Cara Daftar', icon: 'assignment', desc: 'Panduan langkah demi langkah proses pendaftaran online.' },
    { id: 'persyaratan', title: 'Persyaratan', icon: 'rule', desc: 'Persyaratan berkas pendaftaran dan kriteria kelulusan.' },
    { id: 'contact', title: 'Kontak PMB', icon: 'contact_support', desc: 'Hotline layanan pendaftaran dan media sosial resmi.' },
    { id: 'pengumuman', title: 'Pengumuman', icon: 'campaign', desc: 'Informasi terbaru seputar penerimaan mahasiswa baru.' },
    { id: 'peserta-ujian', title: 'Peserta Ujian', icon: 'groups', desc: 'Lihat daftar peserta ujian gelombang aktif saat ini.' },
    { id: 'panduan', title: 'Panduan', icon: 'smart_display', desc: 'Video tutorial lengkap penggunaan portal pendaftaran.', url: 'http://www.youtube.com/@UniversitasHangTuahPekanbaru' },
    { id: 'pertanyaan', title: 'Pertanyaan (FAQ)', icon: 'quiz', desc: 'Jawaban atas pertanyaan yang sering diajukan pendaftar.' },
    { id: 'lokasi', title: 'Lokasi', icon: 'map', desc: 'Peta rute perjalanan dan alamat lengkap kampus utama.', url: 'https://maps.google.com/?q=Universitas+Hang+Tuah+Pekanbaru' },
];

export function IconBarOptionCleanGrid() {
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
                                <p className="text-slate-600 leading-relaxed text-lg font-medium italic">
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
                        <div className="absolute left-[30px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-[#00857A]/20 via-[#00857A]/40 to-[#00857A]/20 hidden md:block opacity-50"></div>
                        {caraDaftarData.map((step, idx) => (
                            <div key={idx} className="relative flex flex-col md:flex-row gap-5 items-start md:items-center bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_2px_10px_-3px_rgba(0,133,122,0.05)] hover:shadow-[0_8px_30px_rgba(0,133,122,0.1)] hover:border-[#00857A]/20 transition-all duration-300 group">
                                <div className="flex-shrink-0 z-10 w-[52px] h-[52px] bg-emerald-50 border-2 border-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center font-black text-xl group-hover:bg-[#00857A] group-hover:text-white group-hover:border-[#00857A] group-hover:-rotate-6 transition-all shadow-sm">
                                    {idx + 1}
                                </div>
                                <div className="flex-1 text-slate-700 text-[15px] sm:text-base pr-2 leading-relaxed">
                                    {step.split('\n').map((line, i) => (
                                        <div key={i} className={`${i > 0 ? 'ml-2 sm:ml-4 mt-2 text-slate-500 flex items-start gap-2.5 text-sm' : 'font-bold text-slate-800'}`}>
                                            {i > 0 && <span className="text-[#00857A]/60 mt-0.5 flex-shrink-0 material-symbols-outlined text-[16px]">chevron_right</span>}
                                            <span className={i > 0 ? "flex-1 pt-0.5 font-medium" : ""}>{line.replace('• ', '')}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 'persyaratan':
                return (
                    <div className="space-y-6">
                        <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl flex gap-3 text-emerald-800">
                            <span className="material-symbols-outlined text-emerald-600 shrink-0">info</span>
                            <p className="text-sm leading-relaxed">
                                Pastikan Anda telah mempersiapkan dokumen-dokumen berikut dalam format digital (scan) sebelum melakukan pengisian berkas di portal pendaftaran.
                            </p>
                        </div>
                        <div className="grid gap-4">
                            {[
                                { title: "Pas Photo Terbaru", detail: "Pas photo berwarna terbaru dengan latar belakang merah atau biru (format JPG/PNG, ukuran maksimal 2MB)." },
                                { title: "Scan KTP / Kartu Keluarga", detail: "Scan KTP asli calon mahasiswa atau Kartu Keluarga yang jelas dan terbaca (format JPG/PNG/PDF, ukuran maksimal 2MB)." },
                                { title: "Scan Ijazah / SKL", detail: "Scan Ijazah asli atau Surat Keterangan Lulus (SKL) sementara bagi yang baru lulus sekolah (format JPG/PNG/PDF, ukuran maksimal 2MB)." },
                                { title: "Bukti Transaksi Pembayaran", detail: "Bukti transfer uang pendaftaran/pembayaran formulir resmi sesuai petunjuk tagihan sistem." },
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-start gap-4 p-5 bg-white border border-slate-100 rounded-2xl hover:border-[#00857A]/20 transition-all duration-300 shadow-xs">
                                    <div className="flex-shrink-0 size-8 rounded-xl bg-[#00857A]/10 text-[#00857A] flex items-center justify-center text-sm font-bold">
                                        {idx + 1}
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-slate-800 text-[16px] mb-1">{item.title}</h5>
                                        <p className="text-slate-500 text-sm leading-relaxed">{item.detail}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
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
                                    <span className="font-medium text-[15px]">Yulanda : <a href="tel:08117561513" className="font-bold text-[#00857A] hover:text-[#00695C] transition-colors">0811-7561-513</a></span>
                                </li>
                                <li className="flex items-center gap-3 text-slate-700">
                                    <div className="size-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                                        <span className="material-symbols-outlined text-[18px]">person</span>
                                    </div>
                                    <span className="font-medium text-[15px]">Gatot : <a href="tel:082172595019" className="font-bold text-[#00857A] hover:text-[#00695C] transition-colors">0821-7259-5019</a></span>
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
                                    <span className="font-medium text-[15px]">Email : <a href="mailto:spmb@htp.ac.id" className="font-bold text-[#00857A] hover:text-[#00695C] transition-colors">spmb@htp.ac.id</a></span>
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
            case 'pengumuman':
                return (
                    <div className="flex flex-col items-center justify-center py-12 px-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                        <div className="size-20 bg-slate-200 text-slate-600 rounded-full flex items-center justify-center mb-6">
                            <span className="material-symbols-outlined text-[40px]">campaign</span>
                        </div>
                        <h4 className="text-2xl font-bold text-slate-800 mb-3 tracking-tight">Belum Ada Pengumuman Baru</h4>
                        <p className="text-slate-600 text-base max-w-md mx-auto leading-relaxed">
                            Belum ada pengumuman pendaftaran baru saat ini. Silakan periksa kembali secara berkala untuk pembaruan informasi seleksi PMB.
                        </p>
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
            case 'persyaratan': return 'Persyaratan Pendaftaran Calon Mahasiswa';
            case 'pengumuman': return 'Pengumuman Resmi SPMB';
            case 'contact': return 'Hubungi Kami';
            case 'peserta-ujian': return 'Peserta Ujian Gelombang Yang Mendaftar Online Universitas Hang Tuah';
            case 'pertanyaan': return 'Frequently Asked Question';
            default: return 'Informasi';
        }
    };

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {cleanLinks.map((link, idx) => {
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
                            className="
                                group relative flex flex-col p-6 h-full
                                bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]
                                hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20
                                hover:-translate-y-1.5 transition-all duration-300 ease-out
                                overflow-hidden justify-between
                            "
                        >
                            <div className="w-full">
                                {/* Icon Container (Teal tinted background) */}
                                <div className="flex-shrink-0 flex items-center justify-center rounded-xl size-12 bg-primary/10 text-primary mb-5 group-hover:scale-110 transition-transform duration-300">
                                    <span className="material-symbols-outlined text-[24px]">
                                        {link.icon}
                                    </span>
                                </div>

                                <span className="block font-bold text-slate-800 text-lg group-hover:text-primary transition-colors tracking-tight leading-tight mb-2 font-display">
                                    {link.title}
                                </span>
                                <p className="text-slate-500 leading-relaxed font-medium text-[13px] mb-6">
                                    {link.desc}
                                </p>
                            </div>

                            <div className="flex items-center gap-1.5 text-slate-400 group-hover:text-primary transition-colors border-t border-slate-50 pt-4 mt-auto">
                                <span className="text-[10px] font-bold uppercase tracking-wider">{link.url ? 'Buka Tautan' : 'Lihat Detail'}</span>
                                <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform duration-300">arrow_forward</span>
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
                            className="h-2 w-full bg-primary" 
                        ></div>
                        {/* Modal Header */}
                        <div className="px-6 py-5 sm:px-8 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10 shadow-[0_4px_20px_-15px_rgba(0,0,0,0.1)]">
                            <div className="flex items-center gap-4 pr-4">
                                <div 
                                    className="hidden sm:flex size-12 rounded-2xl items-center justify-center bg-primary/10 text-primary shadow-lg shadow-primary/5" 
                                >
                                    <span className="material-symbols-outlined text-[28px]">
                                        {cleanLinks.find(l => l.id === activeModal)?.icon || 'info'}
                                    </span>
                                </div>
                                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight leading-tight font-display font-bold">
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

// ==========================================
// Segmented Category Tabs Layout (Option B)
// Tab-based interactive layout that groups the 12 quick access cards.
// ==========================================

const categories = [
    {
        id: 'pendaftaran',
        title: 'Layanan Pendaftaran',
        icon: 'how_to_reg',
        desc: 'Proses admisi, syarat dokumen pendaftaran, jadwal seleksi, dan status peserta.',
        linkIds: ['cara-daftar', 'persyaratan', 'jadwal', 'peserta-ujian']
    },
    {
        id: 'akademik',
        title: 'Informasi Akademik',
        icon: 'account_balance',
        desc: 'Kurikulum program studi, status akreditasi BAN-PT, visi-misi universitas, dan rute lokasi.',
        linkIds: ['program-studi', 'akreditasi', 'visi-misi', 'lokasi']
    },
    {
        id: 'bantuan',
        title: 'Pusat Bantuan',
        icon: 'support_agent',
        desc: 'Tanya jawab FAQ, kontak panitia PMB, papan pengumuman resmi, dan video panduan.',
        linkIds: ['pertanyaan', 'contact', 'pengumuman', 'panduan']
    }
];

const activeTabColorsMap: Record<string, {
    activeClass: string;
    hoverText: string;
}> = {
    'pendaftaran': {
        activeClass: 'bg-emerald-600 text-white shadow-emerald-600/20',
        hoverText: 'hover:text-emerald-600'
    },
    'akademik': {
        activeClass: 'bg-blue-600 text-white shadow-blue-600/20',
        hoverText: 'hover:text-blue-600'
    },
    'bantuan': {
        activeClass: 'bg-purple-600 text-white shadow-purple-600/20',
        hoverText: 'hover:text-purple-600'
    }
};

const cardColorsMap: Record<string, {
    iconBg: string;
    titleHover: string;
    borderHover: string;
    shadowHover: string;
    footerTextHover: string;
    solidBg: string;
}> = {
    'visi-misi': {
        iconBg: 'bg-indigo-50 text-indigo-600',
        titleHover: 'group-hover:text-indigo-600',
        borderHover: 'hover:border-indigo-200/60',
        shadowHover: 'hover:shadow-indigo-600/5',
        footerTextHover: 'group-hover:text-indigo-600',
        solidBg: 'bg-indigo-600'
    },
    'program-studi': {
        iconBg: 'bg-blue-50 text-blue-600',
        titleHover: 'group-hover:text-blue-600',
        borderHover: 'hover:border-blue-200/60',
        shadowHover: 'hover:shadow-blue-600/5',
        footerTextHover: 'group-hover:text-blue-600',
        solidBg: 'bg-blue-600'
    },
    'akreditasi': {
        iconBg: 'bg-emerald-50 text-emerald-600',
        titleHover: 'group-hover:text-emerald-600',
        borderHover: 'hover:border-emerald-200/60',
        shadowHover: 'hover:shadow-emerald-600/5',
        footerTextHover: 'group-hover:text-emerald-600',
        solidBg: 'bg-emerald-600'
    },
    'jadwal': {
        iconBg: 'bg-amber-50 text-amber-600',
        titleHover: 'group-hover:text-amber-600',
        borderHover: 'hover:border-amber-200/60',
        shadowHover: 'hover:shadow-amber-600/5',
        footerTextHover: 'group-hover:text-amber-600',
        solidBg: 'bg-amber-600'
    },
    'cara-daftar': {
        iconBg: 'bg-cyan-50 text-cyan-600',
        titleHover: 'group-hover:text-cyan-600',
        borderHover: 'hover:border-cyan-200/60',
        shadowHover: 'hover:shadow-cyan-600/5',
        footerTextHover: 'group-hover:text-cyan-600',
        solidBg: 'bg-cyan-600'
    },
    'persyaratan': {
        iconBg: 'bg-rose-50 text-rose-600',
        titleHover: 'group-hover:text-rose-600',
        borderHover: 'hover:border-rose-200/60',
        shadowHover: 'hover:shadow-rose-600/5',
        footerTextHover: 'group-hover:text-rose-600',
        solidBg: 'bg-rose-600'
    },
    'contact': {
        iconBg: 'bg-fuchsia-50 text-fuchsia-600',
        titleHover: 'group-hover:text-fuchsia-600',
        borderHover: 'hover:border-fuchsia-200/60',
        shadowHover: 'hover:shadow-fuchsia-600/5',
        footerTextHover: 'group-hover:text-fuchsia-600',
        solidBg: 'bg-fuchsia-600'
    },
    'pengumuman': {
        iconBg: 'bg-violet-50 text-violet-600',
        titleHover: 'group-hover:text-violet-600',
        borderHover: 'hover:border-violet-200/60',
        shadowHover: 'hover:shadow-violet-600/5',
        footerTextHover: 'group-hover:text-violet-600',
        solidBg: 'bg-violet-600'
    },
    'peserta-ujian': {
        iconBg: 'bg-teal-50 text-teal-600',
        titleHover: 'group-hover:text-teal-600',
        borderHover: 'hover:border-teal-200/60',
        shadowHover: 'hover:shadow-teal-600/5',
        footerTextHover: 'group-hover:text-teal-600',
        solidBg: 'bg-teal-600'
    },
    'panduan': {
        iconBg: 'bg-red-50 text-red-600',
        titleHover: 'group-hover:text-red-600',
        borderHover: 'hover:border-red-200/60',
        shadowHover: 'hover:shadow-red-600/5',
        footerTextHover: 'group-hover:text-red-600',
        solidBg: 'bg-red-600'
    },
    'pertanyaan': {
        iconBg: 'bg-sky-50 text-sky-600',
        titleHover: 'group-hover:text-sky-600',
        borderHover: 'hover:border-sky-200/60',
        shadowHover: 'hover:shadow-sky-600/5',
        footerTextHover: 'group-hover:text-sky-600',
        solidBg: 'bg-sky-600'
    },
    'lokasi': {
        iconBg: 'bg-lime-50 text-lime-600',
        titleHover: 'group-hover:text-lime-600',
        borderHover: 'hover:border-lime-200/60',
        shadowHover: 'hover:shadow-lime-600/5',
        footerTextHover: 'group-hover:text-lime-600',
        solidBg: 'bg-lime-600'
    }
};

const defaultColor = {
    iconBg: 'bg-primary/10 text-primary',
    titleHover: 'group-hover:text-primary',
    borderHover: 'hover:border-primary/20',
    shadowHover: 'hover:shadow-primary/5',
    footerTextHover: 'group-hover:text-primary',
    solidBg: 'bg-primary'
};

export function IconBarOptionCategorized() {
    const [activeTab, setActiveTab] = useState('pendaftaran');
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
                                <p className="text-slate-600 leading-relaxed text-lg font-medium italic">
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
                    <div className="space-y-4 relative py-2">
                        {/* Thin vertical timeline guide line */}
                        <div className="absolute left-[26px] top-6 bottom-6 w-0.5 bg-slate-100 hidden md:block pointer-events-none"></div>
                        
                        {caraDaftarData.map((step, idx) => (
                            <div 
                                key={idx} 
                                className="relative flex flex-row gap-4 items-start bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-xs hover:border-[#00857A]/25 transition-all duration-300 group"
                            >
                                {/* Step number badge - aligned to top start */}
                                <div className="flex-shrink-0 z-10 size-11 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center font-bold text-base transition-colors group-hover:bg-[#00857A] group-hover:text-white group-hover:border-[#00857A] shadow-xs">
                                    {idx + 1}
                                </div>
                                
                                {/* Step Content */}
                                <div className="flex-1 text-slate-700 text-sm sm:text-base leading-relaxed pt-1">
                                    {step.split('\n').map((line, i) => (
                                        <div 
                                            key={i} 
                                            className={i > 0 
                                                ? "mt-2 pl-2 sm:pl-3 text-slate-500 flex items-start gap-2 text-xs sm:text-sm font-medium" 
                                                : "font-semibold text-slate-800 text-[15px] sm:text-base"
                                            }
                                        >
                                            {i > 0 && (
                                                <span className="text-[#00857A]/60 mt-0.5 flex-shrink-0 material-symbols-outlined text-[14px] sm:text-[16px]">
                                                    chevron_right
                                                </span>
                                            )}
                                            <span className={i > 0 ? "flex-1 pt-0.5" : ""}>
                                                {line.replace('• ', '')}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 'persyaratan':
                return (
                    <div className="space-y-6">
                        <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl flex gap-3 text-emerald-800">
                            <span className="material-symbols-outlined text-emerald-600 shrink-0">info</span>
                            <p className="text-sm leading-relaxed">
                                Pastikan Anda telah mempersiapkan dokumen-dokumen berikut dalam format digital (scan) sebelum melakukan pengisian berkas di portal pendaftaran.
                            </p>
                        </div>
                        <div className="grid gap-4">
                            {[
                                { title: "Pas Photo Terbaru", detail: "Pas photo berwarna terbaru dengan latar belakang merah atau biru (format JPG/PNG, ukuran maksimal 2MB)." },
                                { title: "Scan KTP / Kartu Keluarga", detail: "Scan KTP asli calon mahasiswa atau Kartu Keluarga yang jelas dan terbaca (format JPG/PNG/PDF, ukuran maksimal 2MB)." },
                                { title: "Scan Ijazah / SKL", detail: "Scan Ijazah asli atau Surat Keterangan Lulus (SKL) sementara bagi yang baru lulus sekolah (format JPG/PNG/PDF, ukuran maksimal 2MB)." },
                                { title: "Bukti Transaksi Pembayaran", detail: "Bukti transfer uang pendaftaran/pembayaran formulir resmi sesuai petunjuk tagihan sistem." },
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-start gap-4 p-5 bg-white border border-slate-100 rounded-2xl hover:border-[#00857A]/20 transition-all duration-300 shadow-xs">
                                    <div className="flex-shrink-0 size-8 rounded-xl bg-[#00857A]/10 text-[#00857A] flex items-center justify-center text-sm font-bold">
                                        {idx + 1}
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-slate-800 text-[16px] mb-1">{item.title}</h5>
                                        <p className="text-slate-500 text-sm leading-relaxed">{item.detail}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
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
                                    <span className="font-medium text-[15px]">Yulanda : <a href="tel:08117561513" className="font-bold text-[#00857A] hover:text-[#00695C] transition-colors">0811-7561-513</a></span>
                                </li>
                                <li className="flex items-center gap-3 text-slate-700">
                                    <div className="size-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                                        <span className="material-symbols-outlined text-[18px]">person</span>
                                    </div>
                                    <span className="font-medium text-[15px]">Gatot : <a href="tel:082172595019" className="font-bold text-[#00857A] hover:text-[#00695C] transition-colors">0821-7259-5019</a></span>
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
                                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                                    </a>
                                    <a href="#" className="size-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-[#DB4437] hover:text-white hover:border-[#DB4437] transition-colors" title="Google Plus">
                                        <span className="font-bold text-[14px]">G+</span>
                                    </a>
                                </li>
                                <li className="flex items-center gap-3 text-slate-700 pt-1">
                                    <div className="size-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                                        <span className="material-symbols-outlined text-[18px]">mail</span>
                                    </div>
                                    <span className="font-medium text-[15px]">Email : <a href="mailto:spmb@htp.ac.id" className="font-bold text-[#00857A] hover:text-[#00695C] transition-colors">spmb@htp.ac.id</a></span>
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
            case 'pengumuman':
                return (
                    <div className="flex flex-col items-center justify-center py-12 px-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                        <div className="size-20 bg-slate-200 text-slate-600 rounded-full flex items-center justify-center mb-6">
                            <span className="material-symbols-outlined text-[40px]">campaign</span>
                        </div>
                        <h4 className="text-2xl font-bold text-slate-800 mb-3 tracking-tight">Belum Ada Pengumuman Baru</h4>
                        <p className="text-slate-600 text-base max-w-md mx-auto leading-relaxed">
                            Belum ada pengumuman pendaftaran baru saat ini. Silakan periksa kembali secara berkala untuk pembaruan informasi seleksi PMB.
                        </p>
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
            case 'persyaratan': return 'Persyaratan Pendaftaran Calon Mahasiswa';
            case 'pengumuman': return 'Pengumuman Resmi SPMB';
            case 'contact': return 'Hubungi Kami';
            case 'peserta-ujian': return 'Peserta Ujian Gelombang Yang Mendaftar Online Universitas Hang Tuah';
            case 'pertanyaan': return 'Frequently Asked Question';
            default: return 'Informasi';
        }
    };

    const currentTabLinks = cleanLinks.filter(link => {
        const cat = categories.find(c => c.id === activeTab);
        return cat?.linkIds.includes(link.id) || false;
    });

    return (
        <div className="w-full">
            {/* Tabs Control */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mb-10 p-2 bg-slate-100/80 rounded-2xl max-w-4xl mx-auto border border-slate-200/50 backdrop-blur-xs">
                {categories.map((cat) => {
                    const isActive = activeTab === cat.id;
                    return (
                        <button
                            key={cat.id}
                            onClick={() => setActiveTab(cat.id)}
                            className={`
                                flex items-center justify-center gap-2.5 w-full sm:w-auto px-6 py-3.5 rounded-xl text-[15px] font-bold transition-all duration-300 active:scale-98 cursor-pointer
                                ${isActive 
                                    ? `${activeTabColorsMap[cat.id]?.activeClass || 'bg-primary text-white shadow-primary/20'} shadow-md scale-100` 
                                    : `text-slate-600 ${activeTabColorsMap[cat.id]?.hoverText || 'hover:text-primary'} hover:bg-white/60 bg-transparent`
                                }
                            `}
                        >
                            <span className="material-symbols-outlined text-[20px]">
                                {cat.icon}
                            </span>
                            <span>{cat.title}</span>
                        </button>
                    );
                })}
            </div>

            {/* Tab Description */}
            <div className="text-center max-w-xl mx-auto mb-8 h-10">
                <p className="text-slate-500 font-medium text-sm leading-relaxed animate-in fade-in duration-300">
                    {categories.find(c => c.id === activeTab)?.desc}
                </p>
            </div>

            {/* Tab Panels (Grid) with fade/scale animations */}
            <div 
                key={activeTab} 
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
                {currentTabLinks.map((link, idx) => {
                    const colors = cardColorsMap[link.id] || defaultColor;
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
                                group relative flex flex-col p-6 h-full
                                bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]
                                hover:shadow-xl ${colors.shadowHover} ${colors.borderHover}
                                hover:-translate-y-1.5 transition-all duration-300 ease-out
                                overflow-hidden justify-between
                            `}
                        >
                            <div className="w-full">
                                {/* Icon Container (Color tinted background) */}
                                <div className={`flex-shrink-0 flex items-center justify-center rounded-xl size-12 ${colors.iconBg} mb-5 group-hover:scale-110 transition-transform duration-300`}>
                                    <span className="material-symbols-outlined text-[24px]">
                                        {link.icon}
                                    </span>
                                </div>

                                <span className={`block font-bold text-slate-800 text-lg ${colors.titleHover} transition-colors tracking-tight leading-tight mb-2 font-display`}>
                                    {link.title}
                                </span>
                                <p className="text-slate-500 leading-relaxed font-medium text-[13px] mb-6">
                                    {link.desc}
                                </p>
                            </div>

                            <div className={`flex items-center gap-1.5 text-slate-400 ${colors.footerTextHover} transition-colors border-t border-slate-50 pt-4 mt-auto`}>
                                <span className="text-[10px] font-bold uppercase tracking-wider">{link.url ? 'Buka Tautan' : 'Lihat Detail'}</span>
                                <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform duration-300">arrow_forward</span>
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
                            className={`h-2 w-full ${cardColorsMap[activeModal]?.solidBg || 'bg-primary'}`} 
                        ></div>
                        {/* Modal Header */}
                        <div className="px-6 py-5 sm:px-8 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10 shadow-[0_4px_20px_-15px_rgba(0,0,0,0.1)]">
                            <div className="flex items-center gap-4 pr-4">
                                <div 
                                    className={`hidden sm:flex size-12 rounded-2xl items-center justify-center ${cardColorsMap[activeModal]?.iconBg || 'bg-primary/10 text-primary'} shadow-lg ${cardColorsMap[activeModal]?.shadowHover?.replace('hover:', '') || 'shadow-primary/5'}`} 
                                >
                                    <span className="material-symbols-outlined text-[28px]">
                                        {cleanLinks.find(l => l.id === activeModal)?.icon || 'info'}
                                    </span>
                                </div>
                                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight leading-tight font-display font-bold">
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


