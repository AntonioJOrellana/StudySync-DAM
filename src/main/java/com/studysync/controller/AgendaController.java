package com.studysync.controller;

import com.studysync.model.Agenda;
import com.studysync.service.AgendaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/agenda")
@CrossOrigin(origins = "http://localhost:5173") // Permite la conexión con tu Frontend
public class AgendaController {

    @Autowired
    private AgendaService agendaService;

    // Obtener todos los eventos de un usuario específico
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Agenda>> listarPorUsuario(@PathVariable Long usuarioId) {
        List<Agenda> eventos = agendaService.listarPorUsuario(usuarioId);
        return ResponseEntity.ok(eventos);
    }

    // Crear un nuevo evento
    @PostMapping("/crear")
    public ResponseEntity<Agenda> crearEvento(@RequestBody Agenda evento) {
        return ResponseEntity.ok(agendaService.crearEvento(evento));
    }

    // ACTUALIZAR un evento (Añadido para corregir el error del Modal)
    @PutMapping("/{id}")
    public ResponseEntity<Agenda> actualizarEvento(@PathVariable Long id, @RequestBody Agenda evento) {
        try {
            return ResponseEntity.ok(agendaService.actualizarEvento(id, evento));
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    // Eliminar un evento
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarEvento(@PathVariable Long id) {
        try {
            agendaService.eliminarEvento(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al eliminar: " + e.getMessage());
        }
    }
}