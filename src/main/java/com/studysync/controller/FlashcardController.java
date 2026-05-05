package com.studysync.controller;

import com.studysync.model.Flashcard;
import com.studysync.service.FlashcardService;
import com.studysync.repository.FlashcardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/flashcards")
public class FlashcardController {

    @Autowired
    private FlashcardService flashcardService;

    @Autowired
    private FlashcardRepository flashcardRepository;

    @GetMapping
    public ResponseEntity<List<Flashcard>> listar() {
        return ResponseEntity.ok(flashcardService.listarTodas());
    }

    // --- CORREGIDO: Ahora recibe recursoId y mazoId ---
    // URL: POST http://localhost:8080/api/flashcards/ia/recurso/5/mazo/13
    @PostMapping("/ia/recurso/{recursoId}/mazo/{mazoId}")
    public ResponseEntity<List<Flashcard>> generarDesdePdf(
            @PathVariable Long recursoId, 
            @PathVariable Long mazoId) {
        
        // Llamamos al service pasando ambos IDs
        List<Flashcard> generadas = flashcardService.generarDesdeRecurso(recursoId, mazoId);
        return ResponseEntity.ok(generadas);
    }

    @PostMapping("/{id}/repaso")
    public ResponseEntity<Flashcard> responderFlashcard(
            @PathVariable Long id,
            @RequestParam boolean acierto) {
        return ResponseEntity.ok(flashcardService.actualizarRepaso(id, acierto));
    }

    @GetMapping("/mazo/{mazoId}/pendientes")
    public ResponseEntity<List<Flashcard>> obtenerPendientes(@PathVariable Long mazoId) {
        List<Flashcard> pendientes = flashcardRepository.findByMazoIdAndProximoRepasoBefore(
                mazoId, LocalDateTime.now());
        return ResponseEntity.ok(pendientes);
    }

    @PostMapping
    public ResponseEntity<Flashcard> crearManual(@RequestBody Flashcard flashcard) {
        return ResponseEntity.status(HttpStatus.CREATED).body(flashcardService.guardar(flashcard));
    }
}