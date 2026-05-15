import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { agendaService } from '../services/agendaService';

const ModalEditarEvento = ({ isOpen, onClose, evento, asignaturas, onEventoActualizado }) => {
    const [nombre, setNombre] = useState('');
    const [fecha, setFecha] = useState('');
    const [asignaturaId, setAsignaturaId] = useState('');
    const [cargando, setCargando] = useState(false);

    // Cargar datos cuando se abre el modal con un evento seleccionado
    useEffect(() => {
        if (evento) {
            // Mapeamos 'titulo' del evento al estado 'nombre' del formulario
            setNombre(evento.titulo || '');
            
            // Extraemos solo la parte YYYY-MM-DD de la fecha de la agenda
            const fechaFormateada = evento.fechaEvento ? evento.fechaEvento.split('T')[0] : '';
            setFecha(fechaFormateada);
            
            setAsignaturaId(evento.asignatura?.id || '');
        }
    }, [evento]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!nombre || !fecha || !asignaturaId) {
            alert("Por favor, rellena todos los campos");
            return;
        }

        setCargando(true);
        try {
            // Preparamos el objeto con los nombres de campos que espera tu API de Java
            const datosActualizados = {
                titulo: nombre,
                fechaEvento: `${fecha}T10:00:00`, // Mantener el formato ISO con hora
                asignatura: { id: parseInt(asignaturaId) }
            };
            
            const idEvento = evento.id || evento.id_evento;
            
            // Usamos agendaService.actualizarEvento que es como lo tienes en tu servicio
            await agendaService.actualizarEvento(idEvento, datosActualizados);
            
            onEventoActualizado(); // Refresca los datos en CalendarPage
            onClose();
        } catch (error) {
            console.error("Error al actualizar evento:", error);
            alert("No se pudo actualizar el evento");
        } finally {
            setCargando(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-[#111] border border-white/10 w-full max-w-md rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
                <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors">
                    <X size={24} />
                </button>

                <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-8">Editar Evento</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 italic">¿Qué hay que cambiar?</label>
                        <input 
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-indigo-500 transition-all"
                            placeholder="Ej: Examen Parcial"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 italic">Fecha</label>
                            <input 
                                type="date"
                                value={fecha}
                                onChange={(e) => setFecha(e.target.value)}
                                className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-indigo-500 transition-all [color-scheme:dark]"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 italic">Materia</label>
                            <select 
                                value={asignaturaId}
                                onChange={(e) => setAsignaturaId(e.target.value)}
                                className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-indigo-500 transition-all appearance-none"
                            >
                                <option value="" className="bg-[#111] text-white">Elegir...</option>
                                {asignaturas.map(asig => (
                                    <option key={asig.id} value={asig.id} className="bg-[#111] text-white">
                                        {asig.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button 
                        type="submit"
                        disabled={cargando}
                        className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase text-xs tracking-[0.2em] rounded-2xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95 disabled:opacity-50"
                    >
                        {cargando ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ModalEditarEvento;