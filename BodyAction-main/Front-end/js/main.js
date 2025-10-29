

  window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    const scrollY = window.scrollY;

    if (scrollY > 10) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
const track = document.querySelector('.carousel-track');
const next = document.querySelector('.next');
const prev = document.querySelector('.prev');
const cards = document.querySelectorAll('.cardcarrossel');

let index = 0;

function updateCarousel() {
  track.style.transform = `translateX(-${index * 100}%)`;
}

next.addEventListener('click', () => {
  index = (index + 1) % cards.length; // volta ao 0 depois do último
  updateCarousel();
});

prev.addEventListener('click', () => {
  index = (index - 1 + cards.length) % cards.length; // vai pro último se estiver no 0
  updateCarousel();
});

// Centraliza o mapa em Curitiba
const map = L.map('map').setView([-25.4284, -49.2733], 12);

// Mapa base (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap',
}).addTo(map);

// Unidades em Curitiba (exemplos)
const unidades = [
  { nome: "BodyAction Centro", lat: -25.4284, lng: -49.2733 },
  { nome: "BodyAction Água Verde", lat: -25.4540, lng: -49.2810 },
  { nome: "BodyAction Boa Vista", lat: -25.3902, lng: -49.2530 },
  { nome: "BodyAction Batel", lat: -25.4410, lng: -49.2850 }
];

// Adiciona marcadores das unidades
unidades.forEach(u => {
  L.marker([u.lat, u.lng])
    .addTo(map)
    .bindPopup(`<b>${u.nome}</b>`);
});

// Função pra calcular distância (em km)
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

// Localiza o usuário
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(pos => {
    const latUser = pos.coords.latitude;
    const lngUser = pos.coords.longitude;

    // Adiciona marcador do usuário
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

    // Calcula unidade mais próxima
    let maisProxima = null;
    let menorDistancia = Infinity;

    unidades.forEach(u => {
      const d = calcularDistancia(latUser, lngUser, u.lat, u.lng);
      if (d < menorDistancia) {
        menorDistancia = d;
        maisProxima = u;
      }
    });

    document.getElementById("resultado").textContent =
      `🏋️ A unidade mais próxima de você é: ${maisProxima.nome} (${menorDistancia.toFixed(1)} km)`;
  });
} else {
  alert("Ative a localização para encontrar a unidade mais próxima.");
}
const preloader = document.getElementById("preloader");

// Quando a página termina de carregar
window.addEventListener("load", () => {
  preloader.classList.add("fade-out");
  setTimeout(() => preloader.style.display = "none", 600);
});

// Evento global para todos os links
document.body.addEventListener("click", e => {
  const link = e.target.closest("a[href]");
  if (link) {
    const href = link.getAttribute("href");

    // Ignora links internos (#), mailto ou vazios
    if (!href.startsWith("#") && !href.startsWith("mailto:") && href !== "") {
      e.preventDefault();

      // Mostra preloader antes de navegar
      preloader.style.display = "flex";
      preloader.classList.remove("fade-out");

      // Navega após o delay
      setTimeout(() => {
        window.location.href = href;
      }, 400); // 0.4s de delay
    }
  }
});
