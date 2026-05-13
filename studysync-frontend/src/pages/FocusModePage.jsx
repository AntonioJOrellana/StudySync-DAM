import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Play, Square, Lightbulb, ChevronDown } from 'lucide-react';

const FocusModePage = () => {
  // --- ESTADOS ---
  const [segundos, setSegundos] = useState(25 * 60);
  const [activo, setActivo] = useState(false);
  const [idSesionActual, setIdSesionActual] = useState(null);
  const [asignaturas, setAsignaturas] = useState([]);
  const [asigSeleccionada, setAsigSeleccionada] = useState(null);
  const [sesionesHoy, setSesionesHoy] = useState([]);
  
  // CORRECCIÓN: Usamos la clave 'user' que es la que guarda tu AuthService
  // y eliminamos los datos de "antonio123" para que no se mezclen.
  const usuario = JSON.parse(localStorage.getItem('user'));

  // --- CARGA DE DATOS ---
  const fetchDatos = useCallback(async () => {
    // Si no hay usuario logueado, no intentamos peticiones
    if (!usuario?.id) return;

    try {
      // Cargamos asignaturas del usuario actual
      const resAsig = await axios.get(`http://localhost:8080/api/asignaturas/usuario/${usuario.id}`);
      setAsignaturas(resAsig.data);
      
      if (resAsig.data.length > 0 && !asigSeleccionada) {
        setAsigSeleccionada(resAsig.data[0]);
      }

      // Cargamos sesiones del usuario actual
      const resSesiones = await axios.get(`http://localhost:8080/api/sesiones/usuario/${usuario.id}`);
      setSesionesHoy(resSesiones.data);
    } catch (err) {
      console.error("Error cargando datos:", err);
    }
  }, [usuario?.id, asigSeleccionada]);

  useEffect(() => { 
    fetchDatos(); 
  }, [fetchDatos]);

  // --- LÓGICA DEL CRONÓMETRO ---
  useEffect(() => {
    let intervalo = null;
    if (activo && segundos > 0) {
      intervalo = setInterval(() => setSegundos(s => s - 1), 1000);
    } else if (segundos === 0 && activo) {
      finalizarSesion();
    }
    return () => clearInterval(intervalo);
  }, [activo, segundos]);

  // --- ACCIONES API ---
  const iniciarSesion = async () => {
    if (!asigSeleccionada) return alert("Selecciona una asignatura");
    if (!usuario?.id) return alert("Error de sesión: Usuario no identificado");
    
    try {
      const ahora = new Date();
      const offset = ahora.getTimezoneOffset() * 60000; 
      const horaLocal = new Date(ahora.getTime() - offset);
      
      const payload = {
        usuario: { id: usuario.id },
        asignatura: { id: asigSeleccionada.id },
        tipo: 'estudio',
        fechaInicio: horaLocal.toISOString().split('.')[0] 
      };

      const res = await axios.post('http://localhost:8080/api/sesiones/iniciar', payload);
      const idGenerado = res.data.id || res.data.id_sesion;

      if (idGenerado) {
        setIdSesionActual(idGenerado);
        setActivo(true);
      }
    } catch (err) { 
      console.error("Error al iniciar:", err);
    }
  };

  const finalizarSesion = async () => {
    if (!idSesionActual) {
      setActivo(false);
      setSegundos(25 * 60);
      return;
    }

    const duracionReal = Math.max(1, Math.floor((25 * 60 - segundos) / 60));

    try {
      await axios.put(`http://localhost:8080/api/sesiones/finalizar/${idSesionActual}?duracion=${duracionReal}`);
      setActivo(false);
      setSegundos(25 * 60);
      setIdSesionActual(null);
      fetchDatos(); 
    } catch (err) { 
      console.error("Error al finalizar:", err);
      setActivo(false);
      setSegundos(25 * 60);
    }
  };

  const format = (s) => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;

  return (
    <div className="h-full bg-[#0A0A0A] text-white p-6 sm:p-10 overflow-y-auto no-scrollbar animate-in fade-in duration-500">
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none !important; }
        .no-scrollbar { -ms-overflow-style: none !important; scrollbar-width: none !important; }
        * { -ms-overflow-style: none !important; scrollbar-width: none !important; }
        *::-webkit-scrollbar { display: none !important; }
      `}</style>

      <header className="mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-5xl font-black italic tracking-tighter uppercase leading-none">Modo Focus</h1>
        <p className="text-gray-500 text-xs sm:text-sm mt-3 font-medium tracking-wide uppercase">CONCENTRACIÓN PROFUNDA</p>
      </header>

      <div className="grid grid-cols-12 gap-6 sm:gap-8">
        
        <div className="col-span-12 lg:col-span-8 space-y-6 sm:space-y-8">
          <div className="bg-[#111111] border border-white/5 rounded-[32px] sm:rounded-[40px] p-6 sm:p-12 flex flex-col items-center relative overflow-hidden">
            <div className={`absolute top-6 sm:top-8 px-4 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${activo ? 'bg-indigo-500 text-white animate-pulse' : 'bg-white/5 text-gray-500'}`}>
              {activo ? 'Sesión Activa' : 'En Espera'}
            </div>

            <div className="mt-10 sm:mt-8 relative w-full max-w-xs group">
              <select 
                className="w-full appearance-none bg-[#1A1A1A] text-gray-300 text-xs font-bold uppercase tracking-widest border border-white/10 rounded-full px-6 py-3 pr-12 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer transition-all"
                value={asigSeleccionada?.id || ""}
                onChange={(e) => setAsigSeleccionada(asignaturas.find(a => a.id === Number(e.target.value)))}
                disabled={activo}
              >
                {asignaturas.length === 0 && <option value="">Sin asignaturas</option>}
                {asignaturas.map(a => (
                  <option key={a.id} value={a.id} className="bg-[#111111]">{a.nombre}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>

            <div className="relative flex items-center justify-center my-8 sm:my-12 w-full max-w-[280px] sm:max-w-[320px]">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 320 320">
                <circle cx="160" cy="160" r="150" stroke="#1A1A1A" strokeWidth="6" fill="transparent" />
                <circle 
                  cx="160" cy="160" r="150" stroke="#6366F1" strokeWidth="8" fill="transparent" 
                  strokeDasharray={942} 
                  strokeDashoffset={942 - (942 * segundos) / (25 * 60)}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-linear"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <h2 className="text-[60px] sm:text-[90px] font-black tracking-tighter tabular-nums leading-none italic">{format(segundos)}</h2>
                <span className="text-gray-600 text-[9px] sm:text-[10px] font-black mt-2 uppercase tracking-[0.3em]">Minutos</span>
              </div>
            </div>

            <div className="flex items-center gap-4 sm:gap-6">
              <button onClick={finalizarSesion} className="w-12 h-12 sm:w-14 sm:h-14 bg-[#1A1A1A] rounded-full flex items-center justify-center hover:bg-red-500/10 hover:text-red-500 transition-all active:scale-90">
                <Square size={18} fill="currentColor" />
              </button>
              
              <button 
                onClick={activo ? () => setActivo(false) : iniciarSesion} 
                className="w-16 h-16 sm:w-20 sm:h-20 bg-indigo-600 rounded-full flex items-center justify-center hover:scale-105 transition-all shadow-xl shadow-indigo-600/30 active:scale-95"
              >
                {activo ? <div className="flex gap-1.5"><div className="w-1.5 h-6 bg-white rounded-full"/><div className="w-1.5 h-6 bg-white rounded-full"/></div> : <Play size={28} fill="white" className="ml-1" />}
              </button>
            </div>
          </div>

          <div className="bg-[#111111] border border-white/5 rounded-[32px] p-6 sm:p-8">
            <h3 className="text-lg font-black uppercase italic tracking-tighter mb-6">Sesiones de Hoy</h3>
            <div className="space-y-3">
              {sesionesHoy.length === 0 && <p className="text-gray-700 italic text-xs text-center py-8">No hay actividad registrada hoy.</p>}
              {[...sesionesHoy].reverse().slice(0, 5).map((s) => (
                <div key={s.id || s.id_sesion} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{backgroundColor: s.asignatura?.color || '#6366F1'}}></div>
                    <div>
                      <span className="text-white text-sm font-black uppercase italic block leading-none mb-1">{s.asignatura?.nombre || "General"}</span>
                      <span className="text-gray-600 text-[9px] font-bold tracking-widest uppercase">{s.tipo || 'estudio'}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-white font-black text-sm block">{s.duracion || s.duracion_minutos || 0}m</span>
                    <span className="text-gray-700 font-mono text-[10px]">
                      {s.fechaInicio ? new Date(s.fechaInicio).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-6 sm:space-y-8">
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[32px] p-8 shadow-2xl shadow-indigo-600/20">
            <h3 className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em] mb-6">Resumen Diario</h3>
            <div className="space-y-8">
              <div>
                <span className="text-4xl font-black italic text-white block leading-none mb-2">{sesionesHoy.length}</span>
                <span className="text-white/40 text-[9px] font-black uppercase tracking-widest">Sesiones completadas</span>
              </div>
              <div className="pt-6 border-t border-white/10">
                <span className="text-3xl font-black italic text-white block leading-none mb-2">
                  {Math.floor(sesionesHoy.reduce((acc, s) => acc + (s.duracion || s.duracion_minutos || 0), 0) / 60)}h{' '}
                  {sesionesHoy.reduce((acc, s) => acc + (s.duracion || s.duracion_minutos || 0), 0) % 60}m
                </span>
                <span className="text-white/40 text-[9px] font-black uppercase tracking-widest">Tiempo total focus</span>
              </div>
            </div>
          </div>
          <div className="bg-[#111111] border border-white/5 rounded-[32px] p-8 relative overflow-hidden group">
            <div className="flex items-center gap-2 text-indigo-500 mb-4">
              <Lightbulb size={18} />
              <h3 className="font-black text-white uppercase text-[10px] tracking-widest">Consejo</h3>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed italic relative z-10">
              "La constancia vence a la inteligencia. El éxito es la suma de pequeños esfuerzos diarios."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusModePage;