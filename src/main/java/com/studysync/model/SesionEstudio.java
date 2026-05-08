package com.studysync.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

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

    // Nombre del atributo: duracion (este es el que viaja en el JSON)
    @Column(name = "duracion_minutos")
    private Integer duracion;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    @JsonIgnoreProperties("sesiones") 
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "id_asignatura", nullable = false)
    // Importante: No ignorar 'sesiones' aquí si queremos que la asignatura las cargue
    @JsonIgnoreProperties({"sesiones", "mazos", "tareas", "recursos", "usuario"}) 
    private Asignatura asignatura; 

    @Enumerated(EnumType.STRING)
    private TipoSesion tipo = TipoSesion.estudio;

    public enum TipoSesion {
        estudio, repaso_flashcards, examen_simulado
    }
}