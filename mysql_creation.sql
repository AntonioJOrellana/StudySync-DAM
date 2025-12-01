-- #############################################
-- SCRIPT DDL: CREACIÓN DE BASE DE DATOS Y TABLAS (mysql_creation.sql)
-- Adaptado para MySQL Workbench
-- #############################################

-- 1. Crear la Base de Datos
CREATE DATABASE IF NOT EXISTS studysync
DEFAULT CHARACTER SET utf8mb4
DEFAULT COLLATE utf8mb4_0900_ai_ci;

-- Seleccionar la base de datos para ejecutar los comandos
USE studysync;

-- 2. TABLA USUARIO
CREATE TABLE USUARIO (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT, -- Uso de INT y AUTO_INCREMENT en MySQL
    correo VARCHAR(255) UNIQUE NOT NULL,
    contrasena_hash VARCHAR(255) NOT NULL,
    modo_sin_cuenta BOOLEAN DEFAULT FALSE,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP -- Uso de DATETIME en MySQL
);

-- 3. TABLA ASIGNATURA
CREATE TABLE ASIGNATURA (
    id_asignatura INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    color VARCHAR(7), -- Para almacenar código HEX del color
    id_usuario INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario) ON DELETE CASCADE
);

-- 4. TABLA TAREA
CREATE TABLE TAREA (
    id_tarea INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    fecha_entrega DATE,
    prioridad TINYINT CHECK (prioridad BETWEEN 1 AND 3), -- 1: Alta, 2: Media, 3: Baja
    completada BOOLEAN DEFAULT FALSE,
    id_asignatura INT NOT NULL,
    FOREIGN KEY (id_asignatura) REFERENCES ASIGNATURA(id_asignatura) ON DELETE CASCADE
);

-- 5. TABLA SESION_ESTUDIO (Para registrar Pomodoros y tiempo)
CREATE TABLE SESION_ESTUDIO (
    id_sesion INT PRIMARY KEY AUTO_INCREMENT,
    fecha_inicio DATETIME NOT NULL,
    duracion_minutos INT NOT NULL,
    tipo VARCHAR(50) DEFAULT 'Pomodoro',
    id_usuario INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario) ON DELETE CASCADE
);

-- 6. TABLA MAZO_FLASHCARD
CREATE TABLE MAZO_FLASHCARD (
    id_mazo INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    id_usuario INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario) ON DELETE CASCADE
);

-- 7. TABLA FLASHCARD (Implementación del SRS)
CREATE TABLE FLASHCARD (
    id_flashcard INT PRIMARY KEY AUTO_INCREMENT,
    anverso TEXT NOT NULL,
    reverso TEXT NOT NULL,
    nivel_espaciado INT DEFAULT 0,
    proximo_repaso DATE DEFAULT (CURRENT_DATE()), -- Uso de CURRENT_DATE() para MySQL
    id_mazo INT NOT NULL,
    FOREIGN KEY (id_mazo) REFERENCES MAZO_FLASHCARD(id_mazo) ON DELETE CASCADE
);
