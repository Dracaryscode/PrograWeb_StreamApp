import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import LoginModal from "./components/LoginModal";
import RegisterModal from "./components/RegisterModal";
import OverlayNotification from "./components/OverlayNotification";

function App() {
  const [user, setUser] = useState<any>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [overlayMessage, setOverlayMessage] = useState<string | null>(null);

  // 🔄 Cargar usuario de localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  // 💾 Guardar usuario
  const handleLogin = (userData: any) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    setShowLogin(false);
    setShowRegister(false);
    setOverlayMessage(`Bienvenido, ${userData.name}!`);
  };

  // 🚪 Cerrar sesión
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    setOverlayMessage("Sesión cerrada.");
  };

  return (
    <div className="app">
      <Header
        user={user}
        onLogin={() => setShowLogin(true)}
        onRegister={() => setShowRegister(true)}
      />

      <div style={{ display: "flex", minHeight: "80vh" }}>
        <Sidebar user={user} onLogout={handleLogout} />
        <main style={{ flex: 1, padding: "10px" }}>
          <Outlet />
        </main>
      </div>

      <Footer />

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onLogin={handleLogin} />}
      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} onRegister={handleLogin} />}
      {overlayMessage && <OverlayNotification message={overlayMessage} onClose={() => setOverlayMessage(null)} />}
    </div>
  );
}

export default App;
