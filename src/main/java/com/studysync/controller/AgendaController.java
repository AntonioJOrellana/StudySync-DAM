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
        // Nota: Si el service lanza ResourceNotFoundException cuando está vacío,
        // el ControllerAdvice ya lo manejará. Si no, esto devuelve 200 OK.
        return ResponseEntity.ok(eventos);
    }

    // Crear un nuevo evento
    @PostMapping("/crear")
    public ResponseEntity<Agenda> crearEvento(@RequestBody Agenda evento) {
        // El service ya debería validar que los datos no vengan vacíos
        return ResponseEntity.ok(agendaService.crearEvento(evento));
    }

    // Eliminar un evento
    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> eliminarEvento(@PathVariable Long id) {
        agendaService.eliminarEvento(id);
        // Usamos noContent (204) porque es el estándar para borrados exitosos sin
        // retorno de datos
        return ResponseEntity.noContent().build();
    }
}