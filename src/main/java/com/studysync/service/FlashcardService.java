package com.studysync.service;

import com.studysync.model.Flashcard;
import java.util.List;

public interface FlashcardService {
    List<Flashcard> listarTodas();
    Flashcard guardar(Flashcard flashcard);
    
    // IMPORTANTE: Asegúrate de que esta línea tenga los DOS Long
    List<Flashcard> generarDesdeRecurso(Long recursoId, Long mazoId);
    
    Flashcard actualizarRepaso(Long id, boolean acierto);
    String consultarDudaGeneral(String duda);
}