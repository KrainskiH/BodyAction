import React from 'react';
import './App.css';
import Header from './components/Header';
import Preloader from './components/Preloader';
import Footer from './components/Footer';
import MapView from './components/MapView';
import Carousel from './components/Carousel';
import Hero from './components/Hero';
import Sobre from './components/Sobre';
import Instructors from './components/Instructors';
import CTA from './components/CTA';

function App() {
  return (
    <div className="App">
      <Preloader />
      <Header />
      <Hero />
      
      <section className="sobre-carousel-wrapper">
        <Sobre />
        <div className="carousel-container">
          <Carousel images={[
            '/assets/img/FrenteAcademia.jpg',
            '/assets/img/Cia-Athletica-Nacional-Musculacao-Sao-Paulo-Autores-Grupo-S2-Marketing-Freepik.webp',
            '/assets/img/Uribe%20Schwarzkopf%20-%20uSpots%20-piscina.webp',
            '/assets/img/sala-de-exercicios-e-piscina-interna.jpeg',
            '/assets/img/massoterapia.jpg'
          ]} />
        </div>
      </section>

      <Instructors />

      <section style={{ padding: 20 }}>
        <h2>Unidades</h2>
        <MapView />
      </section>

      <CTA />
      <Footer />
    </div>
  );
}

export default App;
