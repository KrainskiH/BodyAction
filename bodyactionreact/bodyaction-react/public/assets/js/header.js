// Script para incluir o header em todas as páginas estáticas
(function() {
  function setActiveLinks(root) {
    try {
      const path = (location.pathname || '/').toLowerCase();
      const map = [
        { href: '/', match: path === '/' },
        { href: '/pages/sobre.html', match: path.indexOf('/sobre') !== -1 },
        { href: '/pages/services.html', match: path.indexOf('/services') !== -1 },
        { href: '/pages/planos.html', match: path.indexOf('/planos') !== -1 },
        { href: '/pages/contato.html', match: path.indexOf('/contato') !== -1 }
      ];
      const links = root.querySelectorAll('nav.main-nav a, #side-menu a');
      links.forEach(a => {
        a.classList.remove('ativo');
        const href = a.getAttribute('href');
        if (!href) return;
        for (const m of map) {
          if (m.match && href === m.href) {
            a.classList.add('ativo');
          }
        }
      });
    } catch (e) {
      console.warn('Não foi possível marcar link ativo:', e);
    }
  }

  document.addEventListener('DOMContentLoaded', function() {
    const slot = document.getElementById('header-slot');
    if (!slot) return;

    fetch('/includes/header.html', { cache: 'no-store' })
      .then(function(res) { return res.text(); })
      .then(function(html) {
        slot.innerHTML = html;
        setActiveLinks(slot);
        
        // Adicionar funcionalidade de scroll ao header carregado dinamicamente
        const header = document.querySelector('header');
        if (header) {
          window.addEventListener('scroll', function() {
            if (window.scrollY > 10) {
              header.classList.add('scrolled');
            } else {
              header.classList.remove('scrolled');
            }
          });
        }

        // Toggle do menu mobile depois da injeção
        const menuToggle = document.getElementById('menu-toggle');
        const sideMenu = document.getElementById('side-menu');
        const overlay = document.getElementById('overlay');

        function closeMenu() {
          sideMenu && sideMenu.classList.remove('active');
          overlay && overlay.classList.remove('active');
          if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
        }

        if (menuToggle && sideMenu && overlay) {
          menuToggle.addEventListener('click', function() {
            const willOpen = !sideMenu.classList.contains('active');
            sideMenu.classList.toggle('active');
            overlay.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
          });

          overlay.addEventListener('click', closeMenu);
          // Fecha ao navegar
          sideMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
          // Fecha com ESC
          document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
        }

        // Animação suave de entrada dos itens do menu (desktop e mobile)
        const desktopItems = slot.querySelectorAll('.main-nav li');
        const mobileItems = slot.querySelectorAll('#side-menu li');
        desktopItems.forEach((li, i) => li.style.animationDelay = `${0.05 * i}s`);
        mobileItems.forEach((li, i) => li.style.animationDelay = `${0.04 * i}s`);
      })
      .catch(function(err) {
        console.error('Erro ao carregar o header:', err);
      });
  });
})();
