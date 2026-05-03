package com.studysync.service;

import com.studysync.dto.ProgresoDTO;
import com.studysync.model.SesionEstudio;
import java.util.List;

public interface SesionEstudioService {
    SesionEstudio iniciarSesion(SesionEstudio sesion);

    SesionEstudio finalizarSesion(Long id, Integer duracionMinutos);

    List<SesionEstudio> listarPorUsuario(Long usuarioId);

    // Este es el que probablemente te estaba causando el conflicto
    ProgresoDTO obtenerProgresoUsuario(Long usuarioId);
}