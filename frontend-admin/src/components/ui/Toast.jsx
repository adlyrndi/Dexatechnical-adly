import { createPortal } from 'react-dom';

export const Toast = ({ message, type = 'success', onClose }) => {
  if (!message) return null;

  const styles = {
    success: "bg-white border-slate-100 text-slate-800 shadow-emerald-100/50",
    error: "bg-white border-slate-100 text-slate-800 shadow-rose-100/50"
  };

  const toastContent = (
    <div className={`fixed top-10 right-10 z-[99999] min-w-[320px] p-5 pr-6 border-2 rounded-[1.5rem] flex items-center gap-4 animate-in fade-in slide-in-from-right-10 duration-500 shadow-2xl ${styles[type] || styles.success}`}>
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg shadow-sm ${type === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
        {type === 'success' ? '✓' : '⚠️'}
      </div>
      <div className="flex-1">
        <div className={`text-[0.6rem] font-black uppercase tracking-widest ${type === 'success' ? 'text-emerald-500' : 'text-rose-500'}`}>
          {type === 'success' ? 'SISTEM MENGONFIRMASI' : 'PERINGATAN SISTEM'}
        </div>
        <div className="text-[0.75rem] font-bold leading-tight mt-1 text-slate-700">{message}</div>
      </div>
      <button onClick={onClose} className="ml-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all">✕</button>
    </div>
  );

  return createPortal(toastContent, document.body);
};

export default Toast;
