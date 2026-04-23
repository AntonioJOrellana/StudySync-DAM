package com.studysync.controller;

import com.studysync.model.Asignatura;
import com.studysync.service.AsignaturaService; // <--- Cambiado a Service
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/asignaturas") // <--- Añadido /api para que coincida con Postman
public class AsignaturaController {

    @Autowired
    private AsignaturaService asignaturaService; // <--- Usamos el Service

    @GetMapping
    public List<Asignatura> listar() {
        // Aquí podrías crear un método en el service si necesitas listar todas
        // o dejarlo así si es para administración
        return asignaturaService.listarPorUsuario(null); // O el método que prefieras
    }

    @PostMapping
    public Asignatura crear(@RequestBody Asignatura asignatura) {
        return asignaturaService.crear(asignatura);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Asignatura> editar(@PathVariable Long id, @RequestBody Asignatura detalles) {
        // En el futuro podemos mover la lógica de editar al Service
        // Por ahora, usamos el service para asegurar que las reglas se cumplen
        detalles.setId(id);
        return ResponseEntity.ok(asignaturaService.crear(detalles));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        asignaturaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/usuario/{id}")
    public List<Asignatura> listarPorUsuario(@PathVariable Long id) {
        // Ahora sí, esto disparará el 404 si el usuario no tiene asignaturas
        return asignaturaService.listarPorUsuario(id);
    }
}