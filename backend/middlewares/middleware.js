import jwt from "jsonwebtoken";

export function autenticarToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ mensaje: "Token no proporcionado" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ mensaje: "Token inválido" });
    }
    req.user = user; // { id, rol }
    next();
  });
}
