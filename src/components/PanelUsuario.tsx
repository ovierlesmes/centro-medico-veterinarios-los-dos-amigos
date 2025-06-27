import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CitaForm from "./CitaForm";

interface Cita {
  id: string;
  nombre_mascota: string;
  fecha_hora: string;
  sintomas: string;
  estado: string;
  edad: string;
  raza: string;
  especie: string;
  mascota_id: string;
  veterinario_id: string;
  usuario_id: string;
  notas: string | null;
  nombre_veterinario?: string;
}

interface Mascota {
  id: string;
  nombre: string;
  especie: string;
  raza: string;
  edad: number;
  usuario_id: string;
}

const PanelUsuario = () => {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [formVisible, setFormVisible] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [citaSeleccionada, setCitaSeleccionada] = useState<Cita | null>(null);

  useEffect(() => {
    fetchCitas();
    fetchMascotas();
  }, []);

  const fetchCitas = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/citas/usuario", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCitas(res.data);
    } catch (error) {
      console.error("Error al obtener citas", error);
    }
  };

  const fetchMascotas = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/mascotas", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMascotas(res.data);
    } catch (error) {
      console.error("Error al obtener mascotas", error);
    }
  };

  const handleCancelarCita = async (id: string) => {
    try {
      await axios.put(
        `http://localhost:5000/api/citas/${id}/cancelar`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCitas((citas) => citas.filter((cita) => cita.id !== id));
      alert("Cita cancelada y eliminada de la interfaz");
    } catch (error) {
      console.error("Error al cancelar cita", error);
    }
  };

  const handleEditarCita = (cita: Cita) => {
    setCitaSeleccionada(cita);
    setFormVisible(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
        Panel del Usuario
      </h1>

      <div className="botones-wrapper">
        <button onClick={handleLogout} className="btn btn-rojo">
          Cerrar sesión
        </button>

        {!formVisible && (
          <button onClick={() => setFormVisible(true)} className="btn btn-azul">
            Agendar Nueva Cita
          </button>
        )}
      </div>

      {formVisible ? (
        <div className="mb-6">
          <CitaForm
            onCitaAgendada={() => {
              fetchCitas();
              setFormVisible(false);
            }}
          />
          <button
            className="mt-4 btn cancelar"
            onClick={() => setFormVisible(false)}
          >
            Cancelar
          </button>
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">
            Mis Citas📋
          </h2>
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
                  <strong>Veterinario:</strong>{" "}
                  {cita.nombre_veterinario || "No asignado"}
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
                  <strong>Edad:</strong> {cita.edad}
                </p>
                <p>
                  <strong>Raza:</strong> {cita.raza}
                </p>
                <p>
                  <strong>Especie:</strong> {cita.especie}
                </p>
                <p>
                  <strong>Notas:</strong> {cita.notas || "Sin notas"}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <button
                    className="btn editar"
                    onClick={() => handleEditarCita(cita)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn cancelar"
                    onClick={() => handleCancelarCita(cita.id)}
                  >
                    Cancelar Cita
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default PanelUsuario;
