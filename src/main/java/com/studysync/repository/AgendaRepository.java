package com.studysync.repository;

import com.studysync.model.Agenda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AgendaRepository extends JpaRepository<Agenda, Long> {
    // Buscamos dentro del objeto 'usuario' su atributo 'id'
    List<Agenda> findByUsuario_Id(Long id);
}