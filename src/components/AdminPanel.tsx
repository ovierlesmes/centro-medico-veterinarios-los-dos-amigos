import { useEffect, useState } from "react";
import axios from "axios";

interface Usuario {
  id: string;
  nombre: string;
  rol: string;
}

const AdminPanel = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  const obtenerUsuarios = async (): Promise<void> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get("http://localhost:5000/api/usuarios", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (Array.isArray(response.data)) {
        setUsuarios(response.data);
      } else {
        console.error("Formato inesperado:", response.data);
      }
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const asignarVeterinario = async (id: string): Promise<void> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.put(
        `http://localhost:5000/api/usuarios/${id}/veterinario`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Usuario asignado como veterinario");
      setUsuarios((prev) =>
        prev.map((u) => (u.id === id ? { ...u, rol: "veterinario" } : u))
      );
    } catch (error) {
      console.error("Error al asignar veterinario:", error);
    }
  };

  const cambiarRol = async (id: string, nuevoRol: string): Promise<void> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.put(
        `http://localhost:5000/api/usuarios/${id}/cambiar-rol`,
        { nuevoRol },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(`Rol cambiado a ${nuevoRol}`);
      obtenerUsuarios();
    } catch (error) {
      console.error("Error al cambiar rol:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
        Panel de Administración🔑
      </h2>

      {usuarios.length === 0 ? (
        <p className="text-center text-gray-600">
          No hay usuarios registrados.
        </p>
      ) : (
        <ul className="grid gap-4">
          {usuarios.map((user) => (
            <li
              key={user.id}
              className="bg-white p-4 rounded-lg shadow-md flex flex-col md:flex-row md:justify-between md:items-center gap-2"
            >
              <div>
                <p className="font-semibold text-lg">{user.nombre}</p>
                <p className="text-sm text-gray-600">Rol: {user.rol}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {user.rol === "usuario" && (
                  <button
                    onClick={() => asignarVeterinario(user.id)}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                  >
                    Asignar Veterinario
                  </button>
                )}
                {user.rol === "veterinario" && (
                  <button
                    onClick={() => cambiarRol(user.id, "usuario")}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
                  >
                    Revertir a Usuario
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-8 text-center">
        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("rol");
            window.location.href = "/login";
          }}
          className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;
