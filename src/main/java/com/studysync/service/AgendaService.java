package com.studysync.service;

import com.studysync.model.Agenda;
import java.util.List;

public interface AgendaService {
    Agenda crearEvento(Agenda evento);

    List<Agenda> listarPorUsuario(Long usuarioId); // Nombre unificado

    void eliminarEvento(Long id);

    Agenda actualizarEvento(Long id, Agenda evento);

}