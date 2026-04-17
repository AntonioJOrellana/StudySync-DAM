package com.studysync.controller;

import com.studysync.model.Flashcard;
import com.studysync.service.FlashcardService;
import com.studysync.repository.FlashcardRepository; // Lo necesitamos para las consultas rápidas
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
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

    @PostMapping("/ia/recurso/{recursoId}")
    public ResponseEntity<List<Flashcard>> generarDesdePdf(@PathVariable Long recursoId) {
        return ResponseEntity.ok(flashcardService.generarDesdeRecurso(recursoId));
    }
    
    // --- NUEVO: ACTUALIZAR REPASO (SM-2) ---
    // URL: POST http://localhost:8080/api/flashcards/5/repaso?acierto=true
    @PostMapping("/{id}/repaso")
    public ResponseEntity<Flashcard> responderFlashcard(
            @PathVariable Long id, 
            @RequestParam boolean acierto) {
        return ResponseEntity.ok(flashcardService.actualizarRepaso(id, acierto));
    }

    // --- NUEVO: OBTENER TARJETAS PENDIENTES DE HOY ---
    // URL: GET http://localhost:8080/api/flashcards/mazo/1/pendientes
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