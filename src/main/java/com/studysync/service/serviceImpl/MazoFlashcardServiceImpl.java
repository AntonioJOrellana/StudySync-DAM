package com.studysync.service.serviceImpl;

import com.studysync.exception.ResourceNotFoundException;
import com.studysync.model.MazoFlashcard;
import com.studysync.repository.MazoFlashcardRepository;
import com.studysync.service.MazoFlashcardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MazoFlashcardServiceImpl implements MazoFlashcardService {

    @Autowired
    private MazoFlashcardRepository mazoRepository;

    @Override
    public MazoFlashcard crearMazo(MazoFlashcard mazo) {
        // Validación básica: un mazo debe tener nombre
        if (mazo.getNombre() == null || mazo.getNombre().trim().isEmpty()) {
            throw new RuntimeException("El nombre del mazo es obligatorio.");
        }
        return mazoRepository.save(mazo);
    }

    @Override
    public MazoFlashcard actualizarMazo(Long id, MazoFlashcard mazo) {
        MazoFlashcard mazoExistente = mazoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mazo no encontrado con ID: " + id));

        // Actualizamos los campos necesarios
        if (mazo.getNombre() != null && !mazo.getNombre().trim().isEmpty()) {
            mazoExistente.setNombre(mazo.getNombre());
        }

        if (mazo.getDescripcion() != null) {
            mazoExistente.setDescripcion(mazo.getDescripcion());
        }

        if (mazo.getAsignatura() != null) {
            mazoExistente.setAsignatura(mazo.getAsignatura());
        }

        return mazoRepository.save(mazoExistente);
    }

    @Override
    public List<MazoFlashcard> listarMazosPorAsignatura(Long asignaturaId) {
        return mazoRepository.findByAsignaturaId(asignaturaId);
    }

    @Override
    public List<MazoFlashcard> listarMazosPorUsuario(Long usuarioId) {
        return mazoRepository.findByUsuarioId(usuarioId);
    }

    @Override
    public void eliminarMazo(Long id) {
        if (!mazoRepository.existsById(id)) {
            throw new ResourceNotFoundException("No se puede eliminar: Mazo no encontrado con ID: " + id);
        }
        mazoRepository.deleteById(id);
    }
}