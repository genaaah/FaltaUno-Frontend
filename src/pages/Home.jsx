import React from "react";
import { useNavigate } from "react-router-dom";
import PromoBanner from "../components/Home/PromoBanner";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 p-4 md:p-8 overflow-auto bg-gradient-to-br from-green-50 to-blue-50">
      <PromoBanner />
      <section className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl shadow-2xl p-6 md:p-10 text-white mb-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Bienvenido a la Plataforma de Fútbol
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Organiza partidos, crea equipos y conecta con jugadores
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/game")}
              className="bg-white text-green-700 hover:bg-gray-100 font-bold py-3 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              🔍 Buscar Partidos
            </button>
          </div>
        </div>
      </section>
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
          ¿Qué puedes hacer en nuestra plataforma?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl">⚽</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">
              Crear Partidos
            </h3>
            <p className="text-gray-600 text-center">
              Organiza partidos de fútbol en tu localidad. Define fecha, hora,
              lugar y número de jugadores.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl">👥</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">
              Formar Equipos
            </h3>
            <p className="text-gray-600 text-center">
              Crea tu equipo de fútbol (máximo 5 jugadores) y gestiona a tus
              miembros fácilmente.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl">📨</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">
              Invitar Jugadores
            </h3>
            <p className="text-gray-600 text-center">
              Invita a amigos o encuentra nuevos jugadores para completar tu
              equipo o partido.
            </p>
          </div>
        </div>
      </section>
      <section className="bg-white rounded-2xl shadow-lg p-8 mb-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Cómo funciona
        </h2>
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex flex-col items-center text-center mb-8 md:mb-0 md:w-1/4">
            <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4">
              1
            </div>
            <h3 className="font-bold text-lg text-gray-800 mb-2">Regístrate</h3>
            <p className="text-gray-600">Crea tu cuenta gratuita en minutos</p>
          </div>
          <div className="hidden md:block text-green-500 text-2xl">→</div>
          <div className="flex flex-col items-center text-center mb-8 md:mb-0 md:w-1/4">
            <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4">
              2
            </div>
            <h3 className="font-bold text-lg text-gray-800 mb-2">
              Configura tu perfil
            </h3>
            <p className="text-gray-600">
              Haz público tu perfil para recibir invitaciones
            </p>
          </div>
          <div className="hidden md:block text-green-500 text-2xl">→</div>
          <div className="flex flex-col items-center text-center mb-8 md:mb-0 md:w-1/4">
            <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4">
              3
            </div>
            <h3 className="font-bold text-lg text-gray-800 mb-2">
              Busca o crea
            </h3>
            <p className="text-gray-600">
              Encuentra partidos o crea el tuyo propio
            </p>
          </div>
          <div className="hidden md:block text-green-500 text-2xl">→</div>
          <div className="flex flex-col items-center text-center md:w-1/4">
            <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4">
              4
            </div>
            <h3 className="font-bold text-lg text-gray-800 mb-2">¡A jugar!</h3>
            <p className="text-gray-600">
              Disfruta del partido y conecta con la comunidad
            </p>
          </div>
        </div>
      </section>
      <section className="text-center bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8 md:p-10 shadow-lg mb-10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            ¿Quieres recibir invitaciones de otros equipos?
          </h2>
          <p className="text-gray-700 text-lg mb-6 max-w-2xl mx-auto">
            Configura tu perfil como público para que otros jugadores y equipos
            puedan encontrarte e invitarte a sus partidos.
          </p>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Un perfil público te permite mostrar tus habilidades, posición
            preferida y disponibilidad, aumentando tus posibilidades de ser
            invitado a más partidos.
          </p>
          <button
            onClick={() => navigate("/perfil")}
            className="bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold py-4 px-10 rounded-xl text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Configurar mi perfil ahora
          </button>
        </div>
      </section>
    </div>
  );
}

export default Home;
