package com.studysync.service;
import com.studysync.model.MazoFlashcard;
import java.util.List;

public interface MazoFlashcardService {
    MazoFlashcard crearMazo(MazoFlashcard mazo);
    List<MazoFlashcard> listarMazosPorAsignatura(Long asignaturaId);
}