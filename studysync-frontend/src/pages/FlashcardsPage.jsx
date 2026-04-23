import React, { useState, useEffect } from 'react';
import { Search, Plus, Layers, X, BookOpen } from 'lucide-react';
import { mazoService } from '../services/mazoService';
import { asignaturaService } from '../services/asignaturaService';
import { useAuth } from '../context/AuthContext';

const FlashcardsPage = () => {
  const { user } = useAuth();
  const [mazos, setMazos] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  const cargarDatos = async () => {
    if (!user?.id) return;
    try {
      const [resMazos, resAsig] = await Promise.all([
        mazoService.listarPorUsuario(user.id),
        asignaturaService.listarPorUsuario(user.id)
      ]);
      setMazos(resMazos.data || []);
      setAsignaturas(resAsig.data || []);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [user]);

  // Lógica de búsqueda recuperada
  const mazosFiltrados = mazos.filter(m => 
    m.nombre?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="h-full bg-[#0A0A0A] text-white p-10 overflow-y-auto custom-scrollbar">
      {/* Header Original */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mis Mazos</h1>
          <p className="text-gray-500 text-sm mt-1">Organiza tus tarjetas por materias</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
        >
          <Plus size={18} /> Nuevo Mazo
        </button>
      </header>

      {/* BARRA DE BÚSQUEDA RECUPERADA */}
      <div className="relative mb-10">
        <Search className="absolute left-4 top-3.5 text-gray-600" size={18} />
        <input 
          type="text" 
          placeholder="Buscar mazo..." 
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="bg-[#111111] border border-white/5 rounded-2xl py-3.5 pl-12 pr-6 text-sm w-full outline-none focus:border-indigo-500/50 transition-all"
        />
      </div>

      {/* Grid de Mazos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mazosFiltrados.length > 0 ? (
          mazosFiltrados.map((mazo) => (
            <MazoCard key={mazo.id} mazo={mazo} />
          ))
        ) : (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-[40px]">
            <Layers size={40} className="mx-auto text-gray-800 mb-4" />
            <p className="text-gray-500">No se encontraron mazos.</p>
          </div>
        )}
      </div>

      {showModal && (
        <ModalCrearMazo 
          asignaturas={asignaturas} 
          onClose={() => setShowModal(false)} 
          onCreated={cargarDatos}
          userId={user.id}
        />
      )}
    </div>
  );
};

const MazoCard = ({ mazo }) => {
  // Ahora el nombre de la asignatura funciona gracias al cambio en el modelo Java
  const color = mazo.asignatura?.color || '#6366f1';
  const nombreMateria = mazo.asignatura?.nombre || 'General';

  return (
    <div className="bg-[#111111] border border-white/5 rounded-[32px] p-8 hover:border-white/10 transition-all group cursor-pointer relative overflow-hidden">
      <div 
        className="w-12 h-12 rounded-2xl flex items-center justify-center mb-8"
        style={{ backgroundColor: `${color}15`, color: color }}
      >
        <Layers size={24} />
      </div>

      <h3 className="text-xl font-bold mb-1 group-hover:text-indigo-400 transition-colors truncate">
        {mazo.nombre}
      </h3>

      <div className="flex items-center gap-2 mb-4">
        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-[11px] font-black uppercase tracking-wider text-gray-400">
          {nombreMateria}
        </span>
      </div>

      {mazo.descripcion && (
        <p className="text-gray-500 text-xs line-clamp-2 mb-6 h-8 italic">
          "{mazo.descripcion}"
        </p>
      )}

      <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5">
        <span className="text-[10px] text-gray-600 font-bold uppercase">
          {mazo.flashcards?.length || 0} Tarjetas
        </span>
        <BookOpen size={14} className="text-gray-700" />
      </div>
    </div>
  );
};

const ModalCrearMazo = ({ asignaturas, onClose, onCreated, userId }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [asigId, setAsigId] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!asigId) return alert("Selecciona una materia");

    try {
      await mazoService.crear({
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        usuario: { id: userId },
        asignatura: { id_asignatura: parseInt(asigId) }
      });
      onCreated();
      onClose();
    } catch (error) {
      alert("Error al guardar el mazo");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0D0D0D] border border-white/10 w-full max-w-md rounded-[32px] p-10 relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white"><X size={20}/></button>
        <h2 className="text-2xl font-bold mb-6">Crear Mazo</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-[10px] font-black uppercase text-gray-500 ml-1 tracking-widest">Nombre</label>
            <input 
              required value={nombre} onChange={(e) => setNombre(e.target.value)}
              className="w-full bg-[#111111] border border-white/5 rounded-2xl p-4 mt-2 outline-none text-white focus:border-indigo-500/50"
              placeholder="Ej: Examen Final"
            />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase text-gray-500 ml-1 tracking-widest">Descripción</label>
            <textarea 
              value={descripcion} onChange={(e) => setDescripcion(e.target.value)}
              className="w-full bg-[#111111] border border-white/5 rounded-2xl p-4 mt-2 outline-none text-white focus:border-indigo-500/50 h-24 resize-none"
              placeholder="¿De qué trata este mazo?"
            />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase text-gray-500 ml-1 tracking-widest">Asignatura</label>
            <select 
              required value={asigId} onChange={(e) => setAsigId(e.target.value)}
              className="w-full bg-[#111111] border border-white/5 rounded-2xl p-4 mt-2 outline-none text-white focus:border-indigo-500/50 appearance-none cursor-pointer"
            >
              <option value="">Selecciona materia...</option>
              {asignaturas.map(asig => (
                <option key={asig.id_asignatura || asig.id} value={asig.id_asignatura || asig.id}>
                  {asig.nombre}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="w-full bg-indigo-600 py-4 rounded-2xl text-sm font-bold text-white hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20">
            Confirmar Mazo
          </button>
        </form>
      </div>
    </div>
  );
};

export default FlashcardsPage;