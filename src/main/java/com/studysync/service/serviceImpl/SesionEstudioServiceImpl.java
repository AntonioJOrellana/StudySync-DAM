package com.studysync.service.serviceImpl;
import com.studysync.model.SesionEstudio;
import com.studysync.repository.SesionEstudioRepository;
import com.studysync.service.SesionEstudioService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SesionEstudioServiceImpl implements SesionEstudioService {
    @Autowired
    private SesionEstudioRepository sesionRepository;

    @Override
    public SesionEstudio iniciarSesion(SesionEstudio sesion) {
        return sesionRepository.save(sesion);
    }

    @Override
    public SesionEstudio finalizarSesion(Long id, Integer duracionMinutos) {
        SesionEstudio s = sesionRepository.findById(id).orElseThrow();
        s.setDuracion(duracionMinutos);
        // Aquí podrías añadir lógica para marcar la fecha de fin
        return sesionRepository.save(s);
    }

    @Override
    public List<SesionEstudio> listarPorUsuario(Long usuarioId) {
        return sesionRepository.findByUsuarioId(usuarioId);
    }
}