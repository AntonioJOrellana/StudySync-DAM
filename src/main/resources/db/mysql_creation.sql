-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: studysync
-- ------------------------------------------------------
-- Server version	8.0.42

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `agenda`
--

LOCK TABLES `agenda` WRITE;
/*!40000 ALTER TABLE `agenda` DISABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asignatura`
--

LOCK TABLES `asignatura` WRITE;
/*!40000 ALTER TABLE `asignatura` DISABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `flashcard`
--

LOCK TABLES `flashcard` WRITE;
/*!40000 ALTER TABLE `flashcard` DISABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mazo_flashcard`
--

LOCK TABLES `mazo_flashcard` WRITE;
/*!40000 ALTER TABLE `mazo_flashcard` DISABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recurso`
--

LOCK TABLES `recurso` WRITE;
/*!40000 ALTER TABLE `recurso` DISABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sesion_estudio`
--

LOCK TABLES `sesion_estudio` WRITE;
/*!40000 ALTER TABLE `sesion_estudio` DISABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tarea`
--

LOCK TABLES `tarea` WRITE;
/*!40000 ALTER TABLE `tarea` DISABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
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

-- Dump completed on 2026-04-16  9:45:44
