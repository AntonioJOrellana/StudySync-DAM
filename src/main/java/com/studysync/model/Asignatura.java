package com.studysync.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

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
    private String profesor;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    @JsonIgnore // Esto corta el bucle y permite que la lista de materias cargue
    private Usuario usuario;

    @OneToMany(mappedBy = "asignatura", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference // Mantenemos ignore aquí para no saturar el objeto asignatura
    private List<Tarea> tareas;

    // RELACIÓN CORREGIDA: Ahora permite que los recursos viajen al frontend
    @OneToMany(mappedBy = "asignatura", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference 
    private List<Recurso> recursos;

    @OneToMany(mappedBy = "asignatura", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("asignatura")
    private List<MazoFlashcard> mazos;

    @OneToMany(mappedBy = "asignatura", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("asignatura") // Evita que la sesión vuelva a cargar la asignatura
    private List<SesionEstudio> sesiones;
}