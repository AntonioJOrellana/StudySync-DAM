package com.studysync.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "recurso")
@Data
public class Recurso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_recurso")
    private long id;

    @Column(nullable = false, length = 255)
    private String nombre;

    @Enumerated(EnumType.STRING) // Guarda el nombre del enum (PDF, VIDEO...) en la BD
    @Column(columnDefinition = "ENUM('pdf', 'video', 'enlace', 'otro')")
    private TipoRecurso tipo;

    @Column(name = "url_acceso", nullable = false, columnDefinition = "TEXT")
    private String urlAcceso;

    @Column(length = 50)
    private String metadata; // Aquí guardaremos el "2.4 MB" o "15 min"

    @Column(name = "fecha_subida", updatable = false)
    private LocalDateTime fechaSubida = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "id_asignatura", nullable = false)
    private Asignatura asignatura;

    // El Enum puede ir dentro de la clase o en un archivo aparte
    public enum TipoRecurso {
        pdf, video, enlace, otro
    }
}