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
    <div className="max-w-4xl mx-auto pb-24">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Gestión de Usuarios</h1>
      
      <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-900 border-b border-slate-700">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-300">Usuario</th>
                <th className="px-6 py-4 font-semibold text-slate-300">Rol Actual</th>
                <th className="px-6 py-4 font-semibold text-slate-300">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-slate-750 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                        <User size={20} className="text-slate-400" />
                      </div>
                      <div>
                        <div className="font-bold">{u.name}</div>
                        <div className="text-sm text-slate-400">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      u.role === 'ADMIN' ? 'bg-red-500/20 text-red-400' :
                      u.role === 'MUSICIAN' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {u.role === 'ADMIN' ? <ShieldAlert size={14} /> : u.role === 'MUSICIAN' ? <ShieldCheck size={14} /> : <Shield size={14} />}
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={u.role}
                      onChange={(e) => changeRole(u.id, e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
                    >
                      <option value="VOCAL">VOCAL</option>
                      <option value="MUSICIAN">MUSICIAN</option>
                      <option value="ADMIN">ADMIN</option>
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
