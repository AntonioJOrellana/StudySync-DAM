import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, Layers, X, BookOpen, 
  Flame, ArrowLeft, BrainCircuit 
} from 'lucide-react';
import { mazoService } from '../services/mazoService';
import { asignaturaService } from '../services/asignaturaService';
import { flashcardService } from '../services/flashcardService';
import { useAuth } from '../context/AuthContext';

const FlashcardsPage = () => {
  const { user } = useAuth();
  const [mazos, setMazos] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [showModalCrear, setShowModalCrear] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [mazoSeleccionado, setMazoSeleccionado] = useState(null);

  const cargarDatos = async () => {
    if (!user?.id) return;
    try {
      const [resMazos, resAsig] = await Promise.all([
        mazoService.listarPorUsuario(user.id),
        asignaturaService.listarPorUsuario(user.id)
      ]);

      const listaMazos = resMazos.data || resMazos || [];
      const listaAsig = resAsig.data || resAsig || [];

      setMazos(listaMazos);
      setAsignaturas(listaAsig);
      
      // Si hay un mazo abierto, actualizamos su estado local para ver las nuevas tarjetas
      if (mazoSeleccionado) {
        const idActual = mazoSeleccionado.id || mazoSeleccionado.id_mazo;
        const actualizado = listaMazos.find(m => (m.id === idActual || m.id_mazo === idActual));
        if (actualizado) setMazoSeleccionado(actualizado);
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [user]);

  const mazosFiltrados = mazos.filter(m => 
    m.nombre?.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (mazoSeleccionado) {
    return (
      <MazoDetalleInterno 
        mazo={mazoSeleccionado} 
        onVolver={() => setMazoSeleccionado(null)} 
        onRefresh={cargarDatos}
      />
    );
  }

  return (
    <div className="h-full bg-[#0A0A0A] text-white p-10 overflow-y-auto custom-scrollbar animate-in fade-in duration-500">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight uppercase italic">Mis Mazos</h1>
          <p className="text-gray-500 text-sm mt-1">Gestiona tus colecciones de estudio</p>
        </div>
        <button 
          onClick={() => setShowModalCrear(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
        >
          <Plus size={18} /> Nuevo Mazo
        </button>
      </header>

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mazosFiltrados.length > 0 ? (
          mazosFiltrados.map((mazo) => (
            <MazoCard 
              key={mazo.id || mazo.id_mazo} 
              mazo={mazo} 
              onClick={() => setMazoSeleccionado(mazo)} 
            />
          ))
        ) : (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-[40px]">
            <Layers size={40} className="mx-auto text-gray-800 mb-4" />
            <p className="text-gray-500 italic">No se encontraron mazos aún.</p>
          </div>
        )}
      </div>

      {showModalCrear && (
        <ModalCrearMazo 
          asignaturas={asignaturas} 
          onClose={() => setShowModalCrear(false)} 
          onCreated={cargarDatos}
          userId={user.id}
        />
      )}
    </div>
  );
};

const MazoDetalleInterno = ({ mazo, onVolver, onRefresh }) => {
  const [showIAModal, setShowIAModal] = useState(false);
  const [recursoSeleccionado, setRecursoSeleccionado] = useState('');
  const [cargandoIA, setCargandoIA] = useState(false);
  const [recursosList, setRecursosList] = useState([]);

  useEffect(() => {
    const obtenerRecursos = async () => {
      const idAsig = mazo.asignatura?.id_asignatura || mazo.asignatura?.id;
      if (idAsig) {
        try {
          const res = await asignaturaService.obtenerPorId(idAsig);
          const data = res.data || res;
          setRecursosList(data.recursos || []);
        } catch (error) {
          console.error("Error al cargar recursos:", error);
        }
      }
    };
    obtenerRecursos();
  }, [mazo]);

  const handleGenerarIA = async () => {
    if (!recursoSeleccionado) return alert("Selecciona un recurso primero");
    
    setCargandoIA(true);
    try {
      const idMazo = mazo.id || mazo.id_mazo;
      // IMPORTANTE: Pasamos ambos IDs al servicio
      await flashcardService.generarConIA(idMazo, recursoSeleccionado); 
      await onRefresh(); // Recarga los datos globales y actualiza el mazo seleccionado
      setShowIAModal(false);
      setRecursoSeleccionado('');
      alert("¡Flashcards generadas con éxito!");
    } catch (error) {
      console.error(error);
      alert("Error al conectar con el servicio de IA");
    } finally {
      setCargandoIA(false);
    }
  };

  return (
    <div className="h-full bg-[#0A0A0A] text-white p-10 overflow-y-auto animate-in slide-in-from-right duration-500">
      <button onClick={onVolver} className="flex items-center gap-2 text-gray-500 hover:text-white mb-8 group transition-colors">
        <ArrowLeft size={18} />
        <span className="text-[10px] font-black uppercase tracking-widest">Volver</span>
      </button>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h2 className="text-5xl font-black italic uppercase tracking-tighter">{mazo.nombre}</h2>
          <p className="text-gray-500 mt-2 italic">{mazo.descripcion || 'Sin descripción'}</p>
        </div>
        <button 
          onClick={() => setShowIAModal(true)}
          className="flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-sm bg-white text-black hover:scale-105 transition-all shadow-xl shadow-white/5"
        >
          <Flame size={20} fill="currentColor" />
          Generar con IA
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mazo.flashcards?.length > 0 ? (
          mazo.flashcards.map((card, i) => (
            <div key={card.id || i} className="bg-[#111] border border-white/5 p-8 rounded-[32px] hover:border-white/20 transition-all">
              <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Pregunta</span>
              {/* CORREGIDO: card.anverso */}
              <h4 className="text-xl font-bold italic mt-2 mb-6">¿{card.anverso}?</h4>
              <div className="pt-6 border-t border-white/5 text-gray-400 text-sm">
                {/* CORREGIDO: card.reverso */}
                {card.reverso}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-[#111]/50 rounded-[40px] border border-white/5 border-dashed">
            <p className="text-gray-600 italic text-[10px] tracking-widest uppercase">Este mazo no tiene tarjetas aún</p>
          </div>
        )}
      </div>

      {showIAModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#0D0D0D] border border-white/10 w-full max-w-lg rounded-[40px] p-10 relative">
            <button onClick={() => setShowIAModal(false)} className="absolute top-8 right-8 text-gray-500 hover:text-white">
              <X size={24}/>
            </button>

            <div className="mb-8">
              <div className="w-12 h-12 bg-indigo-600/20 rounded-2xl flex items-center justify-center text-indigo-500 mb-6">
                <BrainCircuit size={28} />
              </div>
              <h3 className="text-3xl font-black italic uppercase tracking-tighter">Generar Flashcards</h3>
              <p className="text-gray-500 text-sm mt-2">Selecciona un recurso para que la IA lo analice.</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-3 ml-1">Recursos disponibles</label>
                <select 
                  value={recursoSeleccionado}
                  onChange={(e) => setRecursoSeleccionado(e.target.value)}
                  className="w-full bg-[#151515] border border-white/5 rounded-2xl p-5 outline-none text-white focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                >
                  <option value="">-- Selecciona un archivo --</option>
                  {recursosList.map(rec => (
                    <option key={rec.id} value={rec.id}>{rec.nombre}</option>
                  ))}
                </select>
                {recursosList.length === 0 && (
                  <p className="text-red-400 text-[10px] mt-2 italic">No se encontraron archivos en esta materia.</p>
                )}
              </div>

              <button 
                onClick={handleGenerarIA}
                disabled={cargandoIA || !recursoSeleccionado}
                className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 ${
                  cargandoIA || !recursoSeleccionado ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-500'
                }`}
              >
                {cargandoIA ? (
                  <> <BrainCircuit className="animate-spin" size={18} /> Procesando... </>
                ) : (
                  <> <Flame size={18} fill="currentColor" /> Generar Flashcards </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MazoCard = ({ mazo, onClick }) => {
  const color = mazo.asignatura?.color || '#6366f1';
  return (
    <div onClick={onClick} className="bg-[#111111] border border-white/5 rounded-[32px] p-8 hover:border-white/20 transition-all group cursor-pointer active:scale-95">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-8" style={{ backgroundColor: `${color}15`, color: color }}>
        <Layers size={24} />
      </div>
      <h3 className="text-xl font-bold mb-1 group-hover:text-white transition-colors truncate uppercase italic">{mazo.nombre}</h3>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-[11px] font-black uppercase tracking-wider text-gray-500">{mazo.asignatura?.nombre || 'General'}</span>
      </div>
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5">
        <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{mazo.flashcards?.length || 0} Tarjetas</span>
        <div className="p-2 bg-white/5 rounded-lg text-gray-400 group-hover:text-white">
          <BookOpen size={14} />
        </div>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in zoom-in duration-200">
      <div className="bg-[#0D0D0D] border border-white/10 w-full max-md rounded-[32px] p-10 relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white"><X size={20}/></button>
        <h2 className="text-2xl font-bold mb-6 italic uppercase tracking-tighter">Nuevo Mazo</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input required value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full bg-[#111111] border border-white/5 rounded-2xl p-4 outline-none text-white focus:border-indigo-500/50 transition-all" placeholder="Nombre (ej: Examen Final)" />
          <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} className="w-full bg-[#111111] border border-white/5 rounded-2xl p-4 outline-none text-white focus:border-indigo-500/50 h-24 resize-none transition-all" placeholder="Descripción breve..." />
          <select required value={asigId} onChange={(e) => setAsigId(e.target.value)} className="w-full bg-[#111111] border border-white/5 rounded-2xl p-4 outline-none text-white appearance-none cursor-pointer focus:border-indigo-500/50 transition-all">
            <option value="">Vincular a una asignatura...</option>
            {asignaturas.map(asig => (
              <option key={asig.id_asignatura || asig.id} value={asig.id_asignatura || asig.id}>{asig.nombre}</option>
            ))}
          </select>
          <button type="submit" className="w-full bg-indigo-600 py-4 rounded-2xl text-sm font-bold text-white hover:bg-indigo-500 transition-all">Confirmar Mazo</button>
        </form>
      </div>
    </div>
  );
};

export default FlashcardsPage;