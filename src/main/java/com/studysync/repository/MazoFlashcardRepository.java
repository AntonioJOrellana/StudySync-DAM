package com.studysync.repository;

import com.studysync.model.MazoFlashcard;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MazoFlashcardRepository extends JpaRepository<MazoFlashcard, Long> {
    // Método para encontrar mazos por asignatura
    List<MazoFlashcard> findByAsignaturaId(Long asignaturaId);
}