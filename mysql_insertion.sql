-- #############################################
-- SCRIPT DML: INSERCIÓN DE DATOS DE PRUEBA (mysql_insertion.sql)
-- Adaptado para MySQL Workbench
-- #############################################

USE studysync;

-- 1. Insertar Usuarios
-- Nota: MySQL genera automáticamente el id_usuario
INSERT INTO USUARIO (correo, contrasena_hash, modo_sin_cuenta) VALUES
('ejemplo@studysync.com', 'hash_seguro_123', FALSE), -- id_usuario = 1
('sin_cuenta_user', 'placeholder_hash', TRUE);       -- id_usuario = 2

-- 2. Insertar Asignaturas para el Usuario 1
INSERT INTO ASIGNATURA (nombre, color, id_usuario) VALUES
('Bases de Datos', '#337AFF', 1),    -- id_asignatura = 1
('Programación Avanzada', '#FF5733', 1), -- id_asignatura = 2
('Diseño UX/UI', '#33FF57', 1);       -- id_asignatura = 3

-- 3. Insertar Tareas para el Usuario 1
INSERT INTO TAREA (titulo, descripcion, fecha_entrega, prioridad, id_asignatura) VALUES
('Escribir DDL Base de Datos', 'Crear scripts de creación de tablas', '2025-12-10', 1, 1), -- Alta
('Terminar Prototipo Figma', 'Diseño de la pantalla "Hoy"', '2025-12-05', 2, 3),    -- Media
('Revisión de Clases y Objetos', 'Repasar patrones de diseño', '2025-12-20', 3, 2);   -- Baja

-- Marcar una tarea como completada
UPDATE TAREA SET completada = TRUE WHERE titulo = 'Escribir DDL Base de Datos';

-- 4. Insertar Sesiones de Estudio (Pomodoros) para el Usuario 1
-- Uso de NOW() en MySQL para la fecha y hora actual
INSERT INTO SESION_ESTUDIO (fecha_inicio, duracion_minutos, id_usuario) VALUES
(DATE_SUB(NOW(), INTERVAL 2 HOUR), 25, 1), -- Hace 2 horas
(DATE_SUB(NOW(), INTERVAL 1 HOUR), 25, 1), -- Hace 1 hora
(NOW(), 15, 1); -- Ahora

-- 5. Insertar Mazos de Flashcards para el Usuario 1
INSERT INTO MAZO_FLASHCARD (nombre, id_usuario) VALUES
('Definiciones de UML', 1),    -- id_mazo = 1
('Conceptos de SQL', 1);         -- id_mazo = 2

-- 6. Insertar Flashcards para el Mazo 2
INSERT INTO FLASHCARD (anverso, reverso, nivel_espaciado, proximo_repaso, id_mazo) VALUES
('¿Qué es una clave foránea?', 'Es un campo que establece un vínculo entre datos de dos tablas.', 0, CURDATE(), 2),
('¿Qué es un índice?', 'Es una estructura para acelerar la búsqueda de datos.', 1, DATE_ADD(CURDATE(), INTERVAL 4 DAY), 2),
('¿Qué es SQL DDL?', 'Data Definition Language (Lenguaje de Definición de Datos).', 2, DATE_ADD(CURDATE(), INTERVAL 14 DAY), 2);
