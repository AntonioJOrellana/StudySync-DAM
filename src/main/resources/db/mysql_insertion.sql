USE studysync;

-- 1. USUARIO (El centro de todo)
INSERT INTO usuario (id_usuario, username, email, password, puntos_experiencia, modo_sin_cuenta) 
VALUES (1, 'estudiante_pro', 'alumno@studysync.com', 'pass123', 150, 0);

-- 2. ASIGNATURAS
INSERT INTO asignatura (id_asignatura, id_usuario, nombre, profesor, color, descripcion) 
VALUES 
(1, 1, 'Programación Web', 'Dra. García', '#3498db', 'Desarrollo de aplicaciones con Spring Boot y MySQL'),
(2, 1, 'Bases de Datos', 'Ing. Pérez', '#e74c3c', 'Diseño lógico y normalización de datos SQL');

-- 3. MAZOS DE FLASHCARDS
INSERT INTO mazo_flashcard (id_mazo, id_usuario, id_asignatura, nombre, descripcion) 
VALUES 
(1, 1, 1, 'Conceptos Spring', 'Repaso de anotaciones y ciclo de vida'),
(2, 1, 2, 'Comandos SQL', 'Joins, Aggregations y DDL');

-- 4. FLASHCARDS (Dentro de los mazos)
INSERT INTO flashcard (id_mazo, anverso, reverso, nivel_espaciado, creada_por_ia, fecha_creacion) 
VALUES 
(1, '¿Qué hace @Autowired?', 'Inyecta dependencias automáticamente en Spring', 1, 0, NOW()),
(1, 'Diferencia entre @Service y @Component', 'Service es una especialización de Component para lógica de negocio', 2, 0, NOW()),
(2, '¿Para qué sirve JOIN?', 'Para combinar filas de dos o más tablas basándose en una columna común', 1, 0, NOW());

-- 5. AGENDA (Eventos)
INSERT INTO agenda (titulo, fecha_evento, prioridad, id_asignatura, id_usuario) 
VALUES 
('Examen parcial de Spring', '2026-05-10 09:00:00', 'alta', 1, 1),
('Entrega proyecto DB', '2026-04-25 23:59:59', 'media', 2, 1),
('Tutoría profesor', '2026-04-18 12:30:00', 'baja', 1, 1);

-- 6. TAREAS
INSERT INTO tarea (titulo, descripcion, completada, fecha_entrega, prioridad, id_asignatura, id_usuario) 
VALUES 
('Instalar MySQL Workbench', 'Configurar el entorno local', 1, '2026-04-01', 'media', 2, 1),
('Crear Entidades JPA', 'Mapear el modelo de datos a clases Java', 0, '2026-04-20', 'alta', 1, 1);

-- 7. RECURSOS
INSERT INTO recurso (nombre, tipo, url_acceso, id_asignatura, fecha_subida) 
VALUES 
('Manual de Hibernate PDF', 'pdf', 'http://docs.jboss.org/hibernate.pdf', 1, NOW()),
('Video Tutorial Joins', 'video', 'https://youtube.com/watch?v=sql-joins', 2, NOW());

-- 8. SESIONES DE ESTUDIO
INSERT INTO sesion_estudio (id_usuario, id_asignatura, fecha_inicio, duracion_minutos, tipo) 
VALUES 
(1, 1, '2026-04-15 17:00:00', 60, 'estudio'),
(1, 2, '2026-04-16 10:00:00', 45, 'repaso_flashcards');