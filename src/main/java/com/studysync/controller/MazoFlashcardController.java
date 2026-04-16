package com.studysync.controller;

import com.studysync.exception.ResourceNotFoundException;
import com.studysync.model.Asignatura;
import com.studysync.model.MazoFlashcard;
import com.studysync.model.Usuario;
import com.studysync.repository.AsignaturaRepository;
import com.studysync.repository.MazoFlashcardRepository;
import com.studysync.repository.UsuarioRepository;
import com.studysync.service.MazoFlashcardService; // <--- Cambiado a Service
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/mazos") // <--- Añadido /api
public class MazoFlashcardController {

    @Autowired
    private MazoFlashcardService mazoService; // <--- Usamos el Service
    // 1. AÑADE ESTO (Las herramientas que faltan)
    @Autowired
    private MazoFlashcardRepository mazoRepository;
    // 1. Añade este autowired arriba con los otros
@Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private AsignaturaRepository asignaturaRepository;

    // Obtener todos los mazos (General)
    @GetMapping
    public ResponseEntity<List<MazoFlashcard>> obtenerTodos() {
        // Podrías añadir este método al service si quieres listar todo
        // Por ahora lo dejamos limpio
        return ResponseEntity.ok(mazoService.listarMazosPorAsignatura(null)); 
    }

    // OBTENER mazos por asignatura (Este es el que más usarás en el Frontend)
    // URL: GET http://localhost:8080/api/mazos/asignatura/1
    @GetMapping("/asignatura/{asignaturaId}")
    public ResponseEntity<List<MazoFlashcard>> listarPorAsignatura(@PathVariable Long asignaturaId) {
        List<MazoFlashcard> mazos = mazoService.listarMazosPorAsignatura(asignaturaId);
        return ResponseEntity.ok(mazos);
    }

    // CREAR un mazo nuevo
    @PostMapping
public ResponseEntity<MazoFlashcard> crearMazo(@RequestBody Map<String, Object> payload) {
    // Extraer IDs del JSON
    Map<String, Object> asignaturaData = (Map<String, Object>) payload.get("asignatura");
    Long asignaturaId = Long.valueOf(asignaturaData.get("id").toString());
    
    Map<String, Object> usuarioData = (Map<String, Object>) asignaturaData.get("usuario");
    Long usuarioId = Long.valueOf(usuarioData.get("id").toString());

    // BUSCAR OBJETOS REALES (Esto es lo que evita el Error 500)
    Asignatura asignaturaReal = asignaturaRepository.findById(asignaturaId)
            .orElseThrow(() -> new ResourceNotFoundException("Asignatura no encontrada"));
            
    Usuario usuarioReal = usuarioRepository.findById(usuarioId)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

    // CREAR EL MAZO Y ASIGNAR TODO
    MazoFlashcard mazo = new MazoFlashcard();
    mazo.setNombre((String) payload.get("nombre"));
    mazo.setAsignatura(asignaturaReal);
    mazo.setUsuario(usuarioReal); // <--- ESTO ES LO QUE PIDIÓ LA IMAGEN 18

    return ResponseEntity.status(HttpStatus.CREATED).body(mazoRepository.save(mazo));
}
}