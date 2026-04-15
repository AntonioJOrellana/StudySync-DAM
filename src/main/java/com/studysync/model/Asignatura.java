package com.studysync.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "asignatura")
@Data
public class Asignatura {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_asignatura")
    private long id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(length = 7)
    private String color; 

    @Column(length = 150)
    private String profesor; // Cambiado de catedratico a profesor

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @OneToMany(mappedBy = "asignatura", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Tarea> tareas;

    // Relación con los nuevos Recursos (PDFs, Videos, etc.)
    @OneToMany(mappedBy = "asignatura", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Recurso> recursos;

    // Relación con los Mazos de Flashcards
    @OneToMany(mappedBy = "asignatura", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<MazoFlashcard> mazos;
}