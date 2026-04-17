package com.studysync.service;

import com.studysync.model.Flashcard;
import java.util.List;

public interface FlashcardService {
    List<Flashcard> listarTodas();
    Flashcard guardar(Flashcard flashcard);
    
    // El nuevo método que usaremos para la IA y el PDF
    List<Flashcard> generarDesdeRecurso(Long recursoId);
}