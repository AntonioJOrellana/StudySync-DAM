package com.studysync.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "sesion_estudio")
@Data
public class SesionEstudio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_sesion")
    private long id;

    @Column(name = "fecha_inicio")
    private LocalDateTime fechaInicio;

    @Column(name = "duracion_minutos")
    private Integer duracion;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "id_asignatura", nullable = false)
    private Asignatura asignatura; 

    @Enumerated(EnumType.STRING)
    private TipoSesion tipo = TipoSesion.estudio; // 'estudio', 'repaso_flashcards', 'examen_simulado'

    public enum TipoSesion {
        estudio, repaso_flashcards, examen_simulado
    }
}