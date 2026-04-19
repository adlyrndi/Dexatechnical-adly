export const Input = ({ label, ...props }) => {
  const baseClasses = "w-full px-6 rounded-[1.25rem] bg-slate-50 border-2 border-slate-100 focus:border-blue-500 focus:bg-white focus:ring-[6px] focus:ring-blue-50 transition-all font-bold text-slate-900 placeholder:text-slate-300 outline-none shadow-sm";
  
  return (
    <div className="mb-2">
      {label && <label className="block text-[0.65rem] font-black text-slate-400 uppercase tracking-widest mb-2 ml-2">{label}</label>}
      {props.type === 'textarea' ? (
        <textarea className={`${baseClasses} py-4 min-h-[120px] resize-none`} {...props}></textarea>
      ) : (
        <input className={`${baseClasses} h-16`} {...props} />
      )}
    </div>
  );
};
export default Input;
