import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, Plus, GraduationCap, Clock, 
  FileText, Video, ChevronRight, Flame, Link as LinkIcon, Monitor,
  AlertCircle, Layers, Activity, Brain
} from 'lucide-react';

import ModalNuevoRecurso from '../components/ModalNuevoRecurso';
import { recursoService } from '../services/recursoService';
import { mazoService } from '../services/mazoService';

const MateriaDetallePage = ({ asignatura }) => {
  const navigate = useNavigate();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [recursos, setRecursos] = useState([]);
  const [mazos, setMazos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [fallidasRefuerzo, setFallidasRefuerzo] = useState([]);

  const cargarDatos = useCallback(async () => {
    if (!asignatura?.id && !asignatura?.id_asignatura) return;
    const idAsig = asignatura.id_asignatura || asignatura.id;
    
    setCargando(true);
    try {
      const [dataRecursos, resMazos] = await Promise.allSettled([
        recursoService.getRecursosPorAsignatura(idAsig),
        mazoService.listarPorAsignatura(idAsig)
      ]);
      
      const listaRecursos = dataRecursos.status === 'fulfilled' ? dataRecursos.value : [];
      setRecursos(Array.isArray(listaRecursos) ? listaRecursos : []);

      let listaMazos = [];
      if (resMazos.status === 'fulfilled' && resMazos.value?.data) {
        listaMazos = resMazos.value.data;
      } else {
        listaMazos = asignatura.mazos || [];
      }
      setMazos(listaMazos);

      const fallidas = listaMazos.reduce((acc, mazo) => {
        const mazoId = mazo.id || mazo.id_mazo;
        const saved = localStorage.getItem(`fallidas_mazo_${mazoId}`);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            return [...acc, ...parsed.map(t => ({ ...t, nombreMazo: mazo.nombre }))];
          } catch (e) { return acc; }
        }
        return acc;
      }, []);
      setFallidasRefuerzo(fallidas);

    } catch (error) {
      console.error("Error sincronizando datos:", error);
    } finally {
      setCargando(false);
    }
  }, [asignatura]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const statsReales = useMemo(() => {
    const totalFlashcards = mazos.reduce((acc, mazo) => {
      const cantidad = (mazo.flashcards && mazo.flashcards.length) || 
                       mazo.cantidad_tarjetas || 0;
      return acc + cantidad;
    }, 0);
    
    const listaSesiones = asignatura.sesiones || [];
    const minutosTotales = listaSesiones.reduce((acc, sesion) => acc + (Number(sesion.duracion) || 0), 0);
    const horasCalculadas = minutosTotales / 60;

    return {
      totalFlashcards,
      horasVuelo: horasCalculadas.toFixed(1)
    };
  }, [mazos, asignatura]);

  if (!asignatura) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-600 gap-4">
        <Activity size={48} className="opacity-20 animate-pulse" />
        <p className="font-bold uppercase tracking-widest text-xs italic">Selecciona una materia para auditar</p>
      </div>
    );
  }

  const materiaColor = asignatura.color || '#6366f1';
  const colorConOpacidad = (hex, opacity) => `${hex}${opacity}`;

  return (
    <div className="h-full bg-[#0A0A0A] text-white overflow-y-auto no-scrollbar p-6 sm:p-10 animate-in fade-in duration-500">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none !important; }
        .no-scrollbar { -ms-overflow-style: none !important; scrollbar-width: none !important; }
      `}</style>
      
      {/* HEADER DINÁMICO */}
      <header className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 mb-12">
        <div className="flex items-center gap-6">
          <div 
            className="hidden sm:flex p-6 rounded-[32px] shadow-2xl transition-transform hover:rotate-3"
            style={{ 
              backgroundColor: colorConOpacidad(materiaColor, '10'), 
              color: materiaColor,
              border: `1px solid ${colorConOpacidad(materiaColor, '20')}`
            }}
          >
            <BookOpen size={42} />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter" style={{ backgroundColor: colorConOpacidad(materiaColor, '20'), color: materiaColor }}>Asignatura Activa</span>
                {cargando && <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />}
            </div>
            <h1 className="text-4xl sm:text-7xl font-black tracking-tighter italic uppercase leading-[0.8]" style={{ color: materiaColor }}>
              {asignatura.nombre}
            </h1>
            <p className="text-gray-500 font-bold mt-4 text-sm sm:text-lg max-w-2xl">
              {asignatura.descripcion || "Módulo de estudio sin descripción técnica."}
            </p>
          </div>
        </div>

        <button 
          onClick={() => setModalAbierto(true)}
          className="flex items-center justify-center gap-3 px-8 py-5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all hover:brightness-110 active:scale-95 shadow-2xl"
          style={{ backgroundColor: materiaColor, color: '#fff' }}
        >
          <Plus size={18} /> Nuevo Recurso
        </button>
      </header>

      {/* MÉTRICAS DE RENDIMIENTO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-12">
        <StatCard label="Flashcards Generadas" value={`${statsReales.totalFlashcards}`} sub="TOTAL" color={materiaColor} />
        <StatCard label="Tiempo Focus" value={`${statsReales.horasVuelo}h`} sub="LOG" color={materiaColor} />
        <StatCard label="Flashcards para repasar" value={fallidasRefuerzo.length} sub="PENDIENTE" color="#ef4444" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-12">
          
          <InfoCard icon={<GraduationCap size={22} />} label="Catedrático / Instructor" value={asignatura.profesor || "Personal Docente No Asignado"} color={materiaColor} />

          {/* ZONA DE REFUERZO CRÍTICO REINTEGRADA */}
          {fallidasRefuerzo.length > 0 && (
            <section className="animate-in slide-in-from-bottom-4 duration-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-6 w-1 bg-red-500 rounded-full" />
                <h3 className="text-xl font-black italic uppercase tracking-wider text-red-500">Zona de Refuerzo Crítico</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fallidasRefuerzo.slice(0, 4).map((f, idx) => (
                  <div key={idx} className="bg-[#111] border border-red-500/10 p-6 rounded-[24px] hover:border-red-500/30 transition-all group relative overflow-hidden">
                    <div className="flex justify-between items-start mb-3 relative z-10">
                        <p className="text-xs font-black italic text-gray-200 leading-tight pr-8">¿{f.anverso || f.pregunta}?</p>
                        <span className="text-[8px] font-black bg-red-500/10 px-2 py-1 rounded text-red-500 uppercase shrink-0">{f.nombreMazo}</span>
                    </div>
                    <p className="text-[11px] text-gray-500 leading-relaxed border-t border-white/5 pt-3 mt-3 italic relative z-10">
                        <span className="text-red-500 font-black mr-2 uppercase">Fix:</span> {f.reverso || f.respuesta}
                    </p>
                    <div className="absolute -right-4 -bottom-4 opacity-[0.02] text-red-500 group-hover:scale-110 transition-transform">
                        <AlertCircle size={80} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* LISTADO DE MAZOS */}
          <section>
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black italic uppercase tracking-wider">Mazos de Aprendizaje</h3>
                <span className="text-[10px] font-bold text-gray-600 bg-white/5 px-3 py-1 rounded-full uppercase tracking-widest">{mazos.length} Unidades</span>
            </div>
            <div className="space-y-4">
              {mazos.length > 0 ? (
                mazos.map((mazo) => (
                  <FlashcardItem 
                    key={mazo.id || mazo.id_mazo} 
                    title={mazo.nombre} 
                    count={`${(mazo.flashcards?.length) || mazo.cantidad_tarjetas || 0} tarjetas activas`} 
                    progress={100} 
                    color={materiaColor} 
                    onClick={() => navigate(`/flashcards/mazo/${mazo.id || mazo.id_mazo}`)}
                  />
                ))
              ) : (
                <div className="p-12 bg-[#111] border border-white/5 rounded-[40px] text-center">
                  <Layers size={32} className="mx-auto mb-4 text-gray-800" />
                  <p className="text-gray-600 text-xs font-bold uppercase tracking-widest italic">No se han detectado mazos vinculados</p>
                </div>
              )}
            </div>
          </section>

          {/* BIBLIOTECA */}
          <section>
            <h3 className="text-xl font-black italic uppercase tracking-wider mb-8">Repositorio de Recursos</h3>
            <div className="bg-[#111] border border-white/5 rounded-[32px] overflow-hidden shadow-2xl">
              {recursos.length > 0 ? (
                recursos.map((recurso, index) => (
                  <ResourceItem 
                    key={recurso.id}
                    icon={getIconoRecurso(recurso.tipo)} 
                    name={recurso.nombre} 
                    type={recurso.tipo?.toUpperCase() || 'DOC'} 
                    isLast={index === recursos.length - 1} 
                  />
                ))
              ) : (
                <div className="p-12 text-center">
                   <p className="text-gray-700 text-xs font-bold uppercase tracking-widest italic">Repositorio vacío</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* SIDEBAR ANALÍTICO */}
        <div className="space-y-8">
          <div className="bg-[#111] border border-white/5 rounded-[32px] p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Activity size={80} />
            </div>
            <h4 className="font-black mb-8 text-sm uppercase tracking-[0.2em] text-gray-400">Data Analytics</h4>
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-1 rounded-full animate-pulse" style={{ backgroundColor: materiaColor }} />
                <div>
                  <p className="text-[10px] font-black text-white uppercase tracking-widest">Índice de Retención</p>
                  <p className="text-[10px] text-gray-500 italic mt-1 font-bold">Algoritmo StudySync v.3</p>
                </div>
              </div>
              
              <div className="pt-6 border-t border-white/5">
                <div className="flex justify-between text-[10px] font-black uppercase mb-3 tracking-tighter">
                  <span className="text-gray-500">Objetivo Mensual</span>
                  <span className="text-white">{recursos.length} / 12 archivos</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full transition-all duration-1000 ease-out" 
                    style={{ 
                        width: `${Math.min(100, (recursos.length / 12) * 100)}%`, 
                        backgroundColor: materiaColor 
                    }} 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ModalNuevoRecurso 
        isOpen={modalAbierto} 
        onClose={() => setModalAbierto(false)} 
        asignatura={asignatura} 
        onRecursoCreado={cargarDatos} 
      />
    </div>
  );
};

const StatCard = ({ label, value, sub, color }) => (
  <div className="bg-[#111111] border border-white/5 p-6 sm:p-8 rounded-[32px] hover:border-white/20 transition-all group shadow-xl">
    <p className="text-[9px] text-gray-600 font-black uppercase tracking-[0.2em] mb-4 group-hover:text-gray-400 transition-colors">{label}</p>
    <div className="flex items-baseline justify-between">
      <h4 className="text-2xl sm:text-4xl font-black italic tracking-tighter">{value}</h4>
      <span className="text-[8px] px-2 py-1 rounded-lg font-black uppercase tracking-tighter" style={{ backgroundColor: `${color}15`, color: color }}>{sub}</span>
    </div>
  </div>
);

const InfoCard = ({ icon, label, value, color }) => (
  <div className="bg-[#111111] p-6 rounded-[28px] border border-white/5 flex items-center gap-5 hover:bg-white/[0.02] transition-all w-full shadow-lg group">
    <div className="p-4 rounded-2xl group-hover:scale-110 transition-transform shadow-inner" style={{ backgroundColor: `${color}10`, color: color }}>{icon}</div>
    <div>
      <p className="text-[9px] text-gray-600 uppercase font-black tracking-[0.2em] mb-0.5">{label}</p>
      <p className="text-white font-black italic uppercase text-sm sm:text-base tracking-tight">{value}</p>
    </div>
  </div>
);

const FlashcardItem = ({ title, count, progress, color, onClick }) => (
  <div 
    onClick={onClick}
    className="bg-[#111111] border border-white/5 p-6 rounded-[28px] flex items-center justify-between group cursor-pointer hover:bg-white/[0.03] hover:translate-x-2 transition-all shadow-lg"
  >
    <div className="flex items-center gap-5">
      <div className="p-3 bg-white/5 rounded-xl text-gray-500 group-hover:text-white transition-all shadow-inner">
        <Layers size={20} />
      </div>
      <div>
        <p className="font-black text-white mb-1 uppercase tracking-tight text-sm italic group-hover:text-indigo-400 transition-colors">{title}</p>
        <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest">{count}</p>
      </div>
    </div>
    <div className="flex items-center gap-8">
      <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden hidden md:block">
        <div className="h-full rounded-full transition-all duration-1000 ease-in-out" style={{ width: `${progress}%`, backgroundColor: color }} />
      </div>
      <ChevronRight size={18} className="text-gray-800 group-hover:text-white group-hover:translate-x-1 transition-all" />
    </div>
  </div>
);

const ResourceItem = ({ icon, name, type, isLast }) => (
  <div className={`p-6 flex items-center justify-between hover:bg-white/[0.03] transition-all cursor-pointer group ${!isLast ? 'border-b border-white/5' : ''}`}>
    <div className="flex items-center gap-5">
      <div className="text-gray-600 group-hover:text-indigo-400 group-hover:scale-110 transition-all">{icon}</div>
      <span className="text-xs sm:text-sm font-bold text-gray-500 group-hover:text-gray-200 transition-colors">{name}</span>
    </div>
    <div className="flex items-center gap-4">
        <span className="text-[8px] font-black text-gray-700 tracking-[0.3em] uppercase bg-white/5 px-2 py-1 rounded group-hover:text-indigo-500 transition-colors">{type}</span>
    </div>
  </div>
);

const getIconoRecurso = (tipo) => {
  const t = tipo?.toLowerCase();
  if (t?.includes('pdf')) return <FileText size={20} />;
  if (t?.includes('video')) return <Video size={20} />;
  if (t?.includes('url') || t?.includes('enlace')) return <LinkIcon size={20} />;
  return <Monitor size={20} />;
};

export default MateriaDetallePage;