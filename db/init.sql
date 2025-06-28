-- Estructura de la base de datos veterinaria
-- Sin datos precargados

CREATE TABLE `usuarios` (
  `id` CHAR(36) NOT NULL,
  `nombre` VARCHAR(100) NOT NULL,
  `email` VARCHAR(255) UNIQUE,
  `password` VARCHAR(255),
  `rol` ENUM('usuario','veterinario','admin'),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `mascotas` (
  `id` CHAR(36) NOT NULL,
  `nombre` VARCHAR(100) NOT NULL,
  `especie` VARCHAR(50),
  `raza` VARCHAR(50),
  `edad` INT,
  `usuario_id` CHAR(36),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `historial_medico` (
  `id` CHAR(36) NOT NULL,
  `mascota_id` CHAR(36) NOT NULL,
  `descripcion` TEXT NOT NULL,
  `fecha` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`mascota_id`) REFERENCES `mascotas` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `citas` (
  `id` CHAR(36) NOT NULL,
  `fecha_hora` DATETIME NOT NULL,
  `mascota_id` CHAR(36) NOT NULL,
  `veterinario_id` VARCHAR(36),
  `sintomas` TEXT,
  `estado` ENUM('pendiente','confirmada','cancelada','cancelada_por_veterinario','atendida'),
  `edad` VARCHAR(10),
  `raza` VARCHAR(50),
  `especie` VARCHAR(50),
  `usuario_id` VARCHAR(36),
  `notas` TEXT,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`mascota_id`) REFERENCES `mascotas` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`veterinario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
