package com.studysync.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "usuario")
@Data
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private long id;

    @Column(nullable = false, unique = true)
    private String username;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(nullable = false)
    private String password;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "modo_sin_cuenta")
    private Integer modoSinCuenta;

    // Añadir a Usuario.java
    @Column(name = "url_avatar")
    private String urlAvatar; // Para la foto de perfil

    @Column(name = "puntos_experiencia")
    private Integer puntosExperiencia = 0; // Para el sistema de niveles/logros


}