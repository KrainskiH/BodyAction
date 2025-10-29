const menuToggle = document.getElementById('menu-toggle');
const sideMenu = document.getElementById('side-menu');
const overlay = document.getElementById('overlay');

menuToggle.addEventListener('click', () => {
  sideMenu.classList.toggle('active');
  overlay.classList.toggle('active');
});

overlay.addEventListener('click', () => {
  sideMenu.classList.remove('active');
  overlay.classList.remove('active');
});


// validação simples do formulário (sem backend)
document.getElementById('form-contato')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const f = e.target;
  const req = ['assunto','nome','telefone','email','mensagem','lgpd'];
  for (const id of req) {
    const el = document.getElementById(id);
    if (!el) continue;
    if ((el.type === 'checkbox' && !el.checked) || (el.value || '').trim() === '') {
      alert('Preencha todos os campos obrigatórios e aceite o consentimento.');
      el.focus();
      return;
    }
  }
  alert('Mensagem enviada! Em breve entraremos em contato.');
  f.reset();
});
