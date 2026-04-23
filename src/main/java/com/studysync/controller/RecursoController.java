package com.studysync.controller;

import com.studysync.model.Recurso;
import com.studysync.service.RecursoService; // <--- Cambiado a Service
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recursos")
@CrossOrigin(origins = "http://localhost:5173") // Para que React no se queje
public class RecursoController {

    @Autowired
    private RecursoService recursoService; // <--- Inyectamos el Service

    // Obtener recursos por asignatura
    // URL: GET http://localhost:8080/api/recursos/asignatura/1
    @GetMapping("/asignatura/{asignaturaId}")
    public ResponseEntity<List<Recurso>> listarPorAsignatura(@PathVariable Long asignaturaId) {
        List<Recurso> recursos = recursoService.listarPorAsignatura(asignaturaId);
        // Si la lista está vacía, el Service lanzará el ResourceNotFoundException
        // que configuramos en el GlobalExceptionHandler.
        return ResponseEntity.ok(recursos);
    }

    // Guardar un nuevo recurso (Link, PDF, etc.)
    @PostMapping
    public ResponseEntity<Recurso> guardarRecurso(@RequestBody Recurso recurso) {
        Recurso nuevoRecurso = recursoService.guardarRecurso(recurso);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoRecurso);
    }

    // Eliminar un recurso
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarRecurso(@PathVariable Long id) {
        recursoService.eliminarRecurso(id);
        return ResponseEntity.noContent().build();
    }
}