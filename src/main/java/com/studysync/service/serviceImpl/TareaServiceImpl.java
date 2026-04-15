package com.studysync.service.serviceImpl;
import com.studysync.model.Tarea;
import com.studysync.repository.TareaRepository;
import com.studysync.service.TareaService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TareaServiceImpl implements TareaService {
    @Autowired
    private TareaRepository tareaRepository;

    @Override
    public Tarea crear(Tarea tarea) {
        return tareaRepository.save(tarea);
    }

    @Override
    public List<Tarea> listarPorAsignatura(Long asignaturaId) {
        return tareaRepository.findByAsignaturaId(asignaturaId);
    }

    @Override
    public Tarea cambiarEstado(Long id, String estado) {
    Tarea t = tareaRepository.findById(id).orElseThrow();
    
    // Si el estado que recibes es "COMPLETADA", ponemos el boolean a true
    if ("COMPLETADA".equalsIgnoreCase(estado)) {
        t.setCompletada(true);
    } else {
        t.setCompletada(false);
    }
    
    return tareaRepository.save(t);
}
}