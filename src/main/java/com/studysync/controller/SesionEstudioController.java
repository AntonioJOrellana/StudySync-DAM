package com.studysync.controller;

import com.studysync.dto.ProgresoDTO; // <--- Importante añadir el import del DTO
import com.studysync.model.SesionEstudio;
import com.studysync.service.SesionEstudioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sesiones")
@CrossOrigin(origins = "http://localhost:5173")
public class SesionEstudioController {

    @Autowired
    private SesionEstudioService sesionEstudioService;

    /**
     * NUEVO: Obtiene todas las estadísticas de progreso para el dashboard
     * URL: GET http://localhost:8080/api/sesiones/progreso/1
     */
    @GetMapping("/progreso/{usuarioId}")
    public ResponseEntity<ProgresoDTO> obtenerProgreso(@PathVariable Long usuarioId) {
        ProgresoDTO progreso = sesionEstudioService.obtenerProgresoUsuario(usuarioId);
        return ResponseEntity.ok(progreso);
    }

    // --- TUS MÉTODOS ANTERIORES ---

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<SesionEstudio>> listarPorUsuario(@PathVariable Long usuarioId) {
        List<SesionEstudio> sesiones = sesionEstudioService.listarPorUsuario(usuarioId);
        return ResponseEntity.ok(sesiones);
    }

    @PostMapping("/iniciar")
    public ResponseEntity<SesionEstudio> iniciarSesion(@RequestBody SesionEstudio sesion) {
        SesionEstudio nuevaSesion = sesionEstudioService.iniciarSesion(sesion);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaSesion);
    }

    @PutMapping("/finalizar/{id}")
    public ResponseEntity<SesionEstudio> finalizarSesion(
            @PathVariable Long id,
            @RequestParam Integer duracion) {

        SesionEstudio sesionFinalizada = sesionEstudioService.finalizarSesion(id, duracion);
        return ResponseEntity.ok(sesionFinalizada);
    }
}