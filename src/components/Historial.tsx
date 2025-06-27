import React, { useEffect, useState } from "react";
import axios from "axios";

interface CitaHistorial {
  cita_id: string;
  fecha_hora: string;
  sintomas: string;
  mascota_id: string;
  mascota_nombre: string;
  estado: string;
  notas?: string;
}

const Historial: React.FC = () => {
  const [citas, setCitas] = useState<CitaHistorial[]>([]);
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState<string | null>(
    null
  );
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/historial", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCitas(res.data);
      } catch (error) {
        console.error("Error al cargar historial", error);
      }
    };

    fetchHistorial();
  }, []);

  // Obtener mascotas únicas del historial
  const mascotasUnicas = Array.from(
    new Map(citas.map((c) => [c.mascota_id, c.mascota_nombre])).entries()
  );

  return (
    <div>
      <label className="block mb-1">Seleccione una mascota:</label>
      <select
        onChange={(e) => setMascotaSeleccionada(e.target.value)}
        value={mascotaSeleccionada || ""}
        className="border rounded px-2 py-1 mb-4"
      >
        <option value="">-- Seleccione --</option>
        {mascotasUnicas.map(([id, nombre]) => (
          <option key={id} value={id}>
            {nombre}
          </option>
        ))}
      </select>

      {mascotaSeleccionada && citas.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">
            Historial de{" "}
            {
              citas.find((c) => c.mascota_id === mascotaSeleccionada)
                ?.mascota_nombre
            }
          </h3>
          <ul className="space-y-2">
            {citas
              .filter((c) => c.mascota_id === mascotaSeleccionada)
              .map((c) => (
                <li key={c.cita_id} className="border rounded p-2 shadow-sm">
                  <p>
                    <strong>Fecha:</strong>{" "}
                    {c.fecha_hora
                      ? new Date(c.fecha_hora).toLocaleString("es-ES")
                      : "Fecha no disponible"}
                  </p>
                  <p>
                    <strong>Síntomas:</strong> {c.sintomas}
                  </p>
                  {c.estado === "atendida" && c.notas && (
                    <p>
                      <strong>Notas del veterinario:</strong> {c.notas}
                    </p>
                  )}
                </li>
              ))}
          </ul>
        </div>
      )}

      {mascotaSeleccionada && citas.length === 0 && (
        <p className="text-gray-600 mt-2">
          No hay historial médico registrado para esta mascota.
        </p>
      )}
    </div>
  );
};

export default Historial;
