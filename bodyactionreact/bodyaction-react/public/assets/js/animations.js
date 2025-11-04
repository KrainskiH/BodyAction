// ===== ANIMAÇÕES ON SCROLL =====
(function() {
  'use strict';

  // Configuração do Intersection Observer
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1 // 10% do elemento visível para disparar animação
  };

  // Callback quando elemento entra na viewport
  const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Opcional: parar de observar após animar (performance)
        // observer.unobserve(entry.target);
      }
    });
  };

  // Criar observer
  const observer = new IntersectionObserver(observerCallback, observerOptions);

  // Função para inicializar animações
  function initAnimations() {
    // Selecionar todos os elementos que devem animar
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    animatedElements.forEach(element => {
      observer.observe(element);
    });

    // Adicionar classe de animação para cards
    const cards = document.querySelectorAll('.card, .cardcarrossel, .about-card');
    cards.forEach((card, index) => {
      card.classList.add('animate-on-scroll');
      card.style.transitionDelay = `${index * 0.1}s`;
      observer.observe(card);
    });

    // Adicionar animação para títulos e parágrafos
    const headings = document.querySelectorAll('h1, h2, h3, .hero-title');
    headings.forEach((heading, index) => {
      heading.classList.add('animate-on-scroll');
      heading.style.transitionDelay = `${index * 0.05}s`;
      observer.observe(heading);
    });

    const paragraphs = document.querySelectorAll('p, .hero-subtitle');
    paragraphs.forEach((p, index) => {
      if (!p.closest('.animate-on-scroll')) { // Evitar duplicação
        p.classList.add('animate-on-scroll');
        p.style.transitionDelay = `${index * 0.05}s`;
        observer.observe(p);
      }
    });

    // Adicionar animação para botões
    const buttons = document.querySelectorAll('.btn, .btn-primary');
    buttons.forEach((btn, index) => {
      btn.classList.add('animate-on-scroll');
      btn.style.transitionDelay = `${index * 0.1}s`;
      observer.observe(btn);
    });

    // Adicionar animação para imagens
    const images = document.querySelectorAll('img');
    images.forEach((img, index) => {
      if (!img.classList.contains('loader-logo')) { // Excluir logo do preloader
        img.classList.add('animate-on-scroll');
        img.style.transitionDelay = `${index * 0.05}s`;
        observer.observe(img);
      }
    });
  }

  // Inicializar quando DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimations);
  } else {
    initAnimations();
  }

  // Adicionar efeito parallax suave ao scroll (opcional)
  let ticking = false;
  
  function updateParallax() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.parallax');
    
    parallaxElements.forEach(element => {
      const speed = element.dataset.speed || 0.5;
      const yPos = -(scrolled * speed);
      element.style.transform = `translateY(${yPos}px)`;
    });
    
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  });

  // Smooth scroll para links âncora
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      
      // Ignorar links # vazios ou que abrem menu
      if (href === '#' || href === '#menu') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Adicionar classe hover-zoom em containers de imagem
  document.querySelectorAll('.about-card, .card').forEach(container => {
    if (container.querySelector('img')) {
      container.classList.add('hover-zoom');
    }
  });

})();
