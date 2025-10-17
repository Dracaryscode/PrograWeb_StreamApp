import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./auth";
import { RequireRole } from "./guards";
import NavBar from "../components/Header";    // puedes reusar Header como NavBar
import Sidebar from "../components/Sidebar";  // opcional en layout

import Home from "../pages/Home";
import Login from "../pages/Login";           // crea una página simple que llama a useAuth().login
import Register from "../pages/Register";     // idem register
import Feed from "../pages/Feed";             // placeholder
import Gifts from "../pages/Gifts";           // CRUD usando api stubs
import Dashboard from "../pages/Dashboard";

export default function AppRouter() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <NavBar onLogin={()=>{}} onRegister={()=>{}} />
        <div style={{ display:"flex" }}>
          <Sidebar onNavigate={(_page: string) => {}} />
          <main className="mx-auto max-w-5xl px-4 flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/feed" element={<Feed />} />
              <Route path="/gifts" element={
                <RequireRole role="streamer"><Gifts /></RequireRole>
              } />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
