import React, { useState, useEffect, useCallback } from 'react';
import { 
  BookOpen, Plus, GraduationCap, Clock, 
  FileText, Video, ChevronRight, Flame, Link as LinkIcon, Monitor
} from 'lucide-react';

import ModalNuevoRecurso from '../components/ModalNuevoRecurso';
import { recursoService } from '../services/recursoService';
import { flashcardService } from '../services/flashcardService'; 

const MateriaDetallePage = ({ asignatura }) => {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [recursos, setRecursos] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [cargando, setCargando] = useState(false);

  // --- FUNCIÓN DE CARGA INDEPENDIENTE ---
  const cargarDatos = useCallback(async () => {
    if (!asignatura?.id) return;
    
    setCargando(true);
    
    // 1. Cargar Recursos (Prioridad)
    try {
      const dataRecursos = await recursoService.getRecursosPorAsignatura(asignatura.id);
      setRecursos(dataRecursos || []);
    } catch (error) {
      console.error("Error cargando recursos:", error);
    }

    // 2. Cargar Flashcards (Si falla, no rompe lo de arriba)
    try {
      if (flashcardService.getFlashcardsPorAsignatura) {
        const dataFlashcards = await flashcardService.getFlashcardsPorAsignatura(asignatura.id);
        setFlashcards(dataFlashcards || []);
      }
    } catch (error) {
      console.warn("Flashcard service no disponible o falló:", error);
      setFlashcards([]); // Mantenemos a 0 si falla
    } finally {
      setCargando(false);
    }
  }, [asignatura]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

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
    <div className="h-full bg-[#0A0A0A] text-white overflow-y-auto custom-scrollbar p-10">
      
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

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <StatCard label="Progreso Actual" value="75%" sub="+12%" color={materiaColor} />
        <StatCard label="Flashcards Maj." value={`${flashcards.length}`} sub="Total" color={materiaColor} />
        <StatCard label="Horas de Vuelo" value="18.5h" sub="+2.4h" color={materiaColor} />
        <StatCard label="Nota Estimada" value="8.7" sub="Stable" color={materiaColor} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoCard icon={<GraduationCap size={22} />} label="Catedrático" value={asignatura.profesor || "No asignado"} color={materiaColor} />
            <InfoCard icon={<Clock size={22} />} label="Status" value="En curso" color={materiaColor} />
          </section>

          {/* FLASHCARDS */}
          <section>
            <h3 className="text-xl font-bold mb-6 italic uppercase tracking-wider">Flashcards de Repaso</h3>
            <div className="space-y-4">
              {flashcards.length > 0 ? (
                flashcards.map((set) => (
                  <FlashcardItem key={set.id} title={set.titulo} count={`${set.cantidad_tarjetas} tarjetas`} progress={set.progreso} color={materiaColor} />
                ))
              ) : (
                <div className="p-10 bg-[#111] border border-white/5 rounded-[32px] text-center text-gray-600 italic">
                  No hay sets de flashcards generados para esta materia.
                </div>
              )}
            </div>
          </section>

          {/* RECURSOS (Mapeo corregido) */}
          <section>
            <h3 className="text-xl font-bold mb-6 italic uppercase tracking-wider">Biblioteca de Recursos</h3>
            <div className="bg-[#111] border border-white/5 rounded-[32px] overflow-hidden">
              {cargando && recursos.length === 0 ? (
                <div className="p-10 text-center text-gray-500 italic">Sincronizando...</div>
              ) : recursos.length > 0 ? (
                recursos.map((recurso, index) => (
                  <ResourceItem 
                    key={recurso.id}
                    icon={getIconoRecurso(recurso.tipo)} 
                    name={recurso.nombre} 
                    type={recurso.metadata || recurso.tipo?.toUpperCase()} 
                    isLast={index === recursos.length - 1} 
                  />
                ))
              ) : (
                <div className="p-10 text-center text-gray-600 italic">No hay recursos detectados.</div>
              )}
            </div>
          </section>
        </div>

        {/* SIDEBAR */}
        <div className="space-y-8">
          <div className="bg-[#111] border border-white/5 rounded-[32px] p-8">
            <h4 className="font-bold mb-6 text-lg">Agenda</h4>
            <div className="flex gap-4">
              <div className="w-1 rounded-full" style={{ backgroundColor: materiaColor }} />
              <div>
                <p className="text-sm font-bold text-white uppercase tracking-tighter">Examen Próximo</p>
                <p className="text-xs text-gray-500 italic">Sincronizando calendario...</p>
              </div>
            </div>
          </div>

          <div 
            className="p-8 rounded-[32px] border transition-all hover:bg-opacity-20 cursor-pointer"
            style={{ 
              backgroundColor: colorConOpacidad(materiaColor, '05'),
              borderColor: colorConOpacidad(materiaColor, '10') 
            }}
          >
            <div className="flex items-center gap-3 mb-4" style={{ color: materiaColor }}>
              <Flame size={20} fill="currentColor" />
              <span className="text-[10px] font-black uppercase tracking-widest">Sync AI</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed italic">
              {recursos.length > 0 
                ? `He analizado ${recursos.length} documentos. ¿Generamos un test?`
                : "Sube un archivo para activar la IA."}
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

// --- COMPONENTES AUXILIARES (Tus estilos originales) ---
const StatCard = ({ label, value, sub, color }) => (
  <div className="bg-[#111] border border-white/5 p-7 rounded-[32px] hover:border-white/10 transition-colors">
    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-4">{label}</p>
    <div className="flex items-baseline justify-between">
      <h4 className="text-3xl font-black italic">{value}</h4>
      <span className="text-[10px] px-2 py-1 rounded-lg font-bold" style={{ backgroundColor: `${color}15`, color: color }}>{sub}</span>
    </div>
  </div>
);

const InfoCard = ({ icon, label, value, color }) => (
  <div className="bg-[#111] p-6 rounded-[24px] border border-white/5 flex items-center gap-4">
    <div className="p-3 rounded-xl" style={{ backgroundColor: `${color}15`, color: color }}>{icon}</div>
    <div>
      <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">{label}</p>
      <p className="text-white font-bold italic">{value}</p>
    </div>
  </div>
);

const FlashcardItem = ({ title, count, progress, color }) => (
  <div className="bg-[#111] border border-white/5 p-6 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-white/[0.02] transition-all">
    <div>
      <p className="font-bold text-white mb-1 uppercase tracking-tight">{title}</p>
      <p className="text-xs text-gray-500 italic">{count}</p>
    </div>
    <div className="flex items-center gap-6">
      <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${progress}%`, backgroundColor: color }} />
      </div>
      <ChevronRight size={16} className="text-gray-700 group-hover:text-white transition-colors" />
    </div>
  </div>
);

const ResourceItem = ({ icon, name, type, isLast }) => (
  <div className={`p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors cursor-pointer ${!isLast ? 'border-b border-white/5' : ''}`}>
    <div className="flex items-center gap-4">
      <div className="text-gray-500">{icon}</div>
      <span className="text-sm font-bold text-gray-300">{name}</span>
    </div>
    <span className="text-[9px] font-black text-gray-600 tracking-widest uppercase">{type}</span>
  </div>
);

const getIconoRecurso = (tipo) => {
  switch (tipo?.toLowerCase()) {
    case 'pdf': return <FileText size={18} />;
    case 'video': return <Video size={18} />;
    case 'enlace': return <LinkIcon size={18} />;
    default: return <Monitor size={18} />;
  }
};

export default MateriaDetallePage;