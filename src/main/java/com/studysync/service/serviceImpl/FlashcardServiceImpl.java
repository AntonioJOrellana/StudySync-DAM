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
    public List<Flashcard> generarDesdeRecurso(Long recursoId) {
        System.out.println("--- INICIANDO GENERACIÓN MÚLTIPLE DE FLASHCARDS ---");
        
        Recurso recurso = recursoRepository.findById(recursoId)
                .orElseThrow(() -> new ResourceNotFoundException("Recurso no encontrado"));

        System.out.println("1. Recurso encontrado: " + recurso.getNombre());
        
        String textoPdf;
        try {
            textoPdf = extraerTextoDePdf(recurso.getUrlAcceso());
            if (textoPdf.length() > 5000) textoPdf = textoPdf.substring(0, 5000);
            System.out.println("3. Texto extraído (longitud limitada): " + textoPdf.length());
        } catch (Exception e) {
            System.out.println("ERROR EN PASO 3 (PDF): " + e.getMessage());
            throw e;
        }

        // Nuevo prompt para pedir una lista limpia de varias tarjetas
        String promptTexto = "Analiza el siguiente texto y genera entre 3 y 5 flashcards de estudio. " +
                             "Usa estrictamente este formato por cada línea: Pregunta | Respuesta. " +
                             "No escribas introducciones ni listas numeradas, solo la línea con el separador |. " +
                             "Texto: " + textoPdf;

        List<Flashcard> flashcardsGuardadas = new ArrayList<>();
        try {
            // Obtenemos el texto bruto con todas las preguntas
            String respuestaBruta = llamarAGeminiManual(promptTexto);
            
            // Buscamos el mazo
            MazoFlashcard mazo = null;
            List<MazoFlashcard> mazos = mazoRepository.findByAsignaturaId(recurso.getAsignatura().getId());
            if (!mazos.isEmpty()) {
                mazo = mazos.get(0);
            }

            // Procesamos cada línea como una Flashcard individual
            String[] lineas = respuestaBruta.split("\n");
            for (String linea : lineas) {
                if (linea.contains("|")) {
                    Flashcard f = procesarLineaIA(linea);
                    f.setMazo(mazo);
                    // GUARDADO INDIVIDUAL EN BD
                    flashcardsGuardadas.add(flashcardRepository.save(f));
                    System.out.println("✅ Flashcard guardada individualmente: " + f.getAnverso());
                }
            }
            
            System.out.println("4. Proceso completado. Total guardadas: " + flashcardsGuardadas.size());
            
        } catch (Exception e) {
            System.out.println("ERROR EN PASO 4 (GEMINI): " + e.getMessage());
            throw new RuntimeException("Error en la IA: " + e.getMessage());
        }

        return flashcardsGuardadas;
    }

    private String extraerTextoDePdf(String ruta) {
        try {
            File file = new File(ruta);
            try (PDDocument document = PDDocument.load(file)) {
                PDFTextStripper stripper = new PDFTextStripper();
                return stripper.getText(document);
            } 
        } catch (Exception e) {
            throw new RuntimeException("Error leyendo PDF: " + e.getMessage());
        }
    }

    @SuppressWarnings("unchecked")
    private String llamarAGeminiManual(String prompt) {
        // NO TOCAMOS LA URL: Mantenemos gemini-2.5-flash
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey;

        Map<String, Object> body = Map.of(
            "contents", List.of(
                Map.of("parts", List.of(Map.of("text", prompt)))
            )
        );

        System.out.println("🚀 Llamando a Gemini para generación múltiple...");

        RestTemplate restTemplate = new RestTemplate();
        Map<String, Object> response = restTemplate.postForObject(url, body, Map.class);

        if (response == null || !response.containsKey("candidates")) {
            throw new RuntimeException("La respuesta de Gemini está vacía");
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
            // Limpiamos posibles asteriscos o números que la IA suele poner (ej: "1. ¿Qué es...?")
            String anverso = partes[0].replaceAll("[\\*\\d\\.]", "").trim();
            f.setAnverso(anverso);
            f.setReverso(partes[1].trim());
        } else {
            f.setAnverso("Concepto clave");
            f.setReverso(linea.trim());
        }
        
        f.setCreadaPorIa(true);
        f.setFechaCreacion(LocalDateTime.now());
        f.setProximoRepaso(LocalDateTime.now());
        f.setNivelEspaciado(0);
        
        return f;
    }
}