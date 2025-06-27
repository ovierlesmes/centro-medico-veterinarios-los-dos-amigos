import express from "express";
import bcrypt from "bcrypt";
import { verifyToken } from "../middlewares/auth.js";
import db from "../utils/db.js";
import { v4 as uuidv4 } from "uuid";
const router = express.Router();
import { comparePassword, generarToken } from "../utils/auth.js";

// --------------------- Autenticación ---------------------
// Ruta para registrar usuarios
router.post("/register", async (req, res) => {
  const { nombre, email, password } = req.body; // Eliminamos el rol para evitar manipulación externa
  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Cifrado seguro de la contraseña

    await db.query(
      "INSERT INTO usuarios (id, nombre, email, password, rol) VALUES (?, ?, ?, ?, ?)",
      [uuidv4(), nombre, email, hashedPassword, "usuario"] // 🔒 Siempre "usuario"
    );

    res.status(201).json({ mensaje: "Usuario registrado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al registrar usuario" });
  }
});

router.put("/usuarios/:id/veterinario", verifyToken, async (req, res) => {
  if (req.usuario.rol !== "admin") {
    return res.status(403).json({
      error:
        "Acceso denegado. Solo un administrador puede asignar veterinarios.",
    });
  }

  try {
    await db.query("UPDATE usuarios SET rol = ? WHERE id = ?", [
      "veterinario",
      req.params.id,
    ]);
    res.json({ mensaje: "Usuario ahora es veterinario" });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar rol" });
  }
});

// Ruta para iniciar sesión
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validar datos antes de procesar
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Correo y contraseña son obligatorios" });
    }

    const [rows] = await db.query("SELECT * FROM usuarios WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    const usuario = rows[0];

    // Usamos comparePassword() desde utils/auth.ts
    const passwordValida = await comparePassword(password, usuario.password);
    if (!passwordValida) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    const token = generarToken({
      id: usuario.id,
      nombre: usuario.nombre,
      rol: usuario.rol,
    });

    res.json({
      token,
      rol: usuario.rol,
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email },
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// --------------------- Mascotas ---------------------
// Ruta para registrar una mascota asociada al usuario autenticado
router.post("/mascotas", verifyToken, async (req, res) => {
  const { nombre, especie, raza, edad } = req.body;
  const userId = req.usuario.id;
  try {
    await db.query(
      "INSERT INTO mascotas (id, nombre, especie, raza, edad, usuario_id) VALUES (?, ?, ?, ?, ?, ?)",
      [uuidv4(), nombre, especie, raza, edad, userId]
    );
    res.status(201).json({ mensaje: "Mascota registrada" });
  } catch {
    res.status(500).json({ error: "Error al registrar mascota" });
  }
});

// Ruta para obtener mascotas del usuario autenticado
router.get("/mascotas", verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, nombre FROM mascotas WHERE usuario_id = ?",
      [req.usuario.id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener mascotas" });
  }
});

// --------------------- Citas ---------------------
// Ruta para agendar una cita
router.post("/citas", verifyToken, async (req, res) => {
  const { mascotaId, fecha_hora, sintomas, veterinarioId } = req.body;

  try {
    const [mascota] = await db.query(
      "SELECT edad, raza, especie FROM mascotas WHERE id = ?",
      [mascotaId]
    );

    if (!mascota || mascota.length === 0) {
      return res.status(404).json({ error: "Mascota no encontrada" });
    }

    await db.query(
      "INSERT INTO citas (id, mascota_id, fecha_hora, sintomas, edad, raza, especie, estado, veterinario_id, usuario_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        uuidv4(),
        mascotaId,
        fecha_hora,
        sintomas,
        mascota[0].edad,
        mascota[0].raza,
        mascota[0].especie,
        "pendiente",
        veterinarioId,
        req.usuario.id,
      ]
    );

    res
      .status(201)
      .json({ mensaje: "Cita agendada correctamente con datos de la mascota" });
  } catch (error) {
    console.error("Error en POST /citas:", error);
    res.status(500).json({ error: "Error al agendar cita" });
  }
});

// Ruta para obtener todas las citas
router.get("/citas/usuario", verifyToken, async (req, res) => {
  try {
    const [citas] = await db.query(
      `SELECT c.id, c.fecha_hora, c.sintomas, c.estado, c.notas, 
              c.edad, c.raza, c.especie, m.nombre AS nombre_mascota, 
              v.nombre AS nombre_veterinario
       FROM citas c
       LEFT JOIN mascotas m ON c.mascota_id = m.id
       LEFT JOIN usuarios v ON c.veterinario_id = v.id
       WHERE c.usuario_id = ? 
       ORDER BY c.fecha_hora DESC`,
      [req.usuario.id]
    );

    console.log("Citas recuperadas:", citas);

    res.json(citas);
  } catch (error) {
    console.error("Error en GET /citas/usuario:", error);
    res.status(500).json({ error: "Error al obtener citas del usuario" });
  }
});

router.get("/citas/veterinario", verifyToken, async (req, res) => {
  try {
    const [citas] = await db.query(
      `SELECT c.id, c.fecha_hora, c.sintomas, c.estado, c.notas, 
              m.nombre AS nombre_mascota, m.edad, m.raza, m.especie,
              u.nombre AS nombre_usuario, v.nombre AS nombre_veterinario
       FROM citas c
       LEFT JOIN mascotas m ON c.mascota_id = m.id
       LEFT JOIN usuarios u ON c.usuario_id = u.id
       LEFT JOIN usuarios v ON c.veterinario_id = v.id
       WHERE c.veterinario_id = ? 
       ORDER BY c.fecha_hora DESC`,
      [req.usuario.id]
    );

    res.json(citas);
  } catch (error) {
    console.error("Error en GET /citas/veterinario:", error);
    res.status(500).json({ error: "Error al obtener citas del veterinario" });
  }
});

// Ruta para actualizar una cita por parte del usuario
router.put("/citas/:id", verifyToken, async (req, res) => {
  const {
    fecha_hora,
    sintomas,
    edad,
    raza,
    especie,
    estado,
    notas,
    mascotaId,
    veterinarioId,
  } = req.body;

  try {
    await db.query(
      "UPDATE citas SET fecha_hora = ?, sintomas = ?, edad = ?, raza = ?, especie = ?, estado = ?, notas = ?, mascota_id = ?, veterinario_id = ? WHERE id = ?",
      [
        fecha_hora,
        sintomas,
        edad,
        raza,
        especie,
        estado,
        notas,
        mascotaId,
        veterinarioId,
        req.params.id,
      ]
    );
    res.json({ mensaje: "Cita actualizada correctamente" });
  } catch (error) {
    console.error("Error al actualizar cita:", error);
    res.status(500).json({ error: "Error al actualizar la cita" });
  }
});

// Ruta para cancelar una cita
router.put("/citas/:id/cancelar", verifyToken, async (req, res) => {
  try {
    const [cita] = await db.query("SELECT id FROM citas WHERE id = ?", [
      req.params.id,
    ]);

    if (cita.length === 0) {
      return res.status(404).json({ error: "Cita no encontrada" });
    }

    const userRole = req.usuario.rol;

    if (userRole === "veterinario") {
      await db.query("UPDATE citas SET estado = ? WHERE id = ?", [
        "cancelada_por_veterinario",
        req.params.id,
      ]);
      return res.json({ mensaje: "Cita cancelada por el veterinario" });
    } else {
      const [resultado] = await db.query("DELETE FROM citas WHERE id = ?", [
        req.params.id,
      ]);

      if (resultado.affectedRows === 0) {
        return res.status(404).json({ error: "Cita no encontrada" });
      }

      return res.json({ mensaje: "Cita eliminada correctamente" });
    }
  } catch (error) {
    console.error("Error al cancelar cita:", error);
    res.status(500).json({ error: "Error interno al cancelar la cita" });
  }
});

//confirmar cita por parte de el veterinario
router.put("/citas/:id/confirmar", verifyToken, async (req, res) => {
  try {
    const [resultado] = await db.query(
      "UPDATE citas SET estado = ? WHERE id = ?",
      ["confirmada", req.params.id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: "Cita no encontrada" });
    }

    res.json({ mensaje: "Cita confirmada correctamente" });
  } catch (error) {
    console.error("Error al confirmar cita:", error);
    res.status(500).json({ error: "Error interno al confirmar la cita" });
  }
});
//ruta para citas atendidas
router.put("/citas/:id/atendida", verifyToken, async (req, res) => {
  const { notas } = req.body;
  const citaId = req.params.id;

  try {
    const [estadoCita] = await db.query(
      "SELECT estado, mascota_id FROM citas WHERE id = ?",
      [citaId]
    );

    if (!estadoCita.length) {
      return res.status(404).json({ mensaje: "La cita no se encontró." });
    }

    if (
      estadoCita[0].estado !== "confirmada" &&
      estadoCita[0].estado !== "pendiente"
    ) {
      return res
        .status(400)
        .json({ mensaje: "La cita ya está atendida o cancelada." });
    }

    const mascotaId = estadoCita[0].mascota_id;

    await db.query(
      "UPDATE citas SET estado = 'atendida', notas = ? WHERE id = ?",
      [notas, citaId]
    );

    await db.query(
      "INSERT INTO historial_medico (id, mascota_id, descripcion, fecha) VALUES (?, ?, ?, NOW())",
      [uuidv4(), mascotaId, notas]
    );

    res.json({ mensaje: "Cita atendida y historial médico actualizado." });
  } catch (error) {
    console.error("Error al actualizar cita:", error);
    res.status(500).json({ mensaje: "Error al actualizar la cita." });
  }
});

// --------------------- Historial Médico ---------------------
// Agregar una nota al historial
router.post("/historial/:mascotaId", verifyToken, async (req, res) => {
  const { descripcion } = req.body;
  try {
    await db.query(
      "INSERT INTO historial_medico (id, mascota_id, descripcion, fecha) VALUES (?, ?, ?, NOW())",
      [uuidv4(), req.params.mascotaId, descripcion]
    );
    res.status(201).json({ mensaje: "Nota médica añadida" });
  } catch (error) {
    console.error("Error al guardar historial:", error);
    res.status(500).json({ error: "Error al guardar historial" });
  }
});

// Obtener historial médico por mascota
router.get("/historial", verifyToken, async (req, res) => {
  try {
    const [result] = await db.query(
      `SELECT 
         h.id AS cita_id,
         h.fecha AS fecha_hora,
         h.descripcion AS sintomas,
         h.mascota_id,
         m.nombre AS mascota_nombre
       FROM historial_medico h
       JOIN mascotas m ON h.mascota_id = m.id
       ORDER BY h.fecha DESC`
    );
    res.json(result);
  } catch (error) {
    console.error("Error al obtener historial:", error);
    res.status(500).json({ error: "Error al obtener historial" });
  }
});

// --------------------- Veterinarios ---------------------
// Ruta para obtener la lista de veterinarios
router.get("/veterinarios", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, nombre FROM usuarios WHERE rol = 'veterinario'"
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener veterinarios" });
  }
});
//-----------------administrador--------------
router.get("/usuarios", verifyToken, async (req, res) => {
  try {
    const [usuarios] = await db.query(
      "SELECT id, nombre, email, rol FROM usuarios"
    );
    res.json(usuarios);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

router.put("/usuarios/:id/cambiar-rol", verifyToken, async (req, res) => {
  if (req.usuario.rol !== "admin") {
    return res
      .status(403)
      .json({ error: "Solo el administrador puede modificar roles." });
  }

  const { nuevoRol } = req.body;
  if (!["usuario", "veterinario", "admin"].includes(nuevoRol)) {
    return res.status(400).json({ error: "Rol no válido." });
  }

  try {
    await db.query("UPDATE usuarios SET rol = ? WHERE id = ?", [
      nuevoRol,
      req.params.id,
    ]);
    res.json({ mensaje: `Rol cambiado a ${nuevoRol}` });
  } catch (error) {
    res.status(500).json({ error: "Error al modificar el rol." });
  }
});

export default router;
