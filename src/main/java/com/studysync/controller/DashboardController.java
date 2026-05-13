package com.studysync.controller;

import com.studysync.service.FlashcardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173") // El mismo puerto de tu React
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private FlashcardService flashcardService;

    @PostMapping("/ia/consulta")
    public ResponseEntity<Map<String, String>> resolverDuda(@RequestBody Map<String, String> request) {
        String duda = request.get("duda");
        
        // Usamos el motor de Gemini que ya tenemos en el service
        String respuestaIA = flashcardService.consultarDudaGeneral(duda);

        Map<String, String> response = new HashMap<>();
        response.put("respuesta", respuestaIA);
        
        return ResponseEntity.ok(response);
    }
}