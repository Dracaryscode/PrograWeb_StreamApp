import React, { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import LoginModal from "./components/LoginModal";
import RegisterModal from "./components/RegisterModal";
import OverlayNotification from "./components/OverlayNotification";

import Home from "./pages/Home";
import Nosotros from "./pages/Nosotros";
import TyC from "./pages/TyC";
import Tienda from "./pages/Tienda";
import Perfil from "./pages/Perfil";

function App() {
  const [page, setPage] = useState("home");
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [overlayMessage, setOverlayMessage] = useState<string | null>(null);

  return (
    <div className="app">
      <Header 
        onLogin={() => setShowLogin(true)} 
        onRegister={() => setShowRegister(true)} 
      />

      <div style={{ display: "flex", minHeight: "80vh" }}>
        <Sidebar onNavigate={setPage} />
        <main style={{ flex: 1, padding: "10px" }}>
          {page === "home" && <Home />}
          {page === "nosotros" && <Nosotros />}
          {page === "tyc" && <TyC />}
          {page === "tienda" && <Tienda />}
          {page === "perfil" && <Perfil />}
        </main>
      </div>

      <Footer />

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} />}
      {overlayMessage && <OverlayNotification message={overlayMessage} onClose={() => setOverlayMessage(null)} />}
    </div>
  );
}

export default App;