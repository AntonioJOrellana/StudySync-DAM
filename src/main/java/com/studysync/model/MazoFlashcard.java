package com.studysync.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

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

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    @JsonIgnore
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "id_asignatura", nullable = false)
    @JsonIgnoreProperties({"recursos", "mazos", "tareas", "usuario"})
    private Asignatura asignatura;

    @OneToMany(mappedBy = "mazo", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference // IMPORTANTE: Envía las flashcards al Frontend
    private List<Flashcard> flashcards;
}