import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
      <div className="relative">
        {/* Outer Ring */}
        <div className="size-20 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin"></div>
        
        {/* Inner Pulsing Circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="size-8 bg-emerald-600 rounded-full animate-pulse opacity-20"></div>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase">Memuat Aplikasi</h2>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2 animate-pulse">
          Universitas Hang Tuah Pekanbaru
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
