package com.studysync.controller;

import com.studysync.model.Usuario;
import com.studysync.service.UsuarioService; // <--- Usamos el Service
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/usuarios") // <--- Añadido /api
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService; // <--- Inyectamos el Service

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // Obtener todos los usuarios (Útil para admin)
    @GetMapping
    public ResponseEntity<List<Usuario>> obtenerTodos() {
        // Podrías añadir un listarTodos() en el Service
        return ResponseEntity.ok(usuarioService.listarTodos()); 
    }

    // REGISTRO
    @PostMapping("/registrar")
    public ResponseEntity<?> registrar(@RequestBody Usuario usuario) {
        // La lógica de verificar si el email existe ya la pusimos en el UsuarioServiceImpl
        // Eso hace que este método sea mucho más limpio
        try {
            // Ciframos antes de pasar al service (o podrías hacerlo dentro del service)
            usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
            Usuario nuevoUsuario = usuarioService.registrar(usuario);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoUsuario);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario loginReq) {
        Optional<Usuario> userOpt = usuarioService.buscarPorEmail(loginReq.getEmail());

        if (userOpt.isPresent() && passwordEncoder.matches(loginReq.getPassword(), userOpt.get().getPassword())) {
            // ¡Importante! En una app real, aquí enviarías un Token (JWT)
            // Por ahora, enviamos el objeto usuario (sin la password por seguridad si puedes)
            return ResponseEntity.ok(userOpt.get());
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email o contraseña incorrectos");
    }

    // ACTUALIZAR PERFIL (Nombre, Email, etc.)
    @PutMapping("/{id}")
    public ResponseEntity<Usuario> actualizar(@PathVariable Long id, @RequestBody Usuario datos) {
        return ResponseEntity.ok(usuarioService.actualizarPerfil(id, datos));
    }

    // CAMBIAR PASSWORD (PATCH)
    @PatchMapping("/{id}/password")
    public ResponseEntity<?> cambiarPassword(@PathVariable Long id, @RequestBody String nuevaPassword) {
        // Podrías mover esto al Service para mantener el estándar
        Usuario usuario = usuarioService.actualizarPerfil(id, null); // O un método específico
        usuario.setPassword(passwordEncoder.encode(nuevaPassword));
        usuarioService.registrar(usuario); // Re-guardamos
        return ResponseEntity.ok("Contraseña actualizada con éxito");
    }
}