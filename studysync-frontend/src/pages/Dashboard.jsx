import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Zap, Flame, BookOpen, Clock, Plus, 
  Sparkles, Pause, Play, Save, Calendar, FileUp, ChevronRight
} from 'lucide-react';
import { asignaturaService } from '../services/asignaturaService';

const Dashboard = ({ user, asignaturas = [], onMateriaCreada, setAsignaturaActual }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // Estado para el buscador
  const [selectedAsignaturaFocus, setSelectedAsignaturaFocus] = useState('');
  const [nuevaAsig, setNuevaAsig] = useState({ nombre: '', profesor: '', descripcion: '', color: '#6366f1' });
  const [eventosCalendario, setEventosCalendario] = useState([]);
  
  // Pomodoro State
  const [seconds, setSeconds] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [idSesionActual, setIdSesionActual] = useState(null);

  // IA Generator State
  const [selectedAsigIA, setSelectedAsigIA] = useState('');

  useEffect(() => {
    const cargarEventos = async () => {
      if (user?.id) {
        try {
          const res = await axios.get(`http://localhost:8080/api/agenda/usuario/${user.id}`);
          setEventosCalendario(res.data || []);
        } catch (err) { console.error("Error cargando agenda:", err); }
      }
    };
    cargarEventos();
  }, [user, asignaturas]);

  useEffect(() => {
    let interval = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => setSeconds(prev => prev - 1), 1000);
    } else if (seconds === 0) {
      clearInterval(interval);
      setIsActive(false);
      handleFinalizarYGuardar();
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  // Obtener todas las flashcards de todos los mazos para la lista de "Últimas"
  const todasLasFlashcards = useMemo(() => {
    const cards = [];
    asignaturas.forEach(asig => {
      asig.mazos?.forEach(mazo => {
        mazo.flashcards?.forEach(fc => {
          cards.push({
            ...fc,
            materiaNombre: asig.nombre,
            materiaColor: asig.color,
            mazoNombre: mazo.titulo,
            mazoId: mazo.id
          });
        });
      });
    });
    // Ordenar por ID descendente (asumiendo que las más nuevas tienen ID mayor)
    return cards.sort((a, b) => b.id - a.id);
  }, [asignaturas]);

  // Lógica de filtrado con el buscador superior
  const flashcardsFiltradas = useMemo(() => {
    return todasLasFlashcards.filter(fc => 
      fc.pregunta?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fc.materiaNombre?.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 6); // Limitamos a las 6 últimas para no saturar
  }, [todasLasFlashcards, searchTerm]);

  const stats = useMemo(() => {
    let totalFlashcards = 0;
    let totalMinutos = 0;
    asignaturas.forEach(asig => {
      asig.mazos?.forEach(m => totalFlashcards += (m.flashcards?.length || 0));
      asig.sesiones?.forEach(s => totalMinutos += (s.duracion || 0));
    });
    return { racha: user?.racha || 0, flashcards: totalFlashcards, tiempo: (totalMinutos / 60).toFixed(1) };
  }, [asignaturas, user]);

  const irAMateria = (id) => {
    const asig = asignaturas.find(a => a.id === id);
    if (asig) {
      setAsignaturaActual(asig);
      navigate(`/materia/${id}`);
    }
  };

  const handleIniciarSesion = async () => {
    if (!selectedAsignaturaFocus) return alert("Selecciona una materia");
    try {
      const payload = { usuario: { id: user.id }, asignatura: { id: parseInt(selectedAsignaturaFocus) }, tipo: 'estudio', fechaInicio: new Date().toISOString().split('.')[0] };
      const res = await axios.post('http://localhost:8080/api/sesiones/iniciar', payload);
      setIdSesionActual(res.data.id || res.data.id_sesion);
      setIsActive(true);
    } catch (err) { console.error(err); }
  };

  const handleFinalizarYGuardar = async () => {
    if (!idSesionActual) return setIsActive(false);
    const duracionReal = Math.max(1, Math.floor((25 * 60 - seconds) / 60));
    try {
      await axios.put(`http://localhost:8080/api/sesiones/finalizar/${idSesionActual}?duracion=${duracionReal}`);
      setIsActive(false); setSeconds(25 * 60); setIdSesionActual(null); onMateriaCreada(); 
    } catch (err) { console.error(err); }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full bg-[#0A0A0A] text-white overflow-y-auto lg:overflow-hidden custom-scrollbar p-6 lg:p-10">
      <div className="flex-1 overflow-y-auto pr-0 lg:pr-6 custom-scrollbar">
        <header className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black tracking-tighter italic uppercase">Hola, {user?.username}.</h1>
            <button onClick={() => setIsModalOpen(true)} className="mt-4 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg hover:scale-105 transition-transform"><Plus size={14} /> Añadir Materia</button>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-4 text-gray-600" size={18} />
            <input 
              className="w-full bg-[#111] border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-xs outline-none focus:border-indigo-500/50" 
              placeholder="Buscar flashcards o materias..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <StatCard icon={<Flame className="text-orange-500" />} value={stats.racha} label="Días racha" />
          <StatCard icon={<BookOpen className="text-blue-500" />} value={stats.flashcards} label="Flashcards Totales" />
          <StatCard icon={<Clock className="text-emerald-500" />} value={`${stats.tiempo}h`} label="Tiempo Enfoque" />
        </div>

        {/* --- GENERADOR IA (Restaurado) --- */}
        <section className="mb-10 bg-[#111] border border-white/5 rounded-[40px] p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10"><Sparkles size={120} className="text-indigo-500" /></div>
          <div className="flex items-center gap-2 mb-6 text-indigo-500 font-black text-[10px] uppercase tracking-[0.3em]"><Sparkles size={16} /> Generador de Flashcards IA</div>
          <div className="flex flex-col md:flex-row gap-4 relative z-10">
            <select 
              value={selectedAsigIA}
              onChange={(e) => setSelectedAsigIA(e.target.value)}
              className="flex-1 bg-[#0A0A0A] border border-white/5 rounded-2xl py-4 px-6 text-xs outline-none focus:border-indigo-500"
            >
              <option value="">¿A qué materia pertenece?</option>
              {asignaturas.map(asig => <option key={asig.id} value={asig.id}>{asig.nombre}</option>)}
            </select>
            <div className="flex-[2] bg-[#0A0A0A] border border-dashed border-white/10 rounded-2xl p-4 flex items-center justify-center gap-3 text-gray-500 hover:border-indigo-500/50 transition-colors cursor-pointer">
              <FileUp size={20} />
              <span className="text-[10px] font-black uppercase">Subir archivo (PDF, DOCX)</span>
            </div>
          </div>
          <button className="w-full mt-4 bg-white/5 hover:bg-white/10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all">Crear Mazo con IA</button>
        </section>

        {/* --- ÚLTIMAS FLASHCARDS (Nueva Sección con Filtro) --- */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-gray-500 font-black text-[10px] uppercase tracking-widest"><Zap size={16} /> Últimas Flashcards</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {flashcardsFiltradas.map((card) => (
              <div 
                key={card.id} 
                onClick={() => navigate(`/flashcards/mazo/${card.mazoId}`)}
                className="bg-[#111] border border-white/5 rounded-[28px] p-5 flex items-center justify-between group hover:border-indigo-500/30 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className="w-1.5 h-8 rounded-full shrink-0" style={{ backgroundColor: card.materiaColor }} />
                  <div className="truncate">
                    <h4 className="font-bold text-sm truncate pr-4">{card.pregunta}</h4>
                    <p className="text-[9px] text-gray-500 font-black uppercase mt-1 tracking-tighter">{card.materiaNombre} • {card.mazoNombre}</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-700 group-hover:text-indigo-500 transition-colors shrink-0" />
              </div>
            ))}
            {flashcardsFiltradas.length === 0 && (
              <div className="col-span-2 py-10 text-center border border-dashed border-white/5 rounded-[32px]">
                <p className="text-gray-600 text-[10px] font-black uppercase italic">No se encontraron flashcards con "{searchTerm}"</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Sidebar Pomodoro */}
      <aside className="w-full lg:w-96 bg-[#0D0D0D] border-l border-white/5 p-8 flex flex-col rounded-[40px] lg:rounded-none">
        <div className="bg-[#111] border border-white/5 rounded-[40px] p-8 text-center mb-8 shadow-2xl">
          <p className="text-[10px] text-gray-500 font-black uppercase mb-6 tracking-widest">Enfoque Pomodoro</p>
          <div className={`text-7xl font-black mb-8 tabular-nums tracking-tighter ${isActive ? 'text-indigo-500 animate-pulse' : 'text-white'}`}>{Math.floor(seconds/60).toString().padStart(2,'0')}:{(seconds%60).toString().padStart(2,'0')}</div>
          <select value={selectedAsignaturaFocus} onChange={(e) => setSelectedAsignaturaFocus(e.target.value)} disabled={isActive} className="w-full bg-[#0A0A0A] border border-white/5 rounded-xl py-3 px-4 text-[10px] font-black uppercase mb-6 outline-none text-center">
            <option value="">Selecciona Materia</option>
            {asignaturas.map(asig => <option key={asig.id} value={asig.id}>{asig.nombre}</option>)}
          </select>
          <button onClick={isActive ? handleFinalizarYGuardar : handleIniciarSesion} className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${isActive ? 'bg-emerald-600' : 'bg-indigo-600'}`}>
            {isActive ? <Save size={14}/> : <Play size={14}/>} {isActive ? 'Finalizar' : 'Iniciar'}
          </button>
        </div>
      </aside>

      {/* Modal Nueva Materia */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <form onSubmit={async (e) => { e.preventDefault(); await asignaturaService.crear({ ...nuevaAsig, usuario: { id: user.id } }); setIsModalOpen(false); onMateriaCreada(); }} className="relative bg-[#111] border border-white/10 p-8 rounded-[40px] w-full max-w-md">
            <h2 className="text-2xl font-black italic mb-6 uppercase tracking-tighter">Nueva Materia</h2>
            <input required className="w-full bg-[#0A0A0A] border border-white/5 rounded-2xl p-4 text-sm mb-4 outline-none focus:border-indigo-500" placeholder="Nombre" onChange={e => setNuevaAsig({...nuevaAsig, nombre: e.target.value})} />
            <button type="submit" className="w-full bg-indigo-600 py-4 rounded-2xl font-black uppercase text-[10px]">Crear</button>
          </form>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, value, label }) => (
  <div className="bg-[#111] border border-white/5 p-8 rounded-[32px] hover:border-white/10 transition-all group">
    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center mb-4">{icon}</div>
    <div className="text-3xl font-black tracking-tighter italic">{value}</div>
    <div className="text-[9px] text-gray-600 font-black uppercase tracking-widest mt-1">{label}</div>
  </div>
);

export default Dashboard;