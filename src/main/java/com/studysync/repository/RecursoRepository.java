package com.studysync.repository;

import com.studysync.model.Recurso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RecursoRepository extends JpaRepository<Recurso, Long> {
    
    // "Asignatura" es el objeto en Recurso.java
    // "Id" es la variable en Asignatura.java
    List<Recurso> findByAsignatura_Id(Long idAsignatura);
}