import { useState, useEffect } from 'react';
import { fetchApi } from '../utils/api';
import { User, Shield, ShieldAlert, ShieldCheck } from 'lucide-react';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi('/users')
      .then(setUsers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const changeRole = async (userId, newRole) => {
    try {
      const updatedUser = await fetchApi(`/users/${userId}/role`, {
        method: 'PUT',
        body: JSON.stringify({ role: newRole })
      });
      setUsers(users.map(u => u.id === userId ? updatedUser : u));
    } catch (err) {
      alert("Error cambiando rol: " + err.message);
    }
  };

  if (loading) return <div className="p-8">Cargando usuarios...</div>;

  return (
    <div className="max-w-5xl mx-auto pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6 relative z-10">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 mb-2">Comunidad</h1>
          <p className="text-slate-400 font-medium">Gestión de roles y accesos del ministerio</p>
        </div>
      </div>
      
      <div className="bg-white/5 backdrop-blur-3xl rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative">
        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left">
            <thead className="bg-black/40 border-b border-white/10 backdrop-blur-md">
              <tr>
                <th className="px-8 py-5 font-bold text-slate-300 text-sm uppercase tracking-wider">Usuario</th>
                <th className="px-8 py-5 font-bold text-slate-300 text-sm uppercase tracking-wider">Rol Actual</th>
                <th className="px-8 py-5 font-bold text-slate-300 text-sm uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
                        <User size={22} className="text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-lg">{u.name}</div>
                        <div className="text-sm text-slate-400 font-medium">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold shadow-sm ${
                      u.role === 'ADMIN' ? 'bg-red-500/20 text-red-400 border border-red-500/20' :
                      u.role === 'MUSICIAN' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/20' :
                      'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {u.role === 'ADMIN' ? <ShieldAlert size={14} /> : u.role === 'MUSICIAN' ? <ShieldCheck size={14} /> : <Shield size={14} />}
                      {u.role}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <select
                      value={u.role}
                      onChange={(e) => changeRole(u.id, e.target.value)}
                      className="bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-white/20 transition-all cursor-pointer"
                    >
                      <option value="VOCAL" className="bg-slate-900 text-white">VOCAL</option>
                      <option value="MUSICIAN" className="bg-slate-900 text-white">MUSICIAN</option>
                      <option value="ADMIN" className="bg-slate-900 text-white">ADMIN</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
