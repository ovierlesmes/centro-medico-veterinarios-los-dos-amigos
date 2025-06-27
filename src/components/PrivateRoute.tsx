// src/components/PrivateRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: JSX.Element;
  allowedRoles: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  allowedRoles,
}) => {
  // Obtener el rol directamente de localStorage
  const userRole = localStorage.getItem("rol");

  if (!userRole) {
    // No autenticado, redirigir a login
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    // Rol no autorizado, redirigir a página principal
    return <Navigate to="/" replace />;
  }

  // Usuario autorizado, renderizar componente hijo
  return children;
};

export default PrivateRoute;
