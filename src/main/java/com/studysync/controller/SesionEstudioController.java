package com.studysync.controller;

import com.studysync.model.SesionEstudio;
import com.studysync.service.SesionEstudioService; // <--- Cambiado a Service
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sesiones")
@CrossOrigin(origins = "http://localhost:3000")
public class SesionEstudioController {

    @Autowired
    private SesionEstudioService sesionEstudioService; // <--- Inyectamos el Service

    // Listar sesiones de un usuario
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<SesionEstudio>> listarPorUsuario(@PathVariable Long usuarioId) {
        List<SesionEstudio> sesiones = sesionEstudioService.listarPorUsuario(usuarioId);
        return ResponseEntity.ok(sesiones);
    }

    // Iniciar una sesión nueva (POST)
    @PostMapping("/iniciar")
    public ResponseEntity<SesionEstudio> iniciarSesion(@RequestBody SesionEstudio sesion) {
        SesionEstudio nuevaSesion = sesionEstudioService.iniciarSesion(sesion);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaSesion);
    }

    // Finalizar sesión y registrar duración (PUT)
    // URL: PUT http://localhost:8080/api/sesiones/finalizar/1?duracion=45
    @PutMapping("/finalizar/{id}")
    public ResponseEntity<SesionEstudio> finalizarSesion(
            @PathVariable Long id, 
            @RequestParam Integer duracion) {
        
        SesionEstudio sesionFinalizada = sesionEstudioService.finalizarSesion(id, duracion);
        return ResponseEntity.ok(sesionFinalizada);
    }
}