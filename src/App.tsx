import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import LoginModal from "./components/LoginModal";
import RegisterModal from "./components/RegisterModal";
import OverlayNotification from "./components/OverlayNotification";

function App() {
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
        <Sidebar />
        <main style={{ flex: 1, padding: "10px" }}>
          <Outlet />
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
