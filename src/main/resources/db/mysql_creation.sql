-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: studysync
-- ------------------------------------------------------
-- Server version	8.0.45

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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `agenda`
--

LOCK TABLES `agenda` WRITE;
/*!40000 ALTER TABLE `agenda` DISABLE KEYS */;
INSERT INTO `agenda` VALUES ('2026-05-10 09:00:00.000000',1,1,1,'Examen parcial de Spring','alta'),('2026-04-25 23:59:59.000000',2,2,1,'Entrega proyecto DB','media'),('2026-04-18 12:30:00.000000',1,3,1,'Tutoría profesor','baja'),('2026-05-12 08:00:00.000000',7,4,3,'Examen Tema8','media'),('2026-05-10 08:00:00.000000',7,5,3,'Pruebas varias','media'),('2026-05-20 08:00:00.000000',6,6,3,'Examen Tema8','media'),('2026-05-26 08:00:00.000000',7,7,3,'examen primeros auxilios','media'),('2026-05-13 08:00:00.000000',12,8,3,'examen primeros auxilios','media');
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
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asignatura`
--

LOCK TABLES `asignatura` WRITE;
/*!40000 ALTER TABLE `asignatura` DISABLE KEYS */;
INSERT INTO `asignatura` VALUES ('#3498db',1,3,'Programación Web','Dra. García','Desarrollo de aplicaciones con Spring Boot y MySQL'),('#e74c3c',2,3,'Bases de Datos','Ing. Pérez','Diseño lógico y normalización de datos SQL'),('#FF5733',3,3,'Programación Java',NULL,NULL),('#FF5733',4,3,'Prueba IA',NULL,NULL),('#56f500',5,3,'Prueba DB','Antonio Orellana','Es una prueba para ver como funciona todo'),('#c800ff',6,3,'Twitch','Juan Alberto','Para aprender mas sobre audiovisuales'),('#00ffd5',7,3,'Psicologia','Olivia','Psicologia en hospital'),('#ea10b0',8,3,'Ejemplo','fddfsd','dsfddasdasdas'),('#10fe2c',9,3,'Ejemplo2','sadsdsd','zxz<x<zx'),('#020317',10,3,'ejemplo3','fdsfdfssa<','adasdasdd'),('#ff7300',11,3,'ejemplo4','sdasdsd','sadsdasdasdad '),('#44ff00',12,3,'Higiene','Marta','Higiene en el medio hospitalario'),('#ff0000',13,3,'Mecanica','Jesus','Coches');
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
) ENGINE=InnoDB AUTO_INCREMENT=102 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `flashcard`
--

LOCK TABLES `flashcard` WRITE;
/*!40000 ALTER TABLE `flashcard` DISABLE KEYS */;
INSERT INTO `flashcard` VALUES (_binary '\0',1,'2026-04-16 09:49:03.000000',1,1,NULL,'¿Qué hace @Autowired?','Inyecta dependencias automáticamente en Spring'),(_binary '\0',2,'2026-04-16 09:49:03.000000',2,1,NULL,'Diferencia entre @Service y @Component','Service es una especialización de Component para lógica de negocio'),(_binary '\0',1,'2026-04-16 09:49:03.000000',3,2,NULL,'¿Para qué sirve JOIN?','Para combinar filas de dos o más tablas basándose en una columna común'),(_binary '',0,'2026-04-17 08:48:53.889218',4,1,'2026-04-17 08:48:53.889218','Aquí tienes las flashcards basadas en el texto proporcionado:\n\n**Flashcards de JDBC y Controladores JDBC**\n\n1.  **Pregunta','Respuesta**\n    ¿Qué es JDBC?'),(_binary '',0,'2026-04-17 08:59:47.400773',5,1,'2026-04-17 08:59:47.400773','¿Qué es JDBC?','Es la especificación JavaSoft de una interfaz de programación de aplicaciones (API) estándar que permite que los programas Java accedan a sistemas de gestión de bases de datos.'),(_binary '',0,'2026-04-17 08:59:47.469749',6,1,'2026-04-17 08:59:47.469749','¿De qué consiste la API JDBC?','De un conjunto de interfaces y clases escritas en el lenguaje de programación Java.'),(_binary '',0,'2026-04-17 08:59:47.498913',7,1,'2026-04-17 08:59:47.498913','¿Qué pueden hacer los programadores con JDBC?','Escribir aplicaciones que conecten con bases de datos, envíen consultas SQL y procesen los resultados.'),(_binary '',0,'2026-04-17 08:59:47.507671',8,1,'2026-04-17 08:59:47.507671','¿Qué es un controlador JDBC?','Implementa las interfaces y clases de la API JDBC para un determinado proveedor de DBMS.'),(_binary '',1,'2026-04-17 08:59:47.532566',9,1,'2026-04-19 10:22:55.128771','¿Qué hace la clase JDBC DriverManager?','Envía todas las llamadas de la API JDBC al controlador cargado.'),(_binary '',0,'2026-05-05 09:08:05.634954',10,2,'2026-05-05 09:08:05.634954','¿Qué es JDBC?','Es una API estándar que permite que los programas Java accedan a sistemas de gestión de bases de datos mediante un conjunto de interfaces y clases.'),(_binary '',0,'2026-05-05 09:08:05.751185',11,2,'2026-05-05 09:08:05.751185','¿Cuál es la función de un controlador JDBC?','Implementar las interfaces y clases de la API JDBC para un proveedor de DBMS específico para permitir la conexión y el envío de consultas SQL.'),(_binary '',0,'2026-05-05 09:08:05.751185',12,2,'2026-05-05 09:08:05.751185','¿Qué caracteriza a un controlador JDBC de Tipo 4?','Es un controlador de protocolo nativo y Java puro que conecta directamente la aplicación cliente con el servidor de bases de datos sin necesidad de un nivel medio.'),(_binary '',0,'2026-05-05 09:08:05.784498',13,2,'2026-05-05 09:08:05.784498','¿De qué tipo es el controlador JDBC de IBM Informix?','Es un controlador de Tipo 4, lo que significa que es de protocolo nativo y puro Java.'),(_binary '',0,'2026-05-05 09:08:05.801375',14,2,'2026-05-05 09:08:05.801375','¿Qué variable de entorno debe configurarse para que la JVM encuentre las bibliotecas del controlador JDBC?','Se debe establecer la variable de entorno CLASSPATH apuntando a los archivos del controlador, como ifxjdbc.jar.'),(_binary '',0,'2026-05-05 09:25:44.193384',15,13,'2026-05-05 09:25:44.193384','¿Qué es JDBC?','Es una API estándar de Java que permite a los programas conectar con bases de datos, enviar consultas SQL y procesar los resultados.'),(_binary '',0,'2026-05-05 09:25:44.277195',16,13,'2026-05-05 09:25:44.277195','¿Cuál es la función de un controlador JDBC?','Implementar las interfaces y clases de la API JDBC para un proveedor de sistemas de gestión de bases de datos (DBMS) específico.'),(_binary '',0,'2026-05-05 09:25:44.295283',17,13,'2026-05-05 09:25:44.295283','¿Qué caracteriza a un controlador JDBC de Tipo 4?','Es un controlador de Java puro que convierte las llamadas de la API directamente al protocolo de red del DBMS sin necesidad de un nivel medio.'),(_binary '',0,'2026-05-05 09:25:44.325400',18,13,'2026-05-05 09:25:44.325400','¿Qué función cumple la clase DriverManager en JDBC?','Se encarga de enviar todas las llamadas de la API JDBC al controlador específico que ha sido cargado para el DBMS.'),(_binary '',0,'2026-05-05 09:25:44.327238',19,13,'2026-05-05 09:25:44.327238','¿Qué variable de entorno debe configurarse para utilizar el controlador JDBC de Informix en una aplicación?','La variable CLASSPATH, para que la JVM pueda localizar los archivos de biblioteca como ifxjdbc.jar.'),(_binary '',0,'2026-05-06 06:41:37.931307',20,5,'2026-05-06 06:41:37.931307','¿Qué es JDBC?','Una API estándar de Java que permite a las aplicaciones conectar con bases de datos, enviar consultas SQL y procesar los resultados obtenidos.'),(_binary '',0,'2026-05-06 06:41:38.047177',21,5,'2026-05-06 06:41:38.047177','¿Cuál es la función de un controlador JDBC?','Implementar las interfaces y clases de la API JDBC para un proveedor de DBMS específico, permitiendo la comunicación entre el programa Java y la base de datos.'),(_binary '',0,'2026-05-06 06:41:38.097265',22,5,'2026-05-06 06:41:38.097265','¿Qué caracteriza a un controlador JDBC de Tipo 4?','Es un controlador de Java puro que convierte las llamadas JDBC directamente al protocolo de red del DBMS sin necesidad de un nivel medio.'),(_binary '',0,'2026-05-06 06:41:38.147185',23,5,'2026-05-06 06:41:38.147185','¿Qué tipo de controlador es el IBM Informix JDBC Driver?','Es un controlador de Tipo 4 (protocolo nativo y puro Java) que conecta directamente con el servidor de bases de datos.'),(_binary '',0,'2026-05-06 06:41:38.180818',24,5,'2026-05-06 06:41:38.180818','¿Qué variable de entorno se debe configurar para que la JVM encuentre el controlador de Informix?','La variable de entorno CLASSPATH, que debe incluir la ruta al archivo ifxjdbc.jar.'),(_binary '',0,'2026-05-06 07:38:07.505955',25,5,'2026-05-06 07:38:07.505955','¿Qué es una query o consulta en el contexto de bases de datos?','Es una solicitud de información o una instrucción específica enviada a una base de datos para recuperar, manipular o modificar datos.'),(_binary '',0,'2026-05-06 07:38:07.522713',26,5,'2026-05-06 07:38:07.522713','¿Cuáles son las tres cláusulas fundamentales de una consulta SQL básica para la extracción de datos?','SELECT (para elegir las columnas), FROM (para especificar la tabla) y WHERE (para filtrar los registros según condiciones).'),(_binary '',0,'2026-05-06 07:38:07.540210',27,5,'2026-05-06 07:38:07.540210','¿Cuál es la diferencia principal entre una query de selección y una query de acción?','La de selección solo recupera y muestra información, mientras que la de acción realiza cambios en los datos, como insertar, actualizar o eliminar registros.'),(_binary '',0,'2026-05-06 07:38:07.556188',28,5,'2026-05-06 07:38:07.556188','¿Qué función cumple el operador JOIN en una consulta relacional?','Permite combinar filas de dos o más tablas basándose en una columna relacionada entre ellas para obtener una visión unificada de los datos.'),(_binary '',0,'2026-05-06 07:38:07.572801',29,5,'2026-05-06 07:38:07.572801','¿Para qué se utiliza la cláusula GROUP BY en una sentencia SQL?','Para agrupar filas que tienen los mismos valores en columnas específicas, permitiendo aplicar funciones de agregado como SUM, AVG o COUNT sobre cada grupo.'),(_binary '',0,'2026-05-06 07:40:22.655919',30,5,'2026-05-06 07:40:22.655919','¿Cuál es la función principal de la cláusula INNER JOIN en SQL?','Combinar filas de dos o más tablas basándose en una columna relacionada, devolviendo únicamente los registros que tienen coincidencias en ambas tablas.'),(_binary '',0,'2026-05-06 07:40:22.672620',31,5,'2026-05-06 07:40:22.672620','¿Qué sucede con las filas que no encuentran una correspondencia en la tabla opuesta durante un INNER JOIN?','Dichas filas son excluidas del conjunto de resultados final.'),(_binary '',0,'2026-05-06 07:40:22.672620',32,5,'2026-05-06 07:40:22.672620','¿Cómo se representa gráficamente un INNER JOIN mediante un diagrama de Venn?','Como la intersección sombreada entre dos conjuntos, donde solo se muestra el área común entre ambas tablas.'),(_binary '',0,'2026-05-06 07:40:22.689686',33,5,'2026-05-06 07:40:22.689686','¿Qué palabra clave es opcional y suele omitirse por brevedad, ya que es el tipo de unión por defecto en SQL?','La palabra INNER, de modo que escribir JOIN produce el mismo resultado.'),(_binary '',0,'2026-05-06 07:40:22.689686',34,5,'2026-05-06 07:40:22.689686','¿Qué elemento de la sintaxis es indispensable para definir la condición de vinculación entre las tablas en un INNER JOIN?','La cláusula ON, que especifica la igualdad entre las columnas que relacionan ambas entidades.'),(_binary '',0,'2026-05-06 07:43:48.553806',35,13,'2026-05-06 07:43:48.553806','¿Qué significan las siglas JSON y cuál es su función principal?','JavaScript Object Notation; es un formato ligero de intercambio de datos utilizado para almacenar y transportar información entre un servidor y una aplicación web.'),(_binary '',0,'2026-05-06 07:43:48.570441',36,13,'2026-05-06 07:43:48.570441','¿Cuál es la estructura fundamental que utiliza JSON para organizar la información?','Se basa en una colección de pares de clavevalor, donde las claves deben ser cadenas de texto entre comillas dobles y los valores pueden ser diversos tipos de datos.'),(_binary '',0,'2026-05-06 07:43:48.587016',37,13,'2026-05-06 07:43:48.587016','¿Qué representan los símbolos de llaves {} y corchetes [] dentro de un archivo JSON?','Las llaves definen un objeto (un conjunto de pares clavevalor) y los corchetes definen un arreglo o lista ordenada de elementos.'),(_binary '',0,'2026-05-06 07:43:48.587016',38,13,'2026-05-06 07:43:48.587016','¿Qué tipos de datos son válidos para ser utilizados como valores en JSON?','Cadenas de texto (strings), números, objetos, arreglos (arrays), booleanos (true/false) y el valor null.'),(_binary '',0,'2026-05-06 07:43:48.603761',39,13,'2026-05-06 07:43:48.603761','¿Es JSON un formato dependiente del lenguaje de programación JavaScript?','No, aunque su sintaxis deriva de JavaScript, es un formato de texto independiente y casi todos los lenguajes de programación modernos poseen librerías para procesarlo.'),(_binary '',0,'2026-05-06 08:07:49.978100',40,5,'2026-05-06 08:07:49.978100','¿Cuál es la función principal de la cláusula INNER JOIN en SQL?','Combinar filas de dos o más tablas basándose en una columna relacionada, devolviendo solo los registros que tienen coincidencias en ambas.'),(_binary '',0,'2026-05-06 08:07:49.994832',41,5,'2026-05-06 08:07:49.994832','¿Qué sucede con los registros que no tienen una correspondencia exacta en la otra tabla durante un INNER JOIN?','Son excluidos por completo del conjunto de resultados final.'),(_binary '',0,'2026-05-06 08:07:50.011678',42,5,'2026-05-06 08:07:50.011678','¿Qué palabra clave se utiliza después de especificar las tablas para definir la condición de vinculación?','La palabra clave ON.'),(_binary '',0,'2026-05-06 08:07:50.028070',43,5,'2026-05-06 08:07:50.028070','En un diagrama de Venn que representa dos tablas, ¿qué área corresponde al resultado de un INNER JOIN?','La intersección central, donde ambos conjuntos se solapan.'),(_binary '',0,'2026-05-06 08:07:50.045129',44,5,'2026-05-06 08:07:50.045129','¿Cuál es el tipo de JOIN que se ejecuta por defecto en la mayoría de los motores de bases de datos si solo se escribe la palabra JOIN?','El INNER JOIN.'),(_binary '',0,'2026-05-06 08:54:04.857602',45,5,'2026-05-06 08:54:04.857602','¿Qué es JDBC y cuál es su función principal?','Es una API estándar de Java que permite a las aplicaciones conectar con bases de datos, enviar consultas SQL y procesar los resultados obtenidos.'),(_binary '',0,'2026-05-06 08:54:04.974242',46,5,'2026-05-06 08:54:04.974242','¿Cuál es la función de la clase DriverManager en el proceso de conexión?','Se encarga de cargar el controlador específico del DBMS y enviar todas las llamadas de la API JDBC hacia dicho controlador.'),(_binary '',0,'2026-05-06 08:54:05.002788',47,5,'2026-05-06 08:54:05.002788','¿Qué caracteriza a un controlador JDBC de Tipo 4 como el de IBM Informix?','Es un controlador de protocolo nativo y Java puro que conecta la aplicación directamente con el servidor de bases de datos sin requerir un nivel medio.'),(_binary '',0,'2026-05-06 08:54:05.019030',48,5,'2026-05-06 08:54:05.019030','¿Qué diferencia fundamental existe entre los controladores JDBC de Tipo 1/2 y los de Tipo 4?','Los de Tipo 1 y 2 requieren cargar código binario específico en cada cliente, mientras que el Tipo 4 es Java puro y no necesita software adicional en el cliente.'),(_binary '',0,'2026-05-06 08:54:05.040500',49,5,'2026-05-06 08:54:05.040500','¿Qué configuración de entorno es necesaria para que la Java Virtual Machine localice el controlador de Informix?','Se debe establecer la variable de entorno CLASSPATH para que apunte a la ubicación de los archivos .jar del controlador, como ifxjdbc.jar.'),(_binary '',0,'2026-05-06 10:43:06.854754',50,5,'2026-05-06 10:43:06.854754','','Pregunta'),(_binary '',0,'2026-05-06 10:43:07.007283',51,5,'2026-05-06 10:43:07.007283','',':'),(_binary '',0,'2026-05-06 10:43:07.020825',52,5,'2026-05-06 10:43:07.020825','','¿Qué significa el acrónimo JSON y cuál es su función principal?'),(_binary '',0,'2026-05-06 10:43:07.034463',53,5,'2026-05-06 10:43:07.034463','','¿Cuáles son los dos elementos estructurales básicos en la sintaxis de JSON?'),(_binary '',0,'2026-05-06 10:43:07.043566',54,5,'2026-05-06 10:43:07.043566','','En JSON, ¿qué tipo de comillas se deben utilizar obligatoriamente para las claves (keys) y cadenas de texto?'),(_binary '',0,'2026-05-06 10:43:07.056925',55,5,'2026-05-06 10:43:07.056925','','¿Cuáles son los tipos de datos permitidos para los valores en un archivo JSON?'),(_binary '',0,'2026-05-06 10:43:07.073006',56,5,'2026-05-06 10:43:07.073006','','¿JSON depende exclusivamente del lenguaje JavaScript para funcionar?'),(_binary '',1,'2026-05-06 10:44:11.729389',57,8,'2026-05-13 18:40:23.511593','1. ¿Qué es una \"Query\" o consulta en el contexto de bases de datos?','Es una solicitud de información o una instrucción para realizar una acción (como leer, insertar, actualizar o borrar datos) dentro de una base de datos.'),(_binary '',0,'2026-05-06 10:44:11.746027',58,8,'2026-05-12 18:40:26.040283','2. ¿Cuál es el lenguaje estándar más utilizado para redactar queries en bases de datos relacionales?','SQL (Structured Query Language o Lenguaje de Consulta Estructurada).'),(_binary '',0,'2026-05-06 10:44:11.746027',59,8,'2026-05-12 18:40:27.281382','3. En una consulta SQL básica, ¿cuál es la función de la cláusula SELECT y FROM?','SELECT especifica qué columnas de datos quieres obtener y FROM indica la tabla de donde provienen esos datos.'),(_binary '',0,'2026-05-06 10:44:11.763903',60,8,'2026-05-12 18:40:28.083316','4. ¿Para qué se utiliza la cláusula WHERE en una query?','Se utiliza para filtrar los resultados, permitiendo extraer solo aquellos registros que cumplen con una condición específica.'),(_binary '',1,'2026-05-06 10:44:11.782293',61,8,'2026-05-13 18:40:29.112320','5. ¿Cuál es la diferencia entre una query de tipo SELECT y una de tipo DELETE?','SELECT se usa para recuperar y visualizar datos sin alterarlos, mientras que DELETE se usa para eliminar registros de una tabla de forma permanente.'),(_binary '',0,'2026-05-06 10:44:32.578177',62,8,'2026-05-12 18:40:30.210524','1. Pregunta: ¿Qué es una Query (consulta) en el contexto de bases de datos?','Respuesta: Es una solicitud precisa de información dirigida a una base de datos para recuperar, manipular o modificar datos específicos.'),(_binary '',0,'2026-05-06 10:44:32.594886',63,8,'2026-05-06 10:44:32.594886','2. Pregunta: ¿Cuál es el lenguaje estándar más utilizado para realizar querys en bases de datos relacionales?','Respuesta: SQL (Structured Query Language o Lenguaje de Consulta Estructurado).'),(_binary '',0,'2026-05-06 10:44:32.594886',64,8,'2026-05-06 10:44:32.594886','3. Pregunta: En una query básica de SQL, ¿cuáles son las tres cláusulas fundamentales para extraer datos?','Respuesta: SELECT (define las columnas), FROM (define la tabla) y WHERE (define los filtros o condiciones).'),(_binary '',0,'2026-05-06 10:44:32.614762',65,8,'2026-05-06 10:44:32.614762','4. Pregunta: ¿Cuál es la diferencia entre una query de selección y una query de acción?','Respuesta: La de selección solo recupera y muestra datos sin alterarlos, mientras que la de acción realiza cambios (insertar, actualizar o eliminar registros).'),(_binary '',0,'2026-05-06 10:44:32.631058',66,8,'2026-05-06 10:44:32.631058','5. Pregunta: ¿Qué significa \"optimizar una query\" y por qué es importante?','Respuesta: Es el proceso de escribir la consulta de la forma más eficiente posible para reducir el tiempo de respuesta y el consumo de recursos del servidor.'),(_binary '',0,'2026-05-06 10:45:45.227781',67,5,'2026-05-06 10:45:45.227781','1. Pregunta: ¿Cuál es la función principal de la cláusula INNER JOIN en SQL?','Respuesta: Combinar filas de dos o más tablas basándose en una columna relacionada (llave) común entre ellas.'),(_binary '',0,'2026-05-06 10:45:45.244339',68,5,'2026-05-06 10:45:45.244339','2. Pregunta: En términos de conjuntos (Diagrama de Venn), ¿qué parte de los datos representa un INNER JOIN?','Respuesta: La intersección; es decir, solo los registros que tienen valores coincidentes en ambas tablas.'),(_binary '',0,'2026-05-06 10:45:45.270146',69,5,'2026-05-06 10:45:45.270146','3. Pregunta: ¿Qué sucede con una fila de la \"Tabla A\" si no encuentra una coincidencia en la \"Tabla B\" durante un INNER JOIN?','Respuesta: La fila no aparecerá en el resultado final; el INNER JOIN excluye cualquier registro que no tenga par en la otra tabla.'),(_binary '',0,'2026-05-06 10:45:45.278149',70,5,'2026-05-06 10:45:45.278149','4. Pregunta: ¿Cuál es la sintaxis básica para realizar un INNER JOIN entre la tabla \"Clientes\" y \"Pedidos\" usando el campo \"ID_Cliente\"?','Respuesta: `SELECT  FROM Clientes INNER JOIN Pedidos ON Clientes.ID_Cliente = Pedidos.ID_Cliente;`'),(_binary '',0,'2026-05-06 10:45:45.295204',71,5,'2026-05-06 10:45:45.295204','5. Pregunta: ¿Es obligatorio usar la palabra \"INNER\" en todos los motores de base de datos para realizar esta unión?','Respuesta: No siempre; en muchos sistemas (como MySQL o PostgreSQL), usar simplemente la palabra clave `JOIN` por defecto se interpreta como un `INNER JOIN`.'),(_binary '',0,'2026-05-06 11:13:24.166814',72,5,'2026-05-06 11:13:24.166814','¿Qué significan las siglas CSV y cuál es su función principal?','Comma Separated Values; es un formato de archivo de texto plano diseñado para almacenar datos tabulares separando los valores mediante comas u otros delimitadores.'),(_binary '',0,'2026-05-06 11:13:24.182106',73,5,'2026-05-06 11:13:24.182106','¿Qué es un POJO en Java y qué elemento nunca debe faltar en su creación?','Un Plain Old Java Object es un objeto sencillo sin dependencias de frameworks que debe incluir siempre un constructor vacío.'),(_binary '',0,'2026-05-06 11:13:24.198768',74,5,'2026-05-06 11:13:24.198768','¿Qué paso es obligatorio realizar siempre tras finalizar la lectura o escritura de ficheros de texto en Java?','Cerrar los flujos de datos (streams) para liberar correctamente los recursos del sistema operativo.'),(_binary '',0,'2026-05-06 11:13:24.228976',75,5,'2026-05-06 11:13:24.228976','¿Qué ventaja principal ofrece el uso de la librería OpenCSV frente al manejo manual de archivos?','Simplifica significativamente la programación al gestionar automáticamente el parseo, la lectura y la escritura de los datos.'),(_binary '',0,'2026-05-06 11:13:24.251048',76,5,'2026-05-06 11:13:24.251048','¿Qué clases estándar de Java se utilizan para escribir datos manualmente en un fichero CSV?','Se utilizan las clases FileWriter y PrintWriter, insertando manualmente el delimitador seleccionado entre cada campo.'),(_binary '',1,'2026-05-11 20:55:39.279253',77,15,'2026-05-14 17:06:50.346380','¿Cuáles son los niveles de planificación en educación para la salud ordenados de mayor a menor generalidad?','Plan (líneas estratégicas), Programa (objetivos en realidad determinada) y Proyecto (intenciones y objetivos concretos).'),(_binary '',1,'2026-05-11 20:55:39.279253',78,15,'2026-05-14 17:06:52.300752','¿Qué cuatro requisitos deben cumplir los objetivos específicos en la fase de planificación?','Deben ser medibles, asumibles, relevantes y definidos en el tiempo.'),(_binary '',1,'2026-05-11 20:55:39.279253',79,15,'2026-05-14 17:06:57.269169','¿En qué se diferencian los recursos materiales fungibles de los inventariables dentro de un proyecto?','Los fungibles son aquellos que se agotan y deben reponerse, mientras que los inventariables permanecen en el tiempo.'),(_binary '',0,'2026-05-11 20:55:39.279253',80,15,'2026-05-12 21:33:55.818794','¿Cuáles son las cuatro fases secuenciales para elaborar un proyecto de educación para la salud?','1. Análisis y diagnóstico, 2. Planificación, 3. Ejecución o implementación y 4. Evaluación.'),(_binary '',0,'2026-05-11 20:55:39.279253',81,15,'2026-05-12 21:34:14.250612','¿Qué tres tipos de evaluación se deben realizar para que el proceso sea continuo?','Evaluación inicial o diagnóstica, evaluación del proceso o continua y evaluación del resultado o sumativa.'),(_binary '',0,'2026-05-11 20:57:30.899317',82,16,'2026-05-11 20:57:30.899317','¿Cuáles son los cuatro niveles de estructuración de la educación para la salud de mayor a menor generalidad?','Plan, programa, proyecto y actividades.'),(_binary '',0,'2026-05-11 20:57:30.899317',83,16,'2026-05-11 20:57:30.899317','¿Qué fase de un proyecto de EpS se encarga de identificar necesidades, establecer prioridades y definir el público diana?','Fase de análisis y diagnóstico.'),(_binary '',0,'2026-05-11 20:57:30.899317',84,16,'2026-05-11 20:57:30.899317','¿Qué cinco características deben cumplir los objetivos específicos en la planificación de un proyecto?','Deben ser específicos, medibles, asumibles, relevantes y definidos en el tiempo.'),(_binary '',0,'2026-05-11 20:57:30.899317',85,16,'2026-05-11 20:57:30.899317','¿Cómo se clasifican los recursos materiales según su durabilidad dentro de la fase de planificación?','Fungibles (se agotan y requieren reposición) e inventariables (permanecen en el tiempo).'),(_binary '',0,'2026-05-11 20:57:30.899317',86,16,'2026-05-11 20:57:30.899317','¿Qué tres tipos de evaluación deben realizarse para que el proceso sea considerado continuo?','Evaluación inicial o diagnóstica, evaluación del proceso o continua y evaluación del resultado o sumativa.'),(_binary '',0,'2026-05-11 21:31:38.628188',87,17,'2026-05-11 21:31:38.628188','¿Qué ciclo formativo de Grado Superior está cursando el alumno Antonio Jesús Orellana Orea?','Desarrollo de Aplicaciones Multiplataforma (DAM).'),(_binary '',0,'2026-05-11 21:31:38.628188',88,17,'2026-05-11 21:31:38.628188','¿En qué entidad colaboradora realiza el alumno su fase de formación en centros de trabajo?','Confederación de Empresarios de Andalucía.'),(_binary '',0,'2026-05-11 21:31:38.628188',89,17,'2026-05-11 21:31:38.628188','¿Qué lenguaje de programación empleó el estudiante para el desarrollo de macros en Microsoft Word?','VBA (Visual Basic for Applications).'),(_binary '',0,'2026-05-11 21:31:38.628188',90,17,'2026-05-11 21:31:38.628188','¿Qué tecnología utilizó el alumno para la programación de macros en Google Docs el lunes 9 de marzo?','JavaScript.'),(_binary '',0,'2026-05-11 21:31:38.628188',91,17,'2026-05-11 21:31:38.628188','¿Cuál es la carga horaria diaria dedicada a las actividades formativas según el registro de las fichas?','6 horas.'),(_binary '',1,'2026-05-11 22:08:57.054656',92,18,'2026-05-13 22:09:18.272584','¿Cuál es el paso previo obligatorio e indispensable antes de realizar cualquier proceso de desinfección o esterilización del material sanitario?','La limpieza o eliminación mecánica de la suciedad mediante agua y detergente.'),(_binary '',1,'2026-05-11 22:08:57.054656',93,18,'2026-05-13 22:11:21.718611','¿Por qué el agua empleada en el prelavado y limpieza del instrumental debe estar siempre a una temperatura inferior a 4550 ºC?','Porque el calor excesivo coagula y fija las proteínas de la materia orgánica al instrumental, dificultando su eliminación.'),(_binary '',1,'2026-05-11 22:08:57.054656',94,18,'2026-05-13 22:11:23.939191','¿Cuáles son los cuatro factores interdependientes que componen el Círculo de Sinner en el proceso de limpieza?','Acción química (detergente), acción mecánica, temperatura y tiempo.'),(_binary '',1,'2026-05-11 22:08:57.054656',95,18,'2026-05-13 22:10:40.370754','¿Qué elementos del instrumental sanitario están específicamente contraindicados para ser lavados en una lavadora ultrasónica?','Las ópticas, las lentes y los motores.'),(_binary '',1,'2026-05-11 22:08:57.054656',96,18,'2026-05-13 22:11:25.070389','¿Cuál es la diferencia fundamental en el uso de desinfectantes entre un área de alto riesgo y una de bajo riesgo?','En áreas de alto riesgo (quirófanos, UCI) se usa desinfectante siempre, mientras que en áreas de bajo riesgo (pasillos) no se utiliza de forma rutinaria.'),(_binary '',1,'2026-05-12 17:21:04.252258',97,19,'2026-05-14 17:23:32.228369','¿Qué significa el término \"Volkswagen\" en alemán?','Automóvil del pueblo'),(_binary '',1,'2026-05-12 17:21:04.252258',98,19,'2026-05-14 17:21:42.879294','¿En qué ciudad de Alemania se encuentra la sede central de la empresa Volkswagen?','Wolfsburgo'),(_binary '',1,'2026-05-12 17:21:04.252258',99,19,'2026-05-14 17:23:34.288128','¿Quién fundó la marca Volkswagen el 28 de mayo de 1937?','El Frente Alemán del Trabajo'),(_binary '',1,'2026-05-12 17:21:04.252258',100,19,'2026-05-14 17:21:55.416478','¿Qué tres modelos de Volkswagen se encuentran en la lista de los diez coches más vendidos de todos los tiempos?','Golf, Escarabajo y Passat'),(_binary '',1,'2026-05-12 17:21:04.252258',101,19,'2026-05-14 17:22:05.454412','¿Cuál era el eslogan internacional de Volkswagen antes de simplificarlo en 2016 tras el escándalo de emisiones?','Das Auto');
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
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mazo_flashcard`
--

LOCK TABLES `mazo_flashcard` WRITE;
/*!40000 ALTER TABLE `mazo_flashcard` DISABLE KEYS */;
INSERT INTO `mazo_flashcard` VALUES (1,1,1,'Conceptos Spring','Repaso de anotaciones y ciclo de vida'),(2,2,1,'Comandos SQL','Joins, Aggregations y DDL'),(4,3,1,'Mazo de JDBC',NULL),(3,4,3,'Clases',NULL),(2,5,3,'Querys',NULL),(3,6,3,'Repaso Override','Repaso de todas las etiquetas especialmente Override'),(4,7,3,'Vocabulario','Entreno de IA'),(2,8,3,'Holaaaaa','esto es una prueba'),(1,9,3,'21312332131','wd d sdfsffd s'),(2,10,3,'dsadsdasd','sadasdsadsd'),(2,11,3,'ddsdsfdsf','dfsdfdsff'),(1,12,3,'examen final','estudiar para examen'),(2,13,3,'JDBC','Pruebas para JDBC'),(7,14,3,'Tema 8',NULL),(7,15,3,'Tema 8',NULL),(10,16,3,'XASxaSXA',NULL),(11,17,3,'adasdasd',NULL),(12,18,3,'Apuntes higiene',NULL),(13,19,3,'WolskVAgen',NULL);
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
  `tipo` enum('pdf','video','enlace','otro','pptx','docx') DEFAULT NULL,
  PRIMARY KEY (`id_recurso`),
  KEY `FKd84aid4bpfca7vogqixjlyq9b` (`id_asignatura`),
  CONSTRAINT `FKd84aid4bpfca7vogqixjlyq9b` FOREIGN KEY (`id_asignatura`) REFERENCES `asignatura` (`id_asignatura`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recurso`
--

LOCK TABLES `recurso` WRITE;
/*!40000 ALTER TABLE `recurso` DISABLE KEYS */;
INSERT INTO `recurso` VALUES ('2026-04-16 09:49:03.000000',1,1,NULL,'Manual de Hibernate PDF','http://docs.jboss.org/hibernate.pdf','pdf'),('2026-04-16 09:49:03.000000',2,2,NULL,'Video Tutorial Joins','https://youtube.com/watch?v=sql-joins','video'),('2026-04-16 10:09:20.249383',1,3,NULL,'Apuntes JDBC','C:/TusDocumentos/clase_jdbc.pdf','pdf'),('2026-04-16 10:16:51.844909',1,4,NULL,'Apuntes JDBC','C:/temp/jdbc.pdf','pdf'),('2026-05-05 07:47:01.303321',2,5,'78 KB','Apuntes JDBC','C:\\studysync_files\\uploads\\1777967221303_jdbc.pdf','pdf'),('2026-05-06 06:43:50.923461',2,6,'5 KB','Querys','C:\\studysync_files\\uploads\\1778049830924_WimSXuCam5g[1]','enlace'),('2026-05-06 07:37:48.306237',2,7,'URL','Querys ','enlace-externo','enlace'),('2026-05-06 07:39:21.746529',2,8,'URL','Inner Join SQL','enlace-externo','video'),('2026-05-06 07:43:26.443607',2,9,'URL','JSON','enlace-externo','pdf'),('2026-05-06 08:06:10.494288',2,10,'1251 KB','Sesion 2 CSV','C:\\studysync_files\\uploads\\1778054770494_Sesion 2 - CSV.pptx','otro'),('2026-05-06 10:51:55.941790',2,11,'1251 KB','CSV','C:\\studysync_files\\uploads\\1778064715941_Sesion 2-CSV.pptx','otro'),('2026-05-06 10:53:22.958645',2,12,'1251 KB','CSV2','C:\\studysync_files\\uploads\\1778064802958_Sesion2-CSV.pptx','pdf'),('2026-05-06 11:13:08.916777',2,13,'489 KB','CSV3','C:\\studysync_files\\uploads\\1778065988916_Sesion2-CSV.pdf','pdf'),('2026-05-11 19:19:49.590706',7,14,'454 KB','Tema8','C:\\studysync_files\\uploads\\1778527189590_tema 8 cae.pdf','pdf'),('2026-05-11 20:37:48.342685',7,15,'454 KB','tema2','C:\\studysync_files\\uploads\\1778531868342_tema 8 cae.pdf','pdf'),('2026-05-11 20:57:05.969372',10,16,'454 KB','Sasa','C:\\studysync_files\\uploads\\1778533025970_tema 8 cae.pdf','pdf'),('2026-05-11 21:31:20.901708',11,17,'396 KB','dasdsfasda','C:\\studysync_files\\uploads\\1778535080901_Ficha_Rellenable_Marzo.pdf','pdf'),('2026-05-11 22:08:27.601113',12,18,'188 KB','Apuntes higiene','C:\\studysync_files\\uploads\\1778537307601_APUNTES HIGIENE.pdf','pdf'),('2026-05-12 17:20:10.645232',13,19,'URL','WolskVagen','https://es.wikipedia.org/wiki/Volkswagen','enlace');
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
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sesion_estudio`
--

LOCK TABLES `sesion_estudio` WRITE;
/*!40000 ALTER TABLE `sesion_estudio` DISABLE KEYS */;
INSERT INTO `sesion_estudio` VALUES (60,'2026-04-15 17:00:00.000000',1,1,1,'estudio'),(45,'2026-04-16 10:00:00.000000',2,2,1,'repaso_flashcards'),(2,'2026-05-01 11:02:22.592437',1,3,3,'estudio'),(3,'2026-05-01 11:05:48.695455',3,4,3,'estudio'),(1,'2026-05-11 19:19:08.000000',1,5,3,'estudio'),(1,'2026-05-11 19:21:25.000000',1,6,3,'estudio'),(1,'2026-05-11 19:21:51.000000',10,7,3,'estudio'),(1,'2026-05-11 19:24:52.000000',1,8,3,'estudio'),(1,'2026-05-11 21:30:27.000000',1,9,3,'estudio'),(1,'2026-05-11 21:36:41.000000',7,10,3,'estudio'),(2,'2026-05-11 21:37:07.000000',7,11,3,'estudio'),(1,'2026-05-11 21:40:03.000000',1,12,3,'estudio'),(7,'2026-05-11 21:40:07.000000',7,13,3,'estudio'),(NULL,'2026-05-12 17:02:10.000000',6,14,3,'estudio'),(NULL,'2026-05-12 17:07:22.000000',1,15,3,'estudio'),(NULL,'2026-05-12 17:23:09.000000',13,16,3,'estudio'),(1,'2026-05-12 18:50:51.000000',1,17,3,'estudio'),(1,'2026-05-12 16:57:18.000000',13,18,3,'estudio'),(1,'2026-05-12 16:59:06.000000',7,19,3,'estudio'),(1,'2026-05-12 17:24:26.000000',7,20,3,'estudio');
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

-- Dump completed on 2026-05-12 21:27:07
