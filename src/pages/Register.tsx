import { useState } from "react";
import { useAuth } from "../app/auth";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <form
      className="max-w-sm space-y-3 mt-6"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!email.trim()) {
          setError("Ingresa un correo.");
          return;
        }
        if (pass.length < 8) {
          setError("La contraseña debe tener al menos 8 caracteres.");
          return;
        }
        setError(null);
        setLoading(true);
        try {
          await register(email, pass);
          nav("/feed");
        } catch {
          setError("No se pudo registrar. Verifica datos o intenta con otro correo.");
        } finally {
          setLoading(false);
        }
      }}
    >
      <input
        className="w-full border rounded px-3 py-2"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="w-full border rounded px-3 py-2"
        placeholder="password"
        type="password"
        value={pass}
        onChange={(e) => setPass(e.target.value)}
      />
      {error && <div style={{ color: "#ef4444", fontSize: "0.9rem" }}>{error}</div>}
      <button className="bg-black text-white rounded px-4 py-2" disabled={loading}>
        {loading ? "Creando..." : "Crear cuenta"}
      </button>
    </form>
  );
}
