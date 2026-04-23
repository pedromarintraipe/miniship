import { useState } from 'react';
import { fetchApi } from '../utils/api';
import { Music, Mic2, Guitar, Lock, Mail, UserPlus, LogIn, Users } from 'lucide-react';

export default function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('VOCAL');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const endpoint = isRegister ? '/users/register' : '/users/login';
    const payload = isRegister 
      ? { email, password, name, role }
      : { email, password };

    try {
      const data = await fetchApi(endpoint, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      localStorage.setItem('worship_user', JSON.stringify(data.user));
      onLogin(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-slate-900 text-slate-100 p-4 font-sans">
      <div className="w-full max-w-md p-8 bg-slate-800 rounded-3xl shadow-2xl border border-slate-700/50 relative overflow-hidden">
        {/* Glow Effect */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-600/20 blur-[100px] rounded-full"></div>
        
        <div className="relative z-10">
          <div className="flex justify-center mb-8">
            <div className="p-4 bg-blue-600/10 rounded-3xl ring-1 ring-blue-500/20 shadow-inner">
              <Music size={40} className="text-blue-400" />
            </div>
          </div>
          
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight mb-2">Worship App</h2>
            <p className="text-slate-400 text-sm">
              {isRegister ? 'Crea tu cuenta personalizada' : 'Inicia sesión para continuar'}
            </p>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-sm font-medium animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegister && (
              <div className="grid grid-cols-2 gap-3 p-1 bg-slate-900 rounded-2xl border border-slate-700/50">
                <button
                  type="button"
                  onClick={() => setRole('VOCAL')}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${
                    role === 'VOCAL' 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40' 
                      : 'text-slate-500 hover:text-slate-400'
                  }`}
                >
                  <Mic2 size={16} />
                  Vocalista
                </button>
                <button
                  type="button"
                  onClick={() => setRole('MUSICIAN')}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${
                    role === 'MUSICIAN' 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40' 
                      : 'text-slate-500 hover:text-slate-400'
                  }`}
                >
                  <Guitar size={16} />
                  Músico
                </button>
              </div>
            )}

            <div className="space-y-4">
              {isRegister && (
                <div className="relative group">
                  <input 
                    type="text" 
                    required
                    className="w-full p-4 pl-12 bg-slate-900 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all placeholder:text-slate-600 text-sm"
                    placeholder="Nombre completo"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                </div>
              )}

              <div className="relative group">
                <input 
                  type="email" 
                  required
                  className="w-full p-4 pl-12 bg-slate-900 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all placeholder:text-slate-600 text-sm"
                  placeholder="ejemplo@iglesia.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={18} />
              </div>

              <div className="relative group">
                <input 
                  type="password" 
                  required
                  className="w-full p-4 pl-12 bg-slate-900 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all placeholder:text-slate-600 text-sm"
                  placeholder="Tu contraseña secreta"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={18} />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="group relative w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold shadow-2xl shadow-blue-600/30 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 overflow-hidden"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isRegister ? <UserPlus size={20} /> : <LogIn size={20} />}
                  {isRegister ? 'Crear Cuenta' : 'Entrar'}
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-700/50 text-center">
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
              }}
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              {isRegister ? '¿Ya tienes cuenta? Ingresa aquí' : '¿Eres nuevo? Regístrate aquí'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
