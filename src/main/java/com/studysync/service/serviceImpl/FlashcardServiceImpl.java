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

    // --- NUEVO MÉTODO PARA EL ALGORITMO SRS ---
    @Override
    public Flashcard actualizarRepaso(Long id, boolean acierto) {
        Flashcard f = flashcardRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Flashcard no encontrada"));

        if (acierto) {
            // Si acierta, sube de nivel
            f.setNivelEspaciado(f.getNivelEspaciado() + 1);
        } else {
            // Si falla, vuelve al nivel 0 (estudiar pronto)
            f.setNivelEspaciado(0);
        }

        // Cálculo de días: 2 elevado al nivel (1, 2, 4, 8, 16... días)
        long diasExtra = (long) Math.pow(2, f.getNivelEspaciado());
        f.setProximoRepaso(LocalDateTime.now().plusDays(diasExtra));

        return flashcardRepository.save(f);
    }

    @Override
    public List<Flashcard> generarDesdeRecurso(Long recursoId) {
        System.out.println("--- INICIANDO GENERACIÓN MÚLTIPLE DE FLASHCARDS ---");
        
        Recurso recurso = recursoRepository.findById(recursoId)
                .orElseThrow(() -> new ResourceNotFoundException("Recurso no encontrado"));

        String textoPdf;
        try {
            textoPdf = extraerTextoDePdf(recurso.getUrlAcceso());
            if (textoPdf.length() > 5000) textoPdf = textoPdf.substring(0, 5000);
        } catch (Exception e) {
            throw e;
        }

        String promptTexto = "Analiza el siguiente texto y genera entre 3 y 5 flashcards de estudio. " +
                             "Usa estrictamente este formato por cada línea: Pregunta | Respuesta. " +
                             "No escribas introducciones ni listas numeradas, solo la línea con el separador |. " +
                             "Texto: " + textoPdf;

        List<Flashcard> flashcardsGuardadas = new ArrayList<>();
        try {
            String respuestaBruta = llamarAGeminiManual(promptTexto);
            
            MazoFlashcard mazo = null;
            List<MazoFlashcard> mazos = mazoRepository.findByAsignaturaId(recurso.getAsignatura().getId());
            if (!mazos.isEmpty()) {
                mazo = mazos.get(0);
            }

            String[] lineas = respuestaBruta.split("\n");
            for (String linea : lineas) {
                if (linea.contains("|")) {
                    Flashcard f = procesarLineaIA(linea);
                    f.setMazo(mazo);
                    flashcardsGuardadas.add(flashcardRepository.save(f));
                }
            }
        } catch (Exception e) {
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
        // MANTENEMOS TU URL VERIFICADA
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey;

        Map<String, Object> body = Map.of(
            "contents", List.of(
                Map.of("parts", List.of(Map.of("text", prompt)))
            )
        );

        RestTemplate restTemplate = new RestTemplate();
        Map<String, Object> response = restTemplate.postForObject(url, body, Map.class);
        
        List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
        Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
        List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
        
        return (String) parts.get(0).get("text");
    }

    private Flashcard procesarLineaIA(String linea) {
        String[] partes = linea.split("\\|");
        Flashcard f = new Flashcard();
        
        if (partes.length >= 2) {
            String anverso = partes[0].replaceAll("[\\*\\d\\.]", "").trim();
            f.setAnverso(anverso);
            f.setReverso(partes[1].trim());
        } else {
            f.setAnverso("Concepto clave");
            f.setReverso(linea.trim());
        }
        
        f.setCreadaPorIa(true);
        f.setFechaCreacion(LocalDateTime.now());
        f.setProximoRepaso(LocalDateTime.now()); // Para estudiar ya mismo
        f.setNivelEspaciado(0);
        
        return f;
    }
}