// Arquivo de debug específico para o cadastro
console.log('🔄 cadastro-debug.js carregado');

function debugCadastro() {
  console.log('🔍 === DEBUG CADASTRO INICIADO ===');
  
  // Verificar se todos os elementos existem
  const form = document.getElementById('form-cadastro');
  const senha = document.getElementById('senha');
  
  console.log('Formulário encontrado:', !!form);
  console.log('Campo senha encontrado:', !!senha);
  
  if (senha) {
    console.log('Campo senha valor atual:', `"${senha.value}"`);
    console.log('Campo senha type:', senha.type);
    console.log('Campo senha name:', senha.name);
    console.log('Campo senha id:', senha.id);
  }
  
  // Testar captura direta
  const testeSenha = document.querySelector('#senha');
  console.log('Teste querySelector #senha:', !!testeSenha);
  
  const testeSenha2 = document.querySelector('input[name="senha"]');
  console.log('Teste querySelector input[name="senha"]:', !!testeSenha2);
  
  const testeSenha3 = document.querySelector('input[type="password"]');
  console.log('Teste querySelector input[type="password"]:', !!testeSenha3);
  
  // Listar todos os inputs do formulário
  if (form) {
    const inputs = form.querySelectorAll('input');
    console.log('Total de inputs no form:', inputs.length);
    inputs.forEach((input, index) => {
      console.log(`Input ${index}:`, {
        id: input.id,
        name: input.name,
        type: input.type,
        value: input.value ? 'TEM VALOR' : 'VAZIO'
      });
    });
  }
}

// Executar debug quando a página carregar
document.addEventListener('DOMContentLoaded', debugCadastro);

// Executar também se já carregou
if (document.readyState !== 'loading') {
  debugCadastro();
}

// Adicionar listener no formulário para testar em tempo real
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('form-cadastro');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      console.log('🎯 === SUBMIT DEBUG ===');
      
      // Testar captura da senha no momento do submit
      const senha1 = document.getElementById('senha')?.value;
      const senha2 = document.querySelector('#senha')?.value;
      const senha3 = document.querySelector('input[type="password"]')?.value;
      
      console.log('Senha via getElementById:', `"${senha1}"`);
      console.log('Senha via querySelector #senha:', `"${senha2}"`);
      console.log('Senha via querySelector input[type="password"]:', `"${senha3}"`);
      
      // Criar objeto de dados para testar
      const data = {
        senha: senha1
      };
      
      console.log('Objeto data:', data);
      console.log('JSON.stringify(data):', JSON.stringify(data));
      console.log('data.hasOwnProperty("senha"):', data.hasOwnProperty('senha'));
    });
  }
});