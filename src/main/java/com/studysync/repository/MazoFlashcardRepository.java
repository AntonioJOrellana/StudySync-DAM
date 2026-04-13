package com.studysync.repository;

import com.studysync.model.MazoFlashcard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MazoFlashcardRepository extends JpaRepository<MazoFlashcard, Integer> {
}