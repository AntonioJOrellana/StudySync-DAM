package com.studysync.repository;

import com.studysync.model.SesionEstudio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SesionEstudioRepository extends JpaRepository<SesionEstudio, Integer> {
}