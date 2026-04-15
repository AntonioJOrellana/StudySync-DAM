package com.studysync.controller;

import com.studysync.model.Flashcard;
import com.studysync.service.FlashcardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000") // El puerto por defecto de React
@RestController
@RequestMapping("/api/flashcards")
public class FlashcardController {

    @Autowired
    private FlashcardService flashcardService;

    @GetMapping
    public List<Flashcard> listar() {
        return flashcardService.listarTodas();
    }

    // Ruta mágica: http://localhost:8080/api/flashcards/ia?pregunta=Que es la fotosintesis
    @PostMapping("/ia")
    public Flashcard crearConIA(@RequestParam String pregunta) {
        return flashcardService.generarConIA(pregunta);
    }
}