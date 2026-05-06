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
    @Column(columnDefinition = "ENUM('pdf', 'video', 'enlace', 'otro', 'pptx', 'docx')")
    // ^ CORREGIDO: Ahora la base de datos acepta 'pptx' y 'docx'
    private TipoRecurso tipo;

    @Column(name = "url_acceso", nullable = false, columnDefinition = "TEXT")
    private String urlAcceso;

    @Column(length = 50)
    private String metadata;

    @Column(name = "fecha_subida", updatable = false)
    private LocalDateTime fechaSubida = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "id_asignatura", nullable = false)
    @JsonBackReference // Evita que el archivo intente cargar la asignatura en bucle
    private Asignatura asignatura;

    public enum TipoRecurso {
        pdf, video, enlace, otro, pptx, docx
    }

    public String getUrl() { return urlAcceso; }
}