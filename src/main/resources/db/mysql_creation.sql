-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: studysync
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `agenda`
--

DROP TABLE IF EXISTS `agenda`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `agenda` (
  `fecha_evento` datetime(6) NOT NULL,
  `id_asignatura` bigint NOT NULL,
  `id_evento` bigint NOT NULL AUTO_INCREMENT,
  `id_usuario` bigint NOT NULL,
  `titulo` varchar(150) NOT NULL,
  `prioridad` enum('alta','media','baja') DEFAULT NULL,
  PRIMARY KEY (`id_evento`),
  KEY `FKqpehv51yfhi24fbm12fxgr8b7` (`id_asignatura`),
  KEY `FK8sw8dmc46jl6evg8lsg5p8tue` (`id_usuario`),
  CONSTRAINT `FK8sw8dmc46jl6evg8lsg5p8tue` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`),
  CONSTRAINT `FKqpehv51yfhi24fbm12fxgr8b7` FOREIGN KEY (`id_asignatura`) REFERENCES `asignatura` (`id_asignatura`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `agenda`
--

LOCK TABLES `agenda` WRITE;
/*!40000 ALTER TABLE `agenda` DISABLE KEYS */;
INSERT INTO `agenda` VALUES ('2026-05-10 09:00:00.000000',1,1,1,'Examen parcial de Spring','alta'),('2026-04-25 23:59:59.000000',2,2,1,'Entrega proyecto DB','media'),('2026-04-18 12:30:00.000000',1,3,1,'Tutoría profesor','baja');
/*!40000 ALTER TABLE `agenda` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asignatura`
--

DROP TABLE IF EXISTS `asignatura`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asignatura` (
  `color` varchar(7) DEFAULT NULL,
  `id_asignatura` bigint NOT NULL AUTO_INCREMENT,
  `id_usuario` bigint NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `profesor` varchar(150) DEFAULT NULL,
  `descripcion` text,
  PRIMARY KEY (`id_asignatura`),
  KEY `FK3ny9exio8cdbic7mfpmfhii2e` (`id_usuario`),
  CONSTRAINT `FK3ny9exio8cdbic7mfpmfhii2e` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asignatura`
--

LOCK TABLES `asignatura` WRITE;
/*!40000 ALTER TABLE `asignatura` DISABLE KEYS */;
INSERT INTO `asignatura` VALUES ('#3498db',1,3,'Programación Web','Dra. García','Desarrollo de aplicaciones con Spring Boot y MySQL'),('#e74c3c',2,3,'Bases de Datos','Ing. Pérez','Diseño lógico y normalización de datos SQL'),('#FF5733',3,3,'Programación Java',NULL,NULL),('#FF5733',4,3,'Prueba IA',NULL,NULL);
/*!40000 ALTER TABLE `asignatura` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `flashcard`
--

DROP TABLE IF EXISTS `flashcard`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `flashcard` (
  `creada_por_ia` bit(1) DEFAULT NULL,
  `nivel_espaciado` int DEFAULT NULL,
  `fecha_creacion` datetime(6) DEFAULT NULL,
  `id_flashcard` bigint NOT NULL AUTO_INCREMENT,
  `id_mazo` bigint NOT NULL,
  `proximo_repaso` datetime(6) DEFAULT NULL,
  `anverso` text NOT NULL,
  `reverso` text NOT NULL,
  PRIMARY KEY (`id_flashcard`),
  KEY `FKiw2euet03arkft98hoxghsng4` (`id_mazo`),
  CONSTRAINT `FKiw2euet03arkft98hoxghsng4` FOREIGN KEY (`id_mazo`) REFERENCES `mazo_flashcard` (`id_mazo`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `flashcard`
--

LOCK TABLES `flashcard` WRITE;
/*!40000 ALTER TABLE `flashcard` DISABLE KEYS */;
INSERT INTO `flashcard` VALUES (_binary '\0',1,'2026-04-16 09:49:03.000000',1,1,NULL,'¿Qué hace @Autowired?','Inyecta dependencias automáticamente en Spring'),(_binary '\0',2,'2026-04-16 09:49:03.000000',2,1,NULL,'Diferencia entre @Service y @Component','Service es una especialización de Component para lógica de negocio'),(_binary '\0',1,'2026-04-16 09:49:03.000000',3,2,NULL,'¿Para qué sirve JOIN?','Para combinar filas de dos o más tablas basándose en una columna común'),(_binary '',0,'2026-04-17 08:48:53.889218',4,1,'2026-04-17 08:48:53.889218','Aquí tienes las flashcards basadas en el texto proporcionado:\n\n**Flashcards de JDBC y Controladores JDBC**\n\n1.  **Pregunta','Respuesta**\n    ¿Qué es JDBC?'),(_binary '',0,'2026-04-17 08:59:47.400773',5,1,'2026-04-17 08:59:47.400773','¿Qué es JDBC?','Es la especificación JavaSoft de una interfaz de programación de aplicaciones (API) estándar que permite que los programas Java accedan a sistemas de gestión de bases de datos.'),(_binary '',0,'2026-04-17 08:59:47.469749',6,1,'2026-04-17 08:59:47.469749','¿De qué consiste la API JDBC?','De un conjunto de interfaces y clases escritas en el lenguaje de programación Java.'),(_binary '',0,'2026-04-17 08:59:47.498913',7,1,'2026-04-17 08:59:47.498913','¿Qué pueden hacer los programadores con JDBC?','Escribir aplicaciones que conecten con bases de datos, envíen consultas SQL y procesen los resultados.'),(_binary '',0,'2026-04-17 08:59:47.507671',8,1,'2026-04-17 08:59:47.507671','¿Qué es un controlador JDBC?','Implementa las interfaces y clases de la API JDBC para un determinado proveedor de DBMS.'),(_binary '',1,'2026-04-17 08:59:47.532566',9,1,'2026-04-19 10:22:55.128771','¿Qué hace la clase JDBC DriverManager?','Envía todas las llamadas de la API JDBC al controlador cargado.');
/*!40000 ALTER TABLE `flashcard` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mazo_flashcard`
--

DROP TABLE IF EXISTS `mazo_flashcard`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mazo_flashcard` (
  `id_asignatura` bigint NOT NULL,
  `id_mazo` bigint NOT NULL AUTO_INCREMENT,
  `id_usuario` bigint NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text,
  PRIMARY KEY (`id_mazo`),
  KEY `FKgav7sks5d8ck8cmsaqbe5j5l7` (`id_asignatura`),
  KEY `FKl9n1p440jp3h5to4pih0hu0vw` (`id_usuario`),
  CONSTRAINT `FKgav7sks5d8ck8cmsaqbe5j5l7` FOREIGN KEY (`id_asignatura`) REFERENCES `asignatura` (`id_asignatura`),
  CONSTRAINT `FKl9n1p440jp3h5to4pih0hu0vw` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mazo_flashcard`
--

LOCK TABLES `mazo_flashcard` WRITE;
/*!40000 ALTER TABLE `mazo_flashcard` DISABLE KEYS */;
INSERT INTO `mazo_flashcard` VALUES (1,1,1,'Conceptos Spring','Repaso de anotaciones y ciclo de vida'),(2,2,1,'Comandos SQL','Joins, Aggregations y DDL'),(4,3,1,'Mazo de JDBC',NULL),(3,4,3,'Clases',NULL),(2,5,3,'Querys',NULL),(3,6,3,'Repaso Override','Repaso de todas las etiquetas especialmente Override'),(4,7,3,'Vocabulario','Entreno de IA'),(2,8,3,'Holaaaaa','esto es una prueba'),(1,9,3,'21312332131','wd d sdfsffd s'),(2,10,3,'dsadsdasd','sadasdsadsd'),(2,11,3,'ddsdsfdsf','dfsdfdsff');
/*!40000 ALTER TABLE `mazo_flashcard` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recurso`
--

DROP TABLE IF EXISTS `recurso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recurso` (
  `fecha_subida` datetime(6) DEFAULT NULL,
  `id_asignatura` bigint NOT NULL,
  `id_recurso` bigint NOT NULL AUTO_INCREMENT,
  `metadata` varchar(50) DEFAULT NULL,
  `nombre` varchar(255) NOT NULL,
  `url_acceso` text NOT NULL,
  `tipo` enum('pdf','video','enlace','otro') DEFAULT NULL,
  PRIMARY KEY (`id_recurso`),
  KEY `FKd84aid4bpfca7vogqixjlyq9b` (`id_asignatura`),
  CONSTRAINT `FKd84aid4bpfca7vogqixjlyq9b` FOREIGN KEY (`id_asignatura`) REFERENCES `asignatura` (`id_asignatura`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recurso`
--

LOCK TABLES `recurso` WRITE;
/*!40000 ALTER TABLE `recurso` DISABLE KEYS */;
INSERT INTO `recurso` VALUES ('2026-04-16 09:49:03.000000',1,1,NULL,'Manual de Hibernate PDF','http://docs.jboss.org/hibernate.pdf','pdf'),('2026-04-16 09:49:03.000000',2,2,NULL,'Video Tutorial Joins','https://youtube.com/watch?v=sql-joins','video'),('2026-04-16 10:09:20.249383',1,3,NULL,'Apuntes JDBC','C:/TusDocumentos/clase_jdbc.pdf','pdf'),('2026-04-16 10:16:51.844909',1,4,NULL,'Apuntes JDBC','C:/temp/jdbc.pdf','pdf');
/*!40000 ALTER TABLE `recurso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sesion_estudio`
--

DROP TABLE IF EXISTS `sesion_estudio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sesion_estudio` (
  `duracion_minutos` int DEFAULT NULL,
  `fecha_inicio` datetime(6) DEFAULT NULL,
  `id_asignatura` bigint NOT NULL,
  `id_sesion` bigint NOT NULL AUTO_INCREMENT,
  `id_usuario` bigint NOT NULL,
  `tipo` enum('estudio','examen_simulado','repaso_flashcards') DEFAULT NULL,
  PRIMARY KEY (`id_sesion`),
  KEY `FK7d5v4wtsn79q12ysllca6a8r8` (`id_asignatura`),
  KEY `FKodsfhhjdj5e6lrirm4wdl843` (`id_usuario`),
  CONSTRAINT `FK7d5v4wtsn79q12ysllca6a8r8` FOREIGN KEY (`id_asignatura`) REFERENCES `asignatura` (`id_asignatura`),
  CONSTRAINT `FKodsfhhjdj5e6lrirm4wdl843` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sesion_estudio`
--

LOCK TABLES `sesion_estudio` WRITE;
/*!40000 ALTER TABLE `sesion_estudio` DISABLE KEYS */;
INSERT INTO `sesion_estudio` VALUES (60,'2026-04-15 17:00:00.000000',1,1,1,'estudio'),(45,'2026-04-16 10:00:00.000000',2,2,1,'repaso_flashcards');
/*!40000 ALTER TABLE `sesion_estudio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tarea`
--

DROP TABLE IF EXISTS `tarea`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tarea` (
  `completada` bit(1) NOT NULL,
  `fecha_entrega` date DEFAULT NULL,
  `id_asignatura` bigint NOT NULL,
  `id_tarea` bigint NOT NULL AUTO_INCREMENT,
  `id_usuario` bigint DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `titulo` varchar(255) DEFAULT NULL,
  `prioridad` enum('alta','baja','media') DEFAULT NULL,
  PRIMARY KEY (`id_tarea`),
  KEY `FKl3haq47n5w5udb72k3k7vebkg` (`id_asignatura`),
  KEY `FKet29cbgn3dx42xd4h2647ajx6` (`id_usuario`),
  CONSTRAINT `FKet29cbgn3dx42xd4h2647ajx6` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`),
  CONSTRAINT `FKl3haq47n5w5udb72k3k7vebkg` FOREIGN KEY (`id_asignatura`) REFERENCES `asignatura` (`id_asignatura`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tarea`
--

LOCK TABLES `tarea` WRITE;
/*!40000 ALTER TABLE `tarea` DISABLE KEYS */;
INSERT INTO `tarea` VALUES (_binary '','2026-04-01',2,1,1,'Configurar el entorno local','Instalar MySQL Workbench','media'),(_binary '\0','2026-04-20',1,2,1,'Mapear el modelo de datos a clases Java','Crear Entidades JPA','alta');
/*!40000 ALTER TABLE `tarea` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `modo_sin_cuenta` int DEFAULT NULL,
  `puntos_experiencia` int DEFAULT NULL,
  `id_usuario` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `url_avatar` varchar(255) DEFAULT NULL,
  `username` varchar(255) NOT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `UK5171l57faosmj8myawaucatdw` (`email`),
  UNIQUE KEY `UK863n1y3x0jalatoir4325ehal` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (0,150,1,'alumno@studysync.com','pass123',NULL,'estudiante_pro'),(NULL,0,2,'estudiante@test.com','$2a$10$MP95PcbSNTNUih3akRhUd.2qk6ZeHaEgA1JgLRreQnwpeWcA4j3aW',NULL,'estudiante1'),(NULL,0,3,'antoniojesusorellanaorea@gmail.com','$2a$10$HFBHy1773CvZrzHOJRusZ.zE66.zlX3mKxFuenWGw//Mz0Q8AhJeC',NULL,'antonio123');
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-27 16:04:50
