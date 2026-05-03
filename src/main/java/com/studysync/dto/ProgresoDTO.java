package com.studysync.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data // Genera Getters, Setters, toString, equals y hashCode
@NoArgsConstructor // Genera el constructor vacío (obligatorio para Jackson)
@AllArgsConstructor // Genera un constructor con todos los campos
@Builder // Permite usar el patrón Builder para crear el objeto fácilmente
public class ProgresoDTO {

    // Estadísticas generales para los StatCards
    private double totalHorasEstudio;
    private long totalConceptos;
    private int rachaDias;
    private double promedioCalificaciones;

    // Listas para la gráfica y las materias
    private List<ActividadDiaDTO> actividadSemanal;
    private List<ProgresoAsignaturaDTO> progresoMaterias;

    // --- SUB-DTOS ---

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class ActividadDiaDTO {
        private String dia; // "L", "M", "X", "J", "V", "S", "D"
        private double horas;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class ProgresoAsignaturaDTO {
        private String nombre;
        private double horas;
        private String color;
    }
}