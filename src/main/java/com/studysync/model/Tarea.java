package com.studysync.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "tarea")
@Data
public class Tarea {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tarea")
    private Integer id; // Integer para coincidir con INT

    private String titulo;
    private String descripcion;
    
    @Column(name = "fecha_entrega")
    private LocalDate fechaEntrega;

    private Integer prioridad; // TINYINT en SQL es Integer en Java
    
    private Integer completada; // Usamos Integer (0 o 1) para el TINYINT(1)

    private String estado;




    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "id_asignatura", nullable = false)
    // QUITAMOS EL @JsonIgnore de aquí para que deje entrar datos
    private Asignatura asignatura;
}


