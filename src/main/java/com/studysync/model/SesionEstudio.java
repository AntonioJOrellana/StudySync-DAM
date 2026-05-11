package com.studysync.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonFormat;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "sesion_estudio")
@Data
public class SesionEstudio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_sesion")
    private long id;

    @Column(name = "fecha_inicio")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime fechaInicio;

    @Column(name = "duracion_minutos")
    private Integer duracion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    @JsonIgnoreProperties({"sesiones", "asignaturas", "password"})
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_asignatura")
    @JsonIgnoreProperties({"sesiones", "mazos", "recursos", "tareas", "usuario"})
    private Asignatura asignatura;

    @Enumerated(EnumType.STRING)
    private TipoSesion tipo = TipoSesion.estudio;

    public enum TipoSesion { estudio, repaso_flashcards, examen_simulado }
}