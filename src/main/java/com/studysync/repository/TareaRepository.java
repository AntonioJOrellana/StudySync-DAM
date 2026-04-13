package com.studysync.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.studysync.model.Tarea;

@Repository
public interface TareaRepository extends JpaRepository<Tarea, Long> {
    // Aquí ya tienes todos los métodos para gestionar tareas
}