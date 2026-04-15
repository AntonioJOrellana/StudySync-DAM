package com.studysync.service;
import com.studysync.model.Usuario;
import java.util.Optional;

public interface UsuarioService {
    Usuario registrar(Usuario usuario);
    Optional<Usuario> buscarPorEmail(String email);
    Usuario actualizarPerfil(Long id, Usuario usuario);
}