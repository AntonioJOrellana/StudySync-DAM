package com.studysync.service.serviceImpl;

import com.studysync.model.SesionEstudio;
import com.studysync.repository.SesionEstudioRepository;
import com.studysync.service.SesionEstudioService;
import com.studysync.exception.ResourceNotFoundException; // <--- Importante
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.time.LocalDateTime;

@Service
public class SesionEstudioServiceImpl implements SesionEstudioService {

    @Autowired
    private SesionEstudioRepository sesionRepository;

    @Override
    public SesionEstudio iniciarSesion(SesionEstudio sesion) {
        // Al iniciar, nos aseguramos de que la fecha de inicio sea ahora
        if (sesion.getFechaInicio() == null) {
            sesion.setFechaInicio(LocalDateTime.now());
        }
        return sesionRepository.save(sesion);
    }

    @Override
    public SesionEstudio finalizarSesion(Long id, Integer duracionMinutos) {
        // Cambiamos el orElseThrow vacío por nuestra excepción con mensaje
        SesionEstudio s = sesionRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("No se puede finalizar: No existe ninguna sesión activa con el ID " + id));
        
        if (duracionMinutos != null && duracionMinutos < 0) {
            throw new RuntimeException("La duración de la sesión no puede ser negativa.");
        }

        s.setDuracion(duracionMinutos);
        // Podrías añadir s.setFechaFin(LocalDateTime.now()) si tuvieras ese campo
        
        return sesionRepository.save(s);
    }

    @Override
    public List<SesionEstudio> listarPorUsuario(Long usuarioId) {
        List<SesionEstudio> sesiones = sesionRepository.findByUsuario_Id(usuarioId);
        
        if (sesiones.isEmpty()) {
            throw new ResourceNotFoundException("El usuario con ID " + usuarioId + " aún no ha registrado sesiones de estudio.");
        }
        
        return sesiones;
    }
}