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
      })
      .catch(function(err) {
        console.error('Erro ao carregar o header:', err);
      });
  });
})();
