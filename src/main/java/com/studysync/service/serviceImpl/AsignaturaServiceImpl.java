package com.studysync.service.serviceImpl;
import com.studysync.model.Asignatura;
import com.studysync.repository.AsignaturaRepository;
import com.studysync.service.AsignaturaService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AsignaturaServiceImpl implements AsignaturaService {
    @Autowired
    private AsignaturaRepository asignaturaRepository;

    @Override
    public Asignatura crear(Asignatura asignatura) {
        return asignaturaRepository.save(asignatura);
    }

    @Override
    public List<Asignatura> listarPorUsuario(Long usuarioId) {
        return asignaturaRepository.findByUsuarioId(usuarioId);
    }

    @Override
    public void eliminar(Long id) {
        asignaturaRepository.deleteById(id);
    }
}