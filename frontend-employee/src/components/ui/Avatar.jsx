export const Avatar = ({ name, className = "" }) => (
  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center uppercase justify-center text-white font-black shadow-lg shadow-blue-200 ${className}">
    {name?.charAt(0) || 'U'}
  </div>
);
export default Avatar;
