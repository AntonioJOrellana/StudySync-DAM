package com.studysync.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;
import java.time.LocalDateTime;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
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
    private Integer nivelEspaciado = 0;

    @Column(name = "proximo_repaso")
    private LocalDateTime proximoRepaso = LocalDateTime.now();

    @Column(name = "creada_por_ia")
    private Boolean creadaPorIa = false;

    @Column(name = "fecha_creacion", updatable = false)
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_mazo")
    @JsonIgnoreProperties("flashcards")
    @ToString.Exclude
    private MazoFlashcard mazo;
}