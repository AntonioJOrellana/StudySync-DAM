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
        List<MazoFlashcard> mazos = mazoRepository.findByUsuarioId(usuarioId);
        return ResponseEntity.ok(mazos);
    }

    @PostMapping
    public ResponseEntity<MazoFlashcard> crearMazo(@RequestBody Map<String, Object> payload) {
        try {
            // 1. Extraer y validar Asignatura
            Map<String, Object> asigMap = (Map<String, Object>) payload.get("asignatura");
            if (asigMap == null) {
                System.out.println("Error: El campo 'asignatura' es nulo en el payload");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
            }

            Object idAsignaturaRaw = asigMap.get("id") != null ? asigMap.get("id") : asigMap.get("id_asignatura");
            if (idAsignaturaRaw == null) {
                System.out.println("Error: No se encontró ID en el objeto asignatura");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
            }
            Long asignaturaId = Long.valueOf(idAsignaturaRaw.toString());

            // 2. Extraer y validar Usuario
            Map<String, Object> userMap = (Map<String, Object>) payload.get("usuario");
            if (userMap == null || userMap.get("id") == null) {
                System.out.println("Error: El campo 'usuario' o su 'id' es nulo");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
            }
            Long usuarioId = Long.valueOf(userMap.get("id").toString());

            // 3. Buscar entidades en la BD
            Asignatura asignatura = asignaturaRepository.findById(asignaturaId)
                    .orElseThrow(() -> new ResourceNotFoundException("Asignatura no existe con ID: " + asignaturaId));

            Usuario usuario = usuarioRepository.findById(usuarioId)
                    .orElseThrow(() -> new ResourceNotFoundException("Usuario no existe con ID: " + usuarioId));

            // 4. Crear y configurar el nuevo mazo
            MazoFlashcard mazo = new MazoFlashcard();
            mazo.setNombre((String) payload.get("nombre"));

            if (payload.containsKey("descripcion")) {
                mazo.setDescripcion((String) payload.get("descripcion"));
            }

            mazo.setAsignatura(asignatura);
            mazo.setUsuario(usuario);

            // 5. Guardar y retornar
            MazoFlashcard guardado = mazoRepository.save(mazo);
            return ResponseEntity.status(HttpStatus.CREATED).body(guardado);

        } catch (ResourceNotFoundException e) {
            System.out.println("Error de recurso: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            System.out.println("Error interno al crear mazo:");
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<MazoFlashcard> actualizarMazo(@PathVariable Long id,
            @RequestBody Map<String, Object> payload) {
        try {
            MazoFlashcard mazoExistente = mazoRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Mazo no encontrado con ID: " + id));

            // Actualizar nombre
            if (payload.containsKey("nombre")) {
                mazoExistente.setNombre((String) payload.get("nombre"));
            }

            // Actualizar descripción si viene en el payload
            if (payload.containsKey("descripcion")) {
                mazoExistente.setDescripcion((String) payload.get("descripcion"));
            }

            // Actualizar Asignatura si se proporciona
            if (payload.containsKey("asignatura")) {
                Map<String, Object> asigMap = (Map<String, Object>) payload.get("asignatura");
                Object idAsigRaw = asigMap.get("id") != null ? asigMap.get("id") : asigMap.get("id_asignatura");

                if (idAsigRaw != null) {
                    Long asignaturaId = Long.valueOf(idAsigRaw.toString());
                    Asignatura nuevaAsignatura = asignaturaRepository.findById(asignaturaId)
                            .orElseThrow(() -> new ResourceNotFoundException(
                                    "Asignatura no existe con ID: " + asignaturaId));
                    mazoExistente.setAsignatura(nuevaAsignatura);
                }
            }

            MazoFlashcard actualizado = mazoRepository.save(mazoExistente);
            return ResponseEntity.ok(actualizado);

        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarMazo(@PathVariable Long id) {
        try {
            mazoRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al borrar");
        }
    }
}