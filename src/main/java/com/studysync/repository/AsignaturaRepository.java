package com.studysync.repository;

import com.studysync.model.Asignatura;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional; // Importación obligatoria
import java.util.List;

public interface AsignaturaRepository extends JpaRepository<Asignatura, Long> {

    @Query("SELECT DISTINCT a FROM Asignatura a " +
       "LEFT JOIN FETCH a.recursos " + 
       "WHERE a.id = :id")
    Optional<Asignatura> findByIdConDetalles(@Param("id") Long id);
    List<Asignatura> findByUsuario_Id(Long usuarioId);
}