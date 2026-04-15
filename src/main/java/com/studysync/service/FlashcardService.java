package com.studysync.service;

import com.studysync.model.Flashcard;
import java.util.List;

public interface FlashcardService {
    Flashcard guardar(Flashcard flashcard);
    List<Flashcard> listarTodas();
    // El método estrella: genera el reverso usando la IA
    Flashcard generarConIA(String pregunta);
}