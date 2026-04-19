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
export default Badge;
