import React, { useRef, useState, useEffect, useMemo } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell, Tooltip, YAxis, CartesianGrid } from 'recharts';
import { Flame, BookOpen, Clock, FileDown, Activity, Target } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const ProgresoPage = () => {
  const { user } = useAuth();
  const reportRef = useRef(null);
  const [datosGlobales, setDatosGlobales] = useState(null);
  const [asignaturas, setAsignaturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (user?.id) {
      const userId = user.id.toString().includes(':') ? user.id.split(':')[0] : user.id;
      
      const cargarInformacion = async () => {
        try {
          const [resStats, resAsig] = await Promise.all([
            axios.get(`http://localhost:8080/api/asignaturas/usuario/${userId}/estadisticas-globales`),
            axios.get(`http://localhost:8080/api/asignaturas/usuario/${userId}`)
          ]);
          setDatosGlobales(resStats.data);
          setAsignaturas(resAsig.data);
        } catch (err) {
          console.error("Error sincronizando métricas:", err);
        } finally {
          setLoading(false);
        }
      };

      cargarInformacion();
    }
  }, [user]);

  const actividadSemanalFinal = useMemo(() => {
    const diasLabels = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];
    const graficoMap = diasLabels.map(d => ({ dia: d, horas: 0 }));
    
    if (asignaturas.length === 0) return graficoMap;

    const hoy = new Date();
    const diaSemanaActual = hoy.getDay() === 0 ? 7 : hoy.getDay();
    const inicioSemana = new Date(hoy);
    inicioSemana.setDate(hoy.getDate() - (diaSemanaActual - 1));
    inicioSemana.setHours(0, 0, 0, 0);

    asignaturas.forEach(asig => {
      asig.sesiones?.forEach(sesion => {
        const fechaS = new Date(sesion.fechaInicio);
        if (fechaS >= inicioSemana) {
          const indice = fechaS.getDay() === 0 ? 6 : fechaS.getDay() - 1;
          graficoMap[indice].horas += (sesion.duracion / 60);
        }
      });
    });

    return graficoMap;
  }, [asignaturas]);

  const exportarPDF = async () => {
    if (!reportRef.current) return;
    try {
      setIsExporting(true);
      await new Promise(r => setTimeout(r, 600));
      
      const canvas = await html2canvas(reportRef.current, { 
        backgroundColor: '#0a0a0a', 
        scale: 2,
        useCORS: true,
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? 'l' : 'p',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`StudySync_Report_${user?.username || 'User'}.pdf`);
    } catch (e) {
      console.error("Error en exportación:", e);
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-full bg-[#0a0a0a] text-white gap-4">
      <Activity className="animate-spin text-indigo-500" size={40} />
      <p className="font-black italic uppercase tracking-widest text-xs">Sincronizando Core de Datos...</p>
    </div>
  );
  
  if (!datosGlobales) return (
    <div className="flex items-center justify-center h-full bg-[#0a0a0a] text-red-500 p-10">
      <h1 className="text-xl font-black italic uppercase tracking-tighter border-b-2 border-red-500 pb-2">Error: Offline Sync Failed</h1>
    </div>
  );

  return (
    <div className="h-full bg-[#0a0a0a] text-white overflow-y-auto no-scrollbar">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none !important; }
        .no-scrollbar { -ms-overflow-style: none !important; scrollbar-width: none !important; }
        * { -ms-overflow-style: none !important; scrollbar-width: none !important; }
        *::-webkit-scrollbar { display: none !important; }
      `}</style>

      <div ref={reportRef} className="p-6 sm:p-14 max-w-[1400px] mx-auto bg-[#0a0a0a]">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
          <div>
            <h1 className="text-7xl sm:text-8xl font-black italic uppercase tracking-tighter leading-none mb-4 animate-in slide-in-from-left duration-700">
              Progreso<span className="text-indigo-500">.</span>
            </h1>
            <p className="text-gray-500 font-bold tracking-[0.2em] uppercase text-xs sm:text-sm flex items-center gap-2">
              <span className="w-8 h-[2px] bg-indigo-500/30"></span>
              LOG DE RENDIMIENTO: <span className="text-white italic">{user?.username || 'Admin'}</span>
            </p>
          </div>
          
          <button 
            onClick={exportarPDF} 
            disabled={isExporting} 
            className={`px-8 py-5 rounded-2xl font-black uppercase text-xs flex items-center gap-3 transition-all active:scale-95 shadow-2xl ${
                isExporting ? 'bg-gray-800 text-gray-500' : 'bg-white text-black hover:bg-indigo-500 hover:text-white'
            }`}
          >
            <FileDown size={18} /> {isExporting ? 'Generando...' : 'Exportar Reporte'}
          </button>
        </header>

        {/* TOP STATS - 3 CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <StatCard icon={<Flame color="#f97316" fill="#f97316" size={26} />} val={`${datosGlobales.rachaDias}`} label="Días de Racha" sub="CONSISTENCIA" />
          <StatCard icon={<BookOpen color="#3b82f6" size={26} />} val={datosGlobales.totalFlashcards} label="Cards Totales" sub="CONOCIMIENTO" />
          <StatCard icon={<Clock color="#10b981" size={26} />} val={`${datosGlobales.totalHoras.toFixed(1)}h`} label="Tiempo de Estudio" sub="TIEMPO" />
        </div>

        {/* MAIN DATA SECTION */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 mb-16">
          <div className="xl:col-span-8 p-10 bg-[#111] rounded-[40px] border border-white/5 shadow-2xl">
            <div className="flex justify-between items-center mb-12">
                <h3 className="text-xl font-black italic uppercase tracking-wider">Actividad de Enfoque</h3>
                <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest italic">Horas por día</span>
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={actividadSemanalFinal}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1a1a1a" />
                  <XAxis 
                    dataKey="dia" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#444', fontSize: 11, fontWeight: '900'}} 
                    dy={20} 
                  />
                  <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.03)'}}
                    contentStyle={{backgroundColor: '#0a0a0a', border: '1px solid #222', borderRadius: '15px', fontSize: '12px'}}
                    itemStyle={{color: '#6366f1', fontWeight: 'bold'}}
                  />
                  <Bar dataKey="horas" radius={[8, 8, 8, 8]} barSize={45}>
                    {actividadSemanalFinal.map((entry, i) => (
                      <Cell 
                        key={i} 
                        fill={entry.horas > 0 ? '#6366f1' : '#1a1a1a'} 
                        fillOpacity={entry.horas > 0 ? 1 : 0.5}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="xl:col-span-4 space-y-6">
            <GoalCard 
                label="Disciplina Diaria" 
                current={`${datosGlobales.rachaDias}/7`} 
                percent={(datosGlobales.rachaDias/7)*100} 
                color="#eab308" 
                desc="Días activos esta semana"
            />
            <GoalCard 
                label="Objetivo de Datos" 
                current={`${datosGlobales.totalFlashcards}/200`} 
                percent={(datosGlobales.totalFlashcards/200)*100} 
                color="#3b82f6" 
                desc="Flashcards creadas vs meta"
            />
            <GoalCard 
                label="Meta de Retención" 
                current={`${datosGlobales.totalHoras.toFixed(1)}/50h`} 
                percent={(datosGlobales.totalHoras/50)*100} 
                color="#6366f1" 
                desc="Horas totales de focus"
            />
          </div>
        </div>

        {/* MATERIA BREAKDOWN */}
        <section className="mb-20">
            <h3 className="text-2xl font-black italic uppercase tracking-wider mb-10">Desglose por Asignatura</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {asignaturas.map((asig, i) => {
                const horasMateria = (asig.sesiones?.reduce((acc, s) => acc + s.duracion, 0) / 60) || 0;
                const mColor = asig.color || '#6366f1';
                return (
                <div key={i} className="p-10 bg-[#111] rounded-[32px] border border-white/5 hover:border-white/10 transition-all group">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h4 className="font-black italic uppercase text-xl tracking-tight group-hover:text-indigo-400 transition-colors">{asig.nombre}</h4>
                        </div>
                        <span className="text-xl font-black italic">{horasMateria.toFixed(1)}<span className="text-xs text-gray-600 ml-1">H</span></span>
                    </div>
                    <div className="h-2 bg-black rounded-full overflow-hidden">
                    <div 
                        className="h-full transition-all duration-1000 ease-in-out shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                        style={{ 
                        width: `${Math.min((horasMateria/15)*100, 100)}%`, 
                        backgroundColor: mColor,
                        boxShadow: `0 0 20px ${mColor}30`
                        }} 
                    />
                    </div>
                </div>
                );
            })}
            </div>
        </section>
      </div>
    </div>
  );
};

const StatCard = ({ icon, val, label, sub }) => (
  <div className="bg-[#111] p-10 rounded-[35px] border border-white/5 hover:bg-white/[0.01] transition-all group shadow-2xl relative overflow-hidden">
    <div className="absolute -right-4 -top-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
        {React.cloneElement(icon, { size: 100 })}
    </div>
    <div className="mb-8">{icon}</div>
    <div className="text-5xl font-black italic tracking-tighter mb-2 leading-none">{val}</div>
    <div>
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90">{label}</div>
        <div className="text-[8px] font-bold uppercase tracking-[0.1em] text-gray-600 mt-1">{sub}</div>
    </div>
  </div>
);

const GoalCard = ({ label, current, percent, color, desc }) => (
  <div className="bg-[#111] p-8 rounded-[32px] border border-white/5 shadow-xl">
    <div className="flex justify-between items-start mb-6">
      <div>
        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">{label}</span>
        <p className="text-[9px] text-gray-600 italic font-bold uppercase tracking-tight">{desc}</p>
      </div>
      <span className="text-xs font-black italic bg-white/5 px-3 py-1 rounded-full">{current}</span>
    </div>
    <div className="h-2 bg-black rounded-full overflow-hidden">
      <div 
        className="h-full transition-all duration-[1.5s] ease-out"
        style={{ width: `${Math.min(percent, 100)}%`, backgroundColor: color, boxShadow: `0 0 15px ${color}40` }} 
      />
    </div>
  </div>
);

export default ProgresoPage;