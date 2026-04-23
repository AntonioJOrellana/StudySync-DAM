import React, { useState, useEffect } from 'react';
import { School, Plus, ChevronRight, FileText, Play, Link, Zap } from 'lucide-react';
import { mazoService } from '../services/mazoService';
import { tareaService } from '../services/tareaService';
import { recursoService } from '../services/recursoService';

const MateriaDetallePage = ({ asignatura }) => {
  const [mazos, setMazos] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [recursos, setRecursos] = useState([]);

  useEffect(() => {
    if (asignatura?.id) {
      mazoService.listarPorAsignatura(asignatura.id).then(res => setMazos(res.data));
      tareaService.listarPorAsignatura(asignatura.id).then(res => setTareas(res.data));
      recursoService.listarPorAsignatura(asignatura.id).then(res => setRecursos(res.data));
    }
  }, [asignatura]);

  return (
    <div className="p-10 text-left animate-in slide-in-from-right-4 duration-500">
      <header className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-indigo-500 rounded-[22px] flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <School className="text-white" size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter">{asignatura?.nombre}</h1>
            <p className="text-gray-500 font-medium text-lg">{asignatura?.descripcion || 'Gestión de materia'}</p>
          </div>
        </div>
        <button className="bg-[#111111] border border-white/10 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-white/5 transition-all">
          <Plus size={20} /> Añadir
        </button>
      </header>

      <div className="flex gap-8">
        <div className="flex-1 space-y-8">
          {/* Flashcards Section */}
          <section>
            <h3 className="text-xl font-bold text-white mb-4">Mazos de Flashcards</h3>
            <div className="grid grid-cols-2 gap-4">
              {mazos.map(m => (
                <div key={m.id} className="bg-[#111111] border border-white/5 p-6 rounded-[28px] flex justify-between items-center group cursor-pointer hover:border-indigo-500/50 transition-all">
                  <div>
                    <h4 className="font-bold text-gray-200">{m.nombre}</h4>
                    <p className="text-xs text-gray-500 mt-1">12 tarjetas por repasar</p>
                  </div>
                  <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-gray-500 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                    <ChevronRight size={20} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Biblioteca Section */}
          <section>
            <h3 className="text-xl font-bold text-white mb-4">Biblioteca de Recursos</h3>
            <div className="bg-[#111111] border border-white/5 rounded-[32px] overflow-hidden">
              {recursos.length > 0 ? recursos.map((r, i) => (
                <div key={r.id} className={`p-5 flex items-center gap-4 hover:bg-white/[0.02] transition-all ${i !== recursos.length - 1 ? 'border-b border-white/5' : ''}`}>
                  <div className="text-indigo-400"><FileText size={20}/></div>
                  <div className="flex-1 font-bold text-sm text-gray-300">{r.nombre}</div>
                  <span className="text-[10px] font-black text-gray-600 uppercase">{r.tipo}</span>
                </div>
              )) : (
                <p className="p-10 text-center text-gray-600 font-medium">No hay recursos subidos aún.</p>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar Info */}
        <div className="w-80 space-y-6">
          <div className="bg-indigo-600/10 border border-indigo-500/20 p-8 rounded-[40px]">
            <Zap className="text-indigo-500 mb-4" size={32} fill="currentColor" />
            <h4 className="text-white font-black text-xl mb-2">Sync AI</h4>
            <p className="text-indigo-200/60 text-sm leading-relaxed">Detectamos que tu rendimiento en este tema bajó un 15%. ¿Repasamos?</p>
          </div>
          
          <div className="bg-[#111111] border border-white/5 p-8 rounded-[40px]">
            <h4 className="text-white font-bold mb-6">Próximas Tareas</h4>
            <div className="space-y-6">
              {tareas.map(t => (
                <div key={t.id} className="flex gap-4">
                  <div className={`w-1 h-10 rounded-full ${t.estado === 'COMPLETADA' ? 'bg-emerald-500' : 'bg-indigo-500'}`} />
                  <div>
                    <p className="text-sm font-bold text-white">{t.titulo}</p>
                    <p className="text-[10px] text-gray-500 font-black uppercase mt-1">{t.fechaLimite || 'Sin fecha'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MateriaDetallePage;