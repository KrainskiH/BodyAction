// URL base do backend (direto)
if (typeof window.API_BASE === 'undefined') {
    window.API_BASE = 'http://localhost:5001';
}

// ======== Cadastro ========
// Garantir que o DOM está carregado antes de tentar encontrar elementos
document.addEventListener('DOMContentLoaded', function() {
  console.log('🔄 DOM carregado, procurando formulário...');
  initCadastro();
});

// Também tentar imediatamente caso o script carregue após o DOM
if (document.readyState === 'loading') {
  console.log('📄 Documento ainda carregando, aguardando DOM...');
} else {
  console.log('📄 Documento já carregado, iniciando imediatamente...');
  initCadastro();
}

function initCadastro() {
  const formCadastro = document.getElementById('form-cadastro');
  console.log('🔍 Procurando form-cadastro:', formCadastro);
  
  if (formCadastro) {
    console.log('✅ Formulário de cadastro encontrado:', formCadastro);
  
  formCadastro.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log("Submit disparado");
    
    // Teste imediato dos campos no momento do submit
    console.log('🧪 TESTE IMEDIATO DOS CAMPOS:');
    const testeImediatoSenha = document.getElementById('senha')?.value;
    console.log('   - Senha capturada imediatamente:', `"${testeImediatoSenha}"`);

    // Verificar se os elementos existem antes de pegar o valor
    const nomeEl = document.getElementById('nome');
    const cpfEl = document.getElementById('cpf');
    const emailEl = document.getElementById('email');
    const dataNascEl = document.getElementById('DataNascimento');
    const telefoneEl = document.getElementById('telefone');
    const senhaEl = document.getElementById('senha');
    const planoEl = document.getElementById('plano');
    
    console.log('Elementos encontrados:');
    console.log('nome elemento:', nomeEl);
    console.log('senha elemento:', senhaEl);
    console.log('senha elemento valor:', senhaEl?.value);
    console.log('senha elemento valor length:', senhaEl?.value?.length);
    
    if (!senhaEl) {
      alert('ERRO: Campo senha não encontrado no formulário!');
      return;
    }
    
    // DEBUG CRÍTICO: Verificar senha antes de criar o data
    console.log('🔍 VERIFICAÇÃO CRÍTICA DA SENHA:');
    console.log('   - senhaEl:', senhaEl);
    console.log('   - senhaEl.value:', `"${senhaEl.value}"`);
    console.log('   - senhaEl.value?.length:', senhaEl.value?.length);
    
    const senhaValue = senhaEl.value;
    console.log('   - senhaValue capturada:', `"${senhaValue}"`);
    
    const data = {
      nome: nomeEl?.value || '',
      cpf: cpfEl?.value || '',
      email: emailEl?.value || '',
      dataNascimento: dataNascEl?.value || '',
      telefone: telefoneEl?.value || '',
      senha: senhaValue || '',
      planoId: getPlanoId(planoEl?.value || '0'),
    };
    
    console.log('🔍 SENHA NO OBJETO DATA:');
    console.log('   - data.senha:', `"${data.senha}"`);
    console.log('   - data hasOwnProperty("senha"):', data.hasOwnProperty('senha'));

    // Debug: verificar se todos os campos estão preenchidos
    console.log('Debug dos campos:');
    console.log('nome:', data.nome, '(comprimento:', data.nome?.length, ')');
    console.log('cpf:', data.cpf, '(comprimento:', data.cpf?.length, ')');
    console.log('email:', data.email, '(comprimento:', data.email?.length, ')');
    console.log('dataNascimento:', data.dataNascimento, '(comprimento:', data.dataNascimento?.length, ')');
    console.log('telefone:', data.telefone, '(comprimento:', data.telefone?.length, ')');
    console.log('senha:', data.senha ? 'PREENCHIDA' : 'VAZIA', '(comprimento:', data.senha?.length, ')');
    console.log('senha valor real:', `"${data.senha}"`);
    console.log('planoId:', data.planoId, '(tipo:', typeof data.planoId, ')');

    console.log("Dados enviados:", data);

    // Validações
    let hasError = false;
    
    if (!validarEmail(data.email)) {
      document.getElementById('email-erro').style.display = 'block';
      hasError = true;
    } else {
      document.getElementById('email-erro').style.display = 'none';
    }
    
    if (!validarCPF(data.cpf.replace(/[^\d]/g, ''))) {
      document.getElementById('cpf-erro').style.display = 'block';
      hasError = true;
    } else {
      document.getElementById('cpf-erro').style.display = 'none';
    }
    
    if (!validarTelefone(data.telefone)) {
      document.getElementById('telefone-erro').style.display = 'block';
      hasError = true;
    } else {
      document.getElementById('telefone-erro').style.display = 'none';
    }
    
    console.log('🔍 VALIDANDO SENHA:');
    console.log('   - data.senha antes da validação:', `"${data.senha}"`);
    console.log('   - tipo da senha:', typeof data.senha);
    console.log('   - validarSenha(data.senha):', validarSenha(data.senha));
    
    if (!validarSenha(data.senha)) {
      console.log('❌ VALIDAÇÃO DE SENHA FALHOU!');
      document.getElementById('senha-erro').style.display = 'block';
      hasError = true;
    } else {
      console.log('✅ VALIDAÇÃO DE SENHA OK!');
      document.getElementById('senha-erro').style.display = 'none';
    }
    
    console.log('🔍 CHECK FINAL hasError:', hasError);
    if (hasError) {
      console.log('❌ PARANDO EXECUÇÃO POR CAUSA DE hasError = true');
      return;
    }
    console.log('✅ Passou na validação hasError, continuando...');
    
    // Verificação final antes de enviar
    if (!data.senha || typeof data.senha !== 'string' || data.senha.trim().length === 0) {
      alert('ERRO: Campo senha está vazio! Por favor, preencha a senha.');
      document.getElementById('senha').focus();
      return;
    }
    
    if (data.senha.length < 6) {
      alert('ERRO: Senha deve ter pelo menos 6 caracteres!');
      document.getElementById('senha').focus();
      return;
    }

    try {
      console.log('🔄 API_BASE:', API_BASE);
      console.log('🔄 Enviando cadastro para:', `${window.API_BASE}/api/cadastro`);
      console.log('🔄 Dados da requisição:', JSON.stringify(data, null, 2));
      
      // Log detalhado da senha especificamente
      console.log('🔍 DEBUG SENHA DETALHADO:');
      console.log('   - Senha existe?', 'senha' in data);
      console.log('   - Senha valor:', data.senha);
      console.log('   - Senha tipo:', typeof data.senha);
      console.log('   - Senha length:', data.senha?.length);
      console.log('   - Senha é string?', typeof data.senha === 'string');
      console.log('   - Senha após trim:', data.senha?.trim());
      console.log('   - Senha no JSON:', JSON.stringify({senha: data.senha}));
      
      // Verificar se o JSON final contém a senha
      const jsonPayload = JSON.stringify(data);
      console.log('🔍 JSON FINAL:', jsonPayload);
      console.log('🔍 JSON contém "senha"?', jsonPayload.includes('"senha"'));
      console.log('🔍 Tamanho do JSON:', jsonPayload.length);

      const res = await fetch(`${window.API_BASE}/api/cadastro`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data),
      });

      console.log('📊 Status da resposta:', res.status);
      console.log('📊 Status texto:', res.statusText);
      console.log('📊 Headers da resposta:', Object.fromEntries(res.headers.entries()));
      console.log('📊 Content-Type:', res.headers.get('content-type'));
      console.log('📊 Response OK:', res.ok);

      // Primeiro, vamos sempre tentar ler como texto para debug
      const responseText = await res.text();
      console.log('📝 Resposta completa como texto:', `"${responseText}"`);
      console.log('📝 Tamanho da resposta:', responseText.length);
      console.log('📝 Tipo da resposta:', typeof responseText);

      // Agora tentar parsear como JSON
      let responseData;
      if (responseText && responseText.length > 0) {
        try {
          responseData = JSON.parse(responseText);
          console.log('✅ Resposta parseada como JSON:', responseData);
        } catch (jsonErr) {
          console.error('❌ Erro ao parsear JSON:', jsonErr);
          console.error('❌ Texto que causou erro:', responseText);
          throw new Error(`Resposta não é JSON válido: "${responseText}"`);
        }
      } else {
        console.error('❌ Resposta vazia do servidor');
        throw new Error('Servidor retornou resposta vazia');
      }

      if (res.ok && responseData && responseData.success) {
        // Mostrar mensagem de sucesso com nome
        alert(`🎉 Parabéns, ${data.nome}!\n\nSeu cadastro foi realizado com sucesso!\n\nAgora você já pode fazer login com:\n• Nome ou Email: ${data.nome} ou ${data.email}\n• Senha: (a senha que você criou)\n\nVamos te levar para a página de login.`);
        
        // Redirecionar para página de login
        window.location.href = 'login.html';
      } else {
        const errorMsg = responseData?.message || `Erro HTTP ${res.status}: ${res.statusText}`;
        console.error('❌ Erro na resposta:', errorMsg);
        throw new Error(errorMsg);
      }
    } catch (err) {
      console.error('❌ Erro completo:', err);
      console.error('❌ Tipo do erro:', err.name);
      console.error('❌ Stack trace:', err.stack);
      
      let errorMessage = err.message;
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        errorMessage = `Erro de conexão com o servidor. Verifique se o backend está rodando em ${window.API_BASE}`;
      }
      
      alert('Falha ao enviar cadastro: ' + errorMessage);
    }
  });
}

// Mapeia plano para ID
function getPlanoId(planoValue) {
  const id = parseInt(planoValue);
  return isNaN(id) ? 0 : id;
}

// Validações (duplicadas do auth.js para compatibilidade)
function validarCPF(cpf) {
  cpf = cpf.replace(/[^\d]/g, '');
  return cpf.length === 11;
}

function validarEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validarTelefone(telefone) {
  const telefoneRegex = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;
  return telefoneRegex.test(telefone);
}

function validarSenha(senha) {
  return senha && typeof senha === 'string' && senha.length >= 6;
}

// Fechar a função initCadastro
}
