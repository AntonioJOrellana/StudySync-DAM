package com.studysync.service.serviceImpl;

import com.studysync.model.Agenda;
import com.studysync.repository.AgendaRepository;
import com.studysync.service.AgendaService;
import com.studysync.exception.ResourceNotFoundException; // <--- Importante importar nuestra excepción
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AgendaServiceImpl implements AgendaService {

    @Autowired
    private AgendaRepository agendaRepository;

    @Override
    public Agenda crearEvento(Agenda evento) {
        // Podrías añadir validaciones aquí, ej: que el título no sea nulo
        if (evento.getTitulo() == null || evento.getTitulo().isEmpty()) {
            throw new RuntimeException("El título del evento es obligatorio");
        }
        return agendaRepository.save(evento);
    }

    @Override
    public List<Agenda> listarPorUsuario(Long usuarioId) {
        List<Agenda> eventos = agendaRepository.findByUsuario_Id(usuarioId);
        
        // Si no hay eventos, lanzamos la excepción personalizada
        if (eventos.isEmpty()) {
            throw new ResourceNotFoundException("No se encontraron eventos en la agenda para el usuario con ID: " + usuarioId);
        }
        
        return eventos;
    }

    @Override
    public void eliminarEvento(Long id) {
        // Antes de borrar, verificamos si existe para dar un error coherente si no
        if (!agendaRepository.existsById(id)) {
            throw new ResourceNotFoundException("No se puede eliminar: El evento con ID " + id + " no existe.");
        }
        agendaRepository.deleteById(id);
    }
}