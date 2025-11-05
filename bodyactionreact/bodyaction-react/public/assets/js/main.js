// Menu mobile toggle
document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.getElementById('menu-toggle');
  const sideMenu = document.getElementById('side-menu');
  const overlay = document.getElementById('overlay');

  if (menuToggle && sideMenu && overlay) {
    menuToggle.addEventListener('click', function() {
      sideMenu.classList.toggle('active');
      overlay.classList.toggle('active');
    });

    overlay.addEventListener('click', function() {
      sideMenu.classList.remove('active');
      overlay.classList.remove('active');
    });
  }

  // Header scroll effect (para páginas sem header dinâmico)
  const header = document.querySelector('header');
  if (header && !document.getElementById('header-slot')) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 10) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }
});

const track = document.querySelector('.carousel-track');
const next = document.querySelector('.next');
const prev = document.querySelector('.prev');
const cards = document.querySelectorAll('.cardcarrossel');

if (track && next && prev && cards.length > 0) {
  let index = 0;

  function updateCarousel() {
    track.style.transform = `translateX(-${index * 100}%)`;
  }

  next.addEventListener('click', () => {
    index = (index + 1) % cards.length;
    updateCarousel();
  });

  prev.addEventListener('click', () => {
    index = (index - 1 + cards.length) % cards.length;
    updateCarousel();
  });
}

// Mapa Leaflet
const mapElement = document.getElementById('map');
if (mapElement && typeof L !== 'undefined') {
  const map = L.map('map').setView([-25.4284, -49.2733], 12);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap',
  }).addTo(map);

  const unidades = [
    { nome: "BodyAction Centro", lat: -25.4284, lng: -49.2733 },
    { nome: "BodyAction Água Verde", lat: -25.4540, lng: -49.2810 },
    { nome: "BodyAction Boa Vista", lat: -25.3902, lng: -49.2530 },
    { nome: "BodyAction Batel", lat: -25.4410, lng: -49.2850 }
  ];

  unidades.forEach(u => {
    L.marker([u.lat, u.lng])
      .addTo(map)
      .bindPopup(`<b>${u.nome}</b>`);
  });

  function calcularDistancia(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat/2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      const latUser = pos.coords.latitude;
      const lngUser = pos.coords.longitude;

      L.marker([latUser, lngUser], {
        icon: L.icon({
          iconUrl: 'https://cdn-icons-png.flaticon.com/512/64/64113.png',
          iconSize: [35, 35],
        }),
      })
      .addTo(map)
      .bindPopup("Você está aqui 👋")
      .openPopup();

      map.setView([latUser, lngUser], 13);

      let maisProxima = null;
      let menorDistancia = Infinity;

      unidades.forEach(u => {
        const d = calcularDistancia(latUser, lngUser, u.lat, u.lng);
        if (d < menorDistancia) {
          menorDistancia = d;
          maisProxima = u;
        }
      });

      const resultadoEl = document.getElementById("resultado");
      if (resultadoEl) {
        resultadoEl.textContent =
          `🏋️ A unidade mais próxima de você é: ${maisProxima.nome} (${menorDistancia.toFixed(1)} km)`;
      }
    });
  }
}

// Preloader
const preloader = document.getElementById("preloader");
if (preloader) {
  window.addEventListener("load", () => {
    preloader.classList.add("fade-out");
    setTimeout(() => preloader.style.display = "none", 600);
  });
}

// ====== Welcome Gateway (overlay de abertura) ======
(function initWelcomeGateway(){
  try {
    const KEY_SEEN = 'ba_gateway_seen_v1';
    const KEY_ROLE = 'ba_user_role'; // 'aluno' | 'funcionario'

    // Só mostra se ainda não foi visto
    if (localStorage.getItem(KEY_SEEN) === '1') return;

    // Cria overlay
    const overlay = document.createElement('div');
    overlay.className = 'ba-gateway-overlay';
    overlay.innerHTML = `
      <div class="ba-gateway" role="dialog" aria-modal="true" aria-labelledby="gw-title">
        <div class="ba-gw-header">
          <img src="/assets/img/bodyaction_logo.png" alt="BodyAction"/>
          <div>
            <h2 id="gw-title" class="ba-gw-title">BEM-VINDO À BODY ACTION GYM</h2>
            <p class="ba-gw-sub">Escolha como deseja começar sua experiência.</p>
          </div>
        </div>
        <div class="ba-gw-body">
          <div class="ba-gw-grid">
            <div class="ba-gw-card" id="opt-aluno">
              <h3>Sou Aluno</h3>
              <p>Acompanhe aulas e cobranças. Se ainda não tem cadastro, crie agora.</p>
              <div class="ba-gw-actions">
                <a class="ba-btn primary" href="/pages/cadastro.html">Cadastrar-se</a>
                <button class="ba-btn" type="button" data-action="aluno-dashboard">Ver minha área</button>
              </div>
            </div>
            <div class="ba-gw-card" id="opt-func">
              <h3>Sou Funcionário</h3>
              <p>Acesso administrativo básico para gestão (em breve recursos completos).</p>
              <div class="ba-gw-actions">
                <button class="ba-btn" type="button" data-action="func-area">Entrar</button>
                <a class="ba-btn" href="/pages/planos.html">Ver planos</a>
              </div>
            </div>
          </div>
        </div>
        <div class="ba-gw-footer">
          <div class="ba-gw-mini">Você pode mudar sua escolha depois.</div>
          <a class="ba-btn" href="/pages/planos.html">Adquirir um plano</a>
          <button class="ba-btn ba-gw-close" type="button" data-action="continuar">Continuar navegando</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);

    function openGW(){ overlay.classList.add('active'); }
    function closeGW(){ overlay.classList.remove('active'); localStorage.setItem(KEY_SEEN,'1'); }

    // Ações
    overlay.addEventListener('click', (e)=>{
      const btn = e.target.closest('button, a');
      if (!btn) return;
      const action = btn.getAttribute('data-action');
      if (action === 'continuar') { closeGW(); }
      if (action === 'aluno-dashboard') { localStorage.setItem(KEY_ROLE,'aluno'); showAlunoDashboard(); }
      if (action === 'func-area') { localStorage.setItem(KEY_ROLE,'funcionario'); showFuncionarioArea(); }
    });

    function showAlunoDashboard(){
      const card = overlay.querySelector('#opt-aluno');
      if (!card) return;
      card.innerHTML = `
        <h3>Minha Área — Aluno</h3>
        <p>Aqui você encontrará suas próximas aulas e status de pagamento.</p>
        <div class="ba-gw-actions">
          <a class="ba-btn" href="/pages/services.html">Minhas aulas (exemplo)</a>
          <a class="ba-btn" href="/pages/planos.html">Minhas cobranças (exemplo)</a>
        </div>
      `;
    }

    function showFuncionarioArea(){
      const card = overlay.querySelector('#opt-func');
      if (!card) return;
      card.innerHTML = `
        <h3>Área do Funcionário</h3>
        <p>Acesso rápido a seções administrativas (protótipo).</p>
        <div class="ba-gw-actions">
          <a class="ba-btn" href="/pages/planos.html">Gerenciar Planos</a>
          <a class="ba-btn" href="/pages/contato.html">Mensagens/Contatos</a>
        </div>
      `;
    }

    // Exibir ao carregar (apenas se não visto)
    requestAnimationFrame(openGW);
  } catch(e) { console.warn('Gateway não pôde iniciar:', e); }
})();