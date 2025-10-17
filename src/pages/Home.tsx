//se añadieron algunas cosas para el click rediriga al predeterminado del live

import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // se añadio
import "./Home.css";

import stream1 from "../assets/stream1.jpg";
import stream2 from "../assets/stream2.jpg";
import stream3 from "../assets/stream3.jpg";
import stream4 from "../assets/stream2.jpg";
import stream5 from "../assets/stream1.jpg";
import stream6 from "../assets/stream2.jpg";
import perfil from "../assets/perfil.jpg";
import liveIcon from "../assets/live.png";

interface Stream {
  id: number;
  titulo: string;
  streamer: string;
  viewers: number;
  imagen: string;
}
// Rectángulo grande
const featuredStreams: Stream[] = [
  { id: 1, titulo: "Stream Destacado 1", streamer: "Juan", viewers: 120, imagen: stream1 },
  { id: 2, titulo: "Stream Destacado 2", streamer: "Maria", viewers: 300, imagen: stream2 },
  { id: 3, titulo: "Stream Destacado 3", streamer: "Pedro", viewers: 150, imagen: stream3 },
];
// Mini-streams
const recomendados: Stream[] = [
  { id: 4, titulo: "Live 1", streamer: "Ana", viewers: 50, imagen: stream4 },
  { id: 5, titulo: "Live 2", streamer: "Luis", viewers: 70, imagen: stream5 },
  { id: 6, titulo: "Live 3", streamer: "Carlos", viewers: 100, imagen: stream6 },
];

const conversando: Stream[] = [
  { id: 7, titulo: "Chat con fans", streamer: "Ana", viewers: 50, imagen: stream4 },
  { id: 8, titulo: "Hablando de juegos", streamer: "Luis", viewers: 70, imagen: stream5 },
];

const juegos: Stream[] = [
  { id: 9, titulo: "Partida épica", streamer: "Carlos", viewers: 200, imagen: stream6 },
];

const Home: React.FC = () => {
  const [featuredIndex, setFeaturedIndex] = useState(0);


  const navigate = useNavigate();// se añadio
  const irAlStream = () => navigate("/live/Alguien"); // se añadio



  const prevFeatured = () => {
    setFeaturedIndex((prev) => (prev === 0 ? featuredStreams.length - 1 : prev - 1));
  };

  const nextFeatured = () => {
    setFeaturedIndex((prev) => (prev === featuredStreams.length - 1 ? 0 : prev + 1));
  };

  const renderMiniStreams = (streams: Stream[]) =>
    streams.map((s) => (
      <div
        key={s.id}
        className="mini-stream-card"



        onClick={irAlStream} // se añadio
        style={{ cursor: "pointer" }} // se añadio
      >
       
       
        <img className="mini-stream-img" src={s.imagen} alt={s.titulo} />
        <img className="live-logo" src={liveIcon} alt="live" />
        <div className="mini-bottom">
          <img className="mini-perfil-logo" src={perfil} alt="perfil" />
          <span className="mini-stream-title">{s.titulo}</span>
        </div>
        <div className="mini-viewers">{s.viewers} viewers</div>
      </div>
    ));

  const featured = featuredStreams[featuredIndex];

  return (
    <div className="home-container">


      {/* Rectángulo grande */}
      <div className="featured-stream" onClick={irAlStream} style={{ cursor: "pointer" }}> {/* se añadio*/}


        <img className="featured-img" src={featured.imagen} alt={featured.titulo} />
        <img className="live-logo" src={liveIcon} alt="live" />
        <div className="featured-bottom">
          <img className="perfil-logo" src={perfil} alt="perfil" />
          <span className="stream-title">{featured.titulo}</span>
        </div>
        <div className="featured-viewers">{featured.viewers} viewers</div>
        
        <button className="carousel-arrow left" onClick={(e) => { e.stopPropagation(); prevFeatured(); }}>&lt;</button>{/* para evitar que el boton rediriga a l link*/}
        <button className="carousel-arrow right" onClick={(e) => { e.stopPropagation(); nextFeatured(); }}>&gt;</button>
      </div>

      {/* Secciones */}
      <div className="mini-section">
        <h3 className="section-title">Recomendados</h3>
        <div className="mini-streams">{renderMiniStreams(recomendados)}</div>
      </div>

      <hr className="section-divider" />

      <div className="mini-section">
        <h3 className="section-title">Conversando</h3>
        <div className="mini-streams">{renderMiniStreams(conversando)}</div>
      </div>

      <hr className="section-divider" />

      <div className="mini-section">
        <h3 className="section-title">Juegos</h3>
        <div className="mini-streams">{renderMiniStreams(juegos)}</div>
      </div>
    </div>
  );
};

export default Home;
