export const PolicyBox = () => (
  <div className="p-6 bg-slate-900 rounded-[2rem] text-white relative overflow-hidden shadow-2xl shadow-blue-200/50 border-l-8 border-rose-500 group">
    <div className="absolute -top-4 -right-4 text-8xl opacity-10 blur-sm group-hover:scale-110 transition-transform duration-700">📋</div>
    <div className="flex items-center gap-2 mb-4">
      <div className="w-1.5 h-6 bg-rose-500 rounded-full"></div>
      <span className="text-[0.65rem] font-black uppercase tracking-widest text-rose-400">Kebijakan Absensi</span>
    </div>
    <p className="text-sm font-semibold leading-relaxed text-slate-300 italic">
      "Batas waktu absen masuk adalah pukul <span className="text-rose-400 font-extrabold">08:00 WIB</span>. Absensi yang dilakukan setelah jam tersebut akan otomatis dianggap sebagai <span className="text-rose-400 font-black">TELAT</span> sesuai peraturan perusahaan."
    </p>
  </div>
);
export default PolicyBox;
