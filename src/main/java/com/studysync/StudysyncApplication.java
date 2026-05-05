package com.studysync;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(excludeName = { 
    "org.springframework.ai.autoconfigure.vertexai.gemini.VertexAiGeminiAutoConfiguration" 
})
public class StudysyncApplication {

    public static void main(String[] args) {
        SpringApplication.run(StudysyncApplication.class, args);
    }

}