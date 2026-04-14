package com.studysync.controller;

import com.studysync.model.Usuario;
import com.studysync.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping; // Importante
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000") // El puerto por defecto de React
@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // Obtener todos los usuarios
    @GetMapping
    public List<Usuario> obtenerTodos() {
        return usuarioRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> registrar(@RequestBody Usuario usuario) {
    // 1. Verificación de seguridad: ¿Ya existe el email?
    if (usuarioRepository.findByEmail(usuario.getEmail()) != null) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                             .body("Error: El email ya está en uso.");
    }

    // 2. Cifrado: Transformamos la clave real en un Hash
    String passwordCifrada = passwordEncoder.encode(usuario.getPassword());
    usuario.setPassword(passwordCifrada);

    // 3. Guardado
    Usuario nuevoUsuario = usuarioRepository.save(usuario);
    
    // 4. Respuesta profesional (201 Created)
    return new ResponseEntity<>(nuevoUsuario, HttpStatus.CREATED);
}

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario loginReq) { 
    Usuario user = usuarioRepository.findByEmail(loginReq.getEmail());
    
    if (user != null && passwordEncoder.matches(loginReq.getPassword(), user.getPassword())) {
        return ResponseEntity.ok(user);
    }
    return ResponseEntity.status(401).body("Credenciales incorrectas");
}

    @PatchMapping("/{id}/password")
    public ResponseEntity<?> cambiarPassword(@PathVariable Integer id, @RequestBody String nuevaPassword) {
    return usuarioRepository.findById(id).map(usuario -> {
        // CIFRAMOS la nueva contraseña
        usuario.setPassword(passwordEncoder.encode(nuevaPassword));
        usuarioRepository.save(usuario);
        return ResponseEntity.ok("Contraseña cifrada y actualizada");
    }).orElse(ResponseEntity.notFound().build());
}
}