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
    const KEY_SEEN = 'ba_gateway_seen_v2';
    const KEY_ROLE = 'ba_user_role'; // 'aluno' | 'funcionario'

    // Forçar via querystring: ?gw=1 ou ?gateway=1 ou ?showGateway=1
    let forceGW = false;
    try { const usp = new URLSearchParams(location.search); forceGW = usp.has('gw') || usp.has('gateway') || usp.get('showGateway') === '1'; } catch(_) {}

    // Checa se veio de outra página do mesmo site
    const isInternalNavigation = () => {
      const referrer = document.referrer;
      if (!referrer) return false; // Sem referrer = acesso direto ou refresh
      
      try {
        const referrerUrl = new URL(referrer);
        const currentUrl = new URL(location.href);
        return referrerUrl.hostname === currentUrl.hostname;
      } catch {
        return false;
      }
    };

    const isInternal = isInternalNavigation();
    const seenInSession = sessionStorage.getItem(KEY_SEEN) === '1';

    console.log('Main.js Gateway: forceGW =', forceGW, 'isInternal =', isInternal, 'seenInSession =', seenInSession);

    // Função para verificar se usuário está logado
    function checkUserLoggedIn() {
        const userData = localStorage.getItem('bodyaction_user');
        const isLoggedIn = userData !== null && userData !== 'null' && userData !== '';
        console.log('   - userData no localStorage:', userData);
        console.log('   - usuário está logado:', isLoggedIn);
        return isLoggedIn;
    }

    const isUserLoggedIn = checkUserLoggedIn();
    
    // Verificar se está na página inicial (index) - mais rigoroso
    const currentPath = window.location.pathname.toLowerCase();
    const isHomePage = currentPath === '/' || 
                       currentPath === '/index.html' || 
                       currentPath === '/build/index.html' ||
                       (currentPath.endsWith('/') && currentPath.split('/').length <= 2);

    console.log('Main.js Gateway Debug:');
    console.log('   - currentPath:', currentPath);
    console.log('   - isHomePage:', isHomePage);
    console.log('   - isUserLoggedIn:', isUserLoggedIn);
    console.log('   - forceGW:', forceGW);
    console.log('   - seenInSession:', seenInSession);
    console.log('   - isInternal:', isInternal);

    // LÓGICA DEFINITIVA: só mostra no home E usuário não logado E forçar OU não visto na sessão
    const shouldShow = isHomePage && !isUserLoggedIn && (forceGW || !seenInSession);
    
    console.log('   - shouldShow:', shouldShow);
    
    if (!shouldShow) return;

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
              <p>Acesse sua área para acompanhar aulas e cobranças.</p>
              <div class="ba-gw-actions">
                <a class="ba-btn primary" href="/pages/login.html">🔑 Fazer Login</a>
                <a class="ba-btn" href="/pages/cadastro.html">➕ Cadastrar-se</a>
              </div>
            </div>
            <div class="ba-gw-card" id="opt-func">
              <h3>Sou Funcionário</h3>
              <p>Acesso administrativo para gestão da academia.</p>
              <div class="ba-gw-actions">
                <a class="ba-btn" href="/pages/funcionario.html">🔐 Área Admin</a>
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
    function closeGW(){ overlay.classList.remove('active'); sessionStorage.setItem(KEY_SEEN,'1'); }

    // Ações dos botões
    overlay.addEventListener('click', (e)=>{
      const btn = e.target.closest('button, a');
      if (!btn) return;
      const action = btn.getAttribute('data-action');
      // Se for um link normal, marca como visto e deixa navegar
      if (btn.tagName === 'A') {
        sessionStorage.setItem(KEY_SEEN,'1');
        return; // navegação natural
      }
      if (action === 'continuar') { closeGW(); }
      if (action === 'aluno-dashboard') {
        localStorage.setItem(KEY_ROLE,'aluno');
        sessionStorage.setItem(KEY_SEEN,'1');
        overlay.classList.remove('active');
        window.location.href = '/pages/conta.html';
      }
      if (action === 'func-area') {
        localStorage.setItem(KEY_ROLE,'funcionario');
        sessionStorage.setItem(KEY_SEEN,'1');
        overlay.classList.remove('active');
        window.location.href = '/pages/funcionario.html';
      }
    });

    // Fechar ao clicar no backdrop (fora do modal)
    overlay.addEventListener('click', (e) => {
      // Só fecha se clicou diretamente no overlay (backdrop), não nos elementos filhos
      if (e.target === overlay) {
        console.log('Main.js Gateway: backdrop clicked, closing gateway');
        closeGW();
      }
    });

    function showAlunoDashboard(){}
    function showFuncionarioArea(){}

    // Exibir ao carregar (apenas se não visto)
    requestAnimationFrame(openGW);

    // Função global para esconder overlay quando usuário fizer login
    window.hideGatewayOnLogin = function() {
        console.log('🚪 Escondendo gateway devido ao login do usuário');
        closeGW();
        overlay.remove();
    };

    // Listener para mudanças no localStorage (login)
    window.addEventListener('storage', function(e) {
        if (e.key === 'bodyaction_user' && e.newValue) {
            console.log('👤 Usuário fez login, escondendo gateway');
            window.hideGatewayOnLogin();
        }
    });
  } catch(e) { console.warn('Gateway não pôde iniciar:', e); }
<<<<<<< HEAD
})();
// ... (seu código atual do main.js)

// ========== Dropdown "Serviços" ==========
(function(){
  const dd = document.getElementById("dd-servicos");
  if(!dd) return;
  const btn = dd.querySelector(".nav__btn");

  function close(){
    dd.classList.remove("open");
    btn.setAttribute("aria-expanded","false");
  }

  function toggle(){
    const o = dd.classList.toggle("open");
    btn.setAttribute("aria-expanded", String(o));
  }

  btn.addEventListener("click", e => {
    e.stopPropagation();
    toggle();
  });

  document.addEventListener("click", e => {
    if(!dd.contains(e.target)) close();
  });

  document.addEventListener("keydown", e => {
    if(e.key === "Escape") close();
  });
})();
// ========= Dropdown "Serviços" (robusto) =========
(function initServicosDropdown(){
  function bind(){
    const dd = document.getElementById("dd-servicos");
    if(!dd) return false;
    const btn = dd.querySelector(".nav__btn");
    const panel = dd.querySelector(".dropdown--panel");
    if(!btn || !panel) return false;

    function close(){
      dd.classList.remove("open");
      btn.setAttribute("aria-expanded","false");
    }
    function toggle(){
      const isOpen = dd.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(isOpen));
    }

    // evita múltiplos listeners em hot reload
    btn.__hasHandlers || (btn.__hasHandlers = true,
      btn.addEventListener("click", e => { e.stopPropagation(); toggle(); })
    );

    document.__servicosDocHandlers || (document.__servicosDocHandlers = true,
      document.addEventListener("click", e => { if(!dd.contains(e.target)) close(); }),
      document.addEventListener("keydown", e => { if(e.key==="Escape") close(); })
    );

    return true;
  }

  // tenta já
  if (bind()) return;

  // tenta quando DOM carregar
  document.addEventListener("DOMContentLoaded", bind);

  // tenta algumas vezes caso o header seja injetado depois
  let tries = 0;
  const iv = setInterval(() => {
    if (bind() || ++tries > 20) clearInterval(iv);
  }, 200);
})();
=======
})();
>>>>>>> a232267cd669eeab49fb98799db3d0d89729a2f9
