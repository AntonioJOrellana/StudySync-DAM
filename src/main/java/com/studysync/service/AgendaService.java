package com.studysync.service;
import com.studysync.model.Agenda;
import java.util.List;

public interface AgendaService {
    Agenda crearEvento(Agenda evento);
    List<Agenda> listarPorUsuario(Long usuarioId);
    void eliminarEvento(Long id);
}