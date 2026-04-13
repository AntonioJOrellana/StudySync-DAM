package com.studysync.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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

import jakarta.transaction.Transactional;

@RestController
@RequestMapping("/tareas")
public class TareaController {

    @Autowired
    private TareaRepository tareaRepository;

    // Obtener todas las tareas de un usuario específico
    @GetMapping("/usuario/{usuarioId}")
    public List<Tarea> obtenerPorUsuario(@PathVariable Integer usuarioId) {
        return tareaRepository.findByUsuarioId(usuarioId);
    }

    // Crear una nueva tarea
    @PostMapping
    public Tarea crearTarea(@RequestBody Tarea nuevaTarea) {
        return tareaRepository.save(nuevaTarea);
    }

    // 1. EDITAR una tarea
    @PutMapping("/{id}")
public Tarea actualizarTarea(@PathVariable Integer id, @RequestBody Tarea datosNuevos) {
    return tareaRepository.findById(id).map(tarea -> {



        // 1. Actualizamos los campos básicos
        tarea.setTitulo(datosNuevos.getTitulo());
        tarea.setDescripcion(datosNuevos.getDescripcion());
        tarea.setFechaEntrega(datosNuevos.getFechaEntrega());
        tarea.setPrioridad(datosNuevos.getPrioridad());
        tarea.setCompletada(datosNuevos.getCompletada());
        tarea.setEstado(datosNuevos.getEstado());

        // 2. IMPORTANTE: No toques 'usuario' ni 'asignatura' si no es necesario.
        // Si el JSON los trae, asegúrate de que no vengan vacíos.
        if (datosNuevos.getUsuario() != null) {
            tarea.setUsuario(datosNuevos.getUsuario());
        }
        if (datosNuevos.getAsignatura() != null) {
            tarea.setAsignatura(datosNuevos.getAsignatura());
        }

        return tareaRepository.save(tarea);
    }).orElseThrow(() -> new RuntimeException("No he encontrado la tarea con ID: " + id));
}

    @DeleteMapping("/{id}")
    @Transactional // <--- Esto asegura que el borrado se ejecute en la DB
    public String borrarTarea(@PathVariable Integer id) {
    if (tareaRepository.existsById(id)) {
        tareaRepository.deleteById(id);
        // Forzamos un flush para que se envíe a la DB ahora mismo
        tareaRepository.flush(); 
        return "Tarea eliminada correctamente";
    } else {
        return "La tarea con ID " + id + " no existe en la base de datos";
    }
}


    
}