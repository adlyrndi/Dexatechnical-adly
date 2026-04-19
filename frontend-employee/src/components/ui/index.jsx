
export const Button = ({ children, variant = "primary", className = "", ...props }) => (
  <button className={`${variant === "primary" ? "btn-primary" : "btn-ghost"} ${className}`} {...props}>{children}</button>
);


export const Card = ({ children, className = "", style = {} }) => (
  <div className={`glass-card ${className}`} style={style}>{children}</div>
);


export const Badge = ({ children, variant = "blue", className = "" }) => {
  const variants = {
    blue: "bg-blue-50 text-blue-500 border-blue-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100",
    slate: "bg-slate-900 text-slate-300 border-slate-700"
  };
  return (
    <span className={`px-2 py-0.5 rounded-md border text-[0.6rem] font-black uppercase tracking-widest ${variants[variant] || variants.blue} ${className}`}>
      {children}
    </span>
  );
};


export const Avatar = ({ name, className = "" }) => (
  <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center uppercase justify-center text-white font-black shadow-lg shadow-blue-200 ${className}`}>
    {name?.charAt(0) || 'U'}
  </div>
);


export const Input = ({ label, ...props }) => (
  <div className="mb-6">
    {label && <label className="block text-[0.65rem] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">{label}</label>}
    {props.type === 'textarea' ? <textarea className="input-field" {...props}></textarea> : <input className="input-field" {...props} />}
  </div>
);


export const Toast = ({ message, onClose }) => (!message ? null : (
  <div className="absolute inset-x-0 top-0 p-2.5 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-[0.6rem] font-black uppercase tracking-widest flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-300 shadow-sm shadow-rose-100/20">
    <span className="text-sm">⚠️</span>
    <span className="flex-1 truncate">{message}</span>
    <button onClick={onClose} className="opacity-40 hover:opacity-100 px-1">✕</button>
  </div>
));
