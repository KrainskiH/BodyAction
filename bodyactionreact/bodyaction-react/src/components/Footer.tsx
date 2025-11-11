import React, { useEffect, useState } from 'react';
import '../styles/pages/contato.css';

const Footer: React.FC = () => {
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    // Carrega Remix Icon CSS se não estiver presente
    if (!document.querySelector('link[href*="remixicon"]')) {
      const iconLink = document.createElement('link');
      iconLink.rel = 'stylesheet';
      iconLink.href = 'https://cdn.jsdelivr.net/npm/remixicon@4.3.0/fonts/remixicon.css';
      document.head.appendChild(iconLink);
    }

    // Tenta carregar includes/footer.html
    const tryPaths = ['includes/footer.html', '/includes/footer.html'];
    let mounted = true;
    (async () => {
      for (const p of tryPaths) {
        try {
          const res = await fetch(p, { cache: 'no-store' });
          if (!res.ok) continue;
          const text = await res.text();
          if (mounted) setHtml(text);
          return;
        } catch (_) { }
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (html) return <footer className="ba-footer" dangerouslySetInnerHTML={{ __html: html }} />;

  // fallback simples
  return (
    <footer className="ba-footer">
      <div className="container">
        <p>© {new Date().getFullYear()} BodyAction — todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
