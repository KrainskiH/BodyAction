import React, { useEffect, useRef } from 'react';
import '../styles/base/variables.css';

declare global {
  interface Window { L: any; }
}

const unidades = [
  { nome: 'BodyAction Centro', lat: -25.4284, lng: -49.2733 },
  { nome: 'BodyAction Água Verde', lat: -25.4540, lng: -49.2810 },
  { nome: 'BodyAction Boa Vista', lat: -25.3902, lng: -49.2530 },
  { nome: 'BodyAction Batel', lat: -25.4410, lng: -49.2850 },
];

const MapView: React.FC = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!ref.current) return;
    const L = window.L;
    if (!L) return console.warn('Leaflet não encontrado. Verifique se o script do Leaflet foi carregado.');

    const map = L.map(ref.current).setView([-25.4284, -49.2733], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap',
    }).addTo(map);

    unidades.forEach(u => {
      L.marker([u.lat, u.lng]).addTo(map).bindPopup(`<b>${u.nome}</b>`);
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        const latUser = pos.coords.latitude;
        const lngUser = pos.coords.longitude;
        L.marker([latUser, lngUser], {
          icon: L.icon({ iconUrl: 'https://cdn-icons-png.flaticon.com/512/64/64113.png', iconSize: [35,35] })
        }).addTo(map).bindPopup('Você está aqui 👋').openPopup();
        map.setView([latUser, lngUser], 13);
      });
    }

    return () => { map.remove(); };
  }, []);

  return <div id="map" ref={ref} style={{ width: '100%', height: 400 }} />;
};

export default MapView;
