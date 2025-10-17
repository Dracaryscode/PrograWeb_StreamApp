import { useState } from "react";
import { useAuth } from "../app/auth";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  return (
    <form
      className="max-w-sm space-y-3 mt-6"
      onSubmit={async (e) => {
        e.preventDefault();
        await register(email, pass);
        nav("/feed");
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
      <button className="bg-black text-white rounded px-4 py-2">Crear cuenta</button>
    </form>
  );
}
