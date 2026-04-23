import React, { useState, useEffect } from 'react';
import { BarChart2, TrendingUp, Award, CheckCircle } from 'lucide-react';
import { asignaturaService } from '../services/asignaturaService';

const ProgresoPage = () => {
  const [stats, setStats] = useState({ totalMaterias: 0, completadas: 0 });

  useEffect(() => {
    asignaturaService.listarTodos().then(res => {
      setStats(prev => ({ ...prev, totalMaterias: res.data.length }));
    });
  }, []);

  return (
    <div className="p-12 text-left animate-in fade-in duration-700">
      <header className="mb-12">
        <h1 className="text-4xl font-black text-white">Tu Rendimiento</h1>
        <p className="text-gray-500 mt-2 font-medium">Análisis detallado de tus hábitos de estudio.</p>
      </header>

      <div className="grid grid-cols-3 gap-8 mb-12">
        <StatsCard icon={<BarChart2 className="text-indigo-500"/>} label="Promedio General" value="8.9" />
        <StatsCard icon={<CheckCircle className="text-emerald-500"/>} label="Tareas Listas" value="24" />
        <StatsCard icon={<Award className="text-orange-500"/>} label="Nivel Actual" value="Pro" />
      </div>

      <div className="bg-[#111111] border border-white/5 rounded-[40px] p-10">
        <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
          <TrendingUp size={20} className="text-indigo-500" /> Actividad Semanal
        </h3>
        <div className="h-64 flex items-end justify-between gap-4 px-4">
          {[40, 70, 45, 90, 65, 80, 30].map((height, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-4">
              <div 
                className="w-full bg-indigo-500/20 rounded-t-xl hover:bg-indigo-500 transition-all duration-500 relative group"
                style={{ height: `${height}%` }}
              >
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {height}m
                </div>
              </div>
              <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                {['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'][i]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatsCard = ({ icon, label, value }) => (
  <div className="bg-[#111111] border border-white/5 p-8 rounded-[32px] flex items-center gap-6">
    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center">{icon}</div>
    <div>
      <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.2em] mb-1">{label}</p>
      <p className="text-3xl font-black text-white">{value}</p>
    </div>
  </div>
);

export default ProgresoPage;