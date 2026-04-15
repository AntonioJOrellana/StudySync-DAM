package com.studysync.service.serviceImpl;
import com.studysync.model.Usuario;
import com.studysync.repository.UsuarioRepository;
import com.studysync.service.UsuarioService;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UsuarioServiceImpl implements UsuarioService {
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public Usuario registrar(Usuario usuario) {
        // Aquí podrías añadir lógica para cifrar contraseña en el futuro
        return usuarioRepository.save(usuario);
    }

    @Override
    public Optional<Usuario> buscarPorEmail(String email) {
        return Optional.empty();
    }

    @Override
    public Usuario actualizarPerfil(Long id, Usuario datosActualizados) {
        return usuarioRepository.findById(id).map(u -> {
            u.setUsername(datosActualizados.getUsername());
            u.setEmail(datosActualizados.getEmail());
            return usuarioRepository.save(u);
        }).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }
}