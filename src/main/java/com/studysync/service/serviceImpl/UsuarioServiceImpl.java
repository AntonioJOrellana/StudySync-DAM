package com.studysync.service.serviceImpl;

import com.studysync.model.Usuario;
import com.studysync.repository.UsuarioRepository;
import com.studysync.service.UsuarioService;
import com.studysync.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;
import java.util.List; // <--- Asegúrate de tener este import

@Service
public class UsuarioServiceImpl implements UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    @Override
    public Usuario registrar(Usuario usuario) {
        if (usuario.getEmail() == null || usuario.getEmail().isEmpty()) {
            throw new RuntimeException("El email es obligatorio para el registro.");
        }
        
        if (usuarioRepository.findByEmail(usuario.getEmail()).isPresent()) {
            throw new RuntimeException("El correo electrónico ya está registrado.");
        }

        return usuarioRepository.save(usuario);
    }

    @Override
    public Optional<Usuario> buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    @Override
    public Usuario actualizarPerfil(Long id, Usuario datosActualizados) {
        return usuarioRepository.findById(id).map(u -> {
            u.setUsername(datosActualizados.getUsername());
            u.setEmail(datosActualizados.getEmail());
            if (datosActualizados.getUrlAvatar() != null) {
                u.setUrlAvatar(datosActualizados.getUrlAvatar());
            }
            return usuarioRepository.save(u);
        }).orElseThrow(() -> new ResourceNotFoundException("No se puede actualizar: El usuario con ID " + id + " no existe."));
    }
}