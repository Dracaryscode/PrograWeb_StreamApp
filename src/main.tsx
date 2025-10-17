
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "./app/auth";
import { RequireRole } from "./app/guards";

import Home from "./pages/Home";
import Nosotros from "./pages/Nosotros";
import TyC from "./pages/TyC";
import Tienda from "./pages/Tienda";
import Perfil from "./pages/Perfil";
import Dashboard from "./pages/Dashboard";
import Feed from "./pages/Feed";
import Gifts from "./pages/Gifts";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StreamPage from "./pages/Stream/StreamPage";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/live/:channel" element={<StreamPage />} />
          <Route element={<App />}>
            <Route index element={<Home />} />
            <Route path="nosotros" element={<Nosotros />} />
            <Route path="tyc" element={<TyC />} />
            <Route path="tienda" element={<Tienda />} />
            <Route path="perfil" element={<Perfil />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="feed" element={<Feed />} />
            <Route
              path="gifts"
              element={
                <RequireRole role="streamer">
                  <Gifts />
                </RequireRole>
              }
            />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
