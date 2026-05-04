package com.studysync.service.serviceImpl;

import com.studysync.model.Recurso;
import com.studysync.model.Asignatura;
import com.studysync.repository.RecursoRepository;
import com.studysync.repository.AsignaturaRepository;
import com.studysync.service.RecursoService;
import com.studysync.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
public class RecursoServiceImpl implements RecursoService {

    @Autowired
    private RecursoRepository recursoRepository;

    @Autowired
    private AsignaturaRepository asignaturaRepository;

    // DEFINE AQUÍ TU RUTA EXTERNA (Cámbiala a la carpeta que quieras en tu PC)
    private final String DIRECTORIO_SUBIDAS = "C:/studysync_files/uploads/";

    @Override
    public List<Recurso> listarPorAsignatura(Long idAsignatura) {
        return recursoRepository.findByAsignatura_Id(idAsignatura);
    }

    @Override
    public Recurso procesarYGuardar(String nombre, String tipo, Long idAsignatura, MultipartFile archivo) {
        Asignatura asig = asignaturaRepository.findById(idAsignatura)
                .orElseThrow(() -> new ResourceNotFoundException("Asignatura no encontrada con ID: " + idAsignatura));

        Recurso recurso = new Recurso();
        recurso.setNombre(nombre);
        recurso.setAsignatura(asig);
        
        try {
            recurso.setTipo(Recurso.TipoRecurso.valueOf(tipo.toLowerCase().trim()));
        } catch (Exception e) {
            recurso.setTipo(Recurso.TipoRecurso.otro);
        }

        if (archivo != null && !archivo.isEmpty()) {
            try {
                // 1. Crear el directorio si no existe
                File directorio = new File(DIRECTORIO_SUBIDAS);
                if (!directorio.exists()) directorio.mkdirs();

                // 2. Definir la ruta completa del archivo
                String nombreArchivo = System.currentTimeMillis() + "_" + archivo.getOriginalFilename();
                Path rutaCompleta = Paths.get(DIRECTORIO_SUBIDAS + nombreArchivo);

                // 3. GUARDAR EL ARCHIVO FÍSICAMENTE EN EL DISCO
                Files.copy(archivo.getInputStream(), rutaCompleta);

                // 4. Guardamos la RUTA ABSOLUTA en la BD para que la IA la encuentre
                recurso.setUrlAcceso(rutaCompleta.toString());
                
                long sizeInKb = archivo.getSize() / 1024;
                recurso.setMetadata(sizeInKb + " KB");

            } catch (IOException e) {
                throw new RuntimeException("Error al guardar el archivo físico: " + e.getMessage());
            }
        } else {
            recurso.setUrlAcceso("enlace-externo");
            recurso.setMetadata("URL");
        }

        return recursoRepository.save(recurso);
    }

    @Override
    public Recurso guardarRecurso(Recurso recurso) {
        return recursoRepository.save(recurso);
    }

    @Override
    public void eliminarRecurso(Long id) {
        Recurso recurso = recursoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No existe el recurso " + id));
        
        // Opcional: Borrar el archivo del disco cuando borres el recurso
        try {
            Files.deleteIfExists(Paths.get(recurso.getUrlAcceso()));
        } catch (IOException ignored) {}

        recursoRepository.deleteById(id);
    }
}