// URL base do backend (usar global ou definir se não existir)
(function() {
  if (typeof window.API_BASE === 'undefined') {
      window.API_BASE = 'http://localhost:5001';
  }
})();

// ======== Cadastro ========
document.addEventListener('DOMContentLoaded', function() {
  console.log('🔄 DOM carregado - inicializando cadastro');
  
  const formCadastro = document.getElementById('form-cadastro');
  if (!formCadastro) {
    console.error('❌ Formulário de cadastro NÃO encontrado!');
    return;
  }
  
  console.log('✅ Formulário encontrado:', formCadastro);
  
  formCadastro.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Capturar todos os campos
    const campos = {
      nome: document.getElementById('nome'),
      cpf: document.getElementById('cpf'),
      email: document.getElementById('email'),
      dataNascimento: document.getElementById('DataNascimento'),
      telefone: document.getElementById('telefone'),
      senha: document.getElementById('senha'),
      plano: document.getElementById('plano')
    };
    
    // Verificar se todos os campos necessários existem
    const senhaEl = campos.senha;
    if (!senhaEl) {
      alert('ERRO: Campo senha não encontrado!');
      return;
    }
    
    // Criar objeto de dados
    const data = {
      nome: campos.nome?.value || '',
      cpf: campos.cpf?.value || '',
      email: campos.email?.value || '',
      dataNascimento: campos.dataNascimento?.value || '',
      telefone: campos.telefone?.value || '',
      senha: senhaEl.value || '',
      planoId: parseInt(campos.plano?.value || '0')
    };
    
    // Validação simples da senha
    if (!data.senha || data.senha.length < 6) {
      alert('Senha deve ter pelo menos 6 caracteres!');
      return;
    }
    
    try {
      console.log('📤 Enviando para:', `${window.API_BASE}/api/cadastro`);
      
      const response = await fetch(`${window.API_BASE}/api/cadastro`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      console.log('📥 Resposta recebida:', response.status, response.statusText);
      
      const result = await response.json();
      console.log('📄 Conteúdo da resposta:', result);
      
      if (response.ok && result.success) {
        console.log('✅ Cadastro realizado com sucesso, preparando redirecionamento...');
        
        alert(`🎉 Cadastro realizado com sucesso!\n\nBem-vindo à BodyAction! Agora você já pode acessar sua área do aluno.`);
        
        // Fazer login automático após cadastro
        // Backend retorna em result.data, não result.usuario
        const backendData = result.data || result.usuario || {};
        const userData = {
          Id: backendData.Id || backendData.id || Date.now(),
          Nome: backendData.Nome || backendData.nome || data.nome,
          Email: backendData.Email || backendData.email || data.email,
          Cpf: backendData.Cpf || backendData.cpf || data.cpf,
          DataNascimento: backendData.DataNascimento || backendData.dataNascimento || data.dataNascimento,
          Telefone: backendData.Telefone || backendData.telefone || data.telefone,
          Plano: backendData.Plano || data.planoId,
          PlanoId: backendData.PlanoId || backendData.planoId || data.planoId
        };
        
        localStorage.setItem('bodyaction_user', JSON.stringify(userData));
        
        // Redirecionar para área do usuário
        setTimeout(() => {
          window.location.href = '/pages/conta.html';
        }, 2000);
      } else {
        console.error('❌ Erro no cadastro:', result);
        alert(`❌ Erro: ${result.message || 'Erro desconhecido'}`);
      }
      
    } catch (error) {
      console.error('❌ Erro na requisição:', error);
      alert(`Erro de conexão: ${error.message}`);
    }
  });
});

// Validações simples
function validarCPF(cpf) {
  return cpf.replace(/[^\d]/g, '').length === 11;
}

function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validarTelefone(telefone) {
  return /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/.test(telefone);
}