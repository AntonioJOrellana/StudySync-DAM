package com.studysync.service.serviceImpl;

import com.studysync.model.Flashcard;
import com.studysync.model.Recurso;
import com.studysync.model.MazoFlashcard;
import com.studysync.repository.FlashcardRepository;
import com.studysync.repository.RecursoRepository;
import com.studysync.repository.MazoFlashcardRepository;
import com.studysync.service.FlashcardService;
import com.studysync.exception.ResourceNotFoundException;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.io.File;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class FlashcardServiceImpl implements FlashcardService {

    @Autowired
    private FlashcardRepository flashcardRepository;

    @Autowired
    private RecursoRepository recursoRepository;

    @Autowired
    private MazoFlashcardRepository mazoRepository;

    @Value("${spring.ai.vertex.ai.gemini.api-key}")
    private String apiKey;

    @Override
    public List<Flashcard> listarTodas() {
        return flashcardRepository.findAll();
    }

    @Override
    public Flashcard guardar(Flashcard flashcard) {
        return flashcardRepository.save(flashcard);
    }

    @Override
    public Flashcard actualizarRepaso(Long id, boolean acierto) {
        Flashcard f = flashcardRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Flashcard no encontrada"));

        if (acierto) {
            f.setNivelEspaciado(f.getNivelEspaciado() + 1);
        } else {
            f.setNivelEspaciado(0);
        }

        long diasExtra = (long) Math.pow(2, f.getNivelEspaciado());
        f.setProximoRepaso(LocalDateTime.now().plusDays(diasExtra));

        return flashcardRepository.save(f);
    }

    @Override
    public List<Flashcard> generarDesdeRecurso(Long recursoId) {
        System.out.println(">>> [BACKEND] Iniciando generación desde recurso ID: " + recursoId);
        
        Recurso recurso = recursoRepository.findById(recursoId)
                .orElseThrow(() -> new ResourceNotFoundException("Recurso no encontrado"));

        // 1. EXTRAER TEXTO
        String textoPdf;
        try {
            textoPdf = extraerTextoDePdf(recurso.getUrlAcceso());
            // Limitamos el texto para no saturar la API gratuita
            if (textoPdf.length() > 5000) textoPdf = textoPdf.substring(0, 5000);
            System.out.println(">>> [PDF] Texto extraído correctamente. Longitud: " + textoPdf.length());
        } catch (Exception e) {
            System.err.println(">>> [ERROR PDF] No se pudo leer el archivo: " + e.getMessage());
            throw new RuntimeException("Error leyendo el archivo físico: " + e.getMessage());
        }

        // 2. PREPARAR PROMPT
        String promptTexto = "Analiza el siguiente texto y genera entre 3 y 5 flashcards de estudio. " +
                             "Usa estrictamente este formato por cada línea: Pregunta | Respuesta. " +
                             "No escribas introducciones ni listas numeradas. " +
                             "Texto: " + textoPdf;

        List<Flashcard> flashcardsGuardadas = new ArrayList<>();
        try {
            // 3. LLAMAR A IA
            String respuestaBruta = llamarAGeminiManual(promptTexto);
            System.out.println(">>> [IA] Respuesta recibida: " + respuestaBruta);
            
            // 4. BUSCAR O CREAR MAZO (Evita que el mazo sea null)
            MazoFlashcard mazo = null;
            List<MazoFlashcard> mazos = mazoRepository.findByAsignaturaId(recurso.getAsignatura().getId());
            
            if (mazos.isEmpty()) {
                System.out.println(">>> [MAZO] No existe mazo para esta asignatura. Creando uno...");
                mazo = new MazoFlashcard();
                mazo.setNombre("Mazo: " + recurso.getAsignatura().getNombre());
                mazo.setAsignatura(recurso.getAsignatura());
                mazo = mazoRepository.save(mazo);
            } else {
                mazo = mazos.get(0);
            }

            // 5. PROCESAR LÍNEAS Y GUARDAR
            String[] lineas = respuestaBruta.split("\n");
            for (String linea : lineas) {
                if (linea.contains("|")) {
                    Flashcard f = procesarLineaIA(linea);
                    f.setMazo(mazo); // Vinculación obligatoria
                    flashcardsGuardadas.add(flashcardRepository.save(f));
                }
            }
            System.out.println(">>> [EXITO] Se han guardado " + flashcardsGuardadas.size() + " tarjetas.");

        } catch (Exception e) {
            System.err.println(">>> [ERROR IA/DB] " + e.getMessage());
            throw new RuntimeException("Error en la generación de flashcards: " + e.getMessage());
        }

        return flashcardsGuardadas;
    }

    private String extraerTextoDePdf(String ruta) {
        try {
            // Buscamos el archivo en el sistema de archivos local
            File file = new File(ruta);
            if (!file.exists()) {
                throw new Exception("El archivo no existe en la ruta: " + file.getAbsolutePath());
            }
            try (PDDocument document = PDDocument.load(file)) {
                PDFTextStripper stripper = new PDFTextStripper();
                return stripper.getText(document);
            } 
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    @SuppressWarnings("unchecked")
    private String llamarAGeminiManual(String prompt) {
        // Si tu prueba en ThunderClient fue con 2.5 y funcionó, déjala así. 
        // Si falla, cámbiala a 1.5-flash.
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;

        Map<String, Object> body = Map.of(
            "contents", List.of(
                Map.of("parts", List.of(Map.of("text", prompt)))
            )
        );

        RestTemplate restTemplate = new RestTemplate();
        Map<String, Object> response = restTemplate.postForObject(url, body, Map.class);
        
        if (response == null || !response.containsKey("candidates")) {
            throw new RuntimeException("La respuesta de Gemini está vacía o es inválida.");
        }

        List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
        Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
        List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
        
        return (String) parts.get(0).get("text");
    }

    private Flashcard procesarLineaIA(String linea) {
        String[] partes = linea.split("\\|");
        Flashcard f = new Flashcard();
        
        if (partes.length >= 2) {
            // Limpieza básica de asteriscos o números que a veces mete la IA
            String anverso = partes[0].replaceAll("[\\*]", "").trim();
            String reverso = partes[1].replaceAll("[\\*]", "").trim();
            f.setAnverso(anverso);
            f.setReverso(reverso);
        } else {
            f.setAnverso("Concepto");
            f.setReverso(linea.trim());
        }
        
        f.setCreadaPorIa(true);
        f.setFechaCreacion(LocalDateTime.now());
        f.setProximoRepaso(LocalDateTime.now());
        f.setNivelEspaciado(0);
        
        return f;
    }
}