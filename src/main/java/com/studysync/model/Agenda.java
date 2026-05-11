package com.studysync.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "agenda")
@Data
public class Agenda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_evento")
    private long id;

    @Column(nullable = false, length = 150)
    private String titulo;

    @Column(name = "fecha_evento", nullable = false)
    private LocalDateTime fechaEvento;

    @Enumerated(EnumType.STRING)
    private Prioridad prioridad = Prioridad.media;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_asignatura", nullable = false)
    @JsonIgnoreProperties({"tareas", "recursos", "mazos", "sesiones", "usuario"})
    @ToString.Exclude
    private Asignatura asignatura;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    // Cambiado: Permitimos el ID del usuario pero ignoramos sus listas pesadas
    @JsonIgnoreProperties({"asignaturas", "password", "email", "rol"})
    private Usuario usuario;

    public enum Prioridad { alta, media, baja }
}