import React, { useEffect, useState } from 'react';
import '../styles/base/variables.css';

const Preloader: React.FC = () => {
  const [hidden, setHidden] = useState(false);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const hide = () => {
      setFade(true);
      setTimeout(() => setHidden(true), 600);
    };

    if (document.readyState === 'complete') {
      hide();
    } else {
      window.addEventListener('load', hide);
      return () => window.removeEventListener('load', hide);
    }
  }, []);

  if (hidden) return null;

  return (
    <div id="preloader" className={fade ? 'fade-out' : ''}>
      <img src="/assets/img/bodyaction_logo.png" alt="Logo BodyAction" className="loader-logo" />
      <div className="loader"></div>
      <h1 className="loader-text">BODYACTION</h1>
    </div>
  );
};

export default Preloader;
