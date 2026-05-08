import React, { useRef, useState, useEffect, useMemo } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { Flame, BookOpen, Clock, Star, FileDown } from 'lucide-react';
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
      // Limpiamos el ID por si viene con prefijos de Firebase/Auth0
      const userId = user.id.toString().includes(':') ? user.id.split(':')[0] : user.id;
      
      const cargarInformacion = async () => {
        try {
          // 1. Estadísticas Globales (Racha, Flashcards Totales, Horas Totales)
          const resStats = await axios.get(`http://localhost:8080/api/asignaturas/usuario/${userId}/estadisticas-globales`);
          setDatosGlobales(resStats.data);

          // 2. Detalle de Asignaturas (para Gráfico y Progreso por Materia)
          const resAsig = await axios.get(`http://localhost:8080/api/asignaturas/usuario/${userId}`);
          setAsignaturas(resAsig.data);
        } catch (err) {
          console.error("Error al cargar el panel de progreso:", err);
        } finally {
          setLoading(false);
        }
      };

      cargarInformacion();
    }
  }, [user]);

  // Lógica para generar el gráfico de Lunes a Domingo (rellenando días vacíos)
  const actividadSemanalFinal = useMemo(() => {
    const diasLabels = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
    const graficoMap = diasLabels.map(d => ({ dia: d, horas: 0 }));
    
    if (asignaturas.length === 0) return graficoMap;

    const hoy = new Date();
    const diaSemanaActual = hoy.getDay() === 0 ? 7 : hoy.getDay();
    const inicioSemana = new Date(hoy);
    inicioSemana.setDate(hoy.getDate() - (diaSemanaActual - 1));
    inicioSemana.setHours(0, 0, 0, 0);

    // Recorremos todas las sesiones de todas las materias
    asignaturas.forEach(asig => {
      asig.sesiones?.forEach(sesion => {
        const fechaS = new Date(sesion.fechaInicio);
        if (fechaS >= inicioSemana) {
          const indice = fechaS.getDay() === 0 ? 6 : fechaS.getDay() - 1;
          graficoMap[indice].horas += (sesion.duracion / 60); // Convertimos min a horas para el gráfico
        }
      });
    });

    return graficoMap;
  }, [asignaturas]);

  const exportarPDF = async () => {
    if (!reportRef.current) return;
    try {
      setIsExporting(true);
      await new Promise(r => setTimeout(r, 500));
      const canvas = await html2canvas(reportRef.current, { backgroundColor: '#0a0a0a', scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF(canvas.width > canvas.height ? 'l' : 'p', 'px', [canvas.width, canvas.height]);
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`Reporte_Progreso_${user?.username}.pdf`);
    } catch (e) {
      console.error(e);
    } finally {
      setIsExporting(false);
    }
  };

  const styles = {
    container: { backgroundColor: '#0a0a0a', color: '#ffffff', minHeight: '100vh' },
    card: { backgroundColor: '#111111', borderRadius: '28px', border: '1px solid #222222' },
    textMuted: { color: '#777777', fontWeight: '500' }
  };

  if (loading) return <div style={styles.container} className="p-10 text-white italic">Calculando métricas de rendimiento...</div>;
  
  if (!datosGlobales) return (
    <div style={styles.container} className="p-10 text-white">
      <h1 className="text-xl italic text-red-500">No se pudieron sincronizar los datos con el servidor.</h1>
    </div>
  );

  return (
    <div style={styles.container} className="h-full overflow-y-auto custom-scrollbar">
      <div ref={reportRef} style={{ padding: '50px', maxWidth: '1300px', margin: '0 auto', backgroundColor: '#0a0a0a' }}>
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-5xl font-black italic uppercase tracking-tighter mb-2">Progreso</h1>
            <p style={styles.textMuted}>Panel de rendimiento de {user?.username || 'Usuario'}</p>
          </div>
          <button 
            onClick={exportarPDF} 
            disabled={isExporting} 
            className="bg-white text-black px-7 py-4 rounded-[20px] font-black uppercase text-xs flex items-center gap-3 hover:scale-105 transition-transform"
          >
            <FileDown size={18} /> {isExporting ? 'Procesando...' : 'Exportar Reporte'}
          </button>
        </div>

        {/* STATS SUPERIORES REALES */}
        <div className="grid grid-cols-4 gap-6 mb-12">
          <StatCard icon={<Flame color="#f97316" fill="#f97316" size={24} />} val={`${datosGlobales.rachaDias} días`} label="Racha actual" />
          <StatCard icon={<BookOpen color="#3b82f6" size={24} />} val={datosGlobales.totalFlashcards} label="Conceptos Totales" />
          <StatCard icon={<Clock color="#10b981" size={24} />} val={`${datosGlobales.totalHoras.toFixed(1)} h`} label="Estudio total" />
          <StatCard icon={<Star color="#eab308" fill="#eab308" size={24} />} val="8.7" label="Promedio" />
        </div>

        {/* ACTIVIDAD SEMANAL Y METAS */}
        <div className="grid grid-cols-12 gap-8 mb-12">
          <div className="col-span-8 p-10" style={styles.card}>
            <h3 className="text-lg font-black italic uppercase tracking-widest mb-10">Actividad Semanal (Horas)</h3>
            <div style={{ height: '300px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={actividadSemanalFinal}>
                  <XAxis 
                    dataKey="dia" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#555', fontSize: 14, fontWeight: 'bold'}} 
                    dy={15} 
                  />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{backgroundColor: '#111', border: '1px solid #333', borderRadius: '10px'}}
                  />
                  <Bar dataKey="horas" radius={[10, 10, 10, 10]} barSize={35}>
                    {actividadSemanalFinal.map((entry, i) => (
                      <Cell 
                        key={i} 
                        fill={entry.horas > 0 ? '#6366f1' : '#1a1a1a'} 
                        className="transition-all duration-500"
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* GOAL CARDS */}
          <div className="col-span-4 space-y-5">
            <GoalCard 
                label="Constancia Semanal" 
                current={`${datosGlobales.rachaDias}/7`} 
                percent={(datosGlobales.rachaDias/7)*100} 
                color="#eab308" 
            />
            <GoalCard 
                label="Objetivo Flashcards" 
                current={`${datosGlobales.totalFlashcards}/200`} 
                percent={(datosGlobales.totalFlashcards/200)*100} 
                color="#3b82f6" 
            />
            <GoalCard 
                label="Meta de Enfoque" 
                current={`${datosGlobales.totalHoras.toFixed(1)}/50h`} 
                percent={(datosGlobales.totalHoras/50)*100} 
                color="#6366f1" 
            />
          </div>
        </div>

        {/* PROGRESO POR MATERIA REAL */}
        <h3 className="text-2xl font-black italic uppercase tracking-wider mb-8">Progreso por Materia</h3>
        <div className="grid grid-cols-2 gap-6 pb-12">
          {asignaturas.map((asig, i) => {
            const horasMateria = (asig.sesiones?.reduce((acc, s) => acc + s.duracion, 0) / 60) || 0;
            return (
              <div key={i} className="p-8" style={styles.card}>
                <div className="flex justify-between items-center mb-6">
                  <span className="font-black italic uppercase text-sm tracking-tight">{asig.nombre}</span>
                  <span style={styles.textMuted} className="text-xs font-bold">{horasMateria.toFixed(1)}h</span>
                </div>
                <div style={{ height: '6px', backgroundColor: '#050505', borderRadius: '20px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      height: '100%', 
                      width: `${Math.min((horasMateria/10)*100, 100)}%`, 
                      backgroundColor: asig.color || '#6366f1',
                      boxShadow: `0 0 15px ${asig.color}40`
                    }} 
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// COMPONENTES AUXILIARES
const StatCard = ({ icon, val, label }) => (
  <div style={{ backgroundColor: '#111', padding: '35px', borderRadius: '32px', border: '1px solid #222' }} className="group hover:border-white/10 transition-colors">
    <div className="mb-6">{icon}</div>
    <div className="text-4xl font-black italic tracking-tighter mb-1">{val}</div>
    <div style={{ fontSize: '10px', color: '#555', fontWeight: '900', textTransform: 'uppercase', tracking: '0.1em' }}>{label}</div>
  </div>
);

const GoalCard = ({ label, current, percent, color }) => (
  <div style={{ backgroundColor: '#111', padding: '28px', borderRadius: '28px', border: '1px solid #222' }}>
    <div className="flex justify-between mb-4">
      <span style={{ fontSize: '10px', fontWeight: '900', color: '#555', textTransform: 'uppercase' }}>{label}</span>
      <span style={{ fontSize: '11px', color: '#fff', fontWeight: 'bold' }}>{current}</span>
    </div>
    <div style={{ height: '8px', backgroundColor: '#050505', borderRadius: '10px', overflow: 'hidden' }}>
      <div 
        className="transition-all duration-1000"
        style={{ height: '100%', width: `${Math.min(percent, 100)}%`, backgroundColor: color }} 
      />
    </div>
  </div>
);

export default ProgresoPage;