import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, Layers, X, BookOpen, 
  Flame, ArrowLeft, Play, Check, AlertCircle 
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import { mazoService } from '../services/mazoService';
import { asignaturaService } from '../services/asignaturaService';
import { flashcardService } from '../services/flashcardService';
import { useAuth } from '../context/AuthContext';
import FlashcardStudy from '../components/FlashcardStudy';

const FlashcardsPage = () => {
  const { user } = useAuth();
  const { idMazo } = useParams();
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
      
      const idABuscar = idMazo || (mazoSeleccionado?.id || mazoSeleccionado?.id_mazo);
      
      if (idABuscar) {
        const encontrado = listaMazos.find(m => 
          String(m.id) === String(idABuscar) || String(m.id_mazo) === String(idABuscar)
        );
        if (encontrado) setMazoSeleccionado(encontrado);
      }
    } catch (error) { console.error("Error al cargar datos:", error); }
  };

  useEffect(() => { 
    cargarDatos(); 
  }, [user, idMazo]);

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
    <div className="h-full bg-[#0A0A0A] text-white p-6 sm:p-10 overflow-y-auto animate-in fade-in duration-500 no-scrollbar">
      {/* Inyección de estilos para ocultar scrollbars */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none !important; }
        .no-scrollbar { -ms-overflow-style: none !important; scrollbar-width: none !important; }
        * { -ms-overflow-style: none !important; scrollbar-width: none !important; }
        *::-webkit-scrollbar { display: none !important; }
      `}</style>

      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter uppercase italic leading-none">Mis Mazos</h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-3 font-medium tracking-wide">DOMINA TUS CONOCIMIENTOS</p>
        </div>
        <button onClick={() => setShowModalCrear(true)} className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
          <Plus size={18} strokeWidth={3} /> Nuevo Mazo
        </button>
      </header>

      <div className="relative mb-12">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
        <input 
          type="text" placeholder="BUSCAR COLECCIÓN..." value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="bg-[#111111] border border-white/5 rounded-[20px] sm:rounded-[24px] py-5 sm:py-6 pl-16 pr-8 text-sm w-full outline-none focus:border-indigo-500/50 transition-all placeholder:text-gray-700 font-bold tracking-widest uppercase"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {mazos.filter(m => m.nombre?.toLowerCase().includes(busqueda.toLowerCase())).map((mazo) => (
          <MazoCard key={mazo.id || mazo.id_mazo} mazo={mazo} onClick={() => setMazoSeleccionado(mazo)} />
        ))}
      </div>

      {showModalCrear && (
        <ModalCrearMazo asignaturas={asignaturas} onClose={() => setShowModalCrear(false)} onCreated={cargarDatos} userId={user.id} />
      )}
    </div>
  );
};

const MazoDetalleInterno = ({ mazo, onVolver, onRefresh }) => {
  const [showIAModal, setShowIAModal] = useState(false);
  const [recursosList, setRecursosList] = useState([]);
  const [modoEstudio, setModoEstudio] = useState(false);
  const [recursoSeleccionado, setRecursoSeleccionado] = useState("");
  
  const mazoId = mazo.id || mazo.id_mazo;
  const [fallidas, setFallidas] = useState(() => {
    const saved = localStorage.getItem(`fallidas_mazo_${mazoId}`);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [pendientes, setPendientes] = useState([]);
  const [cargandoIA, setCargandoIA] = useState(false);

  const hideScrollStyle = {
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
    WebkitScrollbar: { display: 'none' }
  };

  useEffect(() => {
    localStorage.setItem(`fallidas_mazo_${mazoId}`, JSON.stringify(fallidas));
  }, [fallidas, mazoId]);

  useEffect(() => {
    const idAsig = mazo.asignatura?.id || mazo.asignatura?.id_asignatura;
    if (idAsig) {
      asignaturaService.obtenerPorId(idAsig).then(res => {
        const data = res.data || res;
        setRecursosList(data.recursos || []);
      });
    }
  }, [mazo]);

  const iniciarRepaso = async () => {
    try {
      const res = await flashcardService.getPendientes(mazoId);
      if (res.length === 0 && fallidas.length === 0) {
        alert("¡Todo al día!");
      } else { 
        setPendientes(res); 
        setModoEstudio(true); 
      }
    } catch (e) { alert("Error al conectar"); }
  };

  const handleResultadoRepaso = async (id, acierto) => {
    try {
      await flashcardService.registrarRepaso(id, acierto);
      if (acierto) {
        setPendientes(prev => prev.filter(c => (c.id_flashcard || c.id) !== id));
        setFallidas(prev => prev.filter(c => (c.id_flashcard || c.id) !== id));
      } else {
        const tarjeta = pendientes.find(c => (c.id_flashcard || c.id) === id) || 
                        fallidas.find(c => (c.id_flashcard || c.id) === id);
        if (tarjeta) {
          setPendientes(prev => prev.filter(c => (c.id_flashcard || c.id) !== id));
          setFallidas(prev => {
            const existe = prev.find(c => (c.id_flashcard || c.id) === id);
            if (existe) return prev;
            return [...prev, tarjeta];
          });
        }
      }
      onRefresh();
    } catch (error) { console.error(error); }
  };

  const manejarGeneracionIA = async () => {
    if(!recursoSeleccionado) {
      alert("Por favor, selecciona un recurso antes de continuar");
      return;
    }
    setCargandoIA(true);
    try {
      await flashcardService.generarConIA(mazoId, recursoSeleccionado);
      await onRefresh(); 
      setShowIAModal(false);
      setRecursoSeleccionado("");
    } catch (e) { 
      alert("Error al generar las tarjetas con IA"); 
    } finally { 
      setCargandoIA(false); 
    }
  };

  if (modoEstudio) {
    const tarjetaActual = pendientes.length > 0 ? pendientes[0] : fallidas[0];
    return (
      <div className="h-full flex flex-col items-center justify-center bg-[#0A0A0A] p-6 sm:p-10 relative no-scrollbar">
        <button onClick={() => setModoEstudio(false)} className="absolute top-6 left-6 sm:top-10 sm:left-10 flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-white/5 hover:bg-red-500/10 rounded-xl sm:rounded-2xl border border-white/10 transition-all text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-red-500 z-10">
          <X size={14} /> Detener
        </button>
        {tarjetaActual ? (
          <div className="w-full max-w-2xl text-center">
            <div className="flex justify-center gap-2 sm:gap-4 mb-8 sm:mb-12 mt-12 sm:mt-0">
              <div className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                <span className="text-indigo-400 text-[9px] sm:text-[10px] font-black uppercase italic">Pendientes: {pendientes.length}</span>
              </div>
              {fallidas.length > 0 && (
                <div className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full animate-pulse">
                  <span className="text-red-400 text-[9px] sm:text-[10px] font-black uppercase italic">Refuerzo: {fallidas.length}</span>
                </div>
              )}
            </div>
            <FlashcardStudy card={tarjetaActual} onResult={handleResultadoRepaso} />
          </div>
        ) : (
          <div className="text-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-green-500/10 text-green-500 rounded-[28px] sm:rounded-[32px] flex items-center justify-center mx-auto mb-8 border border-green-500/20">
              <Check size={36} strokeWidth={3} />
            </div>
            <h2 className="text-3xl sm:text-5xl font-black italic uppercase tracking-tighter">SESIÓN COMPLETADA</h2>
            <button onClick={() => setModoEstudio(false)} className="mt-10 sm:mt-12 bg-white text-black px-10 py-4 sm:px-12 sm:py-5 rounded-[20px] sm:rounded-[24px] font-black uppercase text-xs tracking-widest hover:invert transition-all active:scale-95">
              Volver al Mazo
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="h-full bg-[#0A0A0A] text-white p-6 sm:p-10 overflow-y-auto animate-in slide-in-from-right duration-500 no-scrollbar" style={hideScrollStyle}>
      <button onClick={onVolver} className="flex items-center gap-3 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-[15px] mb-10 transition-all group">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 group-hover:text-white">Volver</span>
      </button>

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 sm:mb-20">
        <div className="max-w-3xl">
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black italic uppercase tracking-tighter leading-[0.9] mb-6">{mazo.nombre}</h2>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
             <span className="px-3 py-1 bg-indigo-600/10 border border-indigo-600/20 text-indigo-400 text-[9px] font-black uppercase rounded tracking-widest">
               {mazo.asignatura?.nombre || 'General'}
             </span>
             <p className="text-gray-600 italic text-base sm:text-lg font-medium">{mazo.descripcion || 'Sin descripción'}</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button onClick={iniciarRepaso} className="flex items-center justify-center gap-4 px-8 py-4 sm:px-10 sm:py-5 rounded-[20px] sm:rounded-[24px] font-black text-xs uppercase tracking-widest bg-indigo-600 text-white hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-600/40 active:scale-95">
            <Play size={16} fill="currentColor" /> Comenzar
          </button>
          <button onClick={() => setShowIAModal(true)} className="flex items-center justify-center gap-4 px-8 py-4 sm:px-10 sm:py-5 rounded-[20px] sm:rounded-[24px] font-black text-xs uppercase tracking-widest bg-white text-black hover:bg-gray-200 transition-all active:scale-95">
            <Flame size={16} fill="currentColor" /> Generar IA
          </button>
        </div>
      </div>

      {fallidas.length > 0 && (
        <div className="mb-16 sm:mb-20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-500/10 rounded-xl text-red-500 border border-red-500/10"><AlertCircle size={20} /></div>
              <h3 className="text-xl sm:text-2xl font-black uppercase italic tracking-tighter">ZONA DE REFUERZO <span className="text-red-500/50">({fallidas.length})</span></h3>
            </div>
            <button onClick={() => setFallidas([])} className="text-left sm:text-right text-[9px] font-black text-gray-700 hover:text-red-500 uppercase tracking-widest transition-colors">Limpiar historial</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fallidas.map((f, idx) => (
              <div key={idx} className="bg-gradient-to-br from-red-500/[0.03] to-transparent border border-red-500/10 p-6 sm:p-8 rounded-[24px] sm:rounded-[32px] group hover:border-red-500/30 transition-all">
                <p className="text-base sm:text-lg font-bold italic text-white/90 leading-tight mb-4">¿{f.anverso}?</p>
                <div className="pt-4 border-t border-red-500/5 text-gray-500 text-sm italic">{f.reverso}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-700 mb-10 flex items-center gap-4 sm:gap-8">
        LISTADO <div className="h-[1px] flex-1 bg-white/5"></div>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 pb-32">
        {(mazo.flashcards || []).map((card, i) => (
          <div key={card.id_flashcard || card.id || i} className="bg-[#111] border border-white/5 p-8 sm:p-10 rounded-[30px] sm:rounded-[40px] group hover:border-indigo-500/30 transition-all duration-500">
            <div className="flex justify-between items-start mb-6">
              <span className="text-[9px] font-black text-indigo-500/30 uppercase tracking-[0.2em] group-hover:text-indigo-500 transition-colors">ID#{i+1}</span>
            </div>
            <h4 className="text-xl sm:text-2xl font-bold italic mb-6 sm:mb-8 text-white/90 group-hover:text-white transition-colors">¿{card.anverso}?</h4>
            <div className="pt-6 sm:pt-8 border-t border-white/5 text-gray-500 text-base sm:text-lg italic group-hover:text-gray-300 transition-colors">{card.reverso}</div>
          </div>
        ))}
      </div>

      {showIAModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/95 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#0D0D0D] border border-white/10 w-full max-w-xl rounded-[32px] sm:rounded-[48px] p-8 sm:p-12 relative shadow-2xl">
            <button onClick={() => setShowIAModal(false)} className="absolute top-6 right-6 sm:top-10 sm:right-10 text-gray-600 hover:text-white transition-colors"><X size={24}/></button>
            <div className="mb-8 sm:mb-12">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-indigo-500/10 text-indigo-500 rounded-2xl sm:rounded-3xl flex items-center justify-center mb-6 sm:mb-8 border border-indigo-500/20">
                <Flame size={28} strokeWidth={2.5} />
              </div>
              <h3 className="text-3xl sm:text-4xl font-black italic uppercase tracking-tighter mb-4">Motor de IA</h3>
              <p className="text-gray-500 text-sm font-medium">Genera flashcards automáticamente.</p>
            </div>
            
            <select 
              className="w-full bg-[#151515] border border-white/5 rounded-2xl p-5 sm:p-6 mb-6 sm:mb-8 text-sm text-white outline-none focus:border-indigo-500/50 appearance-none font-bold uppercase tracking-widest cursor-pointer"
              value={recursoSeleccionado}
              onChange={(e) => setRecursoSeleccionado(e.target.value)}
            >
              <option value="">Elegir recurso...</option>
              {recursosList.map(rec => (
                <option key={rec.id || rec.id_recurso} value={rec.id || rec.id_recurso}>{rec.nombre}</option>
              ))}
            </select>

            <button 
              disabled={cargandoIA || !recursoSeleccionado}
              onClick={manejarGeneracionIA}
              className="w-full py-5 sm:py-6 rounded-2xl sm:rounded-3xl font-black bg-indigo-600 text-white uppercase tracking-[0.2em] text-xs hover:bg-indigo-500 transition-all disabled:opacity-20 active:scale-95"
            >
              {cargandoIA ? "PROCESANDO..." : "GENERAR TARJETAS"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const MazoCard = ({ mazo, onClick }) => {
  const asignatura = mazo.asignatura;
  const nombreAsig = asignatura?.nombre || mazo.nombreAsignatura || 'General';
  const color = asignatura?.color || '#6366f1';

  return (
    <div onClick={onClick} className="bg-[#111111] border border-white/5 rounded-[32px] sm:rounded-[40px] p-8 sm:p-10 hover:border-indigo-500/30 transition-all group cursor-pointer active:scale-95">
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[20px] sm:rounded-[24px] flex items-center justify-center mb-10 transition-transform group-hover:scale-110 shadow-inner" style={{ backgroundColor: `${color}10`, color: color }}>
        <Layers size={28} strokeWidth={2.5} />
      </div>
      <h3 className="text-2xl sm:text-3xl font-black mb-3 uppercase italic group-hover:text-white transition-colors tracking-tight leading-none truncate">{mazo.nombre}</h3>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-600">{nombreAsig}</span>
      </div>
      <div className="flex justify-between items-center pt-6 sm:pt-8 border-t border-white/5">
        <span className="text-[9px] font-black text-gray-700 uppercase tracking-widest">{mazo.flashcards?.length || 0} TARJETAS</span>
        <div className="p-2.5 bg-white/5 rounded-xl text-gray-600 group-hover:text-indigo-500 transition-all group-hover:bg-indigo-500/10"><BookOpen size={16} /></div>
      </div>
    </div>
  );
};

const ModalCrearMazo = ({ asignaturas, onClose, onCreated, userId }) => {
  const [nombre, setNombre] = useState('');
  const [asigId, setAsigId] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!asigId) return;
    try {
      const nuevoMazo = { 
        nombre: nombre,
        usuario: { id: userId }, 
        asignatura: { id: parseInt(asigId) } 
      };
      await mazoService.crear(nuevoMazo);
      onCreated(); 
      onClose();
    } catch (error) { console.error(error); }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-sm animate-in zoom-in duration-300">
      <div className="bg-[#0D0D0D] border border-white/10 w-full max-w-lg rounded-[32px] sm:rounded-[48px] p-8 sm:p-12 relative">
        <button onClick={onClose} className="absolute top-6 right-6 sm:top-10 sm:right-10 text-gray-600 hover:text-white transition-colors"><X size={24}/></button>
        <h2 className="text-3xl sm:text-4xl font-black mb-8 sm:mb-12 italic uppercase tracking-tighter">NUEVA COLECCIÓN</h2>
        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          <div className="space-y-3">
            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-700 ml-4">TÍTULO</label>
            <input required value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full bg-[#111111] border border-white/5 rounded-2xl sm:rounded-3xl p-5 sm:p-6 text-sm text-white outline-none focus:border-indigo-500/50 transition-all font-bold uppercase" placeholder="EJ: ESTRUCTURAS" />
          </div>
          <div className="space-y-3">
            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-700 ml-4">MATERIA</label>
            <select required value={asigId} onChange={(e) => setAsigId(e.target.value)} className="w-full bg-[#111111] border border-white/5 rounded-2xl sm:rounded-3xl p-5 sm:p-6 text-sm text-white outline-none focus:border-indigo-500/50 appearance-none font-bold uppercase tracking-widest">
              <option value="">ELEGIR...</option>
              {asignaturas.map(asig => (
                <option key={asig.id_asignatura || asig.id} value={asig.id_asignatura || asig.id}>{asig.nombre}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="w-full bg-indigo-600 py-5 sm:py-6 rounded-2xl sm:rounded-[28px] text-[10px] font-black text-white uppercase tracking-[0.3em] hover:bg-indigo-500 transition-all mt-4">CONFIRMAR</button>
        </form>
      </div>
    </div>
  );
};

export default FlashcardsPage;