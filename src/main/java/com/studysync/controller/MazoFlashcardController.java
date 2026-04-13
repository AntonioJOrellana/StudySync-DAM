package com.studysync.controller;

import com.studysync.model.MazoFlashcard;
import com.studysync.repository.MazoFlashcardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/mazos")
public class MazoFlashcardController {

    @Autowired
    private MazoFlashcardRepository mazoRepository;

    @GetMapping
    public List<MazoFlashcard> obtenerTodos() {
        return mazoRepository.findAll();
    }
}