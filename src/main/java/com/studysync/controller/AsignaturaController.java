package com.studysync.controller;

import com.studysync.model.Asignatura;
import com.studysync.repository.AsignaturaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000") // El puerto por defecto de React
@RestController
@RequestMapping("/asignaturas")
public class AsignaturaController {

    @Autowired
    private AsignaturaRepository asignaturaRepository;

    // 1. OBTENER todas las asignaturas
    @GetMapping
    public List<Asignatura> listar() {
        return asignaturaRepository.findAll();
    }

    // 2. CREAR una asignatura nueva
    @PostMapping
    public Asignatura crear(@RequestBody Asignatura asignatura) {
        return asignaturaRepository.save(asignatura);
    }

    // 3. EDITAR una asignatura
    @PutMapping("/{id}")
public ResponseEntity<Asignatura> editarAsignatura(@PathVariable Long id, @RequestBody Asignatura detallesNuevos) {
    return asignaturaRepository.findById(id).map(asignaturaExistente -> {
        // 1. Actualizamos el nombre
        asignaturaExistente.setNombre(detallesNuevos.getNombre());
        
        // 2. Actualizamos el color 
        asignaturaExistente.setColor(detallesNuevos.getColor());

        Asignatura actualizada = asignaturaRepository.save(asignaturaExistente);
        return ResponseEntity.ok(actualizada);
    }).orElse(ResponseEntity.notFound().build());
}

    // 4. BORRAR una asignatura
    @DeleteMapping("/{id}")
public ResponseEntity<Void> eliminarAsignatura(@PathVariable Long id) {
    if (asignaturaRepository.existsById(id)) {
        asignaturaRepository.deleteById(id);
        return ResponseEntity.noContent().build(); // Devuelve 204 (Éxito, sin contenido)
    } else {
        return ResponseEntity.notFound().build(); // Devuelve 404 si no existe
    }
}

    // 5. OBTENER asignaturas por usuario
    @GetMapping("/usuario/{id}")
    public List<Asignatura> listarPorUsuario(@PathVariable Long id) {
    return asignaturaRepository.findByUsuarioId(id);
}
}