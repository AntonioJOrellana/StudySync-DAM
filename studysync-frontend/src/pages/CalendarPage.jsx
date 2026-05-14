import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Plus, ChevronLeft, ChevronRight, X, Calendar as CalendarIcon, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { asignaturaService } from '../services/asignaturaService';

const CalendarPage = () => {
  const { user } = useAuth();
  const [eventos, setEventos] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [fechaActual, setFechaActual] = useState(new Date());
  const [showModalCrear, setShowModalCrear] = useState(false);
  const [showModalDia, setShowModalDia] = useState(false);
  const [diaSeleccionado, setDiaSeleccionado] = useState(null);
  const [loading, setLoading] = useState(true);

  const cargarDatos = useCallback(async () => {
    const userId = user?.id?.toString().split(':')[0];
    if (!userId) return;

    try {
      setLoading(true);
      const [resAsig, resEventos] = await Promise.all([
        asignaturaService.listarPorUsuario(userId),
        axios.get(`http://localhost:8080/api/agenda/usuario/${userId}`)
      ]);

      const listaEventos = resEventos.data || [];
      setAsignaturas(resAsig.data || []);
      setEventos(listaEventos);
      
      // Sincronizar modal de día si está abierto
      if (showModalDia && diaSeleccionado) {
        const evsActualizados = listaEventos.filter(e => e.fechaEvento?.startsWith(diaSeleccionado.fecha));
        setDiaSeleccionado(prev => ({ ...prev, eventos: evsActualizados }));
      }
    } catch (error) {
      console.error("Error en la carga:", error);
      // Si el servidor lanza 404/500 por estar vacío, reseteamos eventos sin romper el flujo
      setEventos([]);
    } finally {
      setLoading(false);
    }
  }, [user, showModalDia, diaSeleccionado?.fecha]);

  useEffect(() => { cargarDatos(); }, [cargarDatos]);

  const borrarEvento = async (idEvento) => {
    if (!idEvento) return;
    if (!window.confirm("¿Eliminar este evento de la agenda?")) return;
    
    try {
      await axios.delete(`http://localhost:8080/api/agenda/${idEvento}`);
      
      // Si era el último evento del día, cerramos el modal de detalle
      if (diaSeleccionado?.eventos.length <= 1) {
        setShowModalDia(false);
      }
      
      await cargarDatos();
    } catch (err) {
      console.error("Error al borrar:", err);
      alert("No se pudo eliminar el evento. Verifica la conexión con el servidor.");
    }
  };

  const obtenerEventosProximos = () => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const finPeriodo = new Date(hoy);
    finPeriodo.setDate(hoy.getDate() + 14);

    return eventos.filter(ev => {
      const fechaEv = new Date(ev.fechaEvento);
      return fechaEv >= hoy && fechaEv <= finPeriodo;
    }).sort((a, b) => new Date(a.fechaEvento) - new Date(b.fechaEvento));
  };

  const año = fechaActual.getFullYear();
  const mes = fechaActual.getMonth();
  const diasEnMes = new Date(año, mes + 1, 0).getDate();
  const primerDia = new Date(año, mes, 1).getDay();

  const generarDias = () => {
    const celdas = [];
    for (let i = 0; i < primerDia; i++) {
      celdas.push(<div key={`empty-${i}`} className="h-24 sm:h-32 border border-white/5 bg-white/[0.01]" />);
    }
    for (let d = 1; d <= diasEnMes; d++) {
      const fStr = `${año}-${String(mes + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const evs = eventos.filter(e => e.fechaEvento?.startsWith(fStr));
      const esHoy = new Date().toDateString() === new Date(año, mes, d).toDateString();
      
      celdas.push(
        <div key={d} onClick={() => { setDiaSeleccionado({ fecha: fStr, dia: d, eventos: evs }); setShowModalDia(true); }}
          className={`h-24 sm:h-32 border border-white/5 p-2 sm:p-3 cursor-pointer hover:bg-white/5 transition-all relative ${esHoy ? 'bg-indigo-600/5' : 'bg-[#111111]'}`}>
          <span className={`text-xs sm:text-sm font-black ${esHoy ? 'text-indigo-400' : 'text-gray-600'}`}>{d}</span>
          <div className="flex flex-wrap gap-1 mt-1 sm:mt-2">
            {evs.slice(0, 4).map((ev, i) => (
              <div key={i} className="h-1 sm:h-1.5 w-1 sm:w-full rounded-full" style={{ backgroundColor: ev.asignatura?.color || '#6366F1' }} />
            ))}
            {evs.length > 4 && <div className="text-[8px] text-gray-500 font-bold">+{evs.length - 4}</div>}
          </div>
        </div>
      );
    }
    return celdas;
  };

  return (
    <div className="h-full bg-[#0A0A0A] text-white p-6 sm:p-10 overflow-y-auto no-scrollbar animate-in fade-in duration-500">
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none !important; }
        .no-scrollbar { -ms-overflow-style: none !important; scrollbar-width: none !important; }
        * { -ms-overflow-style: none !important; scrollbar-width: none !important; }
        *::-webkit-scrollbar { display: none !important; }
      `}</style>

      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl sm:text-5xl font-black italic tracking-tighter uppercase leading-none">
            {fechaActual.toLocaleString('es-ES', { month: 'long' })}
            <span className="text-indigo-600 ml-2">{año}</span>
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-2 font-medium tracking-wide uppercase">GESTIÓN DE AGENDA</p>
        </div>
        
        <div className="flex w-full md:w-auto gap-3">
          <div className="flex bg-[#111111] rounded-2xl border border-white/5 p-1">
            <button onClick={() => setFechaActual(new Date(año, mes - 1))} className="p-2 hover:text-indigo-400 transition-colors"><ChevronLeft size={20}/></button>
            <button onClick={() => setFechaActual(new Date(año, mes + 1))} className="p-2 hover:text-indigo-400 transition-colors"><ChevronRight size={20}/></button>
          </div>
          <button onClick={() => setShowModalCrear(true)} className="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-indigo-600/20">
            <Plus size={16} /> Nuevo
          </button>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-6 sm:gap-8">
        <div className="col-span-12 lg:col-span-9">
          <div className="bg-[#111111] border border-white/5 rounded-[32px] sm:rounded-[40px] p-4 sm:p-8 overflow-hidden shadow-2xl">
            <div className="grid grid-cols-7 mb-6 text-center text-[10px] font-black text-gray-700 uppercase tracking-[0.2em]">
              {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => <div key={d}>{d}</div>)}
            </div>
            <div className="grid grid-cols-7 border border-white/5 rounded-2xl overflow-hidden">
              {generarDias()}
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-3 space-y-6">
          <div className="bg-[#111111] border border-white/5 rounded-[32px] p-8">
            <div className="flex items-center gap-2 mb-6">
              <CalendarIcon size={18} className="text-indigo-500" />
              <h3 className="text-sm font-black uppercase tracking-widest">Próximos</h3>
            </div>
            <div className="space-y-5">
              {obtenerEventosProximos().length > 0 ? (
                obtenerEventosProximos().map((ev) => (
                  <div key={ev.id} className="group relative pl-4 border-l-2 hover:border-white transition-all py-1 flex justify-between items-start" style={{ borderLeftColor: ev.asignatura?.color || '#6366F1' }}>
                    <div>
                      <h4 className="text-xs font-black uppercase italic leading-tight group-hover:text-indigo-400 transition-colors">{ev.titulo}</h4>
                      <p className="text-[10px] text-gray-600 font-bold uppercase mt-1">
                        {new Date(ev.fechaEvento).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                      </p>
                    </div>
                    <button onClick={() => borrarEvento(ev.id)} className="opacity-0 group-hover:opacity-100 text-gray-700 hover:text-red-500 transition-all p-1">
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-700 text-[10px] font-bold uppercase tracking-tighter italic">Sin eventos cercanos</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {showModalCrear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-300">
          <div className="bg-[#0D0D0D] border border-white/10 w-full max-w-md rounded-[40px] p-8 sm:p-10 relative shadow-2xl">
            <button onClick={() => setShowModalCrear(false)} className="absolute top-8 right-8 text-gray-600 hover:text-white transition-colors"><X size={20}/></button>
            <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-8">Nuevo Evento</h2>
            <form className="space-y-6" onSubmit={async (e) => {
              e.preventDefault();
              const userId = user?.id?.toString().split(':')[0];
              try {
                const fechaISO = `${e.target.fecha.value}T10:00:00`;
                await axios.post('http://localhost:8080/api/agenda/crear', {
                  titulo: e.target.titulo.value,
                  fechaEvento: fechaISO,
                  prioridad: "media",
                  usuario: { id: parseInt(userId) },
                  asignatura: { id: parseInt(e.target.asig.value) }
                });
                setShowModalCrear(false);
                cargarDatos();
              } catch (err) { alert("Error al guardar"); }
            }}>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-600 tracking-widest ml-1">¿Qué hay que hacer?</label>
                <input name="titulo" required placeholder="Ej: Examen Parcial" className="w-full bg-[#111111] border border-white/5 rounded-2xl p-4 text-sm text-white outline-none focus:border-indigo-500/50 transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-600 tracking-widest ml-1">Fecha</label>
                  <input name="fecha" type="date" required className="w-full bg-[#111111] border border-white/5 rounded-2xl p-4 text-xs text-white [color-scheme:dark] outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-600 tracking-widest ml-1">Materia</label>
                  <select name="asig" required className="w-full bg-[#111111] border border-white/5 rounded-2xl p-4 text-xs text-white outline-none appearance-none">
                    <option value="">Elegir...</option>
                    {asignaturas.map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 py-4 rounded-2xl font-black uppercase tracking-widest text-xs mt-4 transition-all active:scale-95 shadow-lg shadow-indigo-600/20">
                Añadir a la Agenda
              </button>
            </form>
          </div>
        </div>
      )}

      {showModalDia && diaSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-300">
          <div className="bg-[#0D0D0D] border border-white/10 w-full max-w-md rounded-[40px] p-8 sm:p-10 relative">
            <button onClick={() => setShowModalDia(false)} className="absolute top-8 right-8 text-gray-600 hover:text-white transition-colors"><X size={20}/></button>
            <div className="mb-8">
              <span className="text-indigo-500 text-[10px] font-black uppercase tracking-[0.3em]">Agenda del día</span>
              <h2 className="text-4xl font-black italic uppercase tracking-tighter mt-1">{diaSeleccionado.dia}</h2>
            </div>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
              {diaSeleccionado.eventos.length > 0 ? (
                diaSeleccionado.eventos.map((ev) => (
                  <div key={ev.id} className="bg-[#111111] p-5 rounded-3xl border border-white/5 flex gap-5 items-center group hover:border-indigo-500/30 transition-all justify-between">
                    <div className="flex gap-5 items-center">
                        <div className="w-1.5 h-10 rounded-full shrink-0" style={{ backgroundColor: ev.asignatura?.color }}></div>
                        <div>
                        <p className="font-black uppercase italic text-sm group-hover:text-indigo-400 transition-colors leading-tight">{ev.titulo}</p>
                        <p className="text-[10px] text-gray-600 uppercase font-black mt-1 tracking-widest">{ev.asignatura?.nombre}</p>
                        </div>
                    </div>
                    <button onClick={() => borrarEvento(ev.id)} className="text-gray-700 hover:text-red-500 transition-colors p-2">
                        <Trash2 size={16} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-700 text-xs font-bold uppercase italic">Día libre de tareas</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;