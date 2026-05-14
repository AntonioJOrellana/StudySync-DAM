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
import org.apache.poi.xslf.usermodel.XMLSlideShow;
import org.apache.poi.xslf.usermodel.XSLFShape;
import org.apache.poi.xslf.usermodel.XSLFSlide;
import org.apache.poi.xslf.usermodel.XSLFTextShape;
import org.jsoup.Jsoup;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.File;
import java.io.FileInputStream;
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

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.model}")
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
        Recurso recurso = recursoRepository.findById(recursoId)
                .orElseThrow(() -> new ResourceNotFoundException("Recurso no encontrado"));
        
        MazoFlashcard mazoDestino = mazoRepository.findById(mazoId)
                .orElseThrow(() -> new ResourceNotFoundException("Mazo no encontrado"));

        String textoExtraido = "";
        String url = recurso.getUrlAcceso().toLowerCase().trim();

        System.out.println("DEBUG: Iniciando extracción para: " + url);

        try {
            if (url.contains("youtube.com") || url.contains("youtu.be")) {
                textoExtraido = "Video: " + recurso.getNombre();
            } else if (url.startsWith("http")) {
                textoExtraido = extraerTextoDeWeb(recurso.getUrlAcceso());
            } else if (url.endsWith(".pdf")) {
                textoExtraido = extraerTextoDePdf(recurso.getUrlAcceso());
            } else if (url.endsWith(".pptx")) {
                textoExtraido = extraerTextoDePowerPoint(recurso.getUrlAcceso());
            } else {
                textoExtraido = extraerTextoPlano(recurso.getUrlAcceso());
            }

            if (textoExtraido == null || textoExtraido.trim().isEmpty()) {
                textoExtraido = "Tema general: " + recurso.getNombre();
            }

            // Recortamos a 6000 para ser más conservadores con el tamaño del JSON
            if (textoExtraido.length() > 6000) {
                textoExtraido = textoExtraido.substring(0, 6000);
            }

        } catch (Exception e) {
            System.err.println("ERROR CRÍTICO EXTRACCIÓN: " + e.getMessage());
            throw new RuntimeException("No se pudo leer el archivo: " + e.getMessage());
        }

        System.out.println("DEBUG - LONGITUD TEXTO: " + textoExtraido.length());

        String promptTexto = "Actúa como un experto en educación. Analiza este contenido y genera 5 flashcards. " +
                             "Responde ÚNICAMENTE con el formato Pregunta | Respuesta. Sin números ni introducciones. " +
                             "Contenido: " + textoExtraido;

        return ejecutarGeneracionIA(promptTexto, mazoDestino);
    }

    private String extraerTextoDePdf(String ruta) throws Exception {
        File file = new File(ruta);
        try (PDDocument document = PDDocument.load(file)) {
            return limpiarTexto(new PDFTextStripper().getText(document));
        }
    }

    private String extraerTextoDeWeb(String url) throws Exception {
        return limpiarTexto(Jsoup.connect(url).get().text());
    }

    private String extraerTextoDePowerPoint(String ruta) throws Exception {
        StringBuilder sb = new StringBuilder();
        File file = new File(ruta);
        
        try (FileInputStream fis = new FileInputStream(file);
            XMLSlideShow ppt = new XMLSlideShow(fis)) {
            
            for (XSLFSlide slide : ppt.getSlides()) {
                for (XSLFShape shape : slide.getShapes()) {
                    if (shape instanceof XSLFTextShape textShape) {
                        String text = textShape.getText();
                        if (text != null && !text.isBlank()) {
                            sb.append(text).append(" ");
                        }
                    }
                }
                sb.append("\n"); 
            }
        } catch (Exception e) {
            System.err.println("Error específico en PPTX: " + e.getMessage());
            throw e;
        }
        return limpiarTexto(sb.toString());
    }

    private String extraerTextoPlano(String ruta) throws Exception {
        File file = new File(ruta);
        if (!file.exists()) return "";
        return limpiarTexto(new String(java.nio.file.Files.readAllBytes(file.toPath())));
    }

    private String limpiarTexto(String texto) {
        if (texto == null) return "";
        return texto.replace("\\", "\\\\")
                    .replace("\"", "'")
                    .replace("\n", " ")
                    .replace("\r", " ")
                    .replace("\t", " ")
                    .replaceAll("\\s+", " ")
                    .trim();
    }

    private List<Flashcard> ejecutarGeneracionIA(String prompt, MazoFlashcard mazo) {
        String respuestaIA = llamarAGeminiManual(prompt);
        
        if (respuestaIA == null || respuestaIA.isBlank()) {
            return new ArrayList<>();
        }

        List<Flashcard> listaParaGuardar = new ArrayList<>();
        String[] lineas = respuestaIA.split("\n");

        for (String linea : lineas) {
            if (linea.contains("|")) {
                Flashcard f = procesarLineaIA(linea);
                f.setMazo(mazo);
                listaParaGuardar.add(f);
            }
        }

        if (!listaParaGuardar.isEmpty()) {
            return flashcardRepository.saveAll(listaParaGuardar);
        }

        return new ArrayList<>();
    }

    @SuppressWarnings("unchecked")
    public String llamarAGeminiManual(String prompt) {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/" + modelId + ":generateContent?key=" + apiKey;

        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(5000);
        factory.setReadTimeout(60000); 
        RestTemplate restTemplate = new RestTemplate(factory);

        Map<String, Object> textPart = new HashMap<>();
        textPart.put("text", prompt);

        Map<String, Object> contentObj = new HashMap<>();
        contentObj.put("parts", List.of(textPart));

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", List.of(contentObj));

        try {
            System.out.println("DEBUG: Enviando petición a Gemini...");
            Map<String, Object> response = restTemplate.postForObject(url, requestBody, Map.class);
            
            if (response == null || !response.containsKey("candidates")) {
                return "";
            }

            List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
            if (candidates.isEmpty()) return "";

            Map<String, Object> contentRes = (Map<String, Object>) candidates.get(0).get("content");
            List<Map<String, Object>> resParts = (List<Map<String, Object>>) contentRes.get("parts");
            
            return (String) resParts.get(0).get("text");
        } catch (Exception e) {
            System.err.println("ERROR API GEMINI: " + e.getMessage());
            throw new RuntimeException("Error de comunicación con la IA (Timeout o Formato): " + e.getMessage());
        }
    }

    private Flashcard procesarLineaIA(String linea) {
        String[] partes = linea.split("\\|");
        Flashcard f = new Flashcard();
        
        if (partes.length >= 2) {
            f.setAnverso(partes[0].replaceAll("[\\*\\#\\-]", "").trim());
            f.setReverso(partes[1].replaceAll("[\\*\\#\\-]", "").trim());
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

    @Override
    public String consultarDudaGeneral(String duda) {
        String prompt = "Actúa como un tutor académico experto. El alumno tiene la siguiente duda: " + duda + 
                        ". Responde de forma concisa, clara y amena. Máximo 3 párrafos.";
        return llamarAGeminiManual(prompt);
    }

    // --- NUEVO: Implementado para que coincida con la interfaz ---
    @Override
    public void eliminar(Long id) {
        flashcardRepository.deleteById(id);
    }
}