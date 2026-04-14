package com.studysync.controller;

import com.studysync.model.Flashcard;
import com.studysync.repository.FlashcardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000") // El puerto por defecto de React
@RestController
@RequestMapping("/flashcards")
public class FlashcardController {

    @Autowired
    private FlashcardRepository flashcardRepository;

    @GetMapping
    public List<Flashcard> obtenerTodas() {
        return flashcardRepository.findAll();
    }
}