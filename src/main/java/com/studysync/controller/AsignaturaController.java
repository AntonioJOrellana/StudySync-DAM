package com.studysync.controller;

import com.studysync.model.Asignatura;
import com.studysync.service.AsignaturaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/asignaturas")
public class AsignaturaController {

    @Autowired
    private AsignaturaService asignaturaService;

    // Obtener todas las asignaturas de un usuario
    @GetMapping("/usuario/{id}")
    public List<Asignatura> listarPorUsuario(@PathVariable Long id) {
        return asignaturaService.listarPorUsuario(id);
    }

    // Obtener UNA asignatura por su ID (Para la página de detalles)
    @GetMapping("/{id}")
    public ResponseEntity<Asignatura> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(asignaturaService.obtenerPorId(id));
    }

    @PostMapping
    public Asignatura crear(@RequestBody Asignatura asignatura) {
        return asignaturaService.crear(asignatura);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Asignatura> editar(@PathVariable Long id, @RequestBody Asignatura detalles) {
        detalles.setId(id);
        return ResponseEntity.ok(asignaturaService.crear(detalles));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        asignaturaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}