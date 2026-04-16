package com.studysync.service.serviceImpl;

import com.studysync.model.MazoFlashcard;
import com.studysync.repository.MazoFlashcardRepository;
import com.studysync.service.MazoFlashcardService;
import com.studysync.exception.ResourceNotFoundException; // <--- Importante
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
    public List<MazoFlashcard> listarMazosPorAsignatura(Long asignaturaId) {
        // Usamos el estándar con guion bajo: Objeto_Campo
        List<MazoFlashcard> mazos = mazoRepository.findByAsignaturaId(asignaturaId);
        
        if (mazos.isEmpty()) {
            throw new ResourceNotFoundException("No se encontraron mazos para la asignatura con ID: " + asignaturaId);
        }
        
        return mazos;
    }
}