package com.studysync.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    @JsonIgnoreProperties({"password", "email", "modoSinCuenta", "puntosExperiencia"})
    private Usuario usuario;

    @OneToMany(mappedBy = "asignatura", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("asignatura")
    @ToString.Exclude
    private List<Tarea> tareas;

    @OneToMany(mappedBy = "asignatura", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("asignatura")
    @ToString.Exclude
    private List<Recurso> recursos;

    @OneToMany(mappedBy = "asignatura", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("asignatura")
    @ToString.Exclude
    private List<MazoFlashcard> mazos;

    @OneToMany(mappedBy = "asignatura", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("asignatura")
    @ToString.Exclude
    private List<SesionEstudio> sesiones;
}