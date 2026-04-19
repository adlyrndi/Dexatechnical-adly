export const Input = ({ label, ...props }) => (
  <div className="mb-6">
    {label && <label className="block text-[0.65rem] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">{label}</label>}
    {props.type === 'textarea' ? <textarea className="input-field" {...props}></textarea> : <input className="input-field" {...props} />}
  </div>
);
export default Input;
