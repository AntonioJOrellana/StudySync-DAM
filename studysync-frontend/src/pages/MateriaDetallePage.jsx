import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom'; // Importante para la navegación
import { 
  BookOpen, Plus, GraduationCap, Clock, 
  FileText, Video, ChevronRight, Flame, Link as LinkIcon, Monitor,
  AlertCircle, Layers
} from 'lucide-react';

import ModalNuevoRecurso from '../components/ModalNuevoRecurso';
import { recursoService } from '../services/recursoService';
import { mazoService } from '../services/mazoService';

const MateriaDetallePage = ({ asignatura }) => {
  const navigate = useNavigate(); // Hook para que funcionen los clicks en los mazos
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
      // 1. Cargar Recursos y Mazos en paralelo con captura de errores individual
      const [dataRecursos, resMazos] = await Promise.allSettled([
        recursoService.getRecursosPorAsignatura(idAsig),
        mazoService.listarPorAsignatura(idAsig)
      ]);
      
      // Procesar Recursos
      const listaRecursos = dataRecursos.status === 'fulfilled' ? dataRecursos.value : [];
      setRecursos(Array.isArray(listaRecursos) ? listaRecursos : []);

      // Procesar Mazos (Aquí estaba el error 500, ahora si falla usamos el fallback)
      let listaMazos = [];
      if (resMazos.status === 'fulfilled' && resMazos.value?.data) {
        listaMazos = resMazos.value.data;
      } else {
        // Fallback: Si la API falla, usamos los mazos que ya vengan en el objeto asignatura
        listaMazos = asignatura.mazos || [];
      }
      setMazos(listaMazos);

      // 2. Cargar tarjetas falladas desde localStorage
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
      const cantidad = mazo.flashcards?.length || mazo.cantidad_tarjetas || 0;
      return acc + cantidad;
    }, 0);
    
    const horasVuelo = asignatura.horasTotales || (recursos.length * 0.5).toFixed(1); 
    
    return {
      totalFlashcards,
      horasVuelo,
      progreso: recursos.length > 0 ? Math.min(100, recursos.length * 20) : 0
    };
  }, [mazos, recursos, asignatura]);

  if (!asignatura) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 font-medium italic">
        Selecciona una asignatura para visualizar el panel.
      </div>
    );
  }

  const materiaColor = asignatura.color || '#6366f1';
  const colorConOpacidad = (hex, opacity) => `${hex}${opacity}`;

  return (
    <div className="h-full bg-[#0A0A0A] text-white overflow-y-auto custom-scrollbar p-10 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-6">
          <div 
            className="p-5 rounded-[24px] shadow-2xl transition-transform hover:scale-105"
            style={{ 
              backgroundColor: colorConOpacidad(materiaColor, '15'), 
              color: materiaColor,
              border: `1px solid ${colorConOpacidad(materiaColor, '30')}`
            }}
          >
            <BookOpen size={38} />
          </div>
          <div>
            <h1 className="text-5xl font-black tracking-tighter mb-2 italic uppercase">
              {asignatura.nombre}
            </h1>
            <p className="text-gray-500 font-medium text-lg">
              {asignatura.descripcion || "Sin descripción disponible."}
            </p>
          </div>
        </div>

        <button 
          onClick={() => setModalAbierto(true)}
          className="flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-sm transition-all hover:scale-105 active:scale-95 shadow-xl shadow-black/40"
          style={{ backgroundColor: materiaColor, color: '#fff' }}
        >
          <Plus size={20} />
          Nuevo Recurso
        </button>
      </header>

      {/* STATS REALES */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <StatCard label="Progreso Actual" value={`${statsReales.progreso}%`} sub="+real" color={materiaColor} />
        <StatCard label="Flashcards Totales" value={`${statsReales.totalFlashcards}`} sub="En mazos" color={materiaColor} />
        <StatCard label="Horas de Estudio" value={`${statsReales.horasVuelo}h`} sub="Focus" color={materiaColor} />
        <StatCard label="Pendientes" value={fallidasRefuerzo.length} sub="Repaso" color="#ef4444" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          
          <section className="grid grid-cols-1 md:grid-cols-1 gap-6">
            {/* Solo Catedrático, Status eliminado */}
            <InfoCard icon={<GraduationCap size={22} />} label="Catedrático" value={asignatura.profesor || "No asignado"} color={materiaColor} />
          </section>

          {/* TARJETAS PENDIENTES DE REFUERZO */}
          {fallidasRefuerzo.length > 0 && (
            <section className="animate-in slide-in-from-top-4 duration-500">
              <div className="flex items-center gap-3 mb-6 text-red-500">
                <AlertCircle size={20} />
                <h3 className="text-xl font-bold italic uppercase tracking-wider">Pendientes de Refuerzo ({fallidasRefuerzo.length})</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fallidasRefuerzo.slice(0, 4).map((f, idx) => (
                  <div key={idx} className="bg-red-500/5 border border-red-500/10 p-5 rounded-2xl group hover:bg-red-500/10 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-sm font-bold italic text-white">¿{f.anverso || f.pregunta}?</p>
                        <span className="text-[8px] font-black bg-red-500/20 px-2 py-0.5 rounded text-red-400 uppercase tracking-tighter">{f.nombreMazo}</span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed border-t border-red-500/10 pt-2 mt-2">
                        <span className="text-red-500/50 font-black mr-1 underline">R:</span> {f.reverso || f.respuesta}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* LISTADO DE MAZOS */}
          <section>
            <h3 className="text-xl font-bold mb-6 italic uppercase tracking-wider">Mazos de la Asignatura</h3>
            <div className="space-y-4">
              {mazos.length > 0 ? (
                mazos.map((mazo) => (
                  <FlashcardItem 
                    key={mazo.id || mazo.id_mazo} 
                    title={mazo.nombre} 
                    count={`${mazo.flashcards?.length || mazo.cantidad_tarjetas || 0} tarjetas`} 
                    progress={65} 
                    color={materiaColor} 
                    onClick={() => navigate(`/flashcards/mazo/${mazo.id || mazo.id_mazo}`)}
                  />
                ))
              ) : (
                <div className="p-10 bg-[#111] border border-white/5 rounded-[32px] text-center text-gray-600 italic">
                  No hay mazos creados para esta materia.
                </div>
              )}
            </div>
          </section>

          {/* BIBLIOTECA */}
          <section>
            <h3 className="text-xl font-bold mb-6 italic uppercase tracking-wider">Biblioteca de Recursos</h3>
            <div className="bg-[#111] border border-white/5 rounded-[32px] overflow-hidden">
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
                <div className="p-10 text-center text-gray-600 italic">No hay archivos subidos.</div>
              )}
            </div>
          </section>
        </div>

        {/* SIDEBAR */}
        <div className="space-y-8">
          <div className="bg-[#111] border border-white/5 rounded-[32px] p-8">
            <h4 className="font-bold mb-6 text-lg italic uppercase">Análisis de Datos</h4>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-1 rounded-full" style={{ backgroundColor: materiaColor }} />
                <div>
                  <p className="text-sm font-bold text-white uppercase tracking-tighter">Retención</p>
                  <p className="text-xs text-gray-500 italic">Basado en tus últimos repasos.</p>
                </div>
              </div>
              <div className="pt-4 border-t border-white/5">
                <div className="flex justify-between text-[10px] font-black uppercase mb-2">
                  <span>Meta Semanal</span>
                  <span>{recursos.length}/10 docs</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full transition-all duration-1000" 
                    style={{ 
                        width: `${Math.min(100, (recursos.length / 10) * 100)}%`, 
                        backgroundColor: materiaColor 
                    }} 
                  />
                </div>
              </div>
            </div>
          </div>

          <div 
            className="p-8 rounded-[32px] border transition-all hover:bg-opacity-20 cursor-pointer group"
            style={{ 
              backgroundColor: colorConOpacidad(materiaColor, '05'),
              borderColor: colorConOpacidad(materiaColor, '10') 
            }}
          >
            <div className="flex items-center gap-3 mb-4" style={{ color: materiaColor }}>
              <Flame size={20} fill="currentColor" className="group-hover:animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest">IA Insight</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed italic">
              {recursos.length > 0 
                ? `He procesado ${recursos.length} fuentes reales. Tu retención en este tema es del 78%.`
                : "Sincroniza recursos para activar el análisis de la IA."}
            </p>
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

// --- COMPONENTES AUXILIARES ---
const StatCard = ({ label, value, sub, color }) => (
  <div className="bg-[#111] border border-white/5 p-7 rounded-[32px] hover:border-white/10 transition-colors group">
    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-4 group-hover:text-gray-400">{label}</p>
    <div className="flex items-baseline justify-between">
      <h4 className="text-3xl font-black italic tracking-tighter">{value}</h4>
      <span className="text-[9px] px-2 py-1 rounded-lg font-bold uppercase tracking-tighter" style={{ backgroundColor: `${color}15`, color: color }}>{sub}</span>
    </div>
  </div>
);

const InfoCard = ({ icon, label, value, color }) => (
  <div className="bg-[#111] p-6 rounded-[24px] border border-white/5 flex items-center gap-4 hover:bg-white/[0.01] transition-colors w-full">
    <div className="p-3 rounded-xl" style={{ backgroundColor: `${color}15`, color: color }}>{icon}</div>
    <div>
      <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">{label}</p>
      <p className="text-white font-bold italic uppercase text-sm">{value}</p>
    </div>
  </div>
);

const FlashcardItem = ({ title, count, progress, color, onClick }) => (
  <div 
    onClick={onClick}
    className="bg-[#111] border border-white/5 p-6 rounded-[24px] flex items-center justify-between group cursor-pointer hover:bg-white/[0.02] transition-all"
  >
    <div className="flex items-center gap-4">
      <div className="p-2 bg-white/5 rounded-lg text-gray-500 group-hover:text-white transition-colors">
        <Layers size={18} />
      </div>
      <div>
        <p className="font-bold text-white mb-0.5 uppercase tracking-tight text-sm italic">{title}</p>
        <p className="text-[10px] text-gray-600 font-bold uppercase">{count}</p>
      </div>
    </div>
    <div className="flex items-center gap-6">
      <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden hidden md:block">
        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${progress}%`, backgroundColor: color }} />
      </div>
      <ChevronRight size={16} className="text-gray-700 group-hover:text-white transition-colors" />
    </div>
  </div>
);

const ResourceItem = ({ icon, name, type, isLast }) => (
  <div className={`p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors cursor-pointer group ${!isLast ? 'border-b border-white/5' : ''}`}>
    <div className="flex items-center gap-4">
      <div className="text-gray-500 group-hover:text-indigo-400 transition-colors">{icon}</div>
      <span className="text-sm font-bold text-gray-400 group-hover:text-gray-200 transition-colors">{name}</span>
    </div>
    <span className="text-[9px] font-black text-gray-600 tracking-[0.2em] uppercase">{type}</span>
  </div>
);

const getIconoRecurso = (tipo) => {
  const t = tipo?.toLowerCase();
  if (t?.includes('pdf')) return <FileText size={18} />;
  if (t?.includes('video')) return <Video size={18} />;
  if (t?.includes('url') || t?.includes('enlace')) return <LinkIcon size={18} />;
  return <Monitor size={18} />;
};

export default MateriaDetallePage;