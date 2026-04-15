package com.studysync.repository;

import com.studysync.model.Agenda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AgendaRepository extends JpaRepository<Agenda, Long> {
    // Este es el método que te marcaba error en el Service
    List<Agenda> findByUsuarioId(Long usuarioId);
}