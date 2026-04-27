import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Play, Square, Settings, Lightbulb, ChevronDown } from 'lucide-react';

const FocusModePage = () => {
  // --- ESTADOS ---
  const [segundos, setSegundos] = useState(25 * 60);
  const [activo, setActivo] = useState(false);
  const [idSesionActual, setIdSesionActual] = useState(null);
  
  const [asignaturas, setAsignaturas] = useState([]);
  const [asigSeleccionada, setAsigSeleccionada] = useState(null);
  const [sesionesHoy, setSesionesHoy] = useState([]);
  
  // Recuperamos usuario (ID 3 según tus datos)
  const usuario = JSON.parse(localStorage.getItem('usuario')) || { id: 3, username: "antonio123" };

  // --- CARGA INICIAL ---
  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const resAsig = await axios.get(`http://localhost:8080/api/asignaturas/usuario/${usuario.id}`);
        setAsignaturas(resAsig.data);
        if (resAsig.data.length > 0) setAsigSeleccionada(resAsig.data[0]);

        const resSesiones = await axios.get(`http://localhost:8080/api/sesiones/usuario/${usuario.id}`);
        setSesionesHoy(resSesiones.data);
      } catch (err) {
        console.error("Error cargando datos:", err);
      }
    };
    fetchDatos();
  }, [usuario.id]);

  // --- LÓGICA TEMPORIZADOR ---
  useEffect(() => {
    let intervalo = null;
    if (activo && segundos > 0) {
      intervalo = setInterval(() => setSegundos(s => s - 1), 1000);
    } else if (segundos === 0 && activo) {
      finalizarSesion();
    }
    return () => clearInterval(intervalo);
  }, [activo, segundos]);

  // --- FUNCIONES API ---
  const iniciarSesion = async () => {
    if (!asigSeleccionada) return alert("Selecciona asignatura");
    try {
      const res = await axios.post('http://localhost:8080/api/sesiones/iniciar', {
        usuario: { id: usuario.id },
        asignatura: { id: asigSeleccionada.id },
        tipo: 'estudio'
      });
      setIdSesionActual(res.data.id);
      setActivo(true);
    } catch (err) { console.error(err); }
  };

  const finalizarSesion = async () => {
    if (!idSesionActual) {
        setActivo(false);
        setSegundos(25 * 60);
        return;
    };
    const duracionReal = Math.max(1, Math.floor((25 * 60 - segundos) / 60));
    try {
      await axios.put(`http://localhost:8080/api/sesiones/finalizar/${idSesionActual}?duracion=${duracionReal}`);
      setActivo(false);
      setSegundos(25 * 60);
      setIdSesionActual(null);
      const res = await axios.get(`http://localhost:8080/api/sesiones/usuario/${usuario.id}`);
      setSesionesHoy(res.data);
    } catch (err) { console.error(err); }
  };

  const format = (s) => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;

  return (
    /* CAMBIO CLAVE: Usamos h-full y overflow-y-auto igual que en FlashcardsPage 
       Añadimos p-10 para mantener consistencia de espaciado.
    */
    <div className="h-full bg-[#0A0A0A] text-white p-10 overflow-y-auto custom-scrollbar">
      
      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight">Modo Focus</h1>
        <p className="text-gray-500 text-sm mt-1">Mantén tu concentración con la técnica Pomodoro</p>
      </header>

      <div className="grid grid-cols-12 gap-8">
        
        {/* COLUMNA IZQUIERDA Y CENTRAL */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          
          <div className="bg-[#111111] border border-white/5 rounded-[40px] p-12 flex flex-col items-center relative overflow-hidden">
            <div className="absolute top-8 bg-indigo-500/10 text-indigo-400 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              Sesión de Enfoque
            </div>

            {/* Selector de Asignatura */}
            <div className="mt-8 relative group">
              <select 
                className="appearance-none bg-[#1A1A1A] text-gray-300 text-sm border border-white/10 rounded-full px-8 py-2 pr-12 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer transition-all hover:bg-[#222]"
                value={asigSeleccionada?.id || ""}
                onChange={(e) => setAsigSeleccionada(asignaturas.find(a => a.id === Number(e.target.value)))}
              >
                {asignaturas.length > 0 ? (
                  asignaturas.map(a => (
                    <option key={a.id} value={a.id} className="bg-[#111111]">{a.nombre.toUpperCase()}</option>
                  ))
                ) : (
                  <option value="">Cargando materias...</option>
                )}
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>

            {/* Círculo de Progreso */}
            <div className="relative flex items-center justify-center my-10">
              <svg className="w-80 h-80 transform -rotate-90">
                <circle cx="160" cy="160" r="150" stroke="#1A1A1A" strokeWidth="8" fill="transparent" />
                <circle 
                  cx="160" cy="160" r="150" stroke="#6366F1" strokeWidth="8" fill="transparent" 
                  strokeDasharray={942} 
                  strokeDashoffset={942 - (942 * segundos) / (25 * 60)}
                  className="transition-all duration-1000 ease-linear shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <h2 className="text-[90px] font-medium tracking-tighter tabular-nums leading-none">{format(segundos)}</h2>
                <span className="text-gray-500 text-[10px] font-black mt-2 uppercase tracking-widest">Minutos</span>
              </div>
            </div>

            {/* Botones de Control */}
            <div className="flex items-center gap-6">
              <button onClick={finalizarSesion} className="w-14 h-14 bg-[#1A1A1A] rounded-full flex items-center justify-center hover:bg-red-500/10 hover:text-red-500 transition-colors">
                <Square size={20} fill="currentColor" />
              </button>
              <button onClick={activo ? () => setActivo(false) : iniciarSesion} className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-indigo-600/20">
                {activo ? <span className="text-2xl font-bold">||</span> : <Play size={32} fill="white" className="ml-1" />}
              </button>
              <button className="w-14 h-14 bg-[#1A1A1A] rounded-full flex items-center justify-center hover:bg-white/5 transition-colors">
                <Settings size={20} />
              </button>
            </div>
          </div>

          {/* Sesiones de Hoy */}
          <div className="bg-[#111111] border border-white/5 rounded-[32px] p-8">
            <h3 className="text-xl font-bold mb-6">Sesiones de Hoy</h3>
            <div className="space-y-4">
              {sesionesHoy.length === 0 && <p className="text-gray-600 italic text-sm">No hay sesiones hoy.</p>}
              {sesionesHoy.slice().reverse().map((s) => (
                <div key={s.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full" style={{backgroundColor: s.asignatura?.color || '#6366F1'}}></div>
                    <div>
                      <span className="text-white font-medium block">{s.asignatura?.nombre || "General"}</span>
                      <span className="text-gray-500 text-[10px] font-black tracking-widest uppercase">{s.tipo || 'estudio'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <span className="text-gray-400">{s.duracion || 0} min</span>
                    <span className="text-gray-600 font-mono">
                      {s.fechaInicio ? new Date(s.fechaInicio).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          <div className="bg-[#111111] border border-white/5 rounded-[32px] p-8">
            <h3 className="text-lg font-bold mb-6">Estadísticas</h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm font-bold uppercase tracking-tighter">Completadas</span>
                <span className="text-3xl font-bold text-indigo-500">{sesionesHoy.length}</span>
              </div>
              <div className="flex justify-between items-center border-t border-white/5 pt-6">
                <span className="text-gray-500 text-sm font-bold uppercase tracking-tighter">Tiempo Total</span>
                <span className="text-2xl font-bold">
                  {Math.floor(sesionesHoy.reduce((acc, s) => acc + (s.duracion || 0), 0) / 60)}h{' '}
                  {sesionesHoy.reduce((acc, s) => acc + (s.duracion || 0), 0) % 60}m
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#111111] border border-white/5 rounded-[32px] p-8 relative overflow-hidden group">
            <div className="flex items-center gap-2 text-yellow-500 mb-4">
              <Lightbulb size={20} />
              <h3 className="font-black text-white uppercase text-[10px] tracking-widest">Consejo del día</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed italic relative z-10">
              "Toma descansos de 5 minutos para mantener el cerebro fresco."
            </p>
            <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-yellow-500/5 blur-2xl rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusModePage;