import { Link, useLocation } from 'react-router-dom';
import { Music, ListMusic, LogOut, User as UserIcon, Users } from 'lucide-react';

export default function Sidebar({ user, onLogout }) {
  const location = useLocation();
  
  const isAdmin = user?.role === 'ADMIN';

  const navItems = [
    { name: 'Canciones', path: '/songs', icon: Music },
    { name: 'Setlists', path: '/setlists', icon: ListMusic },
    ...(isAdmin ? [{ name: 'Usuarios', path: '/users', icon: Users }] : []),
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 bg-slate-800 border-r border-slate-700 flex-col h-full z-20 relative">
        <div className="p-6 border-b border-slate-700 font-bold text-xl flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Music size={24} className="text-blue-400" />
          </div>
          Worship App
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = location.pathname.startsWith(item.path);
            return (
              <Link 
                key={item.path} 
                to={item.path}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${active ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-700 hover:text-white'}`}
              >
                <Icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-3 mb-4 text-sm">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-blue-400 font-bold flex-shrink-0">
              <UserIcon size={20} />
            </div>
            <div className="overflow-hidden">
              <div className="font-bold truncate">{user.name}</div>
              <div className="text-slate-400 text-xs truncate">{user.role}</div>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="flex items-center gap-2 w-full p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors text-sm"
          >
            <LogOut size={16} />
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-slate-800 border-b border-slate-700 z-10">
        <div className="font-bold text-lg flex items-center gap-2">
          <Music size={20} className="text-blue-400" />
          Worship
        </div>
        <button onClick={onLogout} className="text-slate-400 flex items-center gap-2 text-sm p-1">
          <LogOut size={16} /> Salir
        </button>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 flex justify-around p-2 z-50 pb-safe">
        {navItems.map(item => {
          const Icon = item.icon;
          const active = location.pathname.startsWith(item.path) || (location.pathname === '/' && item.path === '/songs');
          return (
            <Link 
              key={item.path} 
              to={item.path}
              className={`flex flex-col items-center gap-1 p-2 flex-1 rounded-lg ${active ? 'text-blue-400' : 'text-slate-400'}`}
            >
              <Icon size={20} />
              <span className="text-[10px] uppercase font-bold">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
