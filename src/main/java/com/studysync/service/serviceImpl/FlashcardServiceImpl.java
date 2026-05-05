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
import java.util.HashMap;
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

    @Value("${GEMINI_API_KEY}")
    private String apiKey;

    @Value("${GEMINI_MODEL:gemini-1.5-flash}")
    private String modelId;

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
    public List<Flashcard> generarDesdeRecurso(Long recursoId, Long mazoId) {
        System.out.println(">>> [BACKEND] Generando para Recurso: " + recursoId + " en Mazo: " + mazoId);
        
        // 1. Validar existencia de Recurso y Mazo
        Recurso recurso = recursoRepository.findById(recursoId)
                .orElseThrow(() -> new ResourceNotFoundException("Recurso no encontrado"));
        
        MazoFlashcard mazoDestino = mazoRepository.findById(mazoId)
                .orElseThrow(() -> new ResourceNotFoundException("Mazo no encontrado"));

        // 2. Extraer texto del PDF
        String textoPdf;
        try {
            textoPdf = extraerTextoDePdf(recurso.getUrlAcceso());
            if (textoPdf.length() > 5000) textoPdf = textoPdf.substring(0, 5000);
        } catch (Exception e) {
            throw new RuntimeException("Error leyendo el PDF: " + e.getMessage());
        }

        // 3. Preparar Prompt
        String promptTexto = "Analiza el siguiente texto y genera entre 3 y 5 flashcards de estudio. " +
                             "Usa estrictamente este formato por cada línea: Pregunta | Respuesta. " +
                             "No escribas introducciones ni despedidas. " +
                             "Texto: " + textoPdf;

        List<Flashcard> flashcardsGuardadas = new ArrayList<>();
        try {
            // 4. Llamada a Gemini
            String respuestaBruta = llamarAGeminiManual(promptTexto);
            
            // 5. Procesar líneas y guardar en el mazo correcto
            String[] lineas = respuestaBruta.split("\n");
            for (String linea : lineas) {
                if (linea.contains("|") && linea.trim().length() > 5) {
                    Flashcard f = procesarLineaIA(linea);
                    f.setMazo(mazoDestino); // <--- CORRECCIÓN: Asignamos el mazo específico
                    flashcardsGuardadas.add(flashcardRepository.save(f));
                }
            }

        } catch (Exception e) {
            throw new RuntimeException("Error en la comunicación con la IA: " + e.getMessage());
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
            throw new RuntimeException("Error al procesar PDF físico: " + e.getMessage());
        }
    }

    @SuppressWarnings("unchecked")
    private String llamarAGeminiManual(String prompt) {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/" + modelId + ":generateContent?key=" + apiKey;

        Map<String, Object> textPart = new HashMap<>();
        textPart.put("text", prompt);

        Map<String, Object> contentObj = new HashMap<>();
        contentObj.put("parts", List.of(textPart));

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", List.of(contentObj));

        Map<String, Object> generationConfig = new HashMap<>();
        generationConfig.put("temperature", 0.7);
        requestBody.put("generationConfig", generationConfig);

        RestTemplate restTemplate = new RestTemplate();
        
        try {
            Map<String, Object> response = restTemplate.postForObject(url, requestBody, Map.class);
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
            Map<String, Object> contentRes = (Map<String, Object>) candidates.get(0).get("content");
            List<Map<String, Object>> resParts = (List<Map<String, Object>>) contentRes.get("parts");
            
            return (String) resParts.get(0).get("text");
        } catch (Exception e) {
            throw new RuntimeException("Fallo en API Gemini: " + e.getMessage());
        }
    }

    private Flashcard procesarLineaIA(String linea) {
        String[] partes = linea.split("\\|");
        Flashcard f = new Flashcard();
        
        if (partes.length >= 2) {
            f.setAnverso(partes[0].replaceAll("[\\*\\#\\-]", "").trim());
            f.setReverso(partes[1].replaceAll("[\\*\\#\\-]", "").trim());
        } else {
            f.setAnverso("Revisar concepto");
            f.setReverso(linea.trim());
        }
        
        f.setCreadaPorIa(true);
        f.setFechaCreacion(LocalDateTime.now());
        f.setProximoRepaso(LocalDateTime.now());
        f.setNivelEspaciado(0);
        
        return f;
    }
}