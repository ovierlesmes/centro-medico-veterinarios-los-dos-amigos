// src/pages/Landing.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import equipoImg from "../assets/equipo.jpg";
import consultaIcon from "../assets/consulta.png";
import vacunacionIcon from "../assets/vacunacion.png";
import cirugiaIcon from "../assets/cirugia.png";
import mascotasIcon from "../assets/iconomascotas.png";
import veterinarioImg from "../assets/veterinario.jpg";
import iconoanimales from "../assets/iconoanimales.png";
import facebookIcon from "../assets/facebook.svg";
import instagramIcon from "../assets/instagram.svg";
import whatsappIcon from "../assets/whatsapp.svg";

import "@fontsource/poppins";

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="font-poppins text-gray-800">
      <header className="encabezado-veterinario-horizontal">
        <img
          src={iconoanimales}
          alt="Icono animales"
          className="icono-animales-header"
        />
        <div className="contenido-texto-header">
          <h1 className="text-3xl font-semibold">Centro Médico Veterinario</h1>
          <h2 className="text-xl font-medium">🐾 Los Mejores Amigos 🐾</h2>
          <p className="text-base">
            Comprometidos con la salud y el bienestar animal
          </p>
        </div>
      </header>

      {/* Servicios */}
      <section className="py-12 bg-white text-center">
        <img
          src={veterinarioImg}
          alt="Veterinario con mascota"
          className="imagen-veterinario"
        />
        <h2 className="text-4xl font-bold text-gray-800 mb-12">
          Nuestros Servicios
        </h2>

        <div className="flex justify-center gap-10 flex-wrap">
          {/* Servicio 1 */}
          <div className="service-card-1 flex flex-col items-center bg-blue-100 p-6 rounded-2xl w-56 shadow hover:shadow-lg transition">
            <p className="text-lg font-medium text-gray-800 mb-4">
              Consultas médicas
            </p>
            <img
              src={consultaIcon}
              alt="Consulta médica"
              className="w-16 h-16"
            />
          </div>

          {/* Servicio 2 */}
          <div className="service-card-2 flex flex-col items-center bg-blue-100 p-6 rounded-2xl w-56 shadow hover:shadow-lg transition">
            <p className="text-lg font-medium text-gray-800 mb-4">Vacunación</p>
            <img src={vacunacionIcon} alt="Vacunación" className="w-16 h-16" />
          </div>

          {/* Servicio 3 */}
          <div className="service-card-3 flex flex-col items-center bg-blue-100 p-6 rounded-2xl w-56 shadow hover:shadow-lg transition">
            <p className="text-lg font-medium text-gray-800 mb-4">cirugia</p>
            <img src={cirugiaIcon} alt="cirugia" className="w-16 h-16" />
          </div>
        </div>
      </section>

      {/* Opiniones de Clientes*/}
      <section className="opiniones bg-blue-500 text-white rounded-xl shadow-lg p-6 my-8 mx-auto max-w-md">
        <div className="text-4xl mb-2">“</div>
        <p className="text-lg italic mb-4">
          Mi gato odia a todos, pero aquí ¡ronroneó en la consulta!
        </p>
        <p className="text-right text-sm font-semibold">Andrea P.</p>
      </section>

      {/* Sobre Nosotros */}
      <section id="nosotros" className="nosotros">
        <div className="contenedor-nosotros">
          <div>
            <h2 className="titulo-nosotros">Sobre Nosotros</h2>
            <p className="texto-nosotros">
              En el centro de atención animal Los Mejores Amigos somos más que
              un consultorio: somos apasionados por el bienestar animal. Nuestro
              equipo combina experiencia médica, calidez humana y tecnología
              para brindar un cuidado excepcional a tus mascotas.
            </p>
          </div>
          <div className="md:w-1/2 flex justify-start">
            <img
              src={equipoImg}
              alt="Nuestro equipo veterinario"
              className="imagen-nosotros"
            />
          </div>
        </div>
      </section>

      {/*agendar cita*/}
      <section className="seccion-contacto">
        <div className="contenedor-contacto">
          <img
            src={mascotasIcon}
            alt="Ícono de mascotas"
            className="icono-contacto-grande"
          />

          <div className="contenido-contacto">
            <h2>¿Listo para darles lo mejor a tus mascotas?</h2>
            <button onClick={() => navigate("/login")}>
              Agenda una cita ahora
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-8 px-6 text-gray-600 ">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between gap-8 text-center md:text-left footer-info-container">
          {/* Contáctanos */}
          <div className="bloque-contacto-footer">
            <h3>Contáctanos</h3>
            <p>🐈 Calle 123 #45-67, San Gil, Santander, Colombia</p>
            <p>📞 (7) 123 4567 / 📱 +57 123 456 7890</p>
            <p>✉️ info@losmejoresamigos.com</p>
          </div>

          {/* Redes sociales */}
          <div className="md:w-1/2 flex flex-col items-center md:items-end siguenos-section">
            <h3 className="titulo-siguenos text-lg font-semibold text-gray-800 mb-2">
              Síguenos
            </h3>
            <div className="flex gap-5 iconos-siguenos">
              <a
                href="https://facebook.com"
                aria-label="Facebook"
                className="icono-facebook hover:scale-110 transition"
              >
                <img src={facebookIcon} alt="Facebook" className="w-6 h-6" />
              </a>

              <a
                href="https://instagram.com"
                aria-label="Instagram"
                className="icono-instagram hover:scale-110 transition"
              >
                <img src={instagramIcon} alt="Instagram" className="w-6 h-6" />
              </a>

              <a
                href="https://wa.me/573001112233"
                aria-label="WhatsApp"
                className="icono-whatsapp hover:scale-110 transition"
              >
                <img src={whatsappIcon} alt="WhatsApp" className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Derechos reservados */}
        <p className="texto-copyright">
          © {new Date().getFullYear()} VetClínica. Todos los derechos
          reservados.
        </p>
      </footer>
    </div>
  );
};

export default Landing;
