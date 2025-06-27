import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Historial from "./Historial";

interface Cita {
  id: string;
  nombre_mascota: string;
  nombre_usuario: string;
  fecha_hora: string;
  sintomas: string;
  estado: string;
  notas?: string;
  edad: number;
  raza: string;
  especie: string;
}

const PanelVeterinario = () => {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [mensaje, setMensaje] = useState("");
  const [nota, setNota] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();
  const userRole = localStorage.getItem("rol");

  useEffect(() => {
    if (userRole !== "veterinario") {
      navigate("/");
    }
  }, [userRole, navigate]);

  const obtenerCitas = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/citas/veterinario",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCitas(response.data);
    } catch (error) {
      console.error("Error al obtener citas:", error);
      setMensaje("No se pudieron obtener las citas.");
    }
  };

  useEffect(() => {
    obtenerCitas();
  }, []);

  const confirmarCita = async (id: string) => {
    try {
      await axios.put(
        `http://localhost:5000/api/citas/${id}/confirmar`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      obtenerCitas();
    } catch (error) {
      console.error("Error al confirmar la cita:", error);
    }
  };

  const cancelarCita = async (id: string) => {
    try {
      await axios.put(
        `http://localhost:5000/api/citas/${id}/cancelar`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      obtenerCitas();
    } catch (error) {
      console.error("Error al cancelar la cita:", error);
    }
  };

  const marcarComoAtendida = async (id: string) => {
    try {
      await axios.put(
        `http://localhost:5000/api/citas/${id}/atendida`,
        { notas: nota[id] },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      obtenerCitas();
    } catch (error) {
      console.error("Error al marcar como atendida:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">
        Panel del Veterinario⚕️
      </h2>

      {mensaje && <p className="mb-4 text-red-500 text-center">{mensaje}</p>}

      {citas.length === 0 ? (
        <p className="text-center text-gray-600">No hay citas disponibles.</p>
      ) : (
        <ul className="grid gap-4">
          {citas.map((cita) => (
            <li
              key={cita.id}
              className="p-4 bg-white rounded-xl shadow-md flex flex-col gap-2"
            >
              <p>
                <strong>Fecha:</strong>{" "}
                {new Date(cita.fecha_hora).toLocaleString()}
              </p>
              <p>
                <strong>Mascota:</strong> {cita.nombre_mascota}
              </p>
              <p>
                <strong>Dueño:</strong> {cita.nombre_usuario}
              </p>
              <p>
                <strong>Edad:</strong> {cita.edad}
              </p>
              <p>
                <strong>Raza:</strong> {cita.raza}
              </p>
              <p>
                <strong>Especie:</strong> {cita.especie}
              </p>
              <p>
                <strong>Síntomas:</strong> {cita.sintomas}
              </p>
              <p>
                <strong>Estado:</strong>{" "}
                {(() => {
                  const estado = cita.estado.trim().toLowerCase();
                  switch (estado) {
                    case "pendiente":
                      return (
                        <span className="inline-block bg-yellow-200 text-yellow-800 font-semibold px-3 py-1 rounded-full text-sm">
                          Pendiente
                        </span>
                      );
                    case "confirmada":
                      return (
                        <span className="inline-block bg-green-200 text-green-800 font-semibold px-3 py-1 rounded-full text-sm">
                          Confirmada
                        </span>
                      );
                    case "atendida":
                      return (
                        <span className="inline-block bg-blue-200 text-blue-800 font-semibold px-3 py-1 rounded-full text-sm">
                          Atendida
                        </span>
                      );
                    case "cancelada":
                      return (
                        <span className="inline-block bg-red-200 text-red-800 font-semibold px-3 py-1 rounded-full text-sm">
                          Cancelada
                        </span>
                      );
                    default:
                      return (
                        <span className="inline-block bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
                          {cita.estado}
                        </span>
                      );
                  }
                })()}
              </p>
              <p>
                <strong>Notas:</strong>{" "}
                {cita.notas && cita.notas.length > 0
                  ? cita.notas
                  : "Sin notas registradas"}
              </p>

              {cita.estado === "confirmada" && (
                <div className="mt-2">
                  <textarea
                    placeholder="Notas del veterinario..."
                    value={nota[cita.id] || ""}
                    onChange={(e) =>
                      setNota({ ...nota, [cita.id]: e.target.value })
                    }
                    className="border border-gray-300 p-2 rounded w-full text-sm"
                  />
                  <button
                    onClick={() => marcarComoAtendida(cita.id)}
                    className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  >
                    Marcar como atendida
                  </button>
                </div>
              )}

              <div className="flex flex-wrap gap-2 mt-2">
                <button
                  onClick={() => confirmarCita(cita.id)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition w-full sm:w-auto"
                >
                  Confirmar
                </button>
                <button
                  onClick={() => cancelarCita(cita.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition w-full sm:w-auto"
                >
                  Cancelar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-10">
        <h2 className="text-xl font-semibold text-blue-600 mb-2">
          Historial Médico
        </h2>
        <Historial />
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default PanelVeterinario;
