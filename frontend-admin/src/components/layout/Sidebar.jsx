import { NavLink } from 'react-router-dom';

export const Sidebar = ({ profile, onLogout }) => {
  const menuItems = [
    { label: 'Overview', path: '/dashboard/overview' },
    { label: 'Employees', path: '/dashboard/employees' },
    { label: 'Logs', path: '/dashboard/logs' },
  ];

  return (
    <aside className="w-80 h-screen fixed left-0 top-0 bg-white border-r border-slate-200 flex flex-col p-8 z-50">
      <div className="mb-10">
        <h1 className="text-2xl font-black text-slate-900 tracking-tighter italic">Dexa<span className="text-blue-600">Admin</span></h1>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `block px-5 py-3.5 rounded-2xl font-black text-[0.7rem] uppercase tracking-widest transition-all ${isActive ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={onLogout}
        className="w-full py-4 rounded-2xl bg-rose-50 text-rose-600 hover:bg-rose-100 font-black text-[0.7rem] uppercase tracking-widest transition-all"
      >
        Keluar
      </button>
    </aside>
  );
};

export default Sidebar;
