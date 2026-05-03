import React, { useState, useEffect } from 'react';
import { Search, Zap, Flame, BookOpen, Clock, ChevronRight, Sparkles, Plus, X } from 'lucide-react';
import { asignaturaService } from '../services/asignaturaService';
import { agendaService } from '../services/agendaService';

const Dashboard = ({ user }) => {
  const [asignaturas, setAsignaturas] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Estado para la nueva asignatura
  const [nuevaAsig, setNuevaAsig] = useState({
    nombre: '',
    profesor: '',
    descripcion: '',
    color: '#6366f1'
  });

  // Lógica del Cronómetro Pomodoro
  const [seconds, setSeconds] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((s) => s - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
      clearInterval(interval);
      alert("¡Tiempo de enfoque terminado!");
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const formatTime = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const cargarDatos = () => {
    if (user?.id) {
      asignaturaService.listarPorUsuario(user.id)
        .then(res => setAsignaturas(res.data))
        .catch(err => console.error("Error al cargar materias:", err));
      
      if (agendaService.listarPorUsuario) {
        agendaService.listarPorUsuario(user.id)
          .then(res => setEventos(res.data))
          .catch(err => console.error("Error al cargar agenda:", err));
      }
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [user]);

  // FUNCIÓN CORREGIDA CON DEPURACIÓN
  const handleCrearAsignatura = async (e) => {
    e.preventDefault();
    console.log("1. Botón clickeado. Usuario actual:", user);

    if (!user || !user.id) {
      console.error("ERROR: No hay ID de usuario disponible");
      alert("Error crítico: No se reconoce al usuario logueado. Intenta cerrar sesión y volver a entrar.");
      return;
    }

    try {
      const dataAEnviar = {
        nombre: nuevaAsig.nombre,
        profesor: nuevaAsig.profesor,
        descripcion: nuevaAsig.descripcion,
        color: nuevaAsig.color,
        usuario: { id: user.id }
      };
      
      console.log("2. Enviando datos al Back:", dataAEnviar);

      const res = await asignaturaService.crear(dataAEnviar);
      
      console.log("3. Respuesta recibida con éxito:", res.data);
      
      // Si llegamos aquí, la petición fue exitosa
      setIsModalOpen(false);
      setNuevaAsig({ nombre: '', profesor: '', descripcion: '', color: '#6366f1' });
      
      alert("¡Asignatura '" + nuevaAsig.nombre + "' creada correctamente!");
      
      // Recargamos para que aparezca en el sidebar
      window.location.reload(); 

    } catch (err) {
      console.error("ERROR EN LA PETICIÓN:", err);
      console.log("Detalles del error:", err.response?.data);
      alert("Error al guardar en la base de datos. Revisa la consola (F12) para más detalles.");
    }
  };

  const nombreAMostrar = user?.nombre || user?.username || "Estudiante";

  return (
    <div className="flex h-full bg-[#0A0A0A] text-white overflow-hidden relative">
      
      {/* MODAL PARA AÑADIR ASIGNATURA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <form 
            onSubmit={handleCrearAsignatura}
            className="relative bg-[#111] border border-white/10 p-8 rounded-[40px] w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold tracking-tight">Nueva Materia</h2>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase text-gray-500 ml-2 mb-2 block">Nombre de la Asignatura</label>
                <input 
                  required
                  className="w-full bg-[#0A0A0A] border border-white/5 rounded-2xl p-4 text-sm focus:border-indigo-500 outline-none transition-all text-white"
                  placeholder="Ej: Programación Web"
                  value={nuevaAsig.nombre}
                  onChange={(e) => setNuevaAsig({...nuevaAsig, nombre: e.target.value})}
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-gray-500 ml-2 mb-2 block">Profesor / Catedrático</label>
                <input 
                  className="w-full bg-[#0A0A0A] border border-white/5 rounded-2xl p-4 text-sm focus:border-indigo-500 outline-none transition-all text-white"
                  placeholder="Nombre del docente"
                  value={nuevaAsig.profesor}
                  onChange={(e) => setNuevaAsig({...nuevaAsig, profesor: e.target.value})}
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-gray-500 ml-2 mb-2 block">Descripción breve</label>
                <textarea 
                  className="w-full bg-[#0A0A0A] border border-white/5 rounded-2xl p-4 text-sm focus:border-indigo-500 outline-none transition-all h-24 resize-none text-white"
                  placeholder="¿De qué trata esta materia?"
                  value={nuevaAsig.descripcion}
                  onChange={(e) => setNuevaAsig({...nuevaAsig, descripcion: e.target.value})}
                />
              </div>

              <div className="flex items-center gap-4 p-2">
                <label className="text-[10px] font-black uppercase text-gray-500">Color distintivo:</label>
                <input 
                  type="color" 
                  className="bg-transparent border-none w-10 h-10 cursor-pointer"
                  value={nuevaAsig.color}
                  onChange={(e) => setNuevaAsig({...nuevaAsig, color: e.target.value})}
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl mt-8 transition-all shadow-lg shadow-indigo-600/20"
            >
              Crear Asignatura
            </button>
          </form>
        </div>
      )}

      <div className="flex-1 p-10 overflow-y-auto custom-scrollbar">
        <header className="flex justify-between items-start mb-10">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              Hola, {nombreAMostrar}.
            </h1>
            <div className="flex items-center gap-4 mt-4">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-indigo-600 hover:text-white transition-all"
              >
                <Plus size={16} /> Añadir Materia
              </button>
              <p className="text-gray-500 text-xs font-medium">
                {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-gray-600" size={18} />
            <input 
              type="text" 
              placeholder="Filtrar tus flashcards..." 
              className="bg-[#111111] border border-white/5 rounded-2xl py-3 pl-12 pr-6 text-sm w-80 focus:border-indigo-500/50 outline-none transition-all"
            />
          </div>
        </header>

        <div className="grid grid-cols-4 gap-6 mb-10">
          <StatCard icon={<Sparkles className="text-emerald-500" size={20}/>} value="75%" label="Semillas" />
          <StatCard icon={<Flame className="text-orange-500" size={20}/>} value="28" label="Días racha" />
          <StatCard icon={<BookOpen className="text-indigo-500" size={20}/>} value="142" label="Flashcards" />
          <StatCard icon={<Clock className="text-gray-500" size={20}/>} value="18.5h" label="Tiempo" />
        </div>

        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-[32px] p-8 mb-10 flex justify-between items-center shadow-xl shadow-red-900/20">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70 mb-1">Próximo Examen</p>
            <h3 className="text-2xl font-bold text-white">Cálculo III - Parcial 2</h3>
          </div>
          <button className="bg-white text-red-600 px-8 py-3 rounded-2xl font-bold text-sm hover:scale-105 transition-transform">
            Preparar Ahora
          </button>
        </div>

        <section className="bg-[#111111] border border-white/5 rounded-[32px] p-10 mb-10">
          <div className="flex items-center gap-3 mb-8">
            <Sparkles className="text-yellow-500 fill-yellow-500" size={20} />
            <h3 className="text-lg font-bold">Generador de Flashcards IA</h3>
          </div>
          <div className="border-2 border-dashed border-white/5 rounded-3xl h-40 flex items-center justify-center text-gray-500 hover:border-indigo-500/20 hover:bg-white/[0.01] transition-all cursor-pointer group">
            <p className="font-medium group-hover:text-gray-300 transition-colors">Haz clic para subir tus apuntes (PDF, DOCX o Texto)</p>
          </div>
        </section>
      </div>

      <aside className="w-80 bg-[#0D0D0D] border-l border-white/5 p-10">
        <div className="bg-[#111111] border border-white/5 rounded-[40px] p-8 text-center mb-10 shadow-2xl">
          <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-4">Modo Focus</p>
          <div className={`text-5xl font-black mb-8 tabular-nums tracking-tighter transition-colors ${isActive ? 'text-indigo-500' : 'text-white'}`}>
            {formatTime(seconds)}
          </div>
          <button 
            onClick={() => setIsActive(!isActive)}
            className={`w-full py-4 rounded-2xl font-bold text-sm transition-all active:scale-95 shadow-lg ${
              isActive 
              ? 'bg-white text-black' 
              : 'bg-indigo-600 text-white shadow-indigo-600/20'
            }`}
          >
            {isActive ? 'Pausar' : 'Iniciar'}
          </button>
        </div>

        <h4 className="font-bold mb-6 text-gray-400 px-2 text-sm tracking-tight">Agenda de Hoy</h4>
        <div className="space-y-4">
          <AgendaItem title="Cálculo Integral" time="3:00 PM" color="bg-blue-500" />
          <AgendaItem title="Laboratorio Física" time="5:00 PM" color="bg-emerald-500" />
        </div>
      </aside>
    </div>
  );
};

const StatCard = ({ icon, value, label }) => (
  <div className="bg-[#111111] border border-white/5 p-6 rounded-[32px] hover:bg-white/[0.01] transition-colors">
    <div className="mb-4">{icon}</div>
    <div className="text-2xl font-black">{value}</div>
    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">{label}</div>
  </div>
);

const AgendaItem = ({ title, time, color }) => (
  <div className="bg-[#111111] border border-white/5 p-5 rounded-2xl flex items-center justify-between hover:border-white/10 transition-colors cursor-default">
    <div className="flex items-center gap-4">
      <div className={`w-1.5 h-6 rounded-full ${color}`} />
      <span className="text-sm font-bold text-gray-200">{title}</span>
    </div>
    <span className="text-[10px] font-bold text-gray-600">{time}</span>
  </div>
);

export default Dashboard;