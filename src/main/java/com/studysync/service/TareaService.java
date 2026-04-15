package com.studysync.service;
import com.studysync.model.Tarea;
import java.util.List;

public interface TareaService {
    Tarea crear(Tarea tarea);
    List<Tarea> listarPorAsignatura(Long asignaturaId);
    Tarea cambiarEstado(Long id, String estado);
}