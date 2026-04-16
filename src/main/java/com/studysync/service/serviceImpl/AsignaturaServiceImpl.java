package com.studysync.service.serviceImpl;

import com.studysync.model.Asignatura;
import com.studysync.repository.AsignaturaRepository;
import com.studysync.service.AsignaturaService;
import com.studysync.exception.ResourceNotFoundException; // <--- Nuestra excepción personalizada
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AsignaturaServiceImpl implements AsignaturaService {

    @Autowired
    private AsignaturaRepository asignaturaRepository;

    @Override
    public Asignatura crear(Asignatura asignatura) {
        // Validación preventiva: No permitimos asignaturas sin nombre
        if (asignatura.getNombre() == null || asignatura.getNombre().trim().isEmpty()) {
            throw new RuntimeException("El nombre de la asignatura no puede estar vacío.");
        }
        return asignaturaRepository.save(asignatura);
    }

    @Override
    public List<Asignatura> listarPorUsuario(Long usuarioId) {
        // Ojo: Asegúrate de que en tu Repository el método se llame findByUsuario_Id 
        // para que coincida con lo que arreglamos antes.
        List<Asignatura> asignaturas = asignaturaRepository.findByUsuario_Id(usuarioId);
        
        if (asignaturas.isEmpty()) {
            throw new ResourceNotFoundException("Este usuario aún no tiene asignaturas registradas.");
        }
        
        return asignaturas;
    }

    @Override
    public void eliminar(Long id) {
        // Verificamos existencia para dar una respuesta clara (404)
        if (!asignaturaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Error al eliminar: La asignatura con ID " + id + " no existe.");
        }
        asignaturaRepository.deleteById(id);
    }
}