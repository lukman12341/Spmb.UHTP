

// Using colors resembling the reference image (soft/muted bootstrap-like colors)
const links = [
    { title: 'Visi Misi', icon: 'school', bg: 'bg-[#4b8bc2]', textColor: 'text-white' },
    { title: 'Program Studi', icon: 'home', bg: 'bg-[#4b8bc2]', textColor: 'text-white' },
    { title: 'Akreditasi', icon: 'new_releases', bg: 'bg-[#6ab56a]', textColor: 'text-white' },
    { title: 'Jadwal', icon: 'schedule', bg: 'bg-[#eeb15b]', textColor: 'text-white' },
    { title: 'Cara Daftar', isCustomInfo: true, bg: 'bg-[#e06663]', textColor: 'text-white' },
    { title: 'Persyaratan', icon: 'rss_feed', bg: 'bg-[#4b8bc2]', textColor: 'text-white' },
    { title: 'Contact', icon: 'call', bg: 'bg-[#6ab56a]', textColor: 'text-white' },
    // Row 2 starts at col 2 in a 7-col grid
    { title: 'Pengumuman', icon: 'campaign', bg: 'bg-[#eeb15b]', textColor: 'text-white', colStart: 'lg:col-start-2' },
    { title: 'Peserta Ujian', icon: 'person_add', bg: 'bg-[#e06663]', textColor: 'text-white' },
    { title: 'Panduan', isCustomYoutube: true, bg: 'bg-[#6ab56a]', textColor: 'text-white' },
    { title: 'Pertanyaan', icon: 'help', bg: 'bg-[#4b8bc2]', textColor: 'text-white' },
    { title: 'Lokasi', icon: 'location_on', bg: 'bg-white', textColor: 'text-slate-800' },
];

export function IconBar() {
    return (
        <div className="w-full max-w-5xl mx-auto px-4 py-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-[2px]">
                {links.map((link, idx) => (
                    <a
                        key={idx}
                        href="#"
                        className={`
                            flex flex-col items-center justify-center p-2
                            aspect-square transition-all hover:opacity-90 active:scale-95
                            ${link.bg} ${link.textColor}
                            ${link.colStart ? link.colStart : ''}
                        `}
                    >
                        {link.isCustomYoutube ? (
                            <div className="flex justify-center items-center flex-col h-[70px] mb-1 opacity-90">
                                <span className="text-[28px] leading-none font-bold tracking-tighter" style={{ fontFamily: 'Impact, sans-serif' }}>You</span>
                                <span className="text-[28px] leading-none font-bold tracking-tighter border-[3px] border-current px-1.5 rounded-lg mt-0.5" style={{ fontFamily: 'Impact, sans-serif' }}>Tube</span>
                            </div>
                        ) : link.isCustomInfo ? (
                            <div className="flex justify-center items-center h-[70px] mb-1">
                                <span className="text-[80px] font-black leading-none" style={{ fontFamily: 'Arial, sans-serif' }}>i</span>
                            </div>
                        ) : (
                            <span
                                className="material-symbols-outlined mb-1"
                                style={{
                                    fontSize: '70px',
                                    fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 48"
                                }}
                            >
                                {link.icon}
                            </span>
                        )}
                        <span className="text-[14px] sm:text-[13px] font-normal text-center leading-tight mt-1">
                            {link.title}
                        </span>
                    </a>
                ))}
            </div>
        </div>
    );
}
