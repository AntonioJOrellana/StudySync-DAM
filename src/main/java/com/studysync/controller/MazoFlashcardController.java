package com.studysync.controller;

import com.studysync.exception.ResourceNotFoundException;
import com.studysync.model.Asignatura;
import com.studysync.model.MazoFlashcard;
import com.studysync.model.Usuario;
import com.studysync.repository.AsignaturaRepository;
import com.studysync.repository.MazoFlashcardRepository;
import com.studysync.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/mazos")
public class MazoFlashcardController {

    @Autowired
    private MazoFlashcardRepository mazoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private AsignaturaRepository asignaturaRepository;

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<MazoFlashcard>> listarPorUsuario(@PathVariable Long usuarioId) {
        // Importante: Asegúrate de que en tu modelo MazoFlashcard.java
        // la relación con Asignatura NO tenga @JsonIgnore
        List<MazoFlashcard> mazos = mazoRepository.findByUsuarioId(usuarioId);
        return ResponseEntity.ok(mazos);
    }

    @PostMapping
    public ResponseEntity<MazoFlashcard> crearMazo(@RequestBody Map<String, Object> payload) {
        try {
            Map<String, Object> asigMap = (Map<String, Object>) payload.get("asignatura");
            Long asignaturaId = Long.valueOf(asigMap.get("id_asignatura").toString());

            Map<String, Object> userMap = (Map<String, Object>) payload.get("usuario");
            Long usuarioId = Long.valueOf(userMap.get("id").toString());

            Asignatura asignatura = asignaturaRepository.findById(asignaturaId)
                    .orElseThrow(() -> new ResourceNotFoundException("Asignatura no existe"));

            Usuario usuario = usuarioRepository.findById(usuarioId)
                    .orElseThrow(() -> new ResourceNotFoundException("Usuario no existe"));

            MazoFlashcard mazo = new MazoFlashcard();
            mazo.setNombre((String) payload.get("nombre"));
            mazo.setDescripcion((String) payload.get("descripcion"));
            mazo.setAsignatura(asignatura);
            mazo.setUsuario(usuario);

            MazoFlashcard guardado = mazoRepository.save(mazo);
            return ResponseEntity.status(HttpStatus.CREATED).body(guardado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
}