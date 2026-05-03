package com.studysync.service.serviceImpl;

import com.studysync.dto.ProgresoDTO;
import com.studysync.model.SesionEstudio;
import com.studysync.repository.SesionEstudioRepository;
import com.studysync.service.SesionEstudioService;
import com.studysync.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
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
        if (sesion.getFechaInicio() == null) {
            sesion.setFechaInicio(LocalDateTime.now());
        }
        return sesionRepository.save(sesion);
    }

    @Override
    public SesionEstudio finalizarSesion(Long id, Integer duracionMinutos) {
        SesionEstudio s = sesionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No existe la sesión con ID " + id));

        // Usamos setDuracion (mapeado a duracion_minutos en tu modelo)
        s.setDuracion(duracionMinutos);
        return sesionRepository.save(s);
    }

    @Override
    public List<SesionEstudio> listarPorUsuario(Long usuarioId) {
        return sesionRepository.findByUsuario_Id(usuarioId);
    }

    @Override
    public ProgresoDTO obtenerProgresoUsuario(Long usuarioId) {
        // 1. Cálculo de horas totales (evitando NullPointerException si no hay
        // sesiones)
        Long minutosTotales = sesionRepository.sumTotalMinutosByUsuario(usuarioId);
        double horasTotales = (minutosTotales != null) ? minutosTotales / 60.0 : 0.0;

        // 2. Actividad Semanal (Agrupada por día para evitar barras duplicadas)
        LocalDateTime limite = LocalDateTime.now().minusDays(7);
        List<ProgresoDTO.ActividadDiaDTO> grafica = sesionRepository.findActividadUltimaSemana(usuarioId, limite)
                .stream()
                .map(obj -> {
                    LocalDateTime fechaReferencia;

                    // Manejamos los distintos tipos que puede devolver FUNCTION('DATE', ...)
                    if (obj[0] instanceof Date) {
                        fechaReferencia = ((Date) obj[0]).toLocalDate().atStartOfDay();
                    } else if (obj[0] instanceof LocalDate) {
                        fechaReferencia = ((LocalDate) obj[0]).atStartOfDay();
                    } else if (obj[0] instanceof Timestamp) {
                        fechaReferencia = ((Timestamp) obj[0]).toLocalDateTime();
                    } else {
                        // Fallback por si viene como LocalDateTime o String
                        fechaReferencia = LocalDateTime.parse(obj[0].toString().replace(" ", "T").split("\\.")[0]);
                    }

                    return new ProgresoDTO.ActividadDiaDTO(
                            obtenerLetraDia(fechaReferencia),
                            ((Number) obj[1]).doubleValue() / 60.0);
                })
                .collect(Collectors.toList());

        // 3. Progreso por Asignatura
        List<ProgresoDTO.ProgresoAsignaturaDTO> materias = sesionRepository.findMinutosPorAsignatura(usuarioId)
                .stream()
                .map(obj -> new ProgresoDTO.ProgresoAsignaturaDTO(
                        (String) obj[0],
                        ((Number) obj[1]).doubleValue() / 60.0,
                        "#6366f1")) // Color por defecto (puedes hacerlo dinámico luego)
                .collect(Collectors.toList());

        // 4. Construcción del DTO final
        return ProgresoDTO.builder()
                .totalHorasEstudio(Math.round(horasTotales * 10.0) / 10.0)
                .rachaDias(12) // Valor de ejemplo para el dashboard
                .totalConceptos(142) // Valor de ejemplo
                .promedioCalificaciones(8.7) // Valor de ejemplo
                .actividadSemanal(grafica)
                .progresoMaterias(materias)
                .build();
    }

    /**
     * Convierte una fecha en la letra inicial del día de la semana.
     */
    private String obtenerLetraDia(LocalDateTime fecha) {
        // getValue() devuelve 1 (Lunes) a 7 (Domingo)
        // Usamos un array donde el índice coincide con el valor del día
        String[] dias = { "", "L", "M", "X", "J", "V", "S", "D" };
        return dias[fecha.getDayOfWeek().getValue()];
    }
}