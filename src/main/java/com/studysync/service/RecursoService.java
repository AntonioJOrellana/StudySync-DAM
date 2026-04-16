package com.studysync.service;

import com.studysync.model.Recurso;
import java.util.List;

public interface RecursoService {
    List<Recurso> listarPorAsignatura(Long idAsignatura);
    Recurso guardarRecurso(Recurso recurso);
    void eliminarRecurso(Long id);
}