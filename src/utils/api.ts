import axios from 'axios';
import { NuevaCita } from '../types';

const API_URL = 'http://localhost:5000/api';

// --- Funciones para citas ---

export const obtenerCitas = async () => {
  const res = await axios.get(`${API_URL}/citas`);
  return res.data;
};

// Nueva función para obtener citas de un veterinario específico
export const obtenerCitasVeterinario = async (veterinarioId: string) => {
  const res = await axios.get(`${API_URL}/citas/veterinario/${veterinarioId}`);
  return res.data;
};

export const crearCita = async (cita: NuevaCita) => {
  const res = await axios.post(`${API_URL}/citas`, cita);
  return res.data;
};

export const cancelarCita = async (id: string) => {
  await axios.delete(`${API_URL}/citas/${id}`);
};

export const confirmarCita = async (id: string) => {
  await axios.post(`${API_URL}/confirmar-cita/${id}`);
};

export const editarCita = async (id: string, cita: NuevaCita) => {
  const res = await axios.put(`${API_URL}/editar-cita/${id}`, cita);
  return res.data;
};

export const eliminarCitaCancelada = async (id: string) => {
  await axios.delete(`${API_URL}/citas/cancelada/${id}`);
};

// --- Funciones para autenticación ---

export interface RegistroData {
  nombre: string;
  email: string;
  password: string;
  role: 'usuario' | 'veterinario';
}

export interface LoginData {
  email: string;
  password: string;
}

export const registrarUsuario = async (data: RegistroData) => {
  const res = await axios.post(`${API_URL}/auth/register`, data);
  return res.data;
};

export const loginUsuario = async (data: LoginData) => {
  const res = await axios.post(`${API_URL}/auth/login`, data);
  return res.data;
};
