import React, { useEffect, useState } from "react";

interface CitaFormProps {
  onCitaAgendada: () => void;
  cita?: {
    id: string;
    mascota_id: string;
    veterinario_id: string;
    fecha_hora: string;
    sintomas: string;
    edad: string;
    raza: string;
    especie: string;
  } | null;
}

interface Mascota {
  id: string;
  nombre: string;
}

interface Veterinario {
  id: string;
  nombre: string;
}

const CitaForm: React.FC<CitaFormProps> = ({ onCitaAgendada, cita }) => {
  const [formData, setFormData] = useState({
    mascotaId: cita?.mascota_id || "",
    veterinarioId: cita?.veterinario_id || "",
    fecha: cita?.fecha_hora?.split(" ")[0] || "",
    hora: cita?.fecha_hora?.split(" ")[1]?.slice(0, 5) || "",
    sintomas: cita?.sintomas || "",
    edad: cita?.edad || "",
    raza: cita?.raza || "",
    especie: cita?.especie || "",
  });

  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [veterinarios, setVeterinarios] = useState<Veterinario[]>([]);
  const [nuevaMascota, setNuevaMascota] = useState("");
  const creandoNuevaMascota =
    nuevaMascota.trim().length > 0 && !formData.mascotaId;

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const resMascotas = await fetch("http://localhost:5000/api/mascotas", {
          headers,
        });
        const dataMascotas = await resMascotas.json();
        if (Array.isArray(dataMascotas)) setMascotas(dataMascotas);

        const resVeterinarios = await fetch(
          "http://localhost:5000/api/veterinarios",
          { headers }
        );
        const dataVeterinarios = await resVeterinarios.json();
        if (Array.isArray(dataVeterinarios)) setVeterinarios(dataVeterinarios);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    fetchDatos();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCrearMascota = async () => {
    if (!nuevaMascota.trim()) return alert("Ingresa el nombre de la mascota");
    if (!formData.edad || !formData.raza || !formData.especie) {
      return alert("Completa edad, raza y especie para la nueva mascota");
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/mascotas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre: nuevaMascota,
          edad: formData.edad,
          raza: formData.raza,
          especie: formData.especie,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        alert("Mascota registrada");
        setNuevaMascota("");

        const resMascotas = await fetch("http://localhost:5000/api/mascotas", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dataMascotas = await resMascotas.json();
        setMascotas(dataMascotas);

        const nueva = dataMascotas.find(
          (m: Mascota) => m.nombre === result.nombre
        );
        if (nueva) {
          setFormData((prev) => ({
            ...prev,
            mascotaId: nueva.id,
            edad: "",
            raza: "",
            especie: "",
          }));
        }
      } else {
        alert(result.error || "Error al crear la mascota");
      }
    } catch (error) {
      console.error("Error al crear mascota:", error);
      alert("Error al registrar mascota");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const {
      mascotaId,
      veterinarioId,
      fecha,
      hora,
      sintomas,
      edad,
      raza,
      especie,
    } = formData;

    if (!mascotaId || !veterinarioId || !fecha || !hora || !sintomas) {
      return alert("Completa todos los campos obligatorios");
    }

    const fecha_hora = `${fecha} ${hora}:00`;
    const token = localStorage.getItem("token");

    const payload = {
      mascotaId,
      veterinarioId,
      fecha_hora,
      sintomas,
      edad,
      raza,
      especie,
      estado: "pendiente",
      notas: "actualizada por el usuario",
    };

    const url = cita?.id
      ? `http://localhost:5000/api/citas/${cita.id}`
      : "http://localhost:5000/api/citas";
    const method = cita?.id ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert(cita?.id ? "Cita actualizada" : "Cita agendada con éxito");
        onCitaAgendada();
        setFormData({
          mascotaId: "",
          veterinarioId: "",
          fecha: "",
          hora: "",
          sintomas: "",
          edad: "",
          raza: "",
          especie: "",
        });
      } else {
        const error = await res.json();
        console.error("Error al guardar cita", error);
        alert("Error al guardar la cita");
      }
    } catch (error) {
      console.error("Error al enviar cita:", error);
      alert("Error del servidor al guardar la cita");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{cita?.id ? "Editar Cita" : "Agendar Cita"}</h2>
      <label>Mascota:</label>
      <select
        name="mascotaId"
        value={formData.mascotaId}
        onChange={handleChange}
        required
      >
        <option value="">Seleccione una mascota</option>
        {mascotas.map((m) => (
          <option key={m.id} value={m.id}>
            {m.nombre}
          </option>
        ))}
      </select>
      <div style={{ marginTop: "10px", marginBottom: "20px" }}>
        <label>¿No ves tu mascota? Créala aquí:</label>
        <input
          type="text"
          placeholder="Nombre de nueva mascota"
          value={nuevaMascota}
          onChange={(e) => setNuevaMascota(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <button type="button" onClick={handleCrearMascota}>
          Crear
        </button>
      </div>
      {creandoNuevaMascota && (
        <>
          <label>Edad:</label>
          <input
            type="text"
            name="edad"
            value={formData.edad}
            onChange={handleChange}
            required
          />

          <label>Raza:</label>
          <input
            type="text"
            name="raza"
            value={formData.raza}
            onChange={handleChange}
            required
          />

          <label>Especie:</label>
          <input
            type="text"
            name="especie"
            value={formData.especie}
            onChange={handleChange}
            required
          />
        </>
      )}
      <label>Veterinario:</label>
      <select
        name="veterinarioId"
        value={formData.veterinarioId}
        onChange={handleChange}
        required
      >
        <option value="">Seleccione un veterinario</option>
        {veterinarios.map((v) => (
          <option key={v.id} value={v.id}>
            {v.nombre}
          </option>
        ))}
      </select>
      <label>Fecha:</label>
      <input
        type="date"
        name="fecha"
        value={formData.fecha}
        onChange={handleChange}
        required
      />
      <label>Hora:</label>
      <input
        type="time"
        name="hora"
        value={formData.hora}
        onChange={handleChange}
        required
      />
      <label>Síntomas:</label>{" "}
      <textarea
        name="sintomas"
        value={formData.sintomas}
        onChange={handleChange}
        required
      />{" "}
      <button type="submit">Agendar Cita</button>{" "}
    </form>
  );
};
export default CitaForm;
