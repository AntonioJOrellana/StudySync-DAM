package com.studysync.controller;

import com.studysync.model.Asignatura;
import com.studysync.repository.AsignaturaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public Asignatura actualizar(@PathVariable Integer id, @RequestBody Asignatura datosNuevos) {
        return asignaturaRepository.findById(id).map(asig -> {
            asig.setNombre(datosNuevos.getNombre());
            // Si tienes más campos como 'color' o 'icono', añádelos aquí:
            // asig.setColor(datosNuevos.getColor());
            
            // Mantenemos al usuario original
            if (datosNuevos.getUsuario() != null) {
                asig.setUsuario(datosNuevos.getUsuario());
            }
            return asignaturaRepository.save(asig);
        }).orElseThrow(() -> new RuntimeException("Asignatura no encontrada"));
    }

    // 4. BORRAR una asignatura
    @DeleteMapping("/{id}")
    public String borrar(@PathVariable Integer id) {
        if (asignaturaRepository.existsById(id)) {
            asignaturaRepository.deleteById(id);
            return "Asignatura eliminada correctamente";
        }
        return "No existe la asignatura con ID: " + id;
    }
}