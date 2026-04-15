package com.studysync.service;

import org.springframework.ai.vertexai.gemini.VertexAiGeminiChatModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class GeminiService {

    private final VertexAiGeminiChatModel chatModel;

    @Autowired
    public GeminiService(VertexAiGeminiChatModel chatModel) {
        this.chatModel = chatModel;
    }

    public String generarRespuesta(String prompt) {
        try {
            return chatModel.call(prompt);
        } catch (Exception e) {
            return "Error al conectar con Gemini: " + e.getMessage();
        }
    }
}