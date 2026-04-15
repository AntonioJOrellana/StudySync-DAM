package com.studysync.service.serviceImpl;
import com.studysync.model.Agenda;
import com.studysync.repository.AgendaRepository;
import com.studysync.service.AgendaService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AgendaServiceImpl implements AgendaService {
    @Autowired
    private AgendaRepository agendaRepository;

    @Override
    public Agenda crearEvento(Agenda evento) {
        return agendaRepository.save(evento);
    }

    @Override
    public List<Agenda> listarPorUsuario(Long usuarioId) {
        return agendaRepository.findByUsuarioId(usuarioId);
    }

    @Override
    public void eliminarEvento(Long id) {
        agendaRepository.deleteById(id);
    }
}