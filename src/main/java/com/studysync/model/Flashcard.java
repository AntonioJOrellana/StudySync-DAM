package com.studysync.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "flashcard")
@Data
public class Flashcard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_flashcard")
    private long id;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String anverso;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String reverso;

    @Column(name = "nivel_espaciado")
    private Integer nivelEspaciado = 0; // Por defecto empezamos en nivel 0

    @Column(name = "proximo_repaso")
    private LocalDateTime proximoRepaso;

    @Column(name = "creada_por_ia")
    private Boolean creadaPorIa = false;

    @Column(name = "fecha_creacion", updatable = false)
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "id_mazo", nullable = false)
    @JsonIgnore
    private MazoFlashcard mazo;
    
}