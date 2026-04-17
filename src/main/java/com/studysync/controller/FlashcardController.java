package com.studysync.controller;

import com.studysync.model.Flashcard;
import com.studysync.service.FlashcardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/flashcards")
public class FlashcardController {

    @Autowired
    private FlashcardService flashcardService;

    // Obtener todas las flashcards
    @GetMapping
    public ResponseEntity<List<Flashcard>> listar() {
        List<Flashcard> flashcards = flashcardService.listarTodas();
        return ResponseEntity.ok(flashcards);
    }

    // Generar con IA
    // URL: POST http://localhost:8080/api/flashcards/ia?pregunta=¿Qué es un algoritmo?
    @PostMapping("/ia/recurso/{recursoId}")
    public ResponseEntity<List<Flashcard>> generarDesdePdf(@PathVariable Long recursoId) {
        List<Flashcard> nueva = flashcardService.generarDesdeRecurso(recursoId);
     return ResponseEntity.ok(nueva);
    }
    
    // También es buena idea tener un POST normal para cuando el usuario las crea a mano
    @PostMapping
    public ResponseEntity<Flashcard> crearManual(@RequestBody Flashcard flashcard) {
        return ResponseEntity.status(HttpStatus.CREATED).body(flashcardService.guardar(flashcard));
    }
}