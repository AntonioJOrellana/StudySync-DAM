package com.studysync.service.serviceImpl;

import com.studysync.model.Flashcard;
import com.studysync.repository.FlashcardRepository;
import com.studysync.service.FlashcardService;
import com.studysync.service.GeminiService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FlashcardServiceImpl implements FlashcardService {

    @Autowired
    private FlashcardRepository flashcardRepository;

    @Autowired
    private GeminiService geminiService; // Inyectamos el servicio de IA

    @Override
    public Flashcard guardar(Flashcard flashcard) {
        return flashcardRepository.save(flashcard);
    }

    @Override
    public List<Flashcard> listarTodas() {
        return flashcardRepository.findAll();
    }

    @Override
    public Flashcard generarConIA(String pregunta) {
        // Configuramos el prompt para que la IA sea breve y precisa
        String prompt = "Actúa como un asistente de estudio. Dame una respuesta corta y clara para el reverso de una flashcard sobre el siguiente tema: " + pregunta;
        
        String respuestaIA = geminiService.generarRespuesta(prompt);

        Flashcard nuevaCard = new Flashcard();
        nuevaCard.setAnverso(pregunta);
        nuevaCard.setReverso(respuestaIA);

        return flashcardRepository.save(nuevaCard); // Se guarda directamente en la BD
    }
}