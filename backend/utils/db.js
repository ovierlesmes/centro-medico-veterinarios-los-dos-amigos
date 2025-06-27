import mysql from "mysql2/promise";
import dotenv from "dotenv";

// Cargar variables del archivo .env
dotenv.config();

// Crear pool de conexiones
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Probar la conexión inmediatamente
(async () => {
  try {
    const connection = await db.getConnection();
    console.log("Conectado a MySQL correctamente");
    connection.release();
  } catch (error) {
    console.error("❌ Error al conectar a MySQL:", error.message);
  }
})();

// Exportar pool para usar en el resto del backend
export default db;
