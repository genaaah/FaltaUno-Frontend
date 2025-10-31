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
import Game from "./pages/Game";
import Auth from "./pages/Auth";

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/auth" />;
}

function AppContent() {
  const { user } = useAuth();

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-green-50 font-poppins flex flex-col">
      <div className="flex flex-1 min-h-0">
        <Navbar />
        <div className="flex-1 flex flex-col min-h-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/game" element={<Game />} />
          </Routes>
          <Footer />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
