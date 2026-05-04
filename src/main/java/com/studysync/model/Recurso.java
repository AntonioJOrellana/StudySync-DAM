package com.studysync.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonBackReference;

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

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "ENUM('pdf', 'video', 'enlace', 'otro')")
    private TipoRecurso tipo;

    @Column(name = "url_acceso", nullable = false, columnDefinition = "TEXT")
    private String urlAcceso;

    @Column(length = 50)
    private String metadata;

    @Column(name = "fecha_subida", updatable = false)
    private LocalDateTime fechaSubida = LocalDateTime.now();

    // RELACIÓN CORREGIDA: Evita el bucle infinito al serializar a JSON
    @ManyToOne
    @JoinColumn(name = "id_asignatura", nullable = false)
    @JsonBackReference
    private Asignatura asignatura;

    public enum TipoRecurso {
        pdf, video, enlace, otro
    }

    public String getUrl() { return urlAcceso; }
}