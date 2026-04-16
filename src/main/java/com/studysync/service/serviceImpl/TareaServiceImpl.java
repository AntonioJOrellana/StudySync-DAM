package com.studysync.service.serviceImpl;

import com.studysync.model.Tarea;
import com.studysync.repository.TareaRepository;
import com.studysync.service.TareaService;
import com.studysync.exception.ResourceNotFoundException; // <--- Importante
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TareaServiceImpl implements TareaService {

    @Autowired
    private TareaRepository tareaRepository;

    @Override
    public Tarea crear(Tarea tarea) {
        // Validación: Una tarea debe tener al menos un título o descripción
        if (tarea.getTitulo() == null || tarea.getTitulo().trim().isEmpty()) {
            throw new RuntimeException("El título de la tarea es obligatorio.");
        }
        return tareaRepository.save(tarea);
    }

    @Override
    public List<Tarea> listarPorAsignatura(Long asignaturaId) {
        // Usamos el estándar con guion bajo: Objeto_Campo
        List<Tarea> tareas = tareaRepository.findByAsignaturaId(asignaturaId);
        
        if (tareas.isEmpty()) {
            throw new ResourceNotFoundException("No hay tareas pendientes para esta asignatura (ID: " + asignaturaId + ").");
        }
        
        return tareas;
    }

    @Override
    public Tarea cambiarEstado(Long id, String estado) {
        // Usamos nuestra excepción personalizada en lugar del orElseThrow vacío
        Tarea t = tareaRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("No se encontró la tarea con ID: " + id));
        
        // Lógica de estado mejorada
        if ("COMPLETADA".equalsIgnoreCase(estado) || "HECHO".equalsIgnoreCase(estado)) {
            t.setCompletada(true);
        } else {
            t.setCompletada(false);
        }
        
        return tareaRepository.save(t);
    }
}