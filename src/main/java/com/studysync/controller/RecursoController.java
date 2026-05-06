package com.studysync.controller;

import com.studysync.model.Recurso;
import com.studysync.service.RecursoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/recursos")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class RecursoController {

    @Autowired
    private RecursoService recursoService;

    @GetMapping("/asignatura/{asignaturaId}")
    public ResponseEntity<List<Recurso>> listarPorAsignatura(@PathVariable Long asignaturaId) {
        List<Recurso> recursos = recursoService.listarPorAsignatura(asignaturaId);
        return ResponseEntity.ok(recursos);
    }

    @PostMapping("/subir")
    public ResponseEntity<Recurso> guardarRecurso(
        @RequestParam("nombre") String nombre,
        @RequestParam("tipo") String tipo,
        @RequestParam("idAsignatura") Long idAsignatura,
        @RequestParam(value = "archivo", required = false) MultipartFile archivo,
        @RequestParam(value = "urlEnlace", required = false) String urlEnlace) { // <--- Falta este parámetro
    
    // Si es tipo enlace o video, y no viene archivo, usamos la urlEnlace
    if ((tipo.equals("enlace") || tipo.equals("video")) && (archivo == null || archivo.isEmpty())) {
        Recurso nuevoRecurso = recursoService.guardarEnlace(nombre, tipo, idAsignatura, urlEnlace);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoRecurso);
    }
    
    // Para PDF y OTRO (archivos físicos)
    Recurso nuevoRecurso = recursoService.procesarYGuardar(nombre, tipo, idAsignatura, archivo);
    return ResponseEntity.status(HttpStatus.CREATED).body(nuevoRecurso);
}

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarRecurso(@PathVariable Long id) {
        recursoService.eliminarRecurso(id);
        return ResponseEntity.noContent().build();
    }
}