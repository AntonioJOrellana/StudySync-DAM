package com.studysync.repository;

import com.studysync.model.Flashcard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List; // No olvides este import

@Repository
public interface FlashcardRepository extends JpaRepository<Flashcard, Long> {
    
    // Esto te permitirá recuperar todas las cartas de un mazo específico
    List<Flashcard> findByMazoId(Long mazoId);

    List<Flashcard> findByMazoIdAndProximoRepasoBefore(Long mazoId, LocalDateTime now);
}