package com.studysync.repository;

import com.studysync.model.MazoFlashcard;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MazoFlashcardRepository extends JpaRepository<MazoFlashcard, Long> {
    // Método para encontrar mazos por asignatura
    @Query("SELECT m FROM MazoFlashcard m LEFT JOIN FETCH m.flashcards WHERE m.asignatura.id = :id")
    List<MazoFlashcard> findByAsignaturaId(@Param("id") Long id);

    List<MazoFlashcard> findByUsuarioId(Long usuarioId);

    
}