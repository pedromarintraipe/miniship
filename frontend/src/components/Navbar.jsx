import { Link, useLocation } from 'react-router-dom';
import { LogOut, LayoutGrid, Search, Layers, User as UserIcon } from 'lucide-react';

export default function Navbar({ user, onLogout }) {
  const location = useLocation();
  const isAdmin = user?.role === 'ADMIN';

  const navItems = [
    { name: 'Songs', path: '/songs' },
    { name: 'Setlists', path: '/setlists' },
    ...(isAdmin ? [{ name: 'Users', path: '/users' }] : []),
  ];

  return (
    <>
      {/* Desktop Floating Navbar */}
      <div className="hidden md:flex fixed top-6 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-8 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full px-8 py-3 shadow-[0_0_40px_rgba(255,255,255,0.03)]">
          {navItems.map(item => {
            const active = location.pathname.startsWith(item.path);
            return (
              <Link 
                key={item.path} 
                to={item.path}
                className={`text-sm font-medium transition-all ${active ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 'text-slate-400 hover:text-white'}`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Desktop Top Right Actions */}
      <div className="hidden md:flex fixed top-6 right-8 z-50 items-center gap-4">
        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full pl-3 pr-4 py-2">
          <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs text-white">
            <UserIcon size={12} />
          </div>
          <span className="text-sm font-medium text-slate-300">{user.name}</span>
          <button 
            onClick={onLogout}
            className="ml-2 pl-2 border-l border-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>

      {/* Desktop Top Left Logo */}
      <div className="hidden md:flex fixed top-6 left-8 z-50 items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
          <div className="w-5 h-5 rounded-full border-4 border-black"></div>
        </div>
      </div>

      {/* Mobile Top Header */}
      <div className="md:hidden fixed top-0 w-full flex items-center justify-between p-4 bg-black/80 backdrop-blur-lg border-b border-white/5 z-50">
        <div className="font-bold text-lg flex items-center gap-2 text-white">
          <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
            <div className="w-3 h-3 rounded-full border-2 border-black"></div>
          </div>
          Worship
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-400">{user.name}</span>
          <button onClick={onLogout} className="text-slate-400 hover:text-white">
            <LogOut size={18} />
          </button>
        </div>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-6 left-4 right-4 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl flex justify-around p-2 z-50 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        {navItems.map(item => {
          const active = location.pathname.startsWith(item.path) || (location.pathname === '/' && item.path === '/songs');
          return (
            <Link 
              key={item.path} 
              to={item.path}
              className={`flex flex-col items-center gap-1 p-2 flex-1 rounded-xl transition-all ${active ? 'bg-white/10 text-white' : 'text-slate-500'}`}
            >
              <span className="text-[11px] font-medium tracking-wide">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
