package com.studysync.service;

import com.studysync.model.Flashcard;
import java.util.List;

public interface FlashcardService {
    List<Flashcard> listarTodas();
    Flashcard guardar(Flashcard flashcard);
    
   // Generación de tarjetas mediante IA
    List<Flashcard> generarDesdeRecurso(Long recursoId, Long mazoId);
    // Lógica de estudio (SRS)
    Flashcard actualizarRepaso(Long id, boolean acierto);
    // Método para resolver dudas puntuales
    String consultarDudaGeneral(String duda);
    //Necesario para el borrado de tarjetas 
    void eliminar(Long id);
}