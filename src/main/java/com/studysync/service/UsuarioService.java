package com.studysync.service;

import com.studysync.model.Usuario;
import java.util.Optional;
import java.util.List; // <--- Añadido

public interface UsuarioService {
    Usuario registrar(Usuario usuario);
    Optional<Usuario> buscarPorEmail(String email);
    Usuario actualizarPerfil(Long id, Usuario usuario);
    List<Usuario> listarTodos(); // <--- Nuevo método
}