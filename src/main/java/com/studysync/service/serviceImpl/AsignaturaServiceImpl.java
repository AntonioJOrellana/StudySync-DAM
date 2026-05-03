package com.studysync.service.serviceImpl;

import com.studysync.model.Asignatura;
import com.studysync.repository.AsignaturaRepository;
import com.studysync.service.AsignaturaService;
import com.studysync.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AsignaturaServiceImpl implements AsignaturaService {

    @Autowired
    private AsignaturaRepository asignaturaRepository;

    @Override
    public Asignatura crear(Asignatura asignatura) {
        // Validación: No permitimos asignaturas sin nombre
        if (asignatura.getNombre() == null || asignatura.getNombre().trim().isEmpty()) {
            throw new RuntimeException("El nombre de la asignatura no puede estar vacío.");
        }
        return asignaturaRepository.save(asignatura);
    }

    @Override
    public List<Asignatura> listarPorUsuario(Long usuarioId) {
        // Retorna la lista (vacía o con datos) sin lanzar excepción para evitar errores
        // en el Sidebar
        return asignaturaRepository.findByUsuario_Id(usuarioId);
    }

    @Override
    public Asignatura obtenerPorId(Long id) {
        // IMPORTANTE: Usamos findById, que es el método nativo de JpaRepository.
        // Esto evita el error "No property obtenerPorId found"
        return asignaturaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("La asignatura con ID " + id + " no existe."));
    }

    @Override
    public void eliminar(Long id) {
        // Verificamos existencia antes de borrar para lanzar un 404 limpio si no existe
        if (!asignaturaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Error al eliminar: La asignatura con ID " + id + " no existe.");
        }
        asignaturaRepository.deleteById(id);
    }
}