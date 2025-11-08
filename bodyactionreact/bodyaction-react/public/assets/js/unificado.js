// URL base do backend
const API_BASE = 'http://localhost:5000';

// ======== Cadastro ========
const formCadastro = document.getElementById('form-cadastro');
if (formCadastro) {
  formCadastro.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log("Submit disparado");

    const data = {
      Nome: document.getElementById('nome').value,
      Cpf: document.getElementById('cpf').value,
      Email: document.getElementById('email').value,
      DataNascimento: document.getElementById('DataNascimento').value,
      Telefone: document.getElementById('telefone').value,
      PlanoId: getPlanoId(document.getElementById('plano').value),
    };

    console.log("Dados enviados:", data);

    try {
      const res = await fetch(`${API_BASE}/cadastros`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Erro ao enviar cadastro: ${text}`);
      }

      alert('Cadastro enviado com sucesso!');
      formCadastro.reset();
    } catch (err) {
      console.error(err);
      alert('Falha ao enviar cadastro. Veja o console.');
    }
  });
}

// Mapeia plano para ID
function getPlanoId(planoNome) {
  switch (planoNome.toLowerCase()) {
    case 'mensal': return 1;
    case 'semestral': return 2;
    case 'anual': return 3;
    default: return 0;
  }
}
