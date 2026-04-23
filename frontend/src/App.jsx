import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import SongList from './pages/SongList';
import SongViewer from './pages/SongViewer';
import SongImporter from './pages/SongImporter';
import SetlistList from './pages/SetlistList';
import SetlistViewer from './pages/SetlistViewer';
import Users from './pages/Users';
import Sidebar from './components/Sidebar';

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('worship_user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <Router>
      <div className="flex flex-col md:flex-row h-screen bg-slate-900 text-slate-100 font-sans overflow-hidden">
        <Sidebar user={user} onLogout={() => { setUser(null); localStorage.removeItem('worship_user'); }} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-20 md:pb-8">
          <Routes>
            <Route path="/" element={<Navigate to="/songs" replace />} />
            <Route path="/songs" element={<SongList user={user} />} />
            <Route path="/songs/import" element={<SongImporter />} />
            <Route path="/songs/:id" element={<SongViewer user={user} />} />
            <Route path="/setlists" element={<SetlistList user={user} />} />
            <Route path="/setlists/:id" element={<SetlistViewer user={user} />} />
            <Route path="/users" element={user.role === 'ADMIN' ? <Users /> : <div className="p-8">Acceso Denegado</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
