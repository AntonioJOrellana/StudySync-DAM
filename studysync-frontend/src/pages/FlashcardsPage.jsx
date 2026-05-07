import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, Layers, X, BookOpen, 
  Flame, ArrowLeft, Play, Check, AlertCircle 
} from 'lucide-react';
import { useParams } from 'react-router-dom'; // Añadido para capturar el ID de la URL
import { mazoService } from '../services/mazoService';
import { asignaturaService } from '../services/asignaturaService';
import { flashcardService } from '../services/flashcardService';
import { useAuth } from '../context/AuthContext';
import FlashcardStudy from '../components/FlashcardStudy';

const FlashcardsPage = () => {
  const { user } = useAuth();
  const { idMazo } = useParams(); // Capturamos el ID si existe: /flashcards/mazo/:idMazo
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
      
      // Lógica de selección: Prioridad al ID de la URL, luego al estado previo
      const idABuscar = idMazo || (mazoSeleccionado?.id || mazoSeleccionado?.id_mazo);
      
      if (idABuscar) {
        const encontrado = listaMazos.find(m => 
          String(m.id) === String(idABuscar) || String(m.id_mazo) === String(idABuscar)
        );
        if (encontrado) setMazoSeleccionado(encontrado);
      }
    } catch (error) { console.error("Error al cargar datos:", error); }
  };

  // Cargamos datos al iniciar o cuando cambia el ID en la URL
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
    <div className="h-full bg-[#0A0A0A] text-white p-10 overflow-y-auto animate-in fade-in duration-500">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-black tracking-tight uppercase italic leading-none">Mis Mazos</h1>
          <p className="text-gray-500 text-sm mt-2">Gestiona tus colecciones de estudio</p>
        </div>
        <button onClick={() => setShowModalCrear(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
          <Plus size={20} /> Nuevo Mazo
        </button>
      </header>

      <div className="relative mb-10">
        <Search className="absolute left-5 top-4.5 text-gray-600" size={20} />
        <input 
          type="text" placeholder="Buscar mazo por nombre..." value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="bg-[#111111] border border-white/5 rounded-[24px] py-4.5 pl-14 pr-8 text-base w-full outline-none focus:border-indigo-500/50 transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

// --- EL RESTO DEL CÓDIGO SE MANTIENE EXACTAMENTE IGUAL ---

const MazoDetalleInterno = ({ mazo, onVolver, onRefresh }) => {
  const [showIAModal, setShowIAModal] = useState(false);
  const [recursosList, setRecursosList] = useState([]);
  const [modoEstudio, setModoEstudio] = useState(false);
  
  const mazoId = mazo.id || mazo.id_mazo;
  const [fallidas, setFallidas] = useState(() => {
    const saved = localStorage.getItem(`fallidas_mazo_${mazoId}`);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [pendientes, setPendientes] = useState([]);
  const [cargandoIA, setCargandoIA] = useState(false);

  useEffect(() => {
    localStorage.setItem(`fallidas_mazo_${mazoId}`, JSON.stringify(fallidas));
  }, [fallidas, mazoId]);

  useEffect(() => {
    const idAsig = mazo.asignatura?.id_asignatura || mazo.asignatura?.id;
    if (idAsig) {
      asignaturaService.obtenerPorId(idAsig).then(res => setRecursosList((res.data || res).recursos || []));
    }
  }, [mazo]);

  const iniciarRepaso = async () => {
    try {
      const res = await flashcardService.getPendientes(mazoId);
      if (res.length === 0 && fallidas.length === 0) {
        alert("¡Todo al día! No tienes tarjetas pendientes ni fallidas.");
      } else { 
        setPendientes(res); 
        setModoEstudio(true); 
      }
    } catch (e) { alert("Error al conectar con el servidor"); }
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
            if (existe) {
              const resto = prev.filter(c => (c.id_flashcard || c.id) !== id);
              return [...resto, tarjeta];
            }
            return [...prev, tarjeta];
          });
        }
      }
      onRefresh();
    } catch (error) { console.error("Error al registrar repaso", error); }
  };

  if (modoEstudio) {
    const tarjetaActual = pendientes.length > 0 ? pendientes[0] : fallidas[0];
    return (
      <div className="h-full flex flex-col items-center justify-center bg-[#0A0A0A] p-10 relative">
        <button onClick={() => setModoEstudio(false)} className="absolute top-10 left-10 flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-white">
          <X size={16} /> Finalizar Sesión
        </button>
        {tarjetaActual ? (
          <div className="w-full max-w-2xl text-center">
            <div className="flex justify-center gap-3 mb-10">
              <div className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                <span className="text-indigo-500 text-[11px] font-black uppercase italic">Nuevas hoy: {pendientes.length}</span>
              </div>
              {fallidas.length > 0 && (
                <div className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full">
                  <span className="text-red-500 text-[11px] font-black uppercase italic tracking-widest">A reforzar: {fallidas.length}</span>
                </div>
              )}
            </div>
            <div className="scale-110 transform transition-all">
              <FlashcardStudy card={tarjetaActual} onResult={handleResultadoRepaso} />
            </div>
          </div>
        ) : (
          <div className="text-center animate-in zoom-in duration-300">
            <div className="w-24 h-24 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/30">
              <Check size={48} />
            </div>
            <h2 className="text-5xl font-black italic uppercase tracking-tighter">¡Objetivo logrado!</h2>
            <p className="text-gray-500 mt-4 text-lg italic">Has completado todos tus repasos por ahora.</p>
            <button onClick={() => setModoEstudio(false)} className="mt-12 bg-white text-black px-12 py-5 rounded-[24px] font-black uppercase text-xs tracking-[0.2em] hover:bg-gray-200 transition-all shadow-2xl shadow-white/5 active:scale-95">
              Volver al mazo
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="h-full bg-[#0A0A0A] text-white p-10 overflow-y-auto animate-in slide-in-from-right duration-500">
      <button onClick={onVolver} className="flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-[20px] mb-12 transition-all group">
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 group-hover:text-white">Panel de Mazos</span>
      </button>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div>
          <h2 className="text-6xl font-black italic uppercase tracking-tighter leading-none">{mazo.nombre}</h2>
          <div className="flex items-center gap-4 mt-6">
             <span className="px-4 py-1.5 bg-indigo-600/20 border border-indigo-600/30 text-indigo-400 text-[10px] font-bold uppercase rounded-xl">
               {mazo.asignatura?.nombre}
             </span>
             <p className="text-gray-500 italic text-base">{mazo.descripcion || 'Colección de estudio personalizada'}</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button onClick={iniciarRepaso} className="flex items-center gap-4 px-10 py-5 rounded-[24px] font-black text-xs uppercase tracking-widest bg-indigo-600 text-white hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-600/40 active:scale-95">
            <Play size={18} fill="currentColor" /> Repasar ahora
          </button>
          <button onClick={() => setShowIAModal(true)} className="flex items-center gap-4 px-10 py-5 rounded-[24px] font-black text-xs uppercase tracking-widest bg-white text-black hover:bg-gray-200 transition-all active:scale-95 shadow-xl shadow-white/5">
            <Flame size={18} fill="currentColor" /> Generar con IA
          </button>
        </div>
      </div>

      {fallidas.length > 0 && (
        <div className="mb-16 animate-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center justify-between mb-8">
             <div className="flex items-center gap-3">
               <div className="p-2.5 bg-red-500/20 rounded-xl text-red-500 border border-red-500/20"><AlertCircle size={22} /></div>
               <h3 className="text-xl font-black uppercase italic tracking-tighter">Pendientes de refuerzo ({fallidas.length})</h3>
             </div>
             <button onClick={() => { if(window.confirm("¿Limpiar lista de refuerzo?")) setFallidas([]); }} className="text-[10px] font-black text-gray-600 hover:text-red-500 uppercase tracking-widest transition-colors">Limpiar lista</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fallidas.map((f, idx) => (
              <div key={idx} className="bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/20 p-8 rounded-[32px] relative overflow-hidden group hover:border-red-500/40 transition-all">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity"><AlertCircle size={80} /></div>
                <p className="text-lg font-bold italic text-white leading-tight mb-4">¿{f.anverso}?</p>
                <div className="pt-4 border-t border-red-500/10 text-red-200/50 text-sm italic">{f.reverso}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-600 mb-10 flex items-center gap-6">
        Colección del mazo <div className="h-[1px] flex-1 bg-white/5"></div>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-20">
        {(mazo.flashcards || []).map((card, i) => (
          <div key={card.id_flashcard || card.id || i} className="bg-[#111] border border-white/5 p-10 rounded-[40px] group hover:border-indigo-500/30 transition-all duration-500">
            <span className="text-[10px] font-black text-indigo-500/50 uppercase tracking-[0.2em] group-hover:text-indigo-500 transition-colors">Flashcard #{i+1}</span>
            <h4 className="text-2xl font-bold italic mt-5 mb-8 text-white group-hover:text-indigo-100 transition-colors leading-snug">¿{card.anverso}?</h4>
            <div className="pt-8 border-t border-white/5 text-gray-500 text-lg italic group-hover:text-gray-300 transition-colors">{card.reverso}</div>
          </div>
        ))}
      </div>

      {showIAModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#0D0D0D] border border-white/10 w-full max-w-xl rounded-[48px] p-12 relative shadow-2xl">
            <button onClick={() => setShowIAModal(false)} className="absolute top-10 right-10 text-gray-500 hover:text-white transition-colors"><X size={28}/></button>
            <div className="mb-10">
              <h3 className="text-4xl font-black italic uppercase tracking-tighter mb-3 text-indigo-500">Generar con IA</h3>
              <p className="text-gray-500">Elige un recurso para que nuestra IA cree tarjetas por ti.</p>
            </div>
            <select id="recurso-ia" className="w-full bg-[#151515] border border-white/5 rounded-2xl p-6 mb-8 text-white outline-none focus:border-indigo-500/50 appearance-none">
              <option value="">Selecciona un archivo de la materia...</option>
              {recursosList.map(rec => (<option key={rec.id} value={rec.id}>{rec.nombre}</option>))}
            </select>
            <button 
              disabled={cargandoIA}
              onClick={async () => {
                const recId = document.getElementById('recurso-ia').value;
                if(!recId) return;
                setCargandoIA(true);
                try {
                  await flashcardService.generarConIA(mazoId, recId);
                  await onRefresh(); 
                  setShowIAModal(false);
                } catch (e) { alert("Error al generar con IA"); } 
                finally { setCargandoIA(false); }
              }}
              className="w-full py-6 rounded-3xl font-black bg-indigo-600 text-white uppercase tracking-widest text-sm hover:bg-indigo-500 transition-all disabled:opacity-50 active:scale-95"
            >
              {cargandoIA ? "Analizando contenido..." : "Comenzar Generación"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const MazoCard = ({ mazo, onClick }) => {
  const color = mazo.asignatura?.color || '#6366f1';
  return (
    <div onClick={onClick} className="bg-[#111111] border border-white/5 rounded-[40px] p-10 hover:border-indigo-500/30 transition-all group cursor-pointer active:scale-95 shadow-xl hover:shadow-indigo-500/5">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-10 transition-transform group-hover:scale-110" style={{ backgroundColor: `${color}15`, color: color }}>
        <Layers size={28} />
      </div>
      <h3 className="text-2xl font-bold mb-2 uppercase italic group-hover:text-white transition-colors tracking-tight">{mazo.nombre}</h3>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-[11px] font-black uppercase tracking-widest text-gray-500">{mazo.asignatura?.nombre || 'General'}</span>
      </div>
      <div className="flex justify-between items-center mt-6 pt-6 border-t border-white/5">
        <span className="text-xs text-gray-600 font-black uppercase tracking-widest">{mazo.flashcards?.length || 0} Tarjetas</span>
        <div className="p-3 bg-white/5 rounded-xl text-gray-400 group-hover:text-white transition-colors group-hover:bg-indigo-500/10 group-hover:text-indigo-500"><BookOpen size={16} /></div>
      </div>
    </div>
  );
};

const ModalCrearMazo = ({ asignaturas, onClose, onCreated, userId }) => {
  const [nombre, setNombre] = useState('');
  const [asigId, setAsigId] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    await mazoService.crear({ nombre, usuario: { id: userId }, asignatura: { id_asignatura: parseInt(asigId) } });
    onCreated(); onClose();
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in zoom-in duration-200">
      <div className="bg-[#0D0D0D] border border-white/10 w-full max-w-lg rounded-[40px] p-12 relative">
        <button onClick={onClose} className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors"><X size={24}/></button>
        <h2 className="text-3xl font-black mb-10 italic uppercase tracking-tighter">Crear Nuevo Mazo</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-600 ml-4">Nombre del mazo</label>
            <input required value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full bg-[#111111] border border-white/5 rounded-2xl p-5 text-white outline-none focus:border-indigo-500/50 transition-colors" placeholder="Ej: Fundamentos de SQL..." />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-600 ml-4">Materia vinculada</label>
            <select required value={asigId} onChange={(e) => setAsigId(e.target.value)} className="w-full bg-[#111111] border border-white/5 rounded-2xl p-5 text-white outline-none focus:border-indigo-500/50 appearance-none">
              <option value="">Seleccionar materia...</option>
              {asignaturas.map(asig => (<option key={asig.id_asignatura || asig.id} value={asig.id_asignatura || asig.id}>{asig.nombre}</option>))}
            </select>
          </div>
          <button type="submit" className="w-full bg-indigo-600 py-5 rounded-2xl text-xs font-black text-white uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 mt-4 active:scale-95">Crear mazo ahora</button>
        </form>
      </div>
    </div>
  );
};

export default FlashcardsPage;