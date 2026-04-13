package com.studysync.controller;

import com.studysync.model.Usuario;
import com.studysync.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping; // Importante
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Obtener todos los usuarios
    @GetMapping
    public List<Usuario> obtenerTodos() {
        return usuarioRepository.findAll();
    }

    @PostMapping("/registro")
    public Usuario registrarUsuario(@RequestBody Usuario nuevoUsuario) {
    // Por ahora lo guardamos tal cual, más adelante cifreremos la contraseña
    return usuarioRepository.save(nuevoUsuario);
    }

    @PostMapping("/login")
public ResponseEntity<?> login(@RequestBody Usuario datosLogin) {
    Usuario user = usuarioRepository.findByEmail(datosLogin.getEmail());

    if (user != null && user.getPassword().equals(datosLogin.getPassword())) {
        return ResponseEntity.ok(user); // Status 200 + Datos del usuario
    } else {
        return ResponseEntity.status(401).body("Credenciales incorrectas"); // Status 401 + Mensaje
    }
    }
}