import React from "react";

const miembros = [
  { nombre: "Alice" },
  { nombre: "Bob" },
  { nombre: "Charlie" },
];

const Nosotros: React.FC = () => (
  <div>
    <h2>Nosotros</h2>
    <ul>
      {miembros.map((m, i) => (
        <li key={i}>{m.nombre}</li>
      ))}
    </ul>
  </div>
);

export default Nosotros;
