package com.studysync.repository;

import com.studysync.model.SesionEstudio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SesionEstudioRepository extends JpaRepository<SesionEstudio, Long> {
    
    // "usuario" es el objeto en SesionEstudio
    // "id" es como se llama la variable ID en la clase Usuario
    List<SesionEstudio> findByUsuario_Id(Long idUsuario);
}