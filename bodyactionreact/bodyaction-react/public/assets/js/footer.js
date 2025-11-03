// Script para incluir o footer em todas as páginas
document.addEventListener('DOMContentLoaded', function() {
  const footerSlot = document.getElementById('footer-slot');
  if (!footerSlot) return;

  fetch('/includes/footer.html')
    .then(response => response.text())
    .then(html => {
      footerSlot.innerHTML = html;
      
      // Carrega os ícones do Remix Icon se ainda não foram carregados
      if (!document.querySelector('link[href*="remixicon"]')) {
        const iconLink = document.createElement('link');
        iconLink.rel = 'stylesheet';
        iconLink.href = 'https://cdn.jsdelivr.net/npm/remixicon@4.3.0/fonts/remixicon.css';
        document.head.appendChild(iconLink);
      }
    })
    .catch(error => {
      console.error('Erro ao carregar o footer:', error);
      footerSlot.innerHTML = `
        <footer class="ba-footer" role="contentinfo">
          <p class="ba-copy" style="text-align:center;padding:20px">
            © 2019–2025 <strong>Body Action</strong>. Todos os direitos reservados.
          </p>
        </footer>`;
    });
});