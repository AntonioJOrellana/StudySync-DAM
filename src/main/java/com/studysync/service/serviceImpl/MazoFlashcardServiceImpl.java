package com.studysync.service.serviceImpl;
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
        return mazoRepository.save(mazo);
    }

    @Override
    public List<MazoFlashcard> listarMazosPorAsignatura(Long asignaturaId) {
        return mazoRepository.findByAsignaturaId(asignaturaId);
    }
}