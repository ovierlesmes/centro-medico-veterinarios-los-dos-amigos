import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Middleware para verificar el token
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(403).json({ error: "Token requerido" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded; // Guarda los datos del usuario en req.usuario
    next();
  } catch {
    res.status(401).json({ error: "Token inválido" });
  }
};

// Middleware para verificar si el usuario es veterinario
export const verifyVeterinarian = (req, res, next) => {
  if (!req.usuario || req.usuario.rol !== "veterinario") {
    return res
      .status(403)
      .json({ error: "Acceso denegado. Debes ser veterinario para acceder." });
  }
  next();
};
