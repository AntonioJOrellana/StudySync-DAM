package com.studysync.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "flashcard")
@Data
public class Flashcard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_flashcard")
    private Integer id;

    @Column(columnDefinition = "TEXT")
    private String anverso;

    @Column(columnDefinition = "TEXT")
    private String reverso;

    @Column(name = "nivel_espaciado")
    private Integer nivelEspaciado;

    @ManyToOne
    @JoinColumn(name = "id_mazo", nullable = false)
    @JsonIgnore
    private MazoFlashcard mazo;
}