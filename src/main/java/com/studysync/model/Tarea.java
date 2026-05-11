package com.studysync.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;
import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "tarea")
@Data
public class Tarea {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tarea")
    private long id;

    private String titulo;
    private String descripcion;
    
    @Column(name = "fecha_entrega")
    private LocalDate fechaEntrega;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario")
    @JsonIgnoreProperties({"password", "email", "username", "urlAvatar"}) 
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_asignatura")
    @JsonIgnoreProperties({"tareas", "recursos", "mazos", "sesiones", "usuario"})
    @ToString.Exclude
    private Asignatura asignatura;

    @Enumerated(EnumType.STRING)
    private Prioridad prioridad = Prioridad.media;

    @Column(nullable = false)
    private Boolean completada = false;

    public enum Prioridad { alta, media, baja }
}