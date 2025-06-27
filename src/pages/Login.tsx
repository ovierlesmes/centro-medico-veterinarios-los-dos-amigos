// src/pages/Login.tsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import iconoMascota from "../assets/animales.png";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError("");
      const res = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });

      const { token, rol, usuario } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("rol", rol);
      localStorage.setItem("usuarioId", usuario.id);

      if (rol === "usuario") navigate("/panel/usuario");
      else if (rol === "veterinario") navigate("/panel/veterinario");
      else if (rol === "admin") navigate("/panel/admin");
    } catch (err: any) {
      setError(err.response?.data?.mensaje || "Credenciales inválidas.");
    }
  };

  return (
    <div className="login-body px-4">
      <div className="relative z-10 bg-white/95 shadow-xl rounded-xl w-full max-w-sm">
        <div className="px-8 py-6">
          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="flex justify-center">
              <img
                src={iconoMascota}
                alt="Icono mascotas"
                className="icono-mascota"
              />
            </div>

            <h2>🐕 Accede a tu panel de usuario 🐈</h2>

            <div>
              <label htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
              />
            </div>

            <div>
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <button type="submit">Iniciar sesión</button>
          </form>

          <p className="texto-registro mt-6 text-center text-base">
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="enlace-registro">
              Regístrate aquí
            </Link>
          </p>

          <p className="volver-inicio mt-2 text-center text-base">
            <Link to="/" className="enlace-volver">
              ← Volver al inicio
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
