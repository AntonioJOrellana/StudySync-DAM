package com.studysync.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.studysync.model.Tarea;
import com.studysync.repository.TareaRepository;

@CrossOrigin(origins = "http://localhost:3000")
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

    // EDITAR TAREA
    @PutMapping("/{id}")
    public ResponseEntity<Tarea> editarTarea(@PathVariable Long id, @RequestBody Tarea detallesNuevos) {
        return tareaRepository.findById(id).map(tareaExistente -> {
            // Actualizamos los campos que ahora sí existen en la Entity
            tareaExistente.setTitulo(detallesNuevos.getTitulo()); // Asegúrate de si es setNombre o setTitulo según tu Entity
            tareaExistente.setDescripcion(detallesNuevos.getDescripcion());
            tareaExistente.setFechaEntrega(detallesNuevos.getFechaEntrega());
            tareaExistente.setPrioridad(detallesNuevos.getPrioridad());
            tareaExistente.setCompletada(detallesNuevos.getCompletada());

            // Nota: Se ha eliminado setEstado() porque ya no existe en la clase Tarea

            // Mantener Usuario y Asignatura si no vienen en el JSON
            if (detallesNuevos.getUsuario() != null) {
                tareaExistente.setUsuario(detallesNuevos.getUsuario());
            }
            if (detallesNuevos.getAsignatura() != null) {
                tareaExistente.setAsignatura(detallesNuevos.getAsignatura());
            }

            Tarea actualizada = tareaRepository.save(tareaExistente);
            return ResponseEntity.ok(actualizada);
        }).orElse(ResponseEntity.notFound().build());
    }

    // BORRAR una tarea
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarTarea(@PathVariable Long id) {
        if (tareaRepository.existsById(id)) {
            tareaRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // OBTENER tareas por usuario
    @GetMapping("/usuario/{id}")
    public List<Tarea> listarPorUsuario(@PathVariable Long id) {
        return tareaRepository.findByUsuarioId(id);
    }
}