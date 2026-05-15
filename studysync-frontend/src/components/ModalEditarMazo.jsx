import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';

const ModalEditarMazo = ({ isOpen, onClose, mazo, asignaturas, onMazoActualizado }) => {
  const [titulo, setTitulo] = useState('');
  const [asignaturaId, setAsignaturaId] = useState('');
  const [loading, setLoading] = useState(false);

  // Cargar datos cuando el mazo cambia o se abre el modal
  useEffect(() => {
    if (mazo) {
      setTitulo(mazo.titulo || '');
      setAsignaturaId(mazo.asignatura?.id || '');
    }
  }, [mazo, isOpen]);

  if (!isOpen || !mazo) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Ajusta la URL según tu backend de Spring Boot
      await axios.put(`http://localhost:8080/api/mazos/${mazo.id}`, {
        titulo: titulo,
        asignatura: { id: parseInt(asignaturaId) }
      });
      onMazoActualizado();
      onClose();
    } catch (err) {
      console.error("Error al actualizar mazo:", err);
      alert("No se pudo actualizar el mazo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-300">
      <div className="bg-[#0D0D0D] border border-white/10 w-full max-w-md rounded-[40px] p-8 sm:p-10 relative shadow-2xl">
        <button onClick={onClose} className="absolute top-8 right-8 text-gray-600 hover:text-white transition-colors">
          <X size={20}/>
        </button>
        
        <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-8">Editar Colección</h2>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-600 tracking-widest ml-1">Título</label>
            <input 
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required 
              placeholder="EJ: ESTRUCTURAS" 
              className="w-full bg-[#111111] border border-white/5 rounded-2xl p-4 text-sm text-white outline-none focus:border-indigo-500/50 transition-colors uppercase" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-600 tracking-widest ml-1">Materia</label>
            <select 
              value={asignaturaId}
              onChange={(e) => setAsignaturaId(e.target.value)}
              required 
              className="w-full bg-[#111111] border border-white/5 rounded-2xl p-4 text-xs text-white outline-none appearance-none"
            >
              <option value="" className="bg-[#111]">ELEGIR...</option>
              {asignaturas.map(a => (
                <option key={a.id} value={a.id} className="bg-[#111]">{a.nombre.toUpperCase()}</option>
              ))}
            </select>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 py-4 rounded-2xl font-black uppercase tracking-widest text-xs mt-4 transition-all active:scale-95 shadow-lg shadow-indigo-600/20 disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Confirmar Cambios'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModalEditarMazo;