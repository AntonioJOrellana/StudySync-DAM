package com.studysync.service.serviceImpl;

import com.studysync.model.Recurso;
import com.studysync.repository.RecursoRepository;
import com.studysync.service.RecursoService;
import com.studysync.exception.ResourceNotFoundException; // <--- Importante
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class RecursoServiceImpl implements RecursoService {

    @Autowired
    private RecursoRepository recursoRepository;

    @Override
    public List<Recurso> listarPorAsignatura(Long idAsignatura) {
        List<Recurso> recursos = recursoRepository.findByAsignatura_Id(idAsignatura);
        
        // Si la asignatura no tiene materiales, avisamos con un 404
        if (recursos.isEmpty()) {
            throw new ResourceNotFoundException("No se encontraron recursos para la asignatura con ID: " + idAsignatura);
        }
        
        return recursos;
    }

    @Override
    public Recurso guardarRecurso(Recurso recurso) {
        // Validación: Un recurso debe tener nombre y una URL/Ruta de acceso
        if (recurso.getNombre() == null || recurso.getNombre().trim().isEmpty()) {
            throw new RuntimeException("El nombre del recurso es obligatorio.");
        }
        if (recurso.getUrlAcceso() == null || recurso.getUrlAcceso().trim().isEmpty()) {
            throw new RuntimeException("La URL o ruta de acceso del recurso es obligatoria.");
        }
        
        return recursoRepository.save(recurso);
    }

    @Override
    public void eliminarRecurso(Long id) {
        // Verificamos si existe antes de intentar borrar
        if (!recursoRepository.existsById(id)) {
            throw new ResourceNotFoundException("No se puede eliminar: El recurso con ID " + id + " no existe.");
        }
        recursoRepository.deleteById(id);
    }
}