package com.studysync.controller;

import com.studysync.model.Asignatura;
import com.studysync.model.SesionEstudio;
import com.studysync.service.AsignaturaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/asignaturas")
public class AsignaturaController {

    @Autowired
    private AsignaturaService asignaturaService;

    // Obtener todas las asignaturas de un usuario
    @GetMapping("/usuario/{id}")
    public List<Asignatura> listarPorUsuario(@PathVariable Long id) {
        return asignaturaService.listarPorUsuario(id);
    }

    // NUEVO: Estadísticas globales para la pestaña de PROGRESO
    @GetMapping("/usuario/{id}/estadisticas-globales")
    public ResponseEntity<Map<String, Object>> obtenerEstadisticasGlobales(@PathVariable Long id) {
        List<Asignatura> asignaturas = asignaturaService.listarPorUsuario(id);
        
        // 1. Calcular Total de Flashcards de todos los mazos de todas las materias
        int totalFlashcards = asignaturas.stream()
            .filter(a -> a.getMazos() != null)
            .flatMap(a -> a.getMazos().stream())
            .filter(m -> m.getFlashcards() != null)
            .mapToInt(m -> m.getFlashcards().size())
            .sum();
            
        // 2. Calcular Total de Horas de todas las sesiones de todas las materias
        double totalMinutos = asignaturas.stream()
            .filter(a -> a.getSesiones() != null)
            .flatMap(a -> a.getSesiones().stream())
            .filter(s -> s.getDuracion() != null)
            .mapToDouble(SesionEstudio::getDuracion)
            .sum();

        // 3. Obtener todas las fechas de sesiones para calcular la racha y el gráfico
        List<LocalDate> fechasSesiones = asignaturas.stream()
            .filter(a -> a.getSesiones() != null)
            .flatMap(a -> a.getSesiones().stream())
            .filter(s -> s.getFechaInicio() != null)
            .map(s -> s.getFechaInicio().toLocalDate())
            .distinct()
            .sorted(Comparator.reverseOrder())
            .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("totalFlashcards", totalFlashcards);
        response.put("totalHoras", totalMinutos / 60.0);
        response.put("rachaDias", calcularRacha(fechasSesiones));
        
        return ResponseEntity.ok(response);
    }

    // Obtener UNA asignatura por su ID (Para detalles)
    @GetMapping("/{id}")
    public ResponseEntity<Asignatura> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(asignaturaService.obtenerPorId(id));
    }

    @PostMapping
    public Asignatura crear(@RequestBody Asignatura asignatura) {
        return asignaturaService.crear(asignatura);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Asignatura> editar(@PathVariable Long id, @RequestBody Asignatura detalles) {
        detalles.setId(id);
        return ResponseEntity.ok(asignaturaService.crear(detalles));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        asignaturaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    // Lógica privada para calcular la racha de días consecutivos
    private int calcularRacha(List<LocalDate> fechas) {
        if (fechas.isEmpty()) return 0;
        
        int racha = 0;
        LocalDate hoy = LocalDate.now();
        LocalDate verificador = fechas.get(0);

        // Si la última sesión no fue ni hoy ni ayer, la racha se rompió
        if (!verificador.equals(hoy) && !verificador.equals(hoy.minusDays(1))) {
            return 0;
        }

        for (int i = 0; i < fechas.size(); i++) {
            if (i == 0) {
                racha++;
                continue;
            }
            // Si el día anterior en la lista es exactamente un día después que el actual, sigue la racha
            if (fechas.get(i-1).minusDays(1).equals(fechas.get(i))) {
                racha++;
            } else {
                break;
            }
        }
        return racha;
    }
}