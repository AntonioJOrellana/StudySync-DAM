package com.studysync.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.studysync.model.Tarea;
import com.studysync.repository.TareaRepository;


@CrossOrigin(origins = "http://localhost:3000") // El puerto por defecto de React
@RestController
@RequestMapping("/tareas")
public class TareaController {

    @Autowired
    private TareaRepository tareaRepository;

    // Crear una nueva tarea
    @PostMapping
    public Tarea crearTarea(@RequestBody Tarea nuevaTarea) {
        return tareaRepository.save(nuevaTarea);
    }

    // 1. EDITAR una tarea
    // EDITAR TAREA
@PutMapping("/{id}")
public ResponseEntity<Tarea> editarTarea(@PathVariable Integer id, @RequestBody Tarea detallesNuevos) {
    return tareaRepository.findById(id).map(tareaExistente -> {
        // Actualizamos campos de texto y valores
        tareaExistente.setTitulo(detallesNuevos.getTitulo());
        tareaExistente.setDescripcion(detallesNuevos.getDescripcion());
        tareaExistente.setFechaEntrega(detallesNuevos.getFechaEntrega());
        tareaExistente.setPrioridad(detallesNuevos.getPrioridad());
        tareaExistente.setCompletada(detallesNuevos.getCompletada());
        tareaExistente.setEstado(detallesNuevos.getEstado());

        // IMPORTANTE: Si el JSON no trae usuario, mantenemos el que ya tenía
        if (detallesNuevos.getUsuario() != null) {
            tareaExistente.setUsuario(detallesNuevos.getUsuario());
        }
        // Si el JSON no trae asignatura, mantenemos la que ya tenía
        if (detallesNuevos.getAsignatura() != null) {
            tareaExistente.setAsignatura(detallesNuevos.getAsignatura());
        }

        Tarea actualizada = tareaRepository.save(tareaExistente);
        return ResponseEntity.ok(actualizada);
    }).orElse(ResponseEntity.notFound().build());
}
    // 2. BORRAR una tarea
    @DeleteMapping("/{id}")
        public ResponseEntity<Void> eliminarTarea(@PathVariable Integer id) {
    if (tareaRepository.existsById(id)) {
        tareaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
    return ResponseEntity.notFound().build();
}

    

    // 5. OBTENER tareas por usuario
    @GetMapping("/usuario/{id}")
    public List<Tarea> listarPorUsuario(@PathVariable Integer id) {
    return tareaRepository.findByUsuarioId(id);
}


    
}