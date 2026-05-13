package com.studysync.controller;

import com.studysync.dto.ProgresoDTO; 
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
     * Obtiene todas las estadísticas de progreso filtradas por usuario para el dashboard.
     * Esto evita que los datos de diferentes usuarios se mezclen en las gráficas.
     */
    @GetMapping("/progreso/{usuarioId}")
    public ResponseEntity<ProgresoDTO> obtenerProgreso(@PathVariable Long usuarioId) {
        ProgresoDTO progreso = sesionEstudioService.obtenerProgresoUsuario(usuarioId);
        return ResponseEntity.ok(progreso);
    }

    /**
     * Lista el historial de sesiones de un usuario específico.
     * Es el método que debe llamar el Modo Focus para mostrar "Sesiones de hoy".
     */
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<SesionEstudio>> listarPorUsuario(@PathVariable Long usuarioId) {
        List<SesionEstudio> sesiones = sesionEstudioService.listarPorUsuario(usuarioId);
        return ResponseEntity.ok(sesiones);
    }

    @PostMapping("/iniciar")
    public ResponseEntity<SesionEstudio> iniciarSesion(@RequestBody SesionEstudio sesion) {
        // Asegúrate de que el objeto 'sesion' que viene del front incluya el usuario asignado
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