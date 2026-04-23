import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { agendaService } from '../services/agendaService';

const CalendarPage = () => {
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    // Aquí llamarías a tu endpoint de Spring Boot
    agendaService.listarTodos?.().then(res => setEventos(res.data)).catch(() => {});
  }, []);

  return (
    <div className="p-12 text-left animate-in fade-in">
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-black text-white">Mi Agenda</h1>
          <p className="text-gray-500 mt-2 font-medium">Organiza tus entregas y exámenes.</p>
        </div>
        <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2">
          <Plus size={20} /> Nuevo Evento
        </button>
      </header>

      <div className="grid grid-cols-7 border border-white/5 bg-[#111111] rounded-[32px] overflow-hidden shadow-2xl">
        {['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'].map(day => (
          <div key={day} className="p-6 text-center border-b border-r border-white/5 text-[10px] font-black text-gray-500 uppercase tracking-widest bg-white/[0.02]">
            {day}
          </div>
        ))}
        {Array.from({ length: 35 }).map((_, i) => (
          <div key={i} className="h-32 p-4 border-r border-b border-white/5 hover:bg-white/[0.02] transition-colors relative group">
            <span className="text-xs font-bold text-gray-700 group-hover:text-gray-400">{(i % 31) + 1}</span>
            {i === 12 && (
              <div className="mt-2 p-2 bg-indigo-500/20 border-l-2 border-indigo-500 rounded text-[9px] font-bold text-indigo-300">
                Parcial Cálculo
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarPage;