import React, { useState } from 'react';
import { X, Upload, FileText, Video, Monitor, Link as LinkIcon, CheckCircle2 } from 'lucide-react';
import { recursoService } from '../services/recursoService';

const ModalNuevoRecurso = ({ isOpen, onClose, asignatura, onRecursoCreado }) => {
  const [tipo, setTipo] = useState('pdf');
  const [nombre, setNombre] = useState('');
  const [archivo, setArchivo] = useState(null);
  const [subiendo, setSubiendo] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!nombre.trim()) {
      alert("Introduce un nombre para el recurso.");
      return;
    }

    setSubiendo(true);
    
    const data = new FormData();
    data.append('nombre', nombre);
    data.append('tipo', tipo); 
    
    // CORRECCIÓN CLAVE: Usamos .id porque en tu Java el campo es 'private long id'
    data.append('idAsignatura', asignatura.id);
    
    if (archivo) {
      data.append('archivo', archivo);
    }

    try {
      await recursoService.subir(data);
      onRecursoCreado(); // Recarga la lista en la página principal
      onClose();         // Cierra el modal
      setNombre('');     // Limpia el formulario
      setArchivo(null);
    } catch (err) {
      console.error("Error en subida:", err);
      alert(err.message);
    } finally {
      setSubiendo(false);
    }
  };

  const tipos = [
    { id: 'pdf', icon: <FileText size={18} />, label: 'Documento PDF' },
    { id: 'video', icon: <Video size={18} />, label: 'Video / Clase' },
    { id: 'enlace', icon: <LinkIcon size={18} />, label: 'Enlace Web' },
    { id: 'otro', icon: <Monitor size={18} />, label: 'Otro' },
  ];

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0D0D0D] border border-white/10 w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl">
        
        <div className="p-8 border-b border-white/5 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Upload size={24} style={{ color: asignatura.color }} />
              Nuevo Recurso
            </h2>
            <p className="text-gray-500 text-sm mt-1">Añadir material a {asignatura.nombre}</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-500 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Selector de Tipo */}
          <div className="grid grid-cols-2 gap-3">
            {tipos.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTipo(t.id)}
                className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                  tipo === t.id 
                  ? 'bg-white/5 border-white/20 text-white shadow-lg' 
                  : 'bg-transparent border-white/5 text-gray-500 hover:border-white/10'
                }`}
                style={tipo === t.id ? { borderBottom: `2px solid ${asignatura.color}` } : {}}
              >
                <span style={{ color: tipo === t.id ? asignatura.color : 'inherit' }}>{t.icon}</span>
                <span className="text-xs font-bold uppercase tracking-wider">{t.id}</span>
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Nombre del Recurso</label>
            <input 
              required
              type="text" 
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Apuntes Tema 1"
              className="w-full bg-[#111] border border-white/5 rounded-2xl p-4 text-white focus:outline-none focus:border-white/20 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Archivo</label>
            <div className="relative group">
              <input 
                type="file" 
                onChange={(e) => setArchivo(e.target.files[0])}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="bg-[#111] border-2 border-dashed border-white/5 group-hover:border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center transition-all">
                <Upload size={20} className="mb-2 text-gray-500" />
                <p className="text-sm font-bold text-gray-400">
                  {archivo ? archivo.name : "Subir archivo o PDF"}
                </p>
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={subiendo}
            className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 transition-all ${
              subiendo ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'
            }`}
            style={{ backgroundColor: asignatura.color, color: 'white' }}
          >
            {subiendo ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <CheckCircle2 size={18} />
                Guardar Recurso
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModalNuevoRecurso;