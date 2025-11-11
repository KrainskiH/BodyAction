// Debug específico para login
console.log('🔄 login-debug.js carregado');

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔍 === DEBUG LOGIN INICIADO ===');
    
    // Verificar se todos os elementos existem
    const form = document.getElementById('form-login');
    const identificador = document.getElementById('identificador-login');
    const senha = document.getElementById('senha-login');
    
    console.log('Formulário de login encontrado:', !!form);
    console.log('Campo identificador encontrado:', !!identificador);
    console.log('Campo senha encontrado:', !!senha);
    
    if (form) {
        console.log('✅ Adicionando listener ao formulário de login');
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('🎯 === LOGIN SUBMIT DISPARADO ===');
            
            const identificadorValue = identificador?.value;
            const senhaValue = senha?.value;
            
            console.log('Dados capturados:');
            console.log('   - Identificador:', `"${identificadorValue}"`);
            console.log('   - Senha:', senhaValue ? '***' : 'VAZIO');
            
            // Testar se os campos têm valor
            if (!identificadorValue) {
                console.log('❌ Campo identificador vazio!');
                alert('Campo identificador está vazio!');
                return;
            }
            
            if (!senhaValue) {
                console.log('❌ Campo senha vazio!');
                alert('Campo senha está vazio!');
                return;
            }
            
            // Determinar se é email ou nome
            const isEmail = identificadorValue.includes('@');
            console.log('É email?', isEmail);
            
            const loginData = {
                Identificador: identificadorValue,
                Email: isEmail ? identificadorValue : '',
                Nome: !isEmail ? identificadorValue : '',
                Senha: senhaValue
            };
            
            console.log('Objeto de login criado:', {
                ...loginData,
                Senha: '***'
            });
            
            // Testar envio para API
            console.log('📤 Enviando para API...');
            
            fetch('http://localhost:5001/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            })
            .then(response => {
                console.log('📥 Resposta recebida:', response.status, response.statusText);
                return response.json();
            })
            .then(result => {
                console.log('📄 Resultado do login:', result);
                
                if (result.success) {
                    console.log('✅ Login bem-sucedido!');
                    alert(`✅ Login bem-sucedido! Bem-vindo, ${result.usuario?.Nome}!`);
                    
                    // Salvar no localStorage
                    localStorage.setItem('bodyaction_user', JSON.stringify(result.usuario));
                    
                    // Redirecionar
                    window.location.href = '/';
                } else {
                    console.log('❌ Login falhou:', result.message);
                    alert(`❌ Login falhou: ${result.message}`);
                }
            })
            .catch(error => {
                console.error('❌ Erro na requisição:', error);
                alert(`❌ Erro na conexão: ${error.message}`);
            });
        });
    } else {
        console.error('❌ Formulário de login NÃO encontrado!');
    }
});