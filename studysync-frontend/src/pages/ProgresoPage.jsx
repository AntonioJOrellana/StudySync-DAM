import React, { useRef, useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell } from 'recharts';
import { Flame, BookOpen, Clock, Star, FileDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const ProgresoPage = () => {
  const { user } = useAuth();
  const reportRef = useRef(null);
  const [progreso, setProgreso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (user?.id) {
      const userId = user.id.toString().includes(':') ? user.id.split(':')[0] : user.id;
      
      axios.get(`http://localhost:8080/api/sesiones/progreso/${userId}`)
        .then(res => {
          setProgreso(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Fallo al cargar progreso:", err);
          setLoading(false);
        });
    }
  }, [user]);

  const exportarPDF = async () => {
    if (!reportRef.current) return;
    try {
      setIsExporting(true);
      await new Promise(r => setTimeout(r, 500));
      const canvas = await html2canvas(reportRef.current, { backgroundColor: '#0a0a0a', scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF(canvas.width > canvas.height ? 'l' : 'p', 'px', [canvas.width, canvas.height]);
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`Reporte_Progreso.pdf`);
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

  if (loading) return <div style={styles.container} className="p-10 text-white">Cargando...</div>;
  
  // Si no hay datos, mostramos un mensaje pero mantenemos el estilo
  if (!progreso) return (
    <div style={styles.container} className="p-10 text-white">
      <h1>No se pudieron cargar los datos. Revisa la conexión con el servidor.</h1>
    </div>
  );

  return (
    <div style={styles.container} className="h-full overflow-y-auto custom-scrollbar">
      <div ref={reportRef} style={{ padding: '50px', maxWidth: '1300px', margin: '0 auto', backgroundColor: '#0a0a0a' }}>
        
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-2">Progreso</h1>
            <p style={styles.textMuted}>Panel de rendimiento de {user?.username}</p>
          </div>
          <button onClick={exportarPDF} disabled={isExporting} className="bg-white text-black px-7 py-3 rounded-2xl font-bold flex items-center gap-2">
            <FileDown size={20} /> {isExporting ? 'Exportando...' : 'Exportar Reporte'}
          </button>
        </div>

        <div className="grid grid-cols-4 gap-6 mb-12">
          <StatCard icon={<Flame color="#f97316" />} val={`${progreso.rachaDias} días`} label="Racha actual" />
          <StatCard icon={<BookOpen color="#3b82f6" />} val={progreso.totalConceptos} label="Conceptos" />
          <StatCard icon={<Clock color="#10b981" />} val={`${progreso.totalHorasEstudio} h`} label="Estudio total" />
          <StatCard icon={<Star color="#eab308" />} val={progreso.promedioCalificaciones} label="Promedio" />
        </div>

        <div className="grid grid-cols-12 gap-8 mb-12">
          <div className="col-span-8 p-10" style={styles.card}>
            <h3 className="text-lg font-bold mb-8">Actividad Semanal</h3>
            <div style={{ height: '350px', width: '100%' }}>
              <ResponsiveContainer width="99%" height="100%">
                <BarChart data={progreso.actividadSemanal}>
                  <XAxis dataKey="dia" axisLine={false} tickLine={false} tick={{fill: '#555', fontSize: 12}} dy={10} />
                  <Bar dataKey="horas" radius={[6, 6, 6, 6]} barSize={26}>
                    {progreso.actividadSemanal.map((entry, i) => (
                      <Cell key={i} fill={entry.horas > 5 ? '#6366f1' : '#252525'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="col-span-4 space-y-5">
            <GoalCard label="Constancia" current={`${progreso.rachaDias}/30`} percent={(progreso.rachaDias/30)*100} color="#eab308" />
            <GoalCard label="Flashcards" current={`${progreso.totalConceptos}/200`} percent={(progreso.totalConceptos/200)*100} color="#3b82f6" />
            <GoalCard label="Enfoque" current={`${progreso.totalHorasEstudio}/50h`} percent={(progreso.totalHorasEstudio/50)*100} color="#6366f1" />
          </div>
        </div>

        <h3 className="text-2xl font-bold mb-8">Progreso por Materia</h3>
        <div className="grid grid-cols-2 gap-6 pb-12">
          {progreso.progresoMaterias.map((asig, i) => (
            <div key={i} className="p-8" style={styles.card}>
              <div className="flex justify-between items-center mb-6">
                <span className="font-bold text-lg">{asig.nombre}</span>
                <span style={styles.textMuted}>{asig.horas.toFixed(1)}h</span>
              </div>
              <div style={{ height: '8px', backgroundColor: '#1a1a1a', borderRadius: '20px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${Math.min((asig.horas/10)*100, 100)}%`, backgroundColor: asig.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, val, label }) => (
  <div style={{ backgroundColor: '#111111', padding: '30px', borderRadius: '30px', border: '1px solid #222222' }}>
    <div className="mb-4">{icon}</div>
    <div className="text-3xl font-black mb-1">{val}</div>
    <div style={{ fontSize: '10px', color: '#555', fontWeight: '900', textTransform: 'uppercase' }}>{label}</div>
  </div>
);

const GoalCard = ({ label, current, percent, color }) => (
  <div style={{ backgroundColor: '#111111', padding: '25px', borderRadius: '25px', border: '1px solid #222222' }}>
    <div className="flex justify-between mb-4">
      <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#888' }}>{label}</span>
      <span style={{ fontSize: '11px', color: '#555' }}>{current}</span>
    </div>
    <div style={{ height: '6px', backgroundColor: '#1a1a1a', borderRadius: '10px' }}>
      <div style={{ height: '100%', width: `${percent}%`, backgroundColor: color }} />
    </div>
  </div>
);

export default ProgresoPage;