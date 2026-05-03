package com.studysync.repository;

import com.studysync.model.SesionEstudio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SesionEstudioRepository extends JpaRepository<SesionEstudio, Long> {

    /**
     * Busca sesiones por ID de usuario.
     */
    List<SesionEstudio> findByUsuario_Id(Long idUsuario);

    /**
     * Suma total de minutos de estudio de un usuario.
     */
    @Query("SELECT SUM(s.duracion) FROM SesionEstudio s WHERE s.usuario.id = :idUsuario")
    Long sumTotalMinutosByUsuario(@Param("idUsuario") Long idUsuario);

    /**
     * Minutos totales por asignatura para el gráfico circular/barras de materias.
     */
    @Query("SELECT s.asignatura.nombre, SUM(s.duracion) FROM SesionEstudio s " +
            "WHERE s.usuario.id = :idUsuario " +
            "GROUP BY s.asignatura.nombre")
    List<Object[]> findMinutosPorAsignatura(@Param("idUsuario") Long idUsuario);

    /**
     * Actividad semanal agrupada por DÍA.
     * FUNCTION('DATE', s.fechaInicio) extrae solo la fecha (YYYY-MM-DD),
     * evitando que sesiones en distintas horas del mismo día creen barras
     * separadas.
     */
    @Query("SELECT FUNCTION('DATE', s.fechaInicio), SUM(s.duracion) FROM SesionEstudio s " +
            "WHERE s.usuario.id = :idUsuario AND s.fechaInicio >= :fechaLimite " +
            "GROUP BY FUNCTION('DATE', s.fechaInicio) " +
            "ORDER BY FUNCTION('DATE', s.fechaInicio) ASC")
    List<Object[]> findActividadUltimaSemana(@Param("idUsuario") Long idUsuario,
            @Param("fechaLimite") LocalDateTime fechaLimite);
}