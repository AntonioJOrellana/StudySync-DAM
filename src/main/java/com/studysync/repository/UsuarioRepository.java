package com.studysync.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.studysync.model.Usuario;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    // Aquí no hace falta escribir nada más por ahora. 
    // JpaRepository ya nos da los métodos para Guardar, Editar y Borrar.
}