CREATE TABLE historial_medico (
  id CHAR(36) PRIMARY KEY,
  mascota_id CHAR(36) NOT NULL,
  descripcion TEXT NOT NULL,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (mascota_id) REFERENCES mascotas(id) ON DELETE CASCADE
);
