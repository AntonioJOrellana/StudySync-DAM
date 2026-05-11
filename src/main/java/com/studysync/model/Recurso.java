package com.studysync.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
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
    private TipoRecurso tipo;

    @Column(name = "url_acceso", nullable = false, columnDefinition = "TEXT")
    private String urlAcceso;

    @Column(length = 50)
    private String metadata;

    @Column(name = "fecha_subida", updatable = false)
    private LocalDateTime fechaSubida = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_asignatura", nullable = false)
    @JsonIgnoreProperties({"recursos", "mazos", "tareas", "sesiones", "usuario"})
    @ToString.Exclude
    private Asignatura asignatura;

    public enum TipoRecurso { pdf, video, enlace, otro, pptx, docx }
}