import React from "react";

const packs = [
  { id: 1, nombre: "Pack 100 monedas", costo: "$1" },
  { id: 2, nombre: "Pack 500 monedas", costo: "$5" },
  { id: 3, nombre: "Pack 1000 monedas", costo: "$10" },
];

const Tienda: React.FC = () => (
  <div>
    <h2>Tienda de Monedas</h2>
    {packs.map(pack => (
      <div key={pack.id} style={{ marginBottom: "10px" }}>
        <span>{pack.nombre} - {pack.costo}</span>
        <button style={{ marginLeft: "10px" }} onClick={() => alert(`Comprar ${pack.nombre}`)}>Comprar</button>
      </div>
    ))}
  </div>
);

export default Tienda;
