package com.studysync.service;

import com.studysync.model.MazoFlashcard;
import java.util.List;

public interface MazoFlashcardService {
    MazoFlashcard crearMazo(MazoFlashcard mazo);

    MazoFlashcard actualizarMazo(Long id, MazoFlashcard mazo);

    List<MazoFlashcard> listarMazosPorAsignatura(Long asignaturaId);

    List<MazoFlashcard> listarMazosPorUsuario(Long usuarioId);

    void eliminarMazo(Long id);
}