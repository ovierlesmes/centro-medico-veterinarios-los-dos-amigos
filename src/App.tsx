import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./components/Register";
import PanelUsuario from "./components/PanelUsuario";
import PanelVeterinario from "./components/PanelVeterinario";
import AdminPanel from "./components/AdminPanel";
import Historial from "./components/Historial";
import PrivateRoute from "./components/PrivateRoute";
import Landing from "./pages/Landing";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />

        {/* Panel Usuario (protegido) */}
        <Route
          path="/panel/usuario/*"
          element={
            <PrivateRoute allowedRoles={["usuario"]}>
              <PanelUsuario />
            </PrivateRoute>
          }
        />

        {/* Panel Veterinario (protegido) */}
        <Route
          path="/panel/veterinario"
          element={
            <PrivateRoute allowedRoles={["veterinario"]}>
              <PanelVeterinario />
            </PrivateRoute>
          }
        />

        <Route
          path="/panel/admin"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <AdminPanel />
            </PrivateRoute>
          }
        />

        {/* Historial Médico (protegido para veterinarios) */}
        <Route
          path="/panel/veterinario/historial"
          element={
            <PrivateRoute allowedRoles={["veterinario"]}>
              <Historial />
            </PrivateRoute>
          }
        />

        {/* Redirección para rutas no encontradas */}
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
