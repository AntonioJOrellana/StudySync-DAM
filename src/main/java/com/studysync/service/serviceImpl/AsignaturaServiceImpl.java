package com.studysync.service.serviceImpl;

import com.studysync.model.Asignatura;
import com.studysync.repository.AsignaturaRepository;
import com.studysync.service.AsignaturaService;
import com.studysync.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional; // <--- ESTE IMPORT ES CRÍTICO

@Service
public class AsignaturaServiceImpl implements AsignaturaService {

    @Autowired
    private AsignaturaRepository asignaturaRepository;

    @Override
    @Transactional
    public Asignatura crear(Asignatura asignatura) {
        if (asignatura.getNombre() == null || asignatura.getNombre().trim().isEmpty()) {
            throw new RuntimeException("El nombre de la asignatura no puede estar vacío.");
        }
        return asignaturaRepository.save(asignatura);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Asignatura> listarPorUsuario(Long usuarioId) {
        return asignaturaRepository.findByUsuario_Id(usuarioId);
    }

    @Override
    @Transactional(readOnly = true)
    public Asignatura obtenerPorId(Long id) {
        // La sintaxis () -> new ... asegura que se trate como una Supplier de excepción
        return asignaturaRepository.findByIdConDetalles(id)
                .orElseThrow(() -> new ResourceNotFoundException("La asignatura con ID " + id + " no existe."));
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        if (!asignaturaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Error al eliminar: La asignatura con ID " + id + " no existe.");
        }
        asignaturaRepository.deleteById(id);
    }
}