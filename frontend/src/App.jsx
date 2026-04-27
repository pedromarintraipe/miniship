import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import SongList from './pages/SongList';
import SongViewer from './pages/SongViewer';
import SongImporter from './pages/SongImporter';
import SongEditor from './pages/SongEditor';
import VariantEditor from './pages/VariantEditor';
import SetlistList from './pages/SetlistList';
import SetlistViewer from './pages/SetlistViewer';
import Users from './pages/Users';
import Navbar from './components/Navbar';

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('worship_user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const updateUserPreferences = (newPrefs) => {
    const updatedUser = { ...user, ...newPrefs };
    setUser(updatedUser);
    localStorage.setItem('worship_user', JSON.stringify(updatedUser));
  };

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <Router>
      <div className="min-h-screen text-slate-100 font-sans selection:bg-white/20">
        <div className="ambient-bg"></div>
        <div className="ambient-noise"></div>
        
        <Navbar user={user} onLogout={() => { setUser(null); localStorage.removeItem('worship_user'); }} />
        
        <main className="pt-24 pb-32 md:pt-32 md:pb-12 px-4 md:px-8 max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/songs" replace />} />
            <Route path="/songs" element={<SongList user={user} />} />
            <Route path="/songs/import" element={<SongImporter />} />
            <Route path="/songs/:id/edit" element={user.role === 'ADMIN' || user.role === 'MUSICIAN' ? <SongEditor /> : <Navigate to="/songs" />} />
            <Route path="/songs/:id/variants/new" element={user.role === 'ADMIN' || user.role === 'MUSICIAN' ? <VariantEditor user={user} /> : <Navigate to="/songs" />} />
            <Route path="/songs/:id" element={<SongViewer user={user} updateUserPreferences={updateUserPreferences} />} />
            <Route path="/setlists" element={<SetlistList user={user} />} />
            <Route path="/setlists/:id" element={<SetlistViewer user={user} />} />
            <Route path="/users" element={user.role === 'ADMIN' ? <Users /> : <div className="p-8">Acceso Denegado</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
