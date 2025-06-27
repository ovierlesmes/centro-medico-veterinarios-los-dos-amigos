import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Registro = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, password, rol: "usuario" }), // 🔒 Fijamos "usuario"
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje("Registro exitoso. Redirigiendo al login...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMensaje(data.message || "Error al registrar");
      }
    } catch (error) {
      setMensaje("Error del servidor");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Registro</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          required
          autoComplete="email"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
          required
          autoComplete="new-password"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Registrarse
        </button>
      </form>
      {mensaje && <p className="mt-4 text-center text-red-500">{mensaje}</p>}
    </div>
  );
};

export default Registro;
