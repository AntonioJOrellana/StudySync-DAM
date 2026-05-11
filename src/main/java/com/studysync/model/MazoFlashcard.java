package com.studysync.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonIgnore;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "mazo_flashcard")
@Data
public class MazoFlashcard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_mazo")
    private long id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    @JsonIgnore 
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_asignatura", nullable = false)
    @JsonIgnoreProperties({"mazos", "recursos", "tareas", "sesiones", "usuario"})
    @ToString.Exclude
    private Asignatura asignatura;

    @OneToMany(mappedBy = "mazo", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("mazo")
    @ToString.Exclude
    private List<Flashcard> flashcards;
}