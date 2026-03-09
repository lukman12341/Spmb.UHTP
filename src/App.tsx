import { useState } from 'react';
import { IconBarOption3 } from './IconBarOptions';

function App() {
  const [activeImage, setActiveImage] = useState<string | undefined>(undefined);

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative w-full min-h-screen flex items-center bg-linear-to-br from-[#e0f2f1] via-primary/10 to-primary/30 overflow-hidden py-16 md:py-24">
        {/* Background Decorative Blobs */}
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 rounded-full bg-primary/20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 rounded-full bg-primary/30 blur-3xl"></div>

        <div className="w-full max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Text Content */}
            <div className="col-span-1 lg:col-span-6 space-y-6">
              <h1 className="text-slate-800 text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight">
                Selamat Datang<br />
                Calon Mahasiswa Baru<br />
                <span className="text-primary relative inline-block pb-4 mt-1">
                  Universitas Hang Tuah
                  {/* Refined gold underline with more clearance */}
                  <span className="absolute bottom-0 left-0 w-full h-[4px] bg-gold opacity-90 shadow-sm rounded-full"></span>
                </span>
              </h1>
              <p className="text-slate-700 text-lg md:text-xl font-medium max-w-lg mt-6">
                Kami merupakan perguruan tinggi swasta terbaik di Riau. 👏<br />
                Kampus kami mengedepankan inovasi, teknologi, dan akhlak mulia.
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-8">
                <button className="px-6 py-3 rounded-lg bg-primary hover:bg-teal-700 text-white font-bold text-sm shadow-lg shadow-primary/30 flex items-center gap-2 transition-colors">
                  Daftar Sekarang
                  <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
                </button>
              </div>
            </div>
            {/* Right Column: Hero Video Component */}
            <div className="col-span-1 lg:col-span-6 relative mt-12 lg:mt-0">
              {/* Decorative background shape */}
              <div className="absolute -inset-4 md:-inset-6 bg-gold rounded-tr-[40px] rounded-bl-[40px] -z-10 translate-x-4 translate-y-4 shadow-xl"></div>
              <div className="absolute -inset-4 md:-inset-6 bg-primary rounded-tl-[40px] rounded-br-[40px] -z-20 -translate-x-4 -translate-y-4 opacity-80"></div>

              {/* YouTube Video Player */}
              <div className="relative rounded-xl overflow-hidden aspect-video shadow-2xl border-4 border-white bg-slate-900">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/9R8Pv7V4oQo?rel=0"
                  title="Universitas Hang Tuah Pekanbaru Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-white to-transparent"></div>
      </section>

      {/* --- Rest of the Content --- */}

      {/* Floating WhatsApp Icon */}
      <a
        href="https://wa.me/6281234567890"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 right-4 z-50 size-16 bg-[#25D366] hover:bg-[#128C7E] rounded-full flex items-center justify-center shadow-xl shadow-[#25D366]/40 transition-transform hover:-translate-y-1"
        aria-label="Chat with us on WhatsApp"
      >
        <svg className="w-8 h-8 text-white fill-current" viewBox="0 0 24 24">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.066.376-.043c.101-.109.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-5.824 4.74-10.563 10.567-10.564 5.823 0 10.564 4.741 10.564 10.564 0 5.824-4.74 10.564-10.564 10.564z" />
        </svg>
      </a>

      {/* Quick Links / Icon Bar Section */}
      <div className="py-4 bg-slate-50/50 border-b border-slate-100">
        <IconBarOption3 />
      </div>

      {/* Premium Login Section */}
      <section className="relative p-6 md:p-12 lg:p-16 flex justify-center items-center overflow-hidden bg-linear-to-br from-[#e0f2f1] via-white to-primary/5">
        {/* Decorative Background Elements */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 -mb-20 -ml-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/4 right-0 -mr-20 w-80 h-80 bg-gold/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-60 h-60 bg-[#1ca2f1]/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-full max-w-5xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-16 items-center relative z-10">

          {/* Left Area: Illustration/Info */}
          <div className="flex-1 w-full text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm mb-2">
              <span className="flex size-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs font-bold text-slate-600 tracking-wide uppercase">Sistem Terintegrasi</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Akses Portal <br className="hidden lg:block" />
              <span className="bg-clip-text text-transparent bg-linear-to-r from-primary via-[#1ca2f1] to-navy">
                SPMB Online
              </span>
            </h2>
            <p className="text-slate-600 text-base md:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
              Masuk ke akun Anda untuk melengkapi biodata, mengunggah dokumen persyaratan, dan memantau status kelulusan pendaftaran.
            </p>

            <div className="hidden lg:grid grid-cols-2 gap-4 pt-4">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4 hover:shadow-md transition-shadow">
                <div className="bg-primary/10 p-2.5 rounded-xl text-primary shrink-0">
                  <span className="material-symbols-outlined">shield_person</span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Privasi Terjamin</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Data Anda dienkripsi penuh.</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4 hover:shadow-md transition-shadow">
                <div className="bg-gold/10 p-2.5 rounded-xl text-yellow-600 shrink-0">
                  <span className="material-symbols-outlined">support_agent</span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Bantuan 24/7</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Tim support siap membantu.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Area: Premium Glass Login Card (Simplified) */}
          <div className="w-full max-w-md shrink-0 relative">
            <div className="relative bg-white rounded-[2rem] p-8 sm:p-10 shadow-sm border border-slate-200">
              <div className="mb-8 relative">
                <div className="absolute top-0 right-0 size-12 bg-primary/5 rounded-full blur-xl"></div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Login Akun</h3>
                <p className="text-sm text-slate-500 font-medium">Silakan masukkan identitas pendaftaran Anda.</p>
              </div>

              <div className="space-y-5">
                {/* Username Input */}
                <div className="space-y-1.5 group/input">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">Username / No. Pendaftaran</label>
                  <div className="relative flex items-center transition-transform duration-300 group-focus-within/input:-translate-y-1">
                    <span className="material-symbols-outlined absolute left-4 text-slate-400 text-xl transition-colors group-focus-within/input:text-primary">person</span>
                    <input
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 focus:bg-white text-sm font-medium transition-all shadow-sm placeholder:text-slate-400"
                      placeholder="Masukkan ID Anda"
                      type="text"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1.5 group/input">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">Password</label>
                  <div className="relative flex items-center transition-transform duration-300 group-focus-within/input:-translate-y-1">
                    <span className="material-symbols-outlined absolute left-4 text-slate-400 text-xl transition-colors group-focus-within/input:text-primary">lock</span>
                    <input
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 focus:bg-white text-sm font-medium transition-all shadow-sm placeholder:text-slate-400"
                      placeholder="••••••••"
                      type="password"
                    />
                    <button className="absolute right-4 text-slate-400 hover:text-slate-600 transition-colors flex items-center justify-center p-1 rounded-md hover:bg-slate-100">
                      <span className="material-symbols-outlined text-[18px]">visibility_off</span>
                    </button>
                  </div>
                </div>

                {/* Extras */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer group/check">
                    <div className="relative flex items-center justify-center">
                      <input type="checkbox" className="peer sr-only" />
                      <div className="size-4.5 rounded border border-slate-300 bg-white peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center shadow-sm">
                        <span className="material-symbols-outlined text-white text-[12px] opacity-0 peer-checked:opacity-100 font-bold">check</span>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-slate-600 group-hover/check:text-slate-900 transition-colors">Ingat saya</span>
                  </label>
                  <a className="text-xs font-bold text-primary hover:text-navy transition-colors hover:underline" href="#">Lupa sandi?</a>
                </div>

                {/* Submit Button */}
                <button className="relative w-full overflow-hidden bg-primary text-white font-bold text-sm rounded-xl shadow-lg shadow-primary/30 mt-2 transition-all hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 group/btn">
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]"></div>
                  <div className="flex items-center justify-center gap-2 py-4">
                    <span>Masuk ke Dashboard</span>
                    <span className="material-symbols-outlined text-[18px] transition-transform group-hover/btn:translate-x-1">arrow_forward</span>
                  </div>
                </button>

              </div>
              <div className="relative flex items-center py-3">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-4 text-slate-400 text-[10px] font-bold uppercase tracking-widest">Atau</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              {/* Register Button */}
              <button className="w-full py-3.5 bg-white border-2 border-slate-100 text-slate-700 font-bold rounded-xl flex items-center justify-center gap-2 text-sm hover:bg-slate-50 hover:border-slate-200 transition-all shadow-sm">
                <span className="material-symbols-outlined text-gold">person_add</span>
                Buat Akun Pendaftaran Baru
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Informasi Penerimaan Mahasiswa Baru Section */}
      <section className="relative p-6 md:p-12 lg:p-16 flex flex-col items-center bg-white overflow-hidden">
        <div className="text-center mb-10 lg:mb-14 relative z-10 w-full max-w-4xl mx-auto">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-sm mb-4">
            <span className="material-symbols-outlined text-[18px]">info</span>
            Info Pendaftaran
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Informasi Penerimaan <br className="hidden md:block" />
            <span className="bg-clip-text text-transparent bg-linear-to-r from-primary via-[#1ca2f1] to-navy">
              Mahasiswa Baru 2026
            </span>
          </h2>
          <p className="mt-4 text-slate-600 max-w-2xl mx-auto md:text-lg">
            Berikut adalah rincian brosur dan biaya pendaftaran untuk tahun ajaran baru.
            Klik pada gambar untuk melihat lebih jelas.
          </p>
        </div>

        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10 relative z-10">

          {/* Brosur Depan */}
          <div
            onClick={() => setActiveImage('/brosurdepan2026(1).jpg')}
            className="group cursor-pointer flex flex-col bg-white rounded-3xl p-3 border-2 border-slate-100 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-500 hover:-translate-y-2"
          >
            <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden mb-4 bg-slate-100">
              <img
                src="/brosurdepan2026(1).jpg"
                alt="Brosur Halaman Depan"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors flex items-center justify-center backdrop-blur-[1px] opacity-0 group-hover:opacity-100">
                <div className="size-14 bg-white text-primary rounded-full flex items-center justify-center shadow-2xl scale-50 group-hover:scale-100 transition-transform duration-300">
                  <span className="material-symbols-outlined text-3xl">zoom_in</span>
                </div>
              </div>
            </div>
            <div className="px-2 pb-2 text-center">
              <h3 className="text-lg font-bold text-slate-800">Brosur Depan</h3>
              <p className="text-sm text-slate-500 mt-1 line-clamp-2">Informasi umum kampus dan fasilitas Universitas Hang Tuah Pekanbaru.</p>
            </div>
          </div>

          {/* Brosur Belakang */}
          <div
            onClick={() => setActiveImage('/brosurbelakang2026(2).jpg')}
            className="group cursor-pointer flex flex-col bg-white rounded-3xl p-3 border-2 border-slate-100 shadow-sm hover:shadow-xl hover:border-gold/50 transition-all duration-500 hover:-translate-y-2"
          >
            <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden mb-4 bg-slate-100">
              <img
                src="/brosurbelakang2026(2).jpg"
                alt="Brosur Halaman Belakang"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/20 transition-colors flex items-center justify-center backdrop-blur-[1px] opacity-0 group-hover:opacity-100">
                <div className="size-14 bg-white text-yellow-600 rounded-full flex items-center justify-center shadow-2xl scale-50 group-hover:scale-100 transition-transform duration-300">
                  <span className="material-symbols-outlined text-3xl">zoom_in</span>
                </div>
              </div>
            </div>
            <div className="px-2 pb-2 text-center">
              <h3 className="text-lg font-bold text-slate-800">Brosur Belakang</h3>
              <p className="text-sm text-slate-500 mt-1 line-clamp-2">Daftar Program Studi dan Persyaratan Lengkap Pendaftaran.</p>
            </div>
          </div>

          {/* Biaya */}
          <div
            onClick={() => setActiveImage('/biaya26.jpg')}
            className="group cursor-pointer flex flex-col bg-white rounded-3xl p-3 border-2 border-slate-100 shadow-sm hover:shadow-xl hover:border-[#1ca2f1]/40 transition-all duration-500 hover:-translate-y-2"
          >
            <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden mb-4 bg-slate-100">
              <img
                src="/biaya26.jpg"
                alt="Rincian Biaya Pendaftaran"
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[#1ca2f1]/0 group-hover:bg-[#1ca2f1]/20 transition-colors flex items-center justify-center backdrop-blur-[1px] opacity-0 group-hover:opacity-100">
                <div className="size-14 bg-white text-[#1ca2f1] rounded-full flex items-center justify-center shadow-2xl scale-50 group-hover:scale-100 transition-transform duration-300">
                  <span className="material-symbols-outlined text-3xl">zoom_in</span>
                </div>
              </div>
            </div>
            <div className="px-2 pb-2 text-center">
              <h3 className="text-lg font-bold text-slate-800">Rincian Biaya</h3>
              <p className="text-sm text-slate-500 mt-1 line-clamp-2">Detail estimasi biaya pendidikan (registrasi, SPP, dan lainnya).</p>
            </div>
          </div>

        </div>
      </section>

      {/* Video Gallery Section */}
      <section className="p-6 md:p-12 lg:p-16 bg-slate-50 dark:bg-navy/30">
        <div className="w-full max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs mb-2">
                <span className="material-symbols-outlined text-[14px]">smart_display</span>
                Multimedia UHT
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Galeri Video Kampus</h2>
            </div>
            <a
              className="text-primary text-sm font-bold flex items-center gap-1 hover:text-navy transition-colors bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm"
              href="https://www.youtube.com/@UniversitasHangTuahPekanbaru"
              target="_blank"
              rel="noopener noreferrer"
            >
              Lihat Channel YouTube <span className="material-symbols-outlined text-[18px]">open_in_new</span>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {/* Video 1 */}
            <div className="group flex flex-col">
              <div className="relative rounded-2xl overflow-hidden aspect-video shadow-sm border-2 border-slate-100 bg-slate-900 mb-3 hover:border-primary/50 transition-colors">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/ghTNfJnyRQg?rel=0"
                  title="JALUR PENERIMAAN MAHASISWA BARU"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 line-clamp-2 px-1 group-hover:text-primary transition-colors">
                Jalur Prestasi - Penerimaan Mahasiswa Baru Gelombang 1
              </h3>
            </div>

            {/* Video 2 */}
            <div className="group flex flex-col">
              <div className="relative rounded-2xl overflow-hidden aspect-video shadow-sm border-2 border-slate-100 bg-slate-900 mb-3 hover:border-primary/50 transition-colors">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/Ody81H1pK68?rel=0"
                  title="Video Promosi Kampus"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 line-clamp-2 px-1 group-hover:text-primary transition-colors">
                Kuliah Nyaman, Fasilitas Lengkap, Tentu Hanya di UHTP
              </h3>
            </div>

            {/* Video 3 */}
            <div className="group flex flex-col">
              <div className="relative rounded-2xl overflow-hidden aspect-video shadow-sm border-2 border-slate-100 bg-slate-900 mb-3 hover:border-primary/50 transition-colors">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/lgjxMAQqt70?rel=0"
                  title="Podcast Penerimaan Mahasiswa Baru"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 line-clamp-2 px-1 group-hover:text-primary transition-colors">
                Bincang-bincang Hangat Seputar Kampus (Podcast UHTP)
              </h3>
            </div>

            {/* Video 4 */}
            <div className="group flex flex-col">
              <div className="relative rounded-2xl overflow-hidden aspect-video shadow-sm border-2 border-slate-100 bg-slate-900 mb-3 hover:border-primary/50 transition-colors">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/aktuYTD5Slo?rel=0"
                  title="Kegiatan Kampus"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 line-clamp-2 px-1 group-hover:text-primary transition-colors">
                Serunya Perkuliahan dan Praktik Mahasiswa UHTP
              </h3>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary/95 border-t-4 border-gold pt-12 pb-8 text-white w-full font-sans overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-10">

            {/* Column 1: Link Cepat */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest text-gold mb-5">Link Cepat</h4>
              <ul className="space-y-3 text-sm text-white/80">
                <li className="flex items-center gap-2">SIAK Online</li>
                <li className="flex items-center gap-2">Portal Terpadu</li>
                <li className="flex items-center gap-2">SPMB Online</li>
                <li className="flex items-center gap-2">Tracer Study</li>
              </ul>
            </div>

            {/* Column 2: Lembaga */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest text-gold mb-5">Lembaga</h4>
              <ul className="space-y-3 text-sm text-white/80">
                <li className="flex items-center gap-2">LP3M</li>
                <li className="flex items-center gap-2">SPMI</li>
                <li className="flex items-center gap-2">SPI</li>
              </ul>
            </div>

            {/* Column 3: Kontak */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest text-gold mb-5">Kontak</h4>
              <div className="space-y-4 text-sm text-white/80">
                <p className="leading-relaxed">Jl. Mustang No.1, Pekanbaru, Riau</p>
                <p>(0761) 33850</p>
                <p>info@uhtp.ac.id</p>

                <div className="flex items-center gap-4 pt-2">
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="size-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#1877F2] hover:text-white transition-all transform hover:scale-110" title="Facebook">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="size-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-gradient-to-tr hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] hover:text-white transition-all transform hover:scale-110" title="Instagram">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.981 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Column 4: Lokasi */}
            <div className="relative group">
              <h4 className="text-sm font-bold uppercase tracking-widest text-gold mb-5">Lokasi</h4>
              <a
                href="https://maps.app.goo.gl/CrUtkJLdZstApLF96"
                target="_blank"
                rel="noopener noreferrer"
                className="block relative rounded-xl overflow-hidden shadow-lg border border-white/10 aspect-video group/map"
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15958.625390979854!2d101.44299446820586!3d0.509749557200547!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31d5ac033100ba71%3A0xc3f34fae2e5cff81!2sUniversitas%20Hang%20Tuah%20Pekanbaru!5e0!3m2!1sid!2sid!4v1709722300000!5m2!1sid!2sid"
                  width="100%"
                  height="100%"
                  style={{ border: 0, pointerEvents: 'none' }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Google Maps Lokasi Kampus"
                ></iframe>
                <div className="absolute inset-0 bg-primary/0 group-hover/map:bg-primary/20 transition-all flex items-center justify-center">
                  <div className="bg-white text-primary px-3 py-1.5 rounded-lg shadow-xl font-bold text-xs opacity-0 group-hover/map:opacity-100 transition-opacity transform translate-y-2 group-hover/map:translate-y-0">
                    Lihat di Maps
                  </div>
                </div>
              </a>
            </div>

          </div>

          <div className="pt-8 border-t border-white/10 text-center text-[11px] text-white/50 tracking-wider">
            <p>© 2026 Universitas Hang Tuah Pekanbaru. All Rights Reserved.</p>
          </div>

        </div>
      </footer>

      {/* Fullscreen Image Modal Overlay */}
      {
        activeImage && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-8 animate-in fade-in duration-300"
            onClick={() => setActiveImage(undefined)}
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 sm:top-8 sm:right-8 z-[110] size-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setActiveImage(undefined);
              }}
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>

            {/* Image Container */}
            <div
              className="relative max-w-[95vw] max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl shadow-black/50"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
            >
              <img
                src={activeImage}
                alt="Brosur Preview"
                className="w-auto h-auto max-w-full max-h-[90vh] object-contain"
              />
            </div>
          </div>
        )
      }
    </div>
  );
}

export default App;