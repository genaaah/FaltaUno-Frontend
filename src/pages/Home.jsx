import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import PromoBanner from "../components/Home/PromoBanner";

function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex-1 p-8 overflow-auto bg-green-50">
      <PromoBanner />
      <section className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center gap-4 mb-8">
          <img
            src={user?.team_shield}
            alt="Escudo equipo"
            className="w-14 h-14 object-contain"
          />
          <span className="text-2xl font-bold text-gray-800">
            {user?.team_name}
          </span>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 bg-gray-50 rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-shadow">
            <p className="font-bold text-gray-600 text-lg">Partidos ganados</p>
            <h2 className="text-4xl font-bold text-green-600 my-3">36</h2>
            <hr className="border-gray-300 w-3/4 mx-auto my-4" />
            <p className="font-bold text-gray-600 text-lg">Torneo</p>
            <h3 className="text-3xl font-bold text-green-500 mt-2">2</h3>
          </div>
          <div className="flex-1 flex flex-col">
            <div
              className="flex-1 bg-cover bg-center rounded-xl text-white font-bold text-xl p-12 text-center relative mb-4 shadow-lg"
              style={{
                backgroundImage:
                  "url(https://i.pinimg.com/736x/29/3b/c5/293bc5455a53d6ae9662ca14b9f7a947.jpg)",
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-40 rounded-xl"></div>
              <span className="relative z-10 leading-8">
                20 PARTIDOS
                <br />
                EN ESPERA
              </span>
            </div>
            <button
              className="bg-green-600 text-white py-4 px-8 rounded-xl font-bold text-lg hover:bg-green-700 transition-colors w-full"
            >
              BUSCAR PARTIDO
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
