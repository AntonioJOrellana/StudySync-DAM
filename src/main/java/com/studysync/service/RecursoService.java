package com.studysync.service;

import com.studysync.model.Recurso;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public interface RecursoService {
    List<Recurso> listarPorAsignatura(Long idAsignatura);
    Recurso guardarRecurso(Recurso recurso); // Mantener para compatibilidad
    Recurso procesarYGuardar(String nombre, String tipo, Long idAsignatura, MultipartFile archivo);
    void eliminarRecurso(Long id);
}