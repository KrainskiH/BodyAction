import React, { useEffect, useState } from 'react';
import '../styles/layout/header.css';

const Header: React.FC = () => {
  const [sideActive, setSideActive] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = sideActive ? 'hidden' : '';
  }, [sideActive]);

  return (
    <>
      <header className={scrolled ? 'scrolled' : ''}>
        <div className="logo">
          <h1 id="TITULO"> | B.A</h1>
          <h1> Body <br />Action</h1>
          <p id="DRAMA">O seu melhor jeito de malhar</p>
        </div>

        <nav className="main-nav">
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/pages/sobre.html">Sobre</a></li>
            <li><a href="/pages/services.html">Serviços</a></li>
            <li><a href="/pages/planos.html">Planos</a></li>
            <li><a href="/pages/contato.html">Contato</a></li>
          </ul>
        </nav>

        <button id="menu-toggle" onClick={() => setSideActive(v => !v)}>☰</button>
      </header>

      <div id="side-menu" className={sideActive ? 'active' : ''} aria-hidden={!sideActive}>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/pages/sobre.html">Sobre</a></li>
          <li><a href="/pages/services.html">Serviços</a></li>
          <li><a href="/pages/planos.html">Planos</a></li>
          <li><a href="/pages/contato.html">Contato</a></li>
        </ul>
      </div>

      <div id="overlay" className={sideActive ? 'active' : ''} onClick={() => setSideActive(false)} />
    </>
  );
};

export default Header;
