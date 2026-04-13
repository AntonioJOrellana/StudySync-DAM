-- #############################################################
-- SCRIPT COMPLETO: StudySync - Creación de Base de Datos y Datos Iniciales
-- Proyecto TFG DAM - Antonio Jesús Orellana Orea
-- #############################################################

-- 1. Crear y usar la Base de Datos
CREATE DATABASE IF NOT EXISTS studysync
DEFAULT CHARACTER SET utf8mb4
DEFAULT COLLATE utf8mb4_0900_ai_ci;

USE studysync;

-- 2. TABLA USUARIO
CREATE TABLE IF NOT EXISTS USUARIO (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    correo VARCHAR(255) UNIQUE NOT NULL,
    contrasena_hash VARCHAR(255) NOT NULL,
    modo_sin_cuenta BOOLEAN DEFAULT FALSE,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. TABLA ASIGNATURA
CREATE TABLE IF NOT EXISTS ASIGNATURA (
    id_asignatura INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    color VARCHAR(7), -- Código HEX (ej: #3498db)
    id_usuario INT NOT NULL,
    CONSTRAINT fk_asignatura_usuario FOREIGN KEY (id_usuario) 
        REFERENCES USUARIO(id_usuario) ON DELETE CASCADE
);

-- 4. TABLA TAREA
CREATE TABLE IF NOT EXISTS TAREA (
    id_tarea INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    fecha_entrega DATE,
    prioridad TINYINT CHECK (prioridad BETWEEN 1 AND 3), -- 1: Alta, 2: Media, 3: Baja
    completada BOOLEAN DEFAULT FALSE,
    id_asignatura INT NOT NULL,
    CONSTRAINT fk_tarea_asignatura FOREIGN KEY (id_asignatura) 
        REFERENCES ASIGNATURA(id_asignatura) ON DELETE CASCADE
);

-- 5. TABLA SESION_ESTUDIO
CREATE TABLE IF NOT EXISTS SESION_ESTUDIO (
    id_sesion INT PRIMARY KEY AUTO_INCREMENT,
    fecha_inicio DATETIME NOT NULL,
    duracion_minutos INT NOT NULL,
    tipo VARCHAR(50) DEFAULT 'Pomodoro',
    id_usuario INT NOT NULL,
    CONSTRAINT fk_sesion_usuario FOREIGN KEY (id_usuario) 
        REFERENCES USUARIO(id_usuario) ON DELETE CASCADE
);

-- 6. TABLA MAZO_FLASHCARD
CREATE TABLE IF NOT EXISTS MAZO_FLASHCARD (
    id_mazo INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    id_usuario INT NOT NULL,
    CONSTRAINT fk_mazo_usuario FOREIGN KEY (id_usuario) 
        REFERENCES USUARIO(id_usuario) ON DELETE CASCADE
);

-- 7. TABLA FLASHCARD (Implementación del SRS)
CREATE TABLE IF NOT EXISTS FLASHCARD (
    id_flashcard INT PRIMARY KEY AUTO_INCREMENT,
    anverso TEXT NOT NULL,
    reverso TEXT NOT NULL,
    nivel_espaciado INT DEFAULT 0,
    proximo_repaso DATE DEFAULT (CURRENT_DATE),
    id_mazo INT NOT NULL,
    CONSTRAINT fk_flashcard_mazo FOREIGN KEY (id_mazo) 
        REFERENCES MAZO_FLASHCARD(id_mazo) ON DELETE CASCADE
);

-- #############################################
-- EXTRAS: ÍNDICES Y DATOS DE PRUEBA
-- #############################################

-- Índices para mejorar la velocidad de las consultas
CREATE INDEX idx_tarea_asignatura ON TAREA(id_asignatura);
CREATE INDEX idx_flashcard_mazo ON FLASHCARD(id_mazo);
CREATE INDEX idx_sesion_usuario ON SESION_ESTUDIO(id_usuario);

-- Inserción de un usuario de prueba (contraseña ejemplo)
INSERT INTO USUARIO (correo, contrasena_hash, modo_sin_cuenta) 
VALUES ('estudiante@studysync.com', 'hash_ejemplo_1234', false);

-- Inserción de asignaturas para el usuario 1
INSERT INTO ASIGNATURA (nombre, color, id_usuario) VALUES 
('Desarrollo de Apps', '#3498db', 1),
('Bases de Datos', '#e74c3c', 1);

-- Inserción de tareas de ejemplo
INSERT INTO TAREA (titulo, descripcion, fecha_entrega, prioridad, id_asignatura) VALUES 
('Finalizar Backend', 'Implementar controladores en Spring Boot', '2026-06-01', 1, 1),
('Repasar SQL', 'Estudiar triggers e índices', '2026-05-20', 2, 2);

-- Inserción de un mazo y flashcards de ejemplo
INSERT INTO MAZO_FLASHCARD (nombre, descripcion, id_usuario) 
VALUES ('Java Básico', 'Conceptos fundamentales de POO', 1);

INSERT INTO FLASHCARD (anverso, reverso, id_mazo) VALUES 
('¿Qué es la Encapsulación?', 'Ocultar los detalles internos de un objeto.', 1),
('¿Qué significa JPA?', 'Java Persistence API.', 1);