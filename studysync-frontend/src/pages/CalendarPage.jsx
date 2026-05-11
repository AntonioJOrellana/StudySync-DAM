import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Plus, ChevronLeft, ChevronRight, X, ChevronDown } from 'lucide-react';
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

  const cargarDatos = useCallback(async () => {
    const userId = user?.id?.toString().split(':')[0];
    if (!userId) return;

    try {
      const resAsig = await asignaturaService.listarPorUsuario(userId);
      setAsignaturas(resAsig.data || []);

      const resEventos = await axios.get(`http://localhost:8080/api/agenda/usuario/${userId}`);
      setEventos(resEventos.data || []);
    } catch (error) {
      console.error("Error en la carga:", error);
    }
  }, [user]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  // --- LÓGICA DE FILTRADO PARA "PRÓXIMOS" ---
  const obtenerEventosProximos = () => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    // Calculamos el domingo de la semana que viene
    // diaSemana: 0 (dom), 1 (lun)... 6 (sab)
    const diaSemanaActual = hoy.getDay();
    const diasHastaDomingoProximo = (7 - diaSemanaActual) + 7; 
    
    const finProximaSemana = new Date(hoy);
    finProximaSemana.setDate(hoy.getDate() + diasHastaDomingoProximo);
    finProximaSemana.setHours(23, 59, 59, 999);

    return eventos.filter(ev => {
      const fechaEv = new Date(ev.fechaEvento);
      return fechaEv >= hoy && fechaEv <= finProximaSemana;
    }).sort((a, b) => new Date(a.fechaEvento) - new Date(b.fechaEvento));
  };

  const año = fechaActual.getFullYear();
  const mes = fechaActual.getMonth();
  const diasEnMes = new Date(año, mes + 1, 0).getDate();
  const primerDia = new Date(año, mes, 1).getDay();

  const generarDias = () => {
    const celdas = [];
    for (let i = 0; i < primerDia; i++) celdas.push(<div key={`empty-${i}`} className="h-32 border border-white/5" />);
    for (let d = 1; d <= diasEnMes; d++) {
      const fStr = `${año}-${String(mes + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const evs = eventos.filter(e => e.fechaEvento?.startsWith(fStr));
      const esHoy = new Date().toDateString() === new Date(año, mes, d).toDateString();
      celdas.push(
        <div key={d} onClick={() => { setDiaSeleccionado({ fecha: fStr, dia: d, eventos: evs }); setShowModalDia(true); }}
          className={`h-32 border border-white/5 p-3 cursor-pointer hover:bg-white/5 transition-all ${esHoy ? 'bg-indigo-600/10' : 'bg-[#111111]'}`}>
          <span className={`text-sm font-bold ${esHoy ? 'text-indigo-400' : 'text-gray-600'}`}>{d}</span>
          <div className="flex flex-col gap-1 mt-2">
            {evs.map((ev, i) => (
              <div key={i} className="h-1.5 w-full rounded-full" style={{ backgroundColor: ev.asignatura?.color || '#6366F1' }} />
            ))}
          </div>
        </div>
      );
    }
    return celdas;
  };

  return (
    <div className="h-full bg-[#0A0A0A] text-white p-10 overflow-y-auto font-sans">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold capitalize">
          {fechaActual.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}
        </h1>
        <div className="flex gap-4">
          <div className="flex bg-[#111111] rounded-2xl border border-white/5 p-1">
            <button onClick={() => setFechaActual(new Date(año, mes - 1))} className="p-2 hover:text-indigo-400 transition-colors"><ChevronLeft/></button>
            <button onClick={() => setFechaActual(new Date(año, mes + 1))} className="p-2 hover:text-indigo-400 transition-colors"><ChevronRight/></button>
          </div>
          <button onClick={() => setShowModalCrear(true)} className="bg-indigo-600 px-6 py-3 rounded-2xl font-bold flex items-center gap-2">
            <Plus size={18} /> Nuevo Evento
          </button>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-9 bg-[#111111] border border-white/5 rounded-[40px] p-8">
          <div className="grid grid-cols-7 mb-4 text-center text-[10px] font-black text-gray-600 uppercase">
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => <div key={d}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
            {generarDias()}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-3 bg-[#111111] border border-white/5 rounded-[32px] p-8">
          <h3 className="text-lg font-bold mb-2">Próximos</h3>
          <p className="text-[10px] text-gray-500 font-bold uppercase mb-8 tracking-widest">Esta semana y la siguiente</p>
          <div className="space-y-6">
            {obtenerEventosProximos().length > 0 ? (
              obtenerEventosProximos().map((ev, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-1 rounded-full h-10 mt-1" style={{ backgroundColor: ev.asignatura?.color || '#6366F1' }}></div>
                  <div>
                    <h4 className="text-sm font-bold leading-tight">{ev.titulo}</h4>
                    <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">
                      {new Date(ev.fechaEvento).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-xs italic">No hay eventos a corto plazo.</p>
            )}
          </div>
        </div>
      </div>

      {/* ... (Resto de los modales se mantienen igual que el código anterior) ... */}
      {showModalCrear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#0D0D0D] border border-white/10 w-full max-w-md rounded-[40px] p-10 relative">
            <button onClick={() => setShowModalCrear(false)} className="absolute top-8 right-8 text-gray-500 hover:text-white"><X /></button>
            <h2 className="text-2xl font-bold mb-8">Nuevo Evento</h2>
            <form className="space-y-6" onSubmit={async (e) => {
              e.preventDefault();
              const userId = user?.id?.toString().split(':')[0];
              if (!userId) return;
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
              } catch (err) {
                alert("Error al guardar");
              }
            }}>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-600">Título</label>
                <input name="titulo" required className="w-full bg-[#111111] border border-white/5 rounded-2xl p-4 text-white outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-600">Fecha</label>
                <input name="fecha" type="date" required className="w-full bg-[#111111] border border-white/5 rounded-2xl p-4 text-white [color-scheme:dark]" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-600">Materia</label>
                <select name="asig" required className="w-full bg-[#111111] border border-white/5 rounded-2xl p-4 text-white outline-none">
                  <option value="">Selecciona materia...</option>
                  {asignaturas.map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}
                </select>
              </div>
              <button type="submit" className="w-full bg-indigo-600 py-4 rounded-2xl font-bold mt-4">Confirmar</button>
            </form>
          </div>
        </div>
      )}

      {showModalDia && diaSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#0D0D0D] border border-white/10 w-full max-w-md rounded-[40px] p-10 relative">
            <button onClick={() => setShowModalDia(false)} className="absolute top-8 right-8 text-gray-500 hover:text-white"><X /></button>
            <h2 className="text-2xl font-bold mb-6 text-indigo-400">Día {diaSeleccionado.dia}</h2>
            <div className="space-y-4 max-h-[350px] overflow-y-auto">
              {diaSeleccionado.eventos.map((ev, i) => (
                <div key={i} className="bg-[#111111] p-5 rounded-3xl border border-white/5 flex gap-5 items-center">
                  <div className="w-1.5 h-10 rounded-full" style={{ backgroundColor: ev.asignatura?.color }}></div>
                  <div>
                    <p className="font-bold text-lg">{ev.titulo}</p>
                    <p className="text-xs text-gray-500 uppercase font-bold">{ev.asignatura?.nombre}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;