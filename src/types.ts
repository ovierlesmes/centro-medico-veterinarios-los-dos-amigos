export interface Cita {
  id: string;
  fecha: string;
  hora: string;
  nombreMascota: string;
  edad: string;
  raza: string;
  especie: string;
  usuario_id: string;
  descripcion?: string;
  sintomas?: string;
  estado: "Pendiente" | "Confirmada" | "Cancelada";
  nombreVeterinario?: string;
}

export interface NuevaCita {
  fecha: string;
  hora: string;
  nombreMascota: string;
  edad: string;
  raza: string;
  especie: string;
  usuario_id: string;
  descripcion?: string;
  sintomas?: string;
  nombreVeterinario?: string;
}
