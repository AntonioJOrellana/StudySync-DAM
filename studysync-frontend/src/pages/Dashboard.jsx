import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, Flame, BookOpen, Clock, Plus, 
  Sparkles, Pause, Play, Save, Calendar, FileUp, ChevronRight,
  Target, CheckCircle2, X, MessageSquare 
} from 'lucide-react';
import { asignaturaService } from '../services/asignaturaService';

const Dashboard = ({ user, onMateriaCreada, setAsignaturaActual }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAsignaturaFocus, setSelectedAsignaturaFocus] = useState('');
  const [nuevaAsig, setNuevaAsig] = useState({ nombre: '', profesor: '', descripcion: '', color: '#6366f1' });
  const [eventosCalendario, setEventosCalendario] = useState([]);
  
  // Estados para sincronización de datos
  const [datosGlobales, setDatosGlobales] = useState(null);
  const [asignaturas, setAsignaturas] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pomodoro State
  const [seconds, setSeconds] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [idSesionActual, setIdSesionActual] = useState(null);

  // IA Duda Rápida State
  const [dudaIA, setDudaIA] = useState('');
  const [respuestaIA, setRespuestaIA] = useState('');
  const [cargandoDuda, setCargandoDuda] = useState(false);

  const hideScrollStyle = {
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
    WebkitScrollbar: { display: 'none' }
  };

  useEffect(() => {
    if (user?.id) {
      const userId = user.id.toString().includes(':') ? user.id.split(':')[0] : user.id;
      
      const cargarInformacion = async () => {
        try {
          const [resStats, resAsig, resAgenda] = await Promise.all([
            axios.get(`http://localhost:8080/api/asignaturas/usuario/${userId}/estadisticas-globales`),
            axios.get(`http://localhost:8080/api/asignaturas/usuario/${userId}`),
            axios.get(`http://localhost:8080/api/agenda/usuario/${userId}`)
          ]);
          setDatosGlobales(resStats.data);
          setAsignaturas(resAsig.data);
          setEventosCalendario(resAgenda.data || []);
        } catch (err) {
          console.error("Error sincronizando dashboard:", err);
        } finally {
          setLoading(false);
        }
      };

      cargarInformacion();
    }
  }, [user]);

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

  const proximosHitos = useMemo(() => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return eventosCalendario
      .filter(ev => new Date(ev.fechaEvento) >= hoy)
      .map(ev => ({
        id: ev.id,
        nombre: ev.titulo,
        fecha: ev.fechaEvento,
        materiaNombre: ev.asignatura?.nombre || 'General',
        materiaColor: ev.asignatura?.color || '#6366f1',
        materiaId: ev.asignatura?.id
      }))
      .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
      .slice(0, 4);
  }, [eventosCalendario]);

  const stats = useMemo(() => {
    return { 
      racha: datosGlobales?.rachaDias || 0, 
      flashcards: datosGlobales?.totalFlashcards || 0, 
      tiempo: datosGlobales?.totalHoras ? datosGlobales.totalHoras.toFixed(1) : "0.0" 
    };
  }, [datosGlobales]);

  const irAMateria = (id) => {
    if (!id) return;
    const asig = asignaturas.find(a => (a.id || a.id_asignatura) === id);
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
      setIsActive(false); setSeconds(25 * 60); setIdSesionActual(null); 
      onMateriaCreada(); 
    } catch (err) { console.error(err); }
  };

  const handleConsultaIA = async () => {
    if (!dudaIA.trim()) return;
    setCargandoDuda(true);
    setRespuestaIA('');
    try {
      const res = await axios.post("http://localhost:8080/api/dashboard/ia/consulta", { duda: dudaIA });
      setRespuestaIA(res.data.respuesta);
    } catch (error) {
      setRespuestaIA("Lo siento, no he podido conectar con mi cerebro artificial. Inténtalo de nuevo.");
    } finally {
      setCargandoDuda(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full bg-[#0A0A0A] text-white overflow-hidden p-6 lg:p-10 no-scrollbar">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none !important; }
        .no-scrollbar { -ms-overflow-style: none !important; scrollbar-width: none !important; }
        * { -ms-overflow-style: none !important; scrollbar-width: none !important; }
        *::-webkit-scrollbar { display: none !important; }
        select { color: white !important; }
        select option { background-color: #111 !important; color: white !important; }
        select:disabled { color: #4b5563 !important; }
      `}</style>
      
      <div className="flex-1 overflow-y-auto pr-0 lg:pr-6 no-scrollbar" style={hideScrollStyle}>
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div className="relative">
            <span className="text-indigo-500 font-black text-[10px] uppercase tracking-[0.4em] mb-2 block">Panel de Control</span>
            <h1 className="text-6xl md:text-7xl font-black tracking-tighter italic uppercase leading-[0.8] bg-gradient-to-b from-white to-white/20 bg-clip-text text-transparent">
              Hola, <br />
              <span className="text-white">{user?.username}.</span>
            </h1>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center gap-3 shadow-[0_0_30px_rgba(79,70,229,0.3)] hover:scale-105 transition-all group"
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform" /> 
            Nueva Materia
          </button>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <StatCard icon={<Flame className="text-orange-500" />} value={stats.racha} label="Días racha" />
          <StatCard icon={<BookOpen className="text-blue-500" />} value={stats.flashcards} label="Flashcards Totales" />
          <StatCard icon={<Clock className="text-emerald-500" />} value={`${stats.tiempo}h`} label="Tiempo Enfoque" />
        </div>

        {/* SECCIÓN TUTOR IA */}
        <section className="mb-10 bg-[#111] border border-white/5 rounded-[40px] p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10"><MessageSquare size={100} className="text-indigo-500" /></div>
          <div className="flex items-center gap-2 mb-6 text-indigo-500 font-black text-[10px] uppercase tracking-[0.3em]">
            <Sparkles size={16} /> Tutor IA StudySync
          </div>
          <div className="relative z-10">
            <textarea 
              className="w-full bg-[#0A0A0A] border border-white/5 rounded-2xl py-4 px-6 text-xs text-white outline-none focus:border-indigo-500 mb-4 min-h-[100px] resize-none" 
              placeholder="¿Qué no entiendes hoy? Escríbeme cualquier concepto para que te lo explique de forma sencilla..." 
              value={dudaIA}
              onChange={(e) => setDudaIA(e.target.value)}
            />
            {respuestaIA && (
              <div className="bg-[#0A0A0A] border border-indigo-500/20 rounded-2xl p-6 mb-4 text-xs leading-relaxed text-gray-300 animate-in fade-in slide-in-from-top-2">
                <p className="font-black text-indigo-400 uppercase text-[9px] mb-2 tracking-widest">Respuesta del Tutor:</p>
                {respuestaIA}
              </div>
            )}
            <button 
              onClick={handleConsultaIA}
              disabled={cargandoDuda || !dudaIA.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-white/5 disabled:text-gray-700 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3"
            >
              {cargandoDuda ? <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : "Consultar al Tutor"}
            </button>
          </div>
        </section>

        <section className="mb-10">
          <div className="flex items-center gap-2 mb-6 text-gray-500 font-black text-[10px] uppercase tracking-[0.3em]">
            <Calendar size={16} /> Próximos Hitos
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {proximosHitos.map((exam) => (
              <div key={exam.id} className="bg-[#111] border border-white/5 rounded-[32px] p-6 flex items-center justify-between group hover:border-indigo-500/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-10 rounded-full" style={{ backgroundColor: exam.materiaColor }} />
                  <div>
                    <h4 className="font-black italic uppercase text-sm tracking-tighter">{exam.nombre}</h4>
                    <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">
                      {exam.materiaNombre} • {new Date(exam.fecha).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button onClick={() => irAMateria(exam.materiaId)} className="bg-white/5 hover:bg-indigo-600 hover:text-white text-indigo-400 px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-tighter transition-all">Preparar</button>
              </div>
            ))}
          </div>
        </section>
      </div>

      <aside className="w-full lg:w-96 flex flex-col gap-6 no-scrollbar">
        {/* MODO FOCUS */}
        <div className="bg-[#111] border border-white/5 rounded-[40px] p-8 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-indigo-600 rounded-b-full opacity-50" />
          <p className="text-[10px] text-indigo-500 font-black uppercase mb-6 tracking-[0.3em]">Modo Focus</p>
          <div className={`text-7xl font-black mb-8 tabular-nums tracking-tighter ${isActive ? 'text-indigo-500 animate-pulse' : 'text-white'}`}>
            {Math.floor(seconds/60).toString().padStart(2,'0')}:{(seconds%60).toString().padStart(2,'0')}
          </div>
          <select value={selectedAsignaturaFocus} onChange={(e) => setSelectedAsignaturaFocus(e.target.value)} disabled={isActive} className="w-full bg-[#0A0A0A] border border-white/5 rounded-xl py-3 px-4 text-[10px] font-black uppercase mb-6 outline-none text-center text-white cursor-pointer hover:border-white/20 transition-colors">
            <option value="">Selecciona Materia</option>
            {asignaturas.map(asig => <option key={asig.id || asig.id_asignatura} value={asig.id || asig.id_asignatura}>{asig.nombre}</option>)}
          </select>
          <button onClick={isActive ? handleFinalizarYGuardar : handleIniciarSesion} className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${isActive ? 'bg-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'bg-indigo-600 shadow-[0_0_20px_rgba(79,70,229,0.2)] hover:scale-[1.02]'}`}>
            {isActive ? <Save size={14}/> : <Play size={14}/>} {isActive ? 'Finalizar' : 'Iniciar Sesión'}
          </button>
        </div>

        <div className="bg-[#111] border border-white/5 rounded-[40px] p-8 shadow-2xl flex-1 overflow-hidden flex flex-col">
          <div className="flex items-center gap-2 mb-6 text-gray-500 font-black text-[10px] uppercase tracking-widest">
            <Target size={16} className="text-indigo-500" /> Objetivos Semanales
          </div>
          <div className="space-y-4 overflow-y-auto pr-2 no-scrollbar" style={hideScrollStyle}>
            <GoalItem label="Repasar 50 flashcards" progress={80} done={false} />
            <GoalItem label="3h de Enfoque Total" progress={100} done={true} />
            <GoalItem label="Completar Mazo Programación" progress={30} done={false} />
          </div>
        </div>
      </aside>

      {/* MODAL CORREGIDO: CON TODOS LOS CAMPOS */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <form 
            onSubmit={async (e) => { 
              e.preventDefault(); 
              await asignaturaService.crear({ ...nuevaAsig, usuario: { id: user.id } }); 
              setIsModalOpen(false); 
              onMateriaCreada(); 
            }} 
            className="relative bg-[#111] border border-white/10 p-10 rounded-[40px] w-full max-w-md text-white shadow-2xl"
          >
            <h2 className="text-3xl font-black italic mb-8 uppercase tracking-tighter">Nueva Materia</h2>
            
            <div className="space-y-4 mb-8">
              <div>
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 ml-4 mb-1 block">Nombre</label>
                <input required className="w-full bg-[#0A0A0A] border border-white/5 rounded-2xl p-4 text-xs outline-none focus:border-indigo-500 text-white transition-all" placeholder="Ej: Programación Avanzada" value={nuevaAsig.nombre} onChange={e => setNuevaAsig({...nuevaAsig, nombre: e.target.value})} />
              </div>
              
              <div>
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 ml-4 mb-1 block">Profesor</label>
                <input required className="w-full bg-[#0A0A0A] border border-white/5 rounded-2xl p-4 text-xs outline-none focus:border-indigo-500 text-white transition-all" placeholder="Nombre del docente" value={nuevaAsig.profesor} onChange={e => setNuevaAsig({...nuevaAsig, profesor: e.target.value})} />
              </div>

              <div>
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 ml-4 mb-1 block">Descripción</label>
                <textarea className="w-full bg-[#0A0A0A] border border-white/5 rounded-2xl p-4 text-xs outline-none focus:border-indigo-500 text-white transition-all resize-none h-24" placeholder="Breve descripción..." value={nuevaAsig.descripcion} onChange={e => setNuevaAsig({...nuevaAsig, descripcion: e.target.value})} />
              </div>

              <div>
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 ml-4 mb-1 block">Identificador Visual (Color)</label>
                <div className="flex items-center gap-4 bg-[#0A0A0A] border border-white/5 rounded-2xl p-3">
                  <input type="color" className="w-12 h-10 rounded-lg cursor-pointer bg-transparent border-none" value={nuevaAsig.color} onChange={e => setNuevaAsig({...nuevaAsig, color: e.target.value})} />
                  <span className="text-[10px] font-black uppercase text-gray-400">{nuevaAsig.color}</span>
                </div>
              </div>
            </div>

            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-lg active:scale-95">Crear Materia</button>
          </form>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, value, label }) => (
  <div className="bg-[#111] border border-white/5 p-8 rounded-[32px] hover:border-indigo-500/20 transition-all group relative overflow-hidden">
    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-8 -mt-8 group-hover:scale-110 transition-transform" />
    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center mb-4 relative z-10">{icon}</div>
    <div className="text-4xl font-black tracking-tighter italic relative z-10">{value}</div>
    <div className="text-[9px] text-gray-600 font-black uppercase tracking-widest mt-1 relative z-10">{label}</div>
  </div>
);

const GoalItem = ({ label, progress, done }) => (
  <div className={`p-4 rounded-2xl border ${done ? 'border-indigo-500/30 bg-indigo-500/5' : 'border-white/5 bg-[#0A0A0A]'} transition-all hover:scale-[1.01]`}>
    <div className="flex items-center justify-between mb-2">
      <span className={`text-[10px] font-bold uppercase ${done ? 'text-indigo-400' : 'text-gray-400'}`}>{label}</span>
      {done && <CheckCircle2 size={14} className="text-indigo-500" />}
    </div>
    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
      <div className="bg-indigo-600 h-full transition-all duration-1000" style={{ width: `${progress}%` }} />
    </div>
  </div>
);

export default Dashboard;