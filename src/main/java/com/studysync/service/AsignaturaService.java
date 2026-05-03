package com.studysync.service;

import com.studysync.model.Asignatura;
import java.util.List;

public interface AsignaturaService {
    Asignatura crear(Asignatura asignatura);

    List<Asignatura> listarPorUsuario(Long usuarioId);

    void eliminar(Long id);

    // Nuevo método para la página de detalles
    Asignatura obtenerPorId(Long id);
}