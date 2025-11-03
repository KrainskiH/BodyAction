import React, { useState, useRef, useEffect } from 'react';
import '../styles/components/cards.css';

interface CarouselProps { images: string[] }

const Carousel: React.FC<CarouselProps> = ({ images }) => {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!trackRef.current) return;
    trackRef.current.style.transform = `translateX(-${index * 100}%)`;
  }, [index]);

  // Auto-play: avança a cada 4 segundos
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setIndex(i => (i + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length, isPaused]);

  const next = () => setIndex(i => (i + 1) % images.length);
  const prev = () => setIndex(i => (i - 1 + images.length) % images.length);
  const goTo = (i: number) => setIndex(i);

  return (
    <div 
      className="carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <button className="prev" onClick={prev} aria-label="Anterior">‹</button>
      <div className="carousel-track" ref={trackRef}>
        {images.map((src, i) => (
          <div key={i} className="cardcarrossel">
            <img src={src} alt={`Slide ${i + 1}`} />
          </div>
        ))}
      </div>
      <button className="next" onClick={next} aria-label="Próximo">›</button>
      
      {/* Indicadores de slides */}
      <div className="carousel-indicators">
        {images.map((_, i) => (
          <button
            key={i}
            className={`indicator ${i === index ? 'active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Ir para slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
