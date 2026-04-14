package com.studysync.repository;

import com.studysync.model.Tarea;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TareaRepository extends JpaRepository<Tarea, Integer> {
    // Este método será vital: buscar tareas por el ID del usuario
    List<Tarea> findByUsuarioId(Integer usuarioId);

}