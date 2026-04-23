import { useState } from 'react';
import { fetchApi } from '../utils/api';
import { Mic2, Guitar, Lock, Mail, UserPlus, LogIn, Users } from 'lucide-react';
import logoBlanco from '../assets/images/logo-blanco.png';

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
    <div className="flex min-h-screen items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Background layers (repeated since Login is outside of App routing if unauthenticated) */}
      <div className="ambient-bg"></div>
      <div className="ambient-noise"></div>

      <div className="w-full max-w-md p-8 md:p-10 bg-white/5 backdrop-blur-3xl rounded-[2rem] shadow-2xl border border-white/10 relative z-10">
        {/* Glow Effect */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-orange-500/20 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex justify-center mb-6">
            <img src={logoBlanco} alt="MinisWorship" className="w-32 md:w-40 h-auto object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]" />
          </div>
          
          <div className="text-center mb-8">
            <p className="text-slate-400 text-sm font-medium">
              {isRegister ? 'Crea tu cuenta personalizada' : 'Inicia sesión para acceder'}
            </p>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-200 rounded-2xl text-sm font-medium animate-in fade-in slide-in-from-top-2 text-center">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {isRegister && (
              <div className="grid grid-cols-2 gap-3 p-1.5 bg-black/40 rounded-2xl border border-white/5">
                <button
                  type="button"
                  onClick={() => setRole('VOCAL')}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${
                    role === 'VOCAL' 
                      ? 'bg-white text-black shadow-lg' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
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
                      ? 'bg-white text-black shadow-lg' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
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
                    className="w-full p-4 pl-12 bg-black/40 border border-white/10 rounded-2xl focus:ring-2 focus:ring-white/20 focus:border-white/30 outline-none transition-all placeholder:text-slate-500 text-sm font-medium text-white"
                    placeholder="Nombre completo"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-white transition-colors" size={18} />
                </div>
              )}

              <div className="relative group">
                <input 
                  type="email" 
                  required
                  className="w-full p-4 pl-12 bg-black/40 border border-white/10 rounded-2xl focus:ring-2 focus:ring-white/20 focus:border-white/30 outline-none transition-all placeholder:text-slate-500 text-sm font-medium text-white"
                  placeholder="ejemplo@iglesia.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-white transition-colors" size={18} />
              </div>

              <div className="relative group">
                <input 
                  type="password" 
                  required
                  className="w-full p-4 pl-12 bg-black/40 border border-white/10 rounded-2xl focus:ring-2 focus:ring-white/20 focus:border-white/30 outline-none transition-all placeholder:text-slate-500 text-sm font-medium text-white"
                  placeholder="Tu contraseña secreta"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-white transition-colors" size={18} />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="group relative w-full py-4 bg-white hover:bg-slate-200 text-black rounded-2xl font-bold shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 overflow-hidden"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  {isRegister ? <UserPlus size={20} /> : <LogIn size={20} />}
                  {isRegister ? 'Crear Cuenta' : 'Ingresar'}
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
              }}
              className="text-sm font-bold text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              {isRegister ? '¿Ya tienes cuenta? Ingresa aquí' : '¿Eres nuevo? Regístrate aquí'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
