import React, { useState, useEffect, useCallback } from 'react';
import { 
  Home, Layers, Timer, Calendar, BarChart2, Zap, 
  ChevronRight, Menu, X 
} from 'lucide-react'; 
import { BrowserRouter, useLocation, useNavigate, Routes, Route } from 'react-router-dom';
import { useAuth, AuthProvider } from './context/AuthContext';
import { asignaturaService } from './services/asignaturaService';

// Páginas
import Dashboard from './pages/Dashboard';
import FlashcardsPage from './pages/FlashcardsPage';
import FocusModePage from './pages/FocusModePage';
import CalendarPage from './pages/CalendarPage';
import ProgresoPage from './pages/ProgresoPage';
import MateriaDetallePage from './pages/MateriaDetallePage';
import AuthPage from './pages/AuthPage';

const MainApp = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [asignaturas, setAsignaturas] = useState([]); 
  const [asignaturaActual, setAsignaturaActual] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Función para cargar materias desde la API
  const cargarMaterias = useCallback(() => {
    if (user?.id) {
      asignaturaService.listarPorUsuario(user.id)
        .then(res => {
          const datosRaw = Array.isArray(res.data) ? res.data : (res.data?.content || []);
          const datosLimpios = datosRaw.map(asig => ({
            ...asig,
            id: asig.id || asig.id_asignatura,
            mazos: asig.mazos || [],
            sesiones: asig.sesiones || []
          }));
          setAsignaturas(datosLimpios);

          // Si estamos en una página de materia, actualizamos la referencia local
          const pathParts = location.pathname.split('/');
          const currentId = pathParts[pathParts.length - 1];
          if (location.pathname.includes('/materia/')) {
            const actualizada = datosLimpios.find(a => String(a.id) === String(currentId));
            if (actualizada) setAsignaturaActual(actualizada);
          }
        })
        .catch(err => {
          console.error("Error al cargar materias:", err);
          setAsignaturas([]); 
        });
    }
  }, [user, location.pathname]);

  useEffect(() => {
    cargarMaterias();
  }, [cargarMaterias]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#0A0A0A] text-white overflow-x-hidden">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none !important; }
        .no-scrollbar { -ms-overflow-style: none !important; scrollbar-width: none !important; }
        .custom-scrollbar::-webkit-scrollbar { display: none !important; width: 0 !important; }
        .custom-scrollbar { -ms-overflow-style: none !important; scrollbar-width: none !important; }
      `}</style>

      {/* Botón menú móvil */}
      <button 
        className="md:hidden fixed top-4 right-4 z-50 p-2 bg-indigo-600 rounded-lg"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* SIDEBAR */}
      <aside className={`fixed md:sticky md:top-0 z-40 h-screen w-[280px] bg-[#0D0D0D] border-r border-white/5 flex flex-col transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-10 flex items-center gap-3 text-indigo-500 shrink-0">
          <Zap size={28} fill="currentColor" />
          <span className="text-2xl font-black tracking-tighter text-white uppercase italic">StudySync</span>
        </div>
        
        <div className="flex-1 overflow-y-auto px-6 no-scrollbar">
          <nav className="space-y-1">
            <SidebarItem icon={<Home size={20}/>} label="Inicio" active={location.pathname === '/'} onClick={() => navigate('/')} />
            <SidebarItem icon={<Layers size={20}/>} label="Flashcards" active={location.pathname.startsWith('/flashcards')} onClick={() => navigate('/flashcards')} />
            <SidebarItem icon={<Timer size={20}/>} label="Modo Focus" active={location.pathname === '/focus'} onClick={() => navigate('/focus')} />
            <SidebarItem icon={<Calendar size={20}/>} label="Calendario" active={location.pathname === '/calendar'} onClick={() => navigate('/calendar')} />
            <SidebarItem icon={<BarChart2 size={20}/>} label="Progreso" active={location.pathname === '/progreso'} onClick={() => navigate('/progreso')} />
            
            <div className="pt-10 pb-4 px-4 text-[10px] text-gray-600 font-black uppercase tracking-[0.3em]">Materias</div>
            {asignaturas.map((asig) => (
              <button 
                key={asig.id} 
                onClick={() => { setAsignaturaActual(asig); navigate(`/materia/${asig.id}`); setIsSidebarOpen(false); }} 
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all mb-1 group ${location.pathname === `/materia/${asig.id}` ? 'bg-white/10 text-white shadow-inner' : 'hover:bg-white/5 text-gray-500'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: asig.color }} />
                  <span className="text-sm font-bold truncate max-w-[150px]">{asig.nombre}</span>
                </div>
                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100" />
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6 border-t border-white/5">
          <div className="bg-[#111] p-4 rounded-[24px] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold uppercase">
                {user?.username?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate">{user?.username}</p>
              <button onClick={logout} className="text-[9px] text-red-500 font-black uppercase tracking-widest">Cerrar sesión</button>
            </div>
          </div>
        </div>
      </aside>
      
      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto h-screen no-scrollbar">
        <Routes>
          <Route path="/" element={<Dashboard user={user} asignaturas={asignaturas} onMateriaCreada={cargarMaterias} setAsignaturaActual={setAsignaturaActual} />} />
          
          <Route path="/flashcards/mazo/:idMazo" element={<FlashcardsPage />} />
          <Route path="/flashcards" element={<FlashcardsPage />} />
          
          <Route path="/focus" element={<FocusModePage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/progreso" element={<ProgresoPage />} />

          {/* Sincronización del Sidebar al actualizar */}
          <Route 
            path="/materia/:id" 
            element={
              <MateriaDetallePage 
                asignatura={asignaturaActual} 
                onAsignaturaActualizada={cargarMaterias} 
              />
            } 
          />
        </Routes>
      </main>
    </div>
  );
};

const SidebarItem = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all mb-1 ${active ? 'bg-white/5 text-white border border-white/5 shadow-inner' : 'text-gray-500 hover:text-gray-300'}`}>
    <span className={active ? 'text-indigo-500' : ''}>{icon}</span>
    <span className="text-sm font-bold tracking-tight">{label}</span>
  </button>
);

const AuthWrapper = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return !user ? <AuthPage /> : <BrowserRouter><MainApp /></BrowserRouter>;
}

export default function App() {
  return (<AuthProvider><AuthWrapper /></AuthProvider>);
}