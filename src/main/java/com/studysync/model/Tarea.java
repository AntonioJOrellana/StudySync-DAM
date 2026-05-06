package com.studysync.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "tarea")
@Data
public class Tarea {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tarea")
    private long id; // Integer para coincidir con INT

    private String titulo;
    private String descripcion;
    
    @Column(name = "fecha_entrega")
    private LocalDate fechaEntrega;




    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = true)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "id_asignatura", nullable = false)
    @JsonBackReference
    private Asignatura asignatura;

    @Enumerated(EnumType.STRING)
    private Prioridad prioridad = Prioridad.media;

    @Column(nullable = false)
    private Boolean completada = false;

    public enum Prioridad {
        alta, media, baja
    }
}


