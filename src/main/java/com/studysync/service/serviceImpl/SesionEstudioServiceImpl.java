package com.studysync.service.serviceImpl;

import com.studysync.dto.ProgresoDTO;
import com.studysync.model.SesionEstudio;
import com.studysync.repository.SesionEstudioRepository;
import com.studysync.service.SesionEstudioService;
import com.studysync.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.ArrayList;
import java.util.stream.Collectors;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.sql.Timestamp;
import java.sql.Date;

@Service
public class SesionEstudioServiceImpl implements SesionEstudioService {

    @Autowired
    private SesionEstudioRepository sesionRepository;

    @Override
    public SesionEstudio iniciarSesion(SesionEstudio sesion) {
        // Si el frontend no manda fecha, la ponemos nosotros
        if (sesion.getFechaInicio() == null) {
            sesion.setFechaInicio(LocalDateTime.now());
        }
        // Forzamos el tipo si llega vacío
        if (sesion.getTipo() == null) {
            sesion.setTipo(SesionEstudio.TipoSesion.estudio);
        }
        return sesionRepository.save(sesion);
    }

    @Override
    public SesionEstudio finalizarSesion(Long id, Integer duracionMinutos) {
        SesionEstudio s = sesionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No existe la sesión con ID " + id));
        s.setDuracion(duracionMinutos);
        return sesionRepository.save(s);
    }

    @Override
    public List<SesionEstudio> listarPorUsuario(Long usuarioId) {
        return sesionRepository.findByUsuario_Id(usuarioId);
    }

    @Override
    public ProgresoDTO obtenerProgresoUsuario(Long usuarioId) {
        Long minutosTotales = sesionRepository.sumTotalMinutosByUsuario(usuarioId);
        double horasTotales = (minutosTotales != null) ? minutosTotales / 60.0 : 0.0;

        LocalDateTime limite = LocalDateTime.now().minusDays(7);
        List<Object[]> resultadosSemana = sesionRepository.findActividadUltimaSemana(usuarioId, limite);
        
        List<ProgresoDTO.ActividadDiaDTO> grafica = (resultadosSemana == null) ? new ArrayList<>() : 
            resultadosSemana.stream()
                .map(obj -> {
                    LocalDateTime fechaRef = LocalDateTime.now();
                    if (obj[0] instanceof Date) fechaRef = ((Date) obj[0]).toLocalDate().atStartOfDay();
                    else if (obj[0] instanceof Timestamp) fechaRef = ((Timestamp) obj[0]).toLocalDateTime();
                    
                    return new ProgresoDTO.ActividadDiaDTO(
                            obtenerLetraDia(fechaRef),
                            ((Number) obj[1]).doubleValue() / 60.0);
                })
                .collect(Collectors.toList());

        return ProgresoDTO.builder()
                .totalHorasEstudio(Math.round(horasTotales * 10.0) / 10.0)
                .actividadSemanal(grafica)
                .build();
    }

    private String obtenerLetraDia(LocalDateTime fecha) {
        String[] dias = { "", "L", "M", "X", "J", "V", "S", "D" };
        return dias[fecha.getDayOfWeek().getValue()];
    }
}