import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Game from "./pages/Game";
import Store from "./pages/Store";
import Invitations from "./pages/Invitations";
import Profile from "./pages/Profile";
<<<<<<< HEAD
=======
import EmailVerification from "./components/Auth/EmailVerification";
import VerificationSuccess from "./components/Auth/VerificationSuccess";
import PasswordReset from "./components/Auth/PasswordReset";
>>>>>>> dev

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Cargando...</p>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return user ? children : <Navigate to="/auth" replace />;
}

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return (
      <Router>
        <Routes>
          <Route path="/auth" element={<Auth />} />
<<<<<<< HEAD
=======
          <Route path="/verificacion" element={<EmailVerification />} />
          <Route path="/verificacion-email" element={<EmailVerification />} />
          <Route
            path="/verificacion-exitosa"
            element={<VerificationSuccess />}
          />
          <Route path="/recuperar-contrasena" element={<PasswordReset />} />{" "}
          {/* <-- NUEVA RUTA */}
          <Route path="/recuperacion" element={<PasswordReset />} />{" "}
          {/* <-- ALIAS */}
>>>>>>> dev
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-green-50 font-poppins flex flex-col lg:flex-row">
        <Navbar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<Home />} />
<<<<<<< HEAD
              <Route path="/game" element={<Game />} />
              <Route path="/invitaciones" element={<Invitations />} />
              <Route path="/perfil" element={<Profile />} />
              <Route path="/store" element={<Store />} />
              <Route path="/calendarios" element={<Calendar />} />
              <Route path="/auth" element={<Navigate to="/" replace />} />
=======
              <Route path="/invitaciones" element={<Invitations />} />
              <Route path="/perfil" element={<Profile />} />
              <Route path="/game" element={<Game />} />
              <Route path="/store" element={<Store />} />
              <Route path="/auth" element={<Navigate to="/" replace />} />
              <Route
                path="/verificacion"
                element={<Navigate to="/" replace />}
              />
              <Route
                path="/verificacion-exitosa"
                element={<Navigate to="/" replace />}
              />
              <Route
                path="/recuperar-contrasena"
                element={<Navigate to="/" replace />}
              />
              <Route
                path="/recuperacion"
                element={<Navigate to="/" replace />}
              />
>>>>>>> dev
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
