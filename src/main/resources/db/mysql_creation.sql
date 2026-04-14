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
  `id_evento` int NOT NULL AUTO_INCREMENT,
  `id_asignatura` int NOT NULL,
  `titulo` varchar(150) NOT NULL,
  `fecha_evento` datetime NOT NULL,
  `prioridad` enum('alta','media','baja') DEFAULT 'media',
  PRIMARY KEY (`id_evento`),
  KEY `id_asignatura` (`id_asignatura`),
  CONSTRAINT `agenda_ibfk_1` FOREIGN KEY (`id_asignatura`) REFERENCES `asignatura` (`id_asignatura`) ON DELETE CASCADE
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
  `id_asignatura` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `color` varchar(7) DEFAULT NULL,
  `id_usuario` int NOT NULL,
  `profesor` varchar(150) DEFAULT NULL,
  `descripcion` text,
  PRIMARY KEY (`id_asignatura`),
  KEY `fk_asignatura_usuario` (`id_usuario`),
  CONSTRAINT `fk_asignatura_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
  `id_flashcard` int NOT NULL AUTO_INCREMENT,
  `anverso` text NOT NULL,
  `reverso` text NOT NULL,
  `nivel_espaciado` int DEFAULT '0',
  `proximo_repaso` date DEFAULT (curdate()),
  `id_mazo` int NOT NULL,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_flashcard`),
  KEY `idx_flashcard_mazo` (`id_mazo`),
  CONSTRAINT `fk_flashcard_mazo` FOREIGN KEY (`id_mazo`) REFERENCES `mazo_flashcard` (`id_mazo`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
  `id_mazo` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text,
  `id_usuario` int NOT NULL,
  `id_asignatura` int NOT NULL,
  PRIMARY KEY (`id_mazo`),
  KEY `fk_mazo_usuario` (`id_usuario`),
  KEY `fk_mazo_asignatura` (`id_asignatura`),
  CONSTRAINT `fk_mazo_asignatura` FOREIGN KEY (`id_asignatura`) REFERENCES `asignatura` (`id_asignatura`) ON DELETE CASCADE,
  CONSTRAINT `fk_mazo_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
  `id_recurso` int NOT NULL AUTO_INCREMENT,
  `id_asignatura` int NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `tipo` enum('pdf','video','enlace') DEFAULT 'pdf',
  `url_acceso` text NOT NULL,
  `metadata` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_recurso`),
  KEY `id_asignatura` (`id_asignatura`),
  CONSTRAINT `recurso_ibfk_1` FOREIGN KEY (`id_asignatura`) REFERENCES `asignatura` (`id_asignatura`) ON DELETE CASCADE
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
  `id_sesion` int NOT NULL AUTO_INCREMENT,
  `fecha_inicio` datetime NOT NULL,
  `duracion_minutos` int NOT NULL,
  `tipo` varchar(50) DEFAULT 'Pomodoro',
  `id_usuario` int NOT NULL,
  `id_asignatura` int NOT NULL,
  PRIMARY KEY (`id_sesion`),
  KEY `idx_sesion_usuario` (`id_usuario`),
  KEY `fk_sesion_asignatura` (`id_asignatura`),
  CONSTRAINT `fk_sesion_asignatura` FOREIGN KEY (`id_asignatura`) REFERENCES `asignatura` (`id_asignatura`) ON DELETE CASCADE,
  CONSTRAINT `fk_sesion_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE
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
  `id_tarea` bigint NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `fecha_entrega` date DEFAULT NULL,
  `prioridad` int DEFAULT NULL,
  `completada` int DEFAULT NULL,
  `id_asignatura` int NOT NULL,
  `estado` varchar(255) DEFAULT NULL,
  `fecha_limite` date DEFAULT NULL,
  `id_usuario` int NOT NULL,
  PRIMARY KEY (`id_tarea`),
  KEY `idx_tarea_asignatura` (`id_asignatura`),
  KEY `FKet29cbgn3dx42xd4h2647ajx6` (`id_usuario`),
  CONSTRAINT `fk_tarea_asignatura` FOREIGN KEY (`id_asignatura`) REFERENCES `asignatura` (`id_asignatura`) ON DELETE CASCADE,
  CONSTRAINT `FKet29cbgn3dx42xd4h2647ajx6` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`),
  CONSTRAINT `tarea_chk_1` CHECK ((`prioridad` between 1 and 3))
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `modo_sin_cuenta` int DEFAULT NULL,
  `fecha_creacion` datetime DEFAULT CURRENT_TIMESTAMP,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
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
INSERT INTO `usuario` VALUES (1,NULL,'2026-04-14 10:27:20','alberto@mail.com','$2a$10$8.UnS3Rpx9L.Agv.L1S9teQWnB2.pWqN6Gf.HhJ.vYvH5H6H5H6H5','Aorellana'),(2,NULL,'2026-04-14 10:27:20','pepe@mail.com','$2a$10$8.UnS3Rpx9L.Agv.L1S9teQWnB2.pWqN6Gf.HhJ.vYvH5H6H5H6H5','Pepe'),(3,NULL,'2026-04-14 10:17:36','ana@mail.com','$2a$10$FUKAJytRAzQ6NtG1aeT6lOl8ByrJxkQeQpAEb5PN8cPwwdl27c4OO','Ana');
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

-- Dump completed on 2026-04-14 12:06:49
