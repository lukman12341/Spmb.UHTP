// Common links data with modern curated colors
const links = [
    { title: 'Visi Misi', icon: 'school', color: '#3b82f6' },
    { title: 'Program Studi', icon: 'home', color: '#6366f1' },
    { title: 'Akreditasi', icon: 'new_releases', color: '#10b981' },
    { title: 'Jadwal', icon: 'schedule', color: '#f59e0b' },
    { title: 'Cara Daftar', isCustomInfo: true, color: '#f43f5e' },
    { title: 'Persyaratan', icon: 'rss_feed', color: '#06b6d4' },
    { title: 'Contact', icon: 'call', color: '#14b8a6' },
    { title: 'Pengumuman', icon: 'campaign', color: '#f97316', colStart: 'lg:col-start-2' },
    { title: 'Peserta Ujian', icon: 'person_add', color: '#ec4899' },
    { title: 'Panduan', isCustomYoutube: true, color: '#ef4444' },
    { title: 'Pertanyaan', icon: 'help', color: '#8b5cf6' },
    { title: 'Lokasi', icon: 'location_on', color: '#64748b' },
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

// ==========================================
// Colorful Bento Cards (Pilihan User)
// Menggabungkan kotak putih bersih dengan aksen warna ikon yang sangat kuat.
// ==========================================
export function IconBarOption3() {
    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {links.map((link, idx) => (
                    <a
                        key={idx}
                        href="#"
                        className={`group flex items-center gap-4 p-4 bg-white rounded-2xl border-2 border-slate-100 shadow-sm transition-all duration-300 hover:border-transparent hover:shadow-[0_10px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 ${link.colStart || ''}`}
                    >
                        <div
                            style={{ backgroundColor: link.color }}
                            className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm group-hover:rotate-12 transition-transform"
                        >
                            {renderIcon(link, 'text-2xl', 'text-3xl', 'text-[11px]')}
                        </div>
                        <span className="text-[14px] font-bold text-slate-700 leading-tight group-hover:text-slate-900 transition-colors">{link.title}</span>
                    </a>
                ))}
            </div>
        </div>
    );
}
