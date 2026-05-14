import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { asignaturaService } from '../services/asignaturaService';

const ModalEditarAsignatura = ({ isOpen, onClose, asignatura, onAsignaturaActualizada }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    profesor: '',
    descripcion: '',
    color: '#6366F1'
  });
  const [cargando, setCargando] = useState(false);

  // Cargar los datos de la asignatura cuando se abre el modal
  useEffect(() => {
    if (asignatura && isOpen) {
      setFormData({
        nombre: asignatura.nombre || '',
        profesor: asignatura.profesor || '',
        descripcion: asignatura.descripcion || '',
        color: asignatura.color || '#6366F1'
      });
    }
  }, [asignatura, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    try {
      const idAsig = asignatura.id_asignatura || asignatura.id;
      const response = await asignaturaService.actualizar(idAsig, formData);
      
      // Notificar al padre que los datos han cambiado
      if (onAsignaturaActualizada) {
        onAsignaturaActualizada(response.data || response);
      }
      
      onClose();
    } catch (error) {
      console.error("Error al actualizar la asignatura:", error);
      alert("No se pudo actualizar la asignatura");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#111] w-full max-w-lg rounded-[40px] border border-white/5 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 sm:p-12">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">
              Editar Materia
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* NOMBRE */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 ml-1">
                Nombre
              </label>
              <input
                type="text"
                required
                className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-gray-800"
                placeholder="Ej: Programación Avanzada"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              />
            </div>

            {/* PROFESOR */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 ml-1">
                Profesor
              </label>
              <input
                type="text"
                className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-gray-800"
                placeholder="Nombre del docente"
                value={formData.profesor}
                onChange={(e) => setFormData({ ...formData, profesor: e.target.value })}
              />
            </div>

            {/* DESCRIPCIÓN */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 ml-1">
                Descripción
              </label>
              <textarea
                rows="4"
                className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-gray-800 resize-none"
                placeholder="Breve descripción..."
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              />
            </div>

            {/* COLOR */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 ml-1">
                Identificador Visual (Color)
              </label>
              <div className="flex gap-4 items-center bg-black/40 border border-white/5 rounded-2xl p-4">
                <input
                  type="color"
                  className="w-12 h-10 rounded-lg bg-transparent border-none cursor-pointer"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                />
                <span className="text-gray-400 font-mono text-sm uppercase">{formData.color}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={cargando}
              className="w-full py-5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase text-xs tracking-[0.2em] transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-indigo-500/20"
            >
              {cargando ? 'Actualizando...' : 'Guardar Cambios'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalEditarAsignatura;