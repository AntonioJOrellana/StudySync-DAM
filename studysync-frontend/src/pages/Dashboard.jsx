import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, Flame, BookOpen, Clock, Plus, 
  Sparkles, Pause, Play, Save, Calendar, 
  Target, CheckCircle2, X, MessageSquare 
} from 'lucide-react';
import { asignaturaService } from '../services/asignaturaService';

const Dashboard = ({ user, onMateriaCreada, setAsignaturaActual }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAsignaturaFocus, setSelectedAsignaturaFocus] = useState('');
  const [nuevaAsig, setNuevaAsig] = useState({ nombre: '', profesor: '', descripcion: '', color: '#6366f1' });
  const [eventosCalendario, setEventosCalendario] = useState([]);
  
  const [datosGlobales, setDatosGlobales] = useState(null);
  const [asignaturas, setAsignaturas] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [seconds, setSeconds] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [idSesionActual, setIdSesionActual] = useState(null);

  const [dudaIA, setDudaIA] = useState('');
  const [respuestaIA, setRespuestaIA] = useState('');
  const [cargandoDuda, setCargandoDuda] = useState(false);

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
      setRespuestaIA("Lo siento, no he podido conectar con mi cerebro artificial.");
    } finally {
      setCargandoDuda(false);
    }
  };

  return (
    <div className="flex flex-col xl:flex-row min-h-screen bg-[#0A0A0A] text-white p-4 sm:p-8 lg:p-10 no-scrollbar overflow-x-hidden">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none !important; }
        .no-scrollbar { -ms-overflow-style: none !important; scrollbar-width: none !important; }
        * { -ms-overflow-style: none !important; scrollbar-width: none !important; }
        *::-webkit-scrollbar { display: none !important; }
        select { color: white !important; }
        select option { background-color: #111 !important; color: white !important; }
      `}</style>
      
      <div className="flex-1 w-full xl:pr-10 mb-10 xl:mb-0">
        {/* HEADER MEJORADO */}
        <header className="flex flex-wrap justify-between items-end gap-6 mb-12">
          <div className="relative min-w-[200px] flex-1">
            <span className="text-indigo-500 font-black text-[10px] uppercase tracking-[0.4em] mb-2 block">Panel de Control</span>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter italic uppercase leading-tight bg-gradient-to-b from-white to-white/20 bg-clip-text text-transparent break-words">
              Hola, <br />
              <span className="text-white">{user?.username}.</span>
            </h1>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(79,70,229,0.3)] transition-all group shrink-0 mb-2"
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform" /> 
            Nueva Materia
          </button>
        </header>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-10">
          <StatCard icon={<Flame className="text-orange-500" />} value={stats.racha} label="Días racha" />
          <StatCard icon={<BookOpen className="text-blue-500" />} value={stats.flashcards} label="Flashcards Totales" />
          <StatCard icon={<Clock className="text-emerald-500" />} value={`${stats.tiempo}h`} label="Tiempo Enfoque" className="sm:col-span-2 md:col-span-1" />
        </div>

        {/* TUTOR IA */}
        <section className="mb-10 bg-[#111] border border-white/5 rounded-[30px] sm:rounded-[40px] p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 hidden md:block"><MessageSquare size={100} className="text-indigo-500" /></div>
          <div className="flex items-center gap-2 mb-6 text-indigo-500 font-black text-[10px] uppercase tracking-[0.3em]">
            <Sparkles size={16} /> Tutor IA StudySync
          </div>
          <div className="relative z-10">
            <textarea 
              className="w-full bg-[#0A0A0A] border border-white/5 rounded-2xl py-4 px-6 text-xs text-white outline-none focus:border-indigo-500 mb-4 min-h-[120px] resize-none" 
              placeholder="¿Qué no entiendes hoy?..." 
              value={dudaIA}
              onChange={(e) => setDudaIA(e.target.value)}
            />
            {respuestaIA && (
              <div className="bg-[#0A0A0A] border border-indigo-500/20 rounded-2xl p-6 mb-4 text-xs leading-relaxed text-gray-300">
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

        {/* PRÓXIMOS EVENTOSS - CORREGIDO PARA NOMBRES LARGOS */}
        <section>
          <div className="flex items-center gap-2 mb-6 text-gray-500 font-black text-[10px] uppercase tracking-[0.3em]">
            <Calendar size={16} /> Próximos Eventos
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {proximosHitos.map((exam) => (
              <div key={exam.id} className="bg-[#111] border border-white/5 rounded-[24px] sm:rounded-[32px] p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group hover:border-indigo-500/30 transition-all">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-1.5 h-10 rounded-full shrink-0" style={{ backgroundColor: exam.materiaColor }} />
                  <div>
                    <h4 className="font-black italic uppercase text-xs sm:text-sm tracking-tighter leading-tight break-words">{exam.nombre}</h4>
                    <p className="text-[9px] sm:text-[10px] text-gray-500 font-bold uppercase mt-1">
                      {exam.materiaNombre} • {new Date(exam.fecha).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => irAMateria(exam.materiaId)} 
                  className="w-full sm:w-auto bg-white/5 hover:bg-indigo-600 hover:text-white text-indigo-400 px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-tighter transition-all shrink-0"
                >
                  Preparar
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ASIDE - MODO FOCUS */}
      <aside className="w-full xl:w-96 shrink-0">
        <div className="bg-[#111] border border-white/5 rounded-[30px] sm:rounded-[40px] p-8 text-center shadow-2xl relative overflow-hidden sticky top-6">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-indigo-600 rounded-b-full opacity-50" />
          <p className="text-[10px] text-indigo-500 font-black uppercase mb-6 tracking-[0.3em]">Modo Focus</p>
          <div className={`text-6xl sm:text-7xl font-black mb-8 tabular-nums tracking-tighter ${isActive ? 'text-indigo-500 animate-pulse' : 'text-white'}`}>
            {Math.floor(seconds/60).toString().padStart(2,'0')}:{(seconds%60).toString().padStart(2,'0')}
          </div>
          <select 
            value={selectedAsignaturaFocus} 
            onChange={(e) => setSelectedAsignaturaFocus(e.target.value)} 
            disabled={isActive} 
            className="w-full bg-[#0A0A0A] border border-white/5 rounded-xl py-3 px-4 text-[10px] font-black uppercase mb-6 outline-none text-center text-white cursor-pointer"
          >
            <option value="">Selecciona Materia</option>
            {asignaturas.map(asig => <option key={asig.id || asig.id_asignatura} value={asig.id || asig.id_asignatura}>{asig.nombre}</option>)}
          </select>
          <button 
            onClick={isActive ? handleFinalizarYGuardar : handleIniciarSesion} 
            className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${isActive ? 'bg-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'bg-indigo-600 shadow-[0_0_20px_rgba(79,70,229,0.2)] hover:scale-[1.02]'}`}
          >
            {isActive ? <Save size={14}/> : <Play size={14}/>} {isActive ? 'Finalizar' : 'Iniciar Sesión'}
          </button>
        </div>
      </aside>

      {/* MODAL NUEVA MATERIA */}
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
            className="relative bg-[#111] border border-white/10 p-6 sm:p-10 rounded-[30px] sm:rounded-[40px] w-full max-w-md text-white shadow-2xl"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tighter">Nueva Materia</h2>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white"><X size={24}/></button>
            </div>
            <div className="space-y-4 mb-8">
              <div>
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 ml-4 mb-1 block">Nombre</label>
                <input required className="w-full bg-[#0A0A0A] border border-white/5 rounded-2xl p-4 text-xs outline-none focus:border-indigo-500 text-white" placeholder="Ej: Programación" value={nuevaAsig.nombre} onChange={e => setNuevaAsig({...nuevaAsig, nombre: e.target.value})} />
              </div>
              <div>
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 ml-4 mb-1 block">Profesor</label>
                <input required className="w-full bg-[#0A0A0A] border border-white/5 rounded-2xl p-4 text-xs outline-none focus:border-indigo-500 text-white" placeholder="Nombre del docente" value={nuevaAsig.profesor} onChange={e => setNuevaAsig({...nuevaAsig, profesor: e.target.value})} />
              </div>
              <div>
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 ml-4 mb-1 block">Identificador Visual</label>
                <div className="flex items-center gap-4 bg-[#0A0A0A] border border-white/5 rounded-2xl p-3">
                  <input type="color" className="w-12 h-10 rounded-lg cursor-pointer bg-transparent border-none" value={nuevaAsig.color} onChange={e => setNuevaAsig({...nuevaAsig, color: e.target.value})} />
                  <span className="text-[10px] font-black uppercase text-gray-400">{nuevaAsig.color}</span>
                </div>
              </div>
            </div>
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg transition-all active:scale-95">Crear Materia</button>
          </form>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, value, label, className = "" }) => (
  <div className={`bg-[#111] border border-white/5 p-6 sm:p-8 rounded-[24px] sm:rounded-[32px] hover:border-indigo-500/20 transition-all group relative overflow-hidden ${className}`}>
    <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 bg-white/5 rounded-full -mr-8 -mt-8 group-hover:scale-110 transition-transform" />
    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center mb-4 relative z-10">{icon}</div>
    <div className="text-3xl sm:text-4xl font-black tracking-tighter italic relative z-10">{value}</div>
    <div className="text-[8px] sm:text-[9px] text-gray-600 font-black uppercase tracking-widest mt-1 relative z-10">{label}</div>
  </div>
);

export default Dashboard;