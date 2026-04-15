package com.studysync.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

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

    // --- VINCULACIÓN CON LA MATERIA ---
    @ManyToOne
    @JoinColumn(name = "id_asignatura", nullable = false)
    @JsonIgnore // Evita que al cargar el mazo se cargue toda la asignatura y entremos en bucle
    private Asignatura asignatura;

    // --- LIMPIEZA AUTOMÁTICA ---
    // orphanRemoval = true hace que si quitas una flashcard de la lista, se borre de la BD
    @OneToMany(mappedBy = "mazo", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Flashcard> flashcards;
}