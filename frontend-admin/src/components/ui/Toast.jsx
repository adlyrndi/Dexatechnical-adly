export const Toast = ({ message, type = 'success', onClose }) => {
  if (!message) return null;

  const styles = {
    success: "bg-emerald-50 border-emerald-100 text-emerald-600 shadow-emerald-100/20",
    error: "bg-rose-50 border-rose-100 text-rose-600 shadow-rose-100/20"
  };

  return (
    <div className={`fixed top-10 left-1/2 -translate-x-1/2 z-[300] p-4 pr-6 border rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-5 duration-300 shadow-2xl ${styles[type] || styles.success}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${type === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
        {type === 'success' ? '✓' : '⚠️'}
      </div>
      <div className="flex-1">
        <div className="text-[0.65rem] font-black uppercase tracking-widest">{type === 'success' ? 'BERHASIL' : 'PERHATIAN'}</div>
        <div className="text-[0.7rem] font-bold leading-tight mt-0.5">{message}</div>
      </div>
      <button onClick={onClose} className="ml-4 opacity-40 hover:opacity-100 p-1">✕</button>
    </div>
  );
};

export default Toast;
