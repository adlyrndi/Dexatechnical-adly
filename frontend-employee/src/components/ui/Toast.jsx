export const Toast = ({ message, onClose }) => (!message ? null : (
  <div className="absolute inset-x-0 top-0 p-2.5 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-[0.6rem] font-black uppercase tracking-widest flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-300 shadow-sm shadow-rose-100/20">
    <span className="text-sm">⚠️</span>
    <span className="flex-1 truncate">{message}</span>
    <button onClick={onClose} className="opacity-40 hover:opacity-100 px-1">✕</button>
  </div>
));
export default Toast;
