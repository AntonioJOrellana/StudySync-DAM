import React, { useState, useEffect } from 'react';
import { Search, Zap, Flame, BookOpen, Clock, ChevronRight, Sparkles } from 'lucide-react';
import { asignaturaService } from '../services/asignaturaService';
import { agendaService } from '../services/agendaService';

const Dashboard = ({ user }) => {
  const [asignaturas, setAsignaturas] = useState([]);
  const [eventos, setEventos] = useState([]);
  
  // Lógica del Cronómetro Pomodoro (Widget lateral)
  const [seconds, setSeconds] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((s) => s - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
      clearInterval(interval);
      alert("¡Tiempo de enfoque terminado!");
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const formatTime = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (user?.id) {
      asignaturaService.listarPorUsuario(user.id).then(res => setAsignaturas(res.data));
      agendaService.listarPorUsuario?.(user.id).then(res => setEventos(res.data));
    }
  }, [user]);

  const nombreAMostrar = user?.nombre || user?.username || "Estudiante";

  return (
    <div className="flex h-full bg-[#0A0A0A] text-white overflow-hidden">
      <div className="flex-1 p-10 overflow-y-auto custom-scrollbar">
        {/* Header y Saludo */}
        <header className="flex justify-between items-start mb-10">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              Hola, {nombreAMostrar}. ¿Qué vamos a dominar hoy?
            </h1>
            <p className="text-gray-500 text-sm mt-2 font-medium">
              {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-gray-600" size={18} />
            <input 
              type="text" 
              placeholder="Filtrar tus flashcards..." 
              className="bg-[#111111] border border-white/5 rounded-2xl py-3 pl-12 pr-6 text-sm w-80 focus:border-indigo-500/50 outline-none transition-all"
            />
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-6 mb-10">
          <StatCard icon={<Sparkles className="text-emerald-500" size={20}/>} value="75%" label="Semillas" />
          <StatCard icon={<Flame className="text-orange-500" size={20}/>} value="28" label="Días racha" />
          <StatCard icon={<BookOpen className="text-indigo-500" size={20}/>} value="142" label="Flashcards" />
          <StatCard icon={<Clock className="text-gray-500" size={20}/>} value="18.5h" label="Tiempo" />
        </div>

        {/* Banner de Examen */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-[32px] p-8 mb-10 flex justify-between items-center shadow-xl shadow-red-900/20">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70 mb-1">Próximo Examen</p>
            <h3 className="text-2xl font-bold text-white">Cálculo III - Parcial 2</h3>
          </div>
          <button className="bg-white text-red-600 px-8 py-3 rounded-2xl font-bold text-sm hover:scale-105 transition-transform">
            Preparar Ahora
          </button>
        </div>

        {/* Generador IA */}
        <section className="bg-[#111111] border border-white/5 rounded-[32px] p-10 mb-10">
          <div className="flex items-center gap-3 mb-8">
            <Sparkles className="text-yellow-500 fill-yellow-500" size={20} />
            <h3 className="text-lg font-bold">Generador de Flashcards IA</h3>
          </div>
          <div className="border-2 border-dashed border-white/5 rounded-3xl h-40 flex items-center justify-center text-gray-500 hover:border-indigo-500/20 hover:bg-white/[0.01] transition-all cursor-pointer group">
            <p className="font-medium group-hover:text-gray-300 transition-colors">Haz clic para subir tus apuntes (PDF, DOCX o Texto)</p>
          </div>
        </section>
      </div>

      {/* SIDEBAR DERECHO CORREGIDO */}
      <aside className="w-80 bg-[#0D0D0D] border-l border-white/5 p-10">
        <div className="bg-[#111111] border border-white/5 rounded-[40px] p-8 text-center mb-10 shadow-2xl">
          <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-4">Modo Focus</p>
          
          {/* Tiempo dinámico */}
          <div className={`text-5xl font-black mb-8 tabular-nums tracking-tighter transition-colors ${isActive ? 'text-indigo-500' : 'text-white'}`}>
            {formatTime(seconds)}
          </div>
          
          {/* Botón con texto "Iniciar" o "Pausar" */}
          <button 
            onClick={() => setIsActive(!isActive)}
            className={`w-full py-4 rounded-2xl font-bold text-sm transition-all active:scale-95 shadow-lg ${
              isActive 
              ? 'bg-white text-black' 
              : 'bg-indigo-600 text-white shadow-indigo-600/20'
            }`}
          >
            {isActive ? 'Pausar' : 'Iniciar'}
          </button>

          {/* Botón pequeño para resetear si está activo */}
          {seconds !== 25 * 60 && (
            <button 
              onClick={() => {setIsActive(false); setSeconds(25 * 60);}}
              className="mt-4 text-[10px] text-gray-600 font-bold uppercase hover:text-gray-400 transition-colors"
            >
              Reiniciar
            </button>
          )}
        </div>

        <h4 className="font-bold mb-6 text-gray-400 px-2 text-sm tracking-tight">Agenda de Hoy</h4>
        <div className="space-y-4">
          <AgendaItem title="Cálculo Integral" time="3:00 PM" color="bg-blue-500" />
          <AgendaItem title="Laboratorio Física" time="5:00 PM" color="bg-emerald-500" />
        </div>
      </aside>
    </div>
  );
};

const StatCard = ({ icon, value, label }) => (
  <div className="bg-[#111111] border border-white/5 p-6 rounded-[32px] hover:bg-white/[0.01] transition-colors">
    <div className="mb-4">{icon}</div>
    <div className="text-2xl font-black">{value}</div>
    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">{label}</div>
  </div>
);

const AgendaItem = ({ title, time, color }) => (
  <div className="bg-[#111111] border border-white/5 p-5 rounded-2xl flex items-center justify-between hover:border-white/10 transition-colors cursor-default">
    <div className="flex items-center gap-4">
      <div className={`w-1.5 h-6 rounded-full ${color}`} />
      <span className="text-sm font-bold text-gray-200">{title}</span>
    </div>
    <span className="text-[10px] font-bold text-gray-600">{time}</span>
  </div>
);

export default Dashboard;