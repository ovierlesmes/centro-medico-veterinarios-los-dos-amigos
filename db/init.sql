-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: veterinaria
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
-- Table structure for table `citas`
--

DROP TABLE IF EXISTS `citas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `citas` (
  `id` char(36) NOT NULL,
  `fecha_hora` datetime NOT NULL,
  `mascota_id` char(36) NOT NULL,
  `veterinario_id` varchar(36) DEFAULT NULL,
  `sintomas` text,
  `estado` enum('pendiente','confirmada','cancelada','cancelada_por_veterinario','atendida') DEFAULT NULL,
  `edad` varchar(10) DEFAULT NULL,
  `raza` varchar(50) DEFAULT NULL,
  `especie` varchar(50) DEFAULT NULL,
  `usuario_id` varchar(36) DEFAULT NULL,
  `notas` text,
  PRIMARY KEY (`id`),
  KEY `fk_mascota_cita` (`mascota_id`),
  KEY `fk_usuario_cita` (`usuario_id`),
  KEY `fk_veterinario_usuario` (`veterinario_id`),
  CONSTRAINT `citas_ibfk_1` FOREIGN KEY (`mascota_id`) REFERENCES `mascotas` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_mascota_cita` FOREIGN KEY (`mascota_id`) REFERENCES `mascotas` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `fk_usuario_cita` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_veterinario_usuario` FOREIGN KEY (`veterinario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `citas`
--

LOCK TABLES `citas` WRITE;
/*!40000 ALTER TABLE `citas` DISABLE KEYS */;
INSERT INTO `citas` VALUES ('c6d5dd0d-0a87-46bd-820e-4746afb620f8','2025-07-01 01:00:00','584259ee-e130-4a66-a41a-9755f8eb75c4','7c2a6102-18c6-4c6f-bed3-2d497f69a964','vomito','atendida','10','rotwailer','perro','ea543208-0f75-46fd-8dff-88571b1b6a7a','se le da vitaminas');
/*!40000 ALTER TABLE `citas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historial_medico`
--

DROP TABLE IF EXISTS `historial_medico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historial_medico` (
  `id` char(36) NOT NULL,
  `mascota_id` char(36) NOT NULL,
  `descripcion` text NOT NULL,
  `fecha` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `mascota_id` (`mascota_id`),
  CONSTRAINT `historial_medico_ibfk_1` FOREIGN KEY (`mascota_id`) REFERENCES `mascotas` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historial_medico`
--

LOCK TABLES `historial_medico` WRITE;
/*!40000 ALTER TABLE `historial_medico` DISABLE KEYS */;
INSERT INTO `historial_medico` VALUES ('320936e3-32d0-4879-96ce-e8a2f424ac6c','584259ee-e130-4a66-a41a-9755f8eb75c4','se le da vitaminas','2025-06-27 22:43:51'),('a951c4ce-5ac6-457a-82c1-ccdf88c38dee','584259ee-e130-4a66-a41a-9755f8eb75c4','se le da vitaminas','2025-06-27 22:43:40');
/*!40000 ALTER TABLE `historial_medico` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mascotas`
--

DROP TABLE IF EXISTS `mascotas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mascotas` (
  `id` char(36) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `especie` varchar(50) DEFAULT NULL,
  `raza` varchar(50) DEFAULT NULL,
  `edad` int DEFAULT NULL,
  `usuario_id` char(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_usuario_mascota` (`usuario_id`),
  CONSTRAINT `fk_usuario_mascota` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `mascotas_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mascotas`
--

LOCK TABLES `mascotas` WRITE;
/*!40000 ALTER TABLE `mascotas` DISABLE KEYS */;
INSERT INTO `mascotas` VALUES ('584259ee-e130-4a66-a41a-9755f8eb75c4','maximo','perro','rotwailer',10,'ea543208-0f75-46fd-8dff-88571b1b6a7a');
/*!40000 ALTER TABLE `mascotas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` char(36) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `rol` enum('usuario','veterinario','admin') DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `correo` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES ('7c2a6102-18c6-4c6f-bed3-2d497f69a964','doctor test 1','doctortest1@remail.net','$2b$10$TJPPki/NcFF2VmWGQ/Ad6ekfiUE3TbkRxjq5tLdZRMharJj9/ZdiC','veterinario'),('87548912-fa2b-431a-8c06-7a453c5b47c4','Adminovier','admin@veterinaria.com','$2b$10$c8ihjjr2nfLgazAfSGNKCuA/0Q4GnvqWnWou8V5Fn0iM2Yh2zWUem','admin'),('ea543208-0f75-46fd-8dff-88571b1b6a7a','pepe luis','pepeluis@remail.net','$2b$10$alsIWnyaX0zkEXp9tQbI.u49UWGZM9VQTDu2Rt2zfFELLJ.N/DDae','usuario'),('f857d1c8-9720-4310-8cb7-6f29e2c5bb16','pepe juan','pepejuan@remail.net','$2b$10$AUNXXRbVZMQh.3F1aPuWpuxIFBtCgEzmAornAuEZDuLCWzKxcFj72','usuario');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-27 19:37:59
