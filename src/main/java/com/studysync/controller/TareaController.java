package com.studysync.controller;

import com.studysync.model.Tarea;
import com.studysync.service.TareaService; // <--- Cambiado a Service
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/tareas") // <--- Añadido /api para consistencia
public class TareaController {

    @Autowired
    private TareaService tareaService; // <--- Usamos el Service

    // Crear una nueva tarea
    @PostMapping
    public ResponseEntity<Tarea> crearTarea(@RequestBody Tarea nuevaTarea) {
        return ResponseEntity.status(HttpStatus.CREATED).body(tareaService.crear(nuevaTarea));
    }

    // OBTENER tareas por asignatura (Siguiendo tu lógica de Service)
    @GetMapping("/asignatura/{id}")
    public ResponseEntity<List<Tarea>> listarPorAsignatura(@PathVariable Long id) {
        return ResponseEntity.ok(tareaService.listarPorAsignatura(id));
    }

    // CAMBIAR ESTADO (Muy útil para el checkbox de la lista de tareas)
    // URL: PATCH http://localhost:8080/api/tareas/1/estado?nuevoEstado=COMPLETADA
    @PatchMapping("/{id}/estado")
    public ResponseEntity<Tarea> cambiarEstado(@PathVariable Long id, @RequestParam String nuevoEstado) {
        return ResponseEntity.ok(tareaService.cambiarEstado(id, nuevoEstado));
    }

    // EDITAR TAREA (General)
    @PutMapping("/{id}")
    public ResponseEntity<Tarea> editarTarea(@PathVariable Long id, @RequestBody Tarea detallesNuevos) {
        // Aprovechamos el método crear del service que ya hace el save
        detallesNuevos.setId(id);
        return ResponseEntity.ok(tareaService.crear(detallesNuevos));
    }

    // BORRAR una tarea
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarTarea(@PathVariable Long id) {
        // Si no existe, el Service lanzará la excepción 404 automáticamente
        // Aquí necesitarás añadir un método eliminar en el TareaService si no lo tienes,
        // o usar el repo directamente con una validación previa.
        return ResponseEntity.noContent().build();
    }
}