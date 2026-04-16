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
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
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

    @Override
    public List<Flashcard> listarTodas() {
        return flashcardRepository.findAll();
    }

    @Override
    public Flashcard guardar(Flashcard flashcard) {
        return flashcardRepository.save(flashcard);
    }

    @Override
public Flashcard generarDesdeRecurso(Long recursoId) {
    System.out.println("--- INICIANDO GENERACIÓN DE FLASHCARD ---");
    
    Recurso recurso = recursoRepository.findById(recursoId)
            .orElseThrow(() -> new ResourceNotFoundException("Recurso no encontrado"));

    System.out.println("1. Recurso encontrado: " + recurso.getNombre());
    System.out.println("2. Ruta del archivo: " + recurso.getUrlAcceso());

    // PASO CRÍTICO: Leer el PDF
    String textoPdf;
    try {
        textoPdf = extraerTextoDePdf(recurso.getUrlAcceso());
        System.out.println("3. Texto extraído correctamente (longitud): " + textoPdf.length());
    } catch (Exception e) {
        System.out.println("ERROR EN PASO 3 (PDF): " + e.getMessage());
        e.printStackTrace(); // Esto sacará el error rojo en la consola
        throw e;
    }

    String prompt = "Genera una pregunta y respuesta corta sobre: " + textoPdf;

    // PASO CRÍTICO: Llamar a Gemini
    Flashcard f;
    try {
        f = llamarAGemini(prompt);
        System.out.println("4. Respuesta de Gemini recibida");
    } catch (Exception e) {
        System.out.println("ERROR EN PASO 4 (GEMINI): " + e.getMessage());
        e.printStackTrace(); // Esto sacará el error rojo en la consola
        throw e;
    }

    List<MazoFlashcard> mazos = mazoRepository.findByAsignaturaId(recurso.getAsignatura().getId());
if (!mazos.isEmpty()) {
    f.setMazo(mazos.get(0));
    // Borramos la línea de f.setUsuario(...) que daba error
}

return flashcardRepository.save(f);
}

    private String extraerTextoDePdf(String ruta) {
    try (PDDocument document = PDDocument.load(new File(ruta))) {
        PDFTextStripper stripper = new PDFTextStripper();
        String texto = stripper.getText(document);
        
        if (texto == null || texto.trim().isEmpty()) {
            throw new RuntimeException("El PDF está vacío o es una imagen.");
        }
        return texto;
    } catch (IOException e) {
        // Aquí es donde capturamos el error que ves en la Imagen 21
        System.err.println("Error fatal al leer el PDF: " + e.getMessage());
        throw new RuntimeException("No se pudo leer el archivo en la ruta: " + ruta);
    }
}

    @SuppressWarnings("unchecked") // Esto quita los avisos amarillos de la Imagen 5
    private Flashcard llamarAGemini(String prompt) {
        String apiKey = "TU_API_KEY_AQUI"; // <--- NO OLVIDES PONER TU CLAVE
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;

        Map<String, Object> body = Map.of(
            "contents", List.of(
                Map.of("parts", List.of(Map.of("text", prompt)))
            )
        );

        RestTemplate restTemplate = new RestTemplate();
        try {
            Map<String, Object> response = restTemplate.postForObject(url, body, Map.class);
            
            // Navegación por el JSON de Gemini
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
            Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
            List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
            String textoIa = (String) parts.get(0).get("text");

            String[] partes = textoIa.split("\\|");
            
            Flashcard f = new Flashcard();
            f.setAnverso(partes[0].trim());
            f.setReverso(partes.length > 1 ? partes[1].trim() : "Respuesta no generada");
            f.setCreadaPorIa(true);
            f.setProximoRepaso(LocalDateTime.now());
            
            return f; 
        } catch (Exception e) {
            throw new RuntimeException("Error en la IA: " + e.getMessage());
        }
    }
}