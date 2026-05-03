import React from 'react';
import { 
  BookOpen, 
  Plus, 
  GraduationCap, 
  Clock, 
  TrendingUp, 
  FileText, 
  Video, 
  ChevronRight,
  Calendar,
  Flame
} from 'lucide-react';

const MateriaDetallePage = ({ asignatura }) => {
  if (!asignatura) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Selecciona una asignatura para ver los detalles.
      </div>
    );
  }

  // Helper para aplicar opacidad al color hexadecimal
  const colorConOpacidad = (hex, opacity) => {
    // Si no hay color, usamos el índigo por defecto
    const color = hex || '#6366f1';
    return `${color}${opacity}`;
  };

  const materiaColor = asignatura.color || '#6366f1';

  return (
    <div className="h-full bg-[#0A0A0A] text-white overflow-y-auto custom-scrollbar p-10">
      
      {/* HEADER DINÁMICO */}
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
          className="flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-sm transition-all hover:scale-105 active:scale-95 shadow-xl shadow-black/40"
          style={{ 
            backgroundColor: materiaColor,
            color: '#fff'
          }}
        >
          <Plus size={20} />
          Nuevo Recurso
        </button>
      </header>

      {/* GRID DE ESTADÍSTICAS RÁPIDAS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <StatCard label="Progreso Actual" value="75%" sub="+12%" color={materiaColor} />
        <StatCard label="Flashcards Maj." value="45/60" sub="85%" color={materiaColor} />
        <StatCard label="Horas de Vuelo" value="18.5h" sub="+2.4h" color={materiaColor} />
        <StatCard label="Nota Estimada" value="8.7" sub="Stable" color={materiaColor} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* COLUMNA IZQUIERDA: CONTENIDO */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* INFORMACIÓN DEL CURSO */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoCard 
              icon={<GraduationCap size={22} />} 
              label="Catedrático" 
              value={asignatura.profesor || "No asignado"} 
              color={materiaColor} 
            />
            <InfoCard 
              icon={<Clock size={22} />} 
              label="Próxima Sesión" 
              value="Consultar horario" 
              color={materiaColor} 
            />
          </section>

          {/* FLASHCARDS DE REPASO */}
          <section>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              Flashcards de Repaso
            </h3>
            <div className="space-y-4">
              <FlashcardItem title="Conceptos Fundamentales" count="15 tarjetas" progress={65} color={materiaColor} />
              <FlashcardItem title="Repaso de Examen" count="12 tarjetas" progress={40} color="#f97316" />
            </div>
          </section>

          {/* BIBLIOTECA DE RECURSOS */}
          <section>
            <h3 className="text-xl font-bold mb-6">Biblioteca de Recursos</h3>
            <div className="bg-[#111] border border-white/5 rounded-[32px] overflow-hidden">
              <ResourceItem icon={<FileText size={18} />} name="Material de clase.pdf" type="PDF" />
              <ResourceItem icon={<Video size={18} />} name="Grabación de sesión" type="VIDEO" isLast />
            </div>
          </section>
        </div>

        {/* COLUMNA DERECHA: AGENDA Y AI */}
        <div className="space-y-8">
          <div className="bg-[#111] border border-white/5 rounded-[32px] p-8">
            <h4 className="font-bold mb-6 text-lg">Agenda</h4>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-1 rounded-full" style={{ backgroundColor: materiaColor }} />
                <div>
                  <p className="text-sm font-bold text-white">Examen Próximo</p>
                  <p className="text-xs text-gray-500">Pendiente de fecha</p>
                </div>
              </div>
            </div>
          </div>

          {/* WIDGET AI DINÁMICO */}
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
            <p className="text-sm text-gray-300 leading-relaxed">
              Estás progresando bien en <span className="font-bold text-white">{asignatura.nombre}</span>. ¿Quieres generar un test rápido?
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

/* COMPONENTES INTERNOS CON ESTILOS DINÁMICOS */

const StatCard = ({ label, value, sub, color }) => (
  <div className="bg-[#111] border border-white/5 p-7 rounded-[32px] hover:border-white/10 transition-colors">
    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-4">{label}</p>
    <div className="flex items-baseline justify-between">
      <h4 className="text-3xl font-black">{value}</h4>
      <span 
        className="text-[10px] px-2 py-1 rounded-lg font-bold"
        style={{ backgroundColor: `${color}15`, color: color }}
      >
        {sub}
      </span>
    </div>
  </div>
);

const InfoCard = ({ icon, label, value, color }) => (
  <div className="bg-[#111] p-6 rounded-[24px] border border-white/5 flex items-center gap-4">
    <div 
      className="p-3 rounded-xl"
      style={{ backgroundColor: `${color}15`, color: color }}
    >
      {icon}
    </div>
    <div>
      <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">{label}</p>
      <p className="text-white font-bold">{value}</p>
    </div>
  </div>
);

const FlashcardItem = ({ title, count, progress, color }) => (
  <div className="bg-[#111] border border-white/5 p-6 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-white/[0.02] transition-all">
    <div>
      <p className="font-bold text-white mb-1">{title}</p>
      <p className="text-xs text-gray-500">{count}</p>
    </div>
    <div className="flex items-center gap-6">
      <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-1000" 
          style={{ width: `${progress}%`, backgroundColor: color }}
        />
      </div>
      <ChevronRight size={16} className="text-gray-700 group-hover:text-white transition-colors" />
    </div>
  </div>
);

const ResourceItem = ({ icon, name, type, isLast }) => (
  <div className={`p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors cursor-pointer ${!isLast ? 'border-b border-white/5' : ''}`}>
    <div className="flex items-center gap-4">
      <div className="text-gray-500">{icon}</div>
      <span className="text-sm font-medium text-gray-300">{name}</span>
    </div>
    <span className="text-[9px] font-black text-gray-600 tracking-widest">{type}</span>
  </div>
);

export default MateriaDetallePage;