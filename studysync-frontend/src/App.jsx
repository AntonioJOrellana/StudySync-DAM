import React, { useState, useEffect, useCallback } from 'react';
import { 
  Home, Layers, Timer, Calendar, BarChart2, Zap, 
  ChevronRight 
} from 'lucide-react';

// Contexto y Servicios
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

const SplashScreen = () => (
  <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0A0A0A]">
    <div className="text-center animate-pulse">
      <Zap size={60} className="text-indigo-500 mb-4 mx-auto" fill="currentColor" />
      <h1 className="text-4xl font-black text-white tracking-tighter">StudySync</h1>
    </div>
  </div>
);

const MainApp = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('Inicio');
  const [asignaturas, setAsignaturas] = useState([]); // Inicializado como array vacío
  const [asignaturaActual, setAsignaturaActual] = useState(null);

  // Función para cargar materias corregida
  const cargarMaterias = useCallback(() => {
    if (user?.id) {
      asignaturaService.listarPorUsuario(user.id)
        .then(res => {
          // Validamos si la respuesta es un array o si viene paginada (res.data.content)
          const datos = Array.isArray(res.data) 
            ? res.data 
            : (res.data?.content || []);
          setAsignaturas(datos);
        })
        .catch(err => {
          console.error("Error cargando materias:", err);
          setAsignaturas([]); // En caso de error, reseteamos a array vacío para no romper el .map
        });
    }
  }, [user]);

  useEffect(() => {
    cargarMaterias();
  }, [cargarMaterias]);

  const renderContent = () => {
    switch (activeTab) {
      case 'Inicio': 
        return <Dashboard user={user} onMateriaCreada={cargarMaterias} />;
      case 'Flashcards': 
        return <FlashcardsPage asignaturasContext={asignaturas} />;
      case 'Modo Focus': 
        return <FocusModePage />;
      case 'Calendario': 
        return <CalendarPage />;
      case 'Progreso': 
        return <ProgresoPage />;
      case 'MateriaDetalle': 
        return <MateriaDetallePage asignatura={asignaturaActual} />;
      default: 
        return <Dashboard user={user} onMateriaCreada={cargarMaterias} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#0A0A0A] text-white overflow-hidden font-sans">
      
      {/* SIDEBAR IZQUIERDO */}
      <aside className="w-[280px] bg-[#0D0D0D] border-r border-white/5 flex flex-col shrink-0">
        <div className="p-10 flex items-center gap-3 text-indigo-500">
          <Zap size={28} fill="currentColor" />
          <span className="text-2xl font-black tracking-tighter text-white uppercase">StudySync</span>
        </div>

        <nav className="flex-1 px-6 space-y-1 overflow-y-auto custom-scrollbar">
          <SidebarItem 
            icon={<Home size={20}/>} 
            label="Inicio" 
            active={activeTab === 'Inicio'} 
            onClick={() => setActiveTab('Inicio')} 
          />
          <SidebarItem 
            icon={<Layers size={20}/>} 
            label="Flashcards" 
            active={activeTab === 'Flashcards'} 
            onClick={() => setActiveTab('Flashcards')} 
          />
          <SidebarItem 
            icon={<Timer size={20}/>} 
            label="Modo Focus" 
            active={activeTab === 'Modo Focus'} 
            onClick={() => setActiveTab('Modo Focus')} 
          />
          <SidebarItem 
            icon={<Calendar size={20}/>} 
            label="Calendario" 
            active={activeTab === 'Calendario'} 
            onClick={() => setActiveTab('Calendario')} 
          />
          <SidebarItem 
            icon={<BarChart2 size={20}/>} 
            label="Progreso" 
            active={activeTab === 'Progreso'} 
            onClick={() => setActiveTab('Progreso')} 
          />

          <div className="pt-10 pb-4 px-4 text-[10px] text-gray-600 font-black uppercase tracking-[0.3em]">
            Materias
          </div>
          
          <div className="space-y-1">
            {/* CORRECCIÓN: Verificamos que asignaturas sea un array antes del .map */}
            {Array.isArray(asignaturas) && asignaturas.length > 0 ? (
              asignaturas.map((asig) => {
                const idUnico = asig.id_asignatura || asig.id;
                const esActiva = activeTab === 'MateriaDetalle' && asignaturaActual?.id_asignatura === idUnico;
                const colorMateria = asig.color || '#6366f1';

                return (
                  <button
                    key={`sidebar-asig-${idUnico}`}
                    onClick={() => {
                      setAsignaturaActual(asig);
                      setActiveTab('MateriaDetalle');
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group mb-1 ${
                      esActiva 
                        ? 'text-white' 
                        : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'
                    }`}
                    style={esActiva ? {
                      backgroundColor: `${colorMateria}15`, 
                      borderLeft: `3px solid ${colorMateria}`,
                      borderRadius: '0 12px 12px 0'
                    } : {}}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]" 
                        style={{ backgroundColor: colorMateria }}
                      />
                      <span className={`text-sm font-bold truncate max-w-[150px] ${esActiva ? 'translate-x-1' : ''} transition-transform`}>
                        {asig.nombre}
                      </span>
                    </div>
                    <ChevronRight 
                      size={14} 
                      className={`transition-all ${esActiva ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`} 
                      style={{ color: colorMateria }}
                    />
                  </button>
                );
              })
            ) : (
              <p className="px-4 text-[10px] text-gray-700 italic">No hay materias disponibles</p>
            )}
          </div>
        </nav>

        {/* PERFIL DE USUARIO */}
        <div className="p-6 mt-auto">
          <div className="bg-[#111111] border border-white/5 p-4 rounded-[24px] flex items-center gap-3 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white text-sm shadow-lg shadow-indigo-600/20">
              {user?.username?.[0].toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">
                {user?.username || 'Usuario'}
              </p>
              <button 
                onClick={logout}
                className="text-[9px] text-red-500 font-black uppercase tracking-widest hover:text-red-400 transition-colors block mt-0.5"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-hidden relative">
        {renderContent()}
      </main>
    </div>
  );
};

const SidebarItem = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
      active 
      ? 'bg-white/5 text-white' 
      : 'text-gray-500 hover:bg-white/[0.02] hover:text-gray-300'
    }`}
  >
    <span className={active ? 'text-indigo-500' : ''}>{icon}</span>
    <span className="text-sm font-bold">{label}</span>
  </button>
);

export default function App() {
  return (
    <AuthProvider>
      <AuthWrapper />
    </AuthProvider>
  );
}

const AuthWrapper = () => {
  const { user, loading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (loading || showSplash) return <SplashScreen />;
  if (!user) return <AuthPage />;

  return <MainApp />;
};