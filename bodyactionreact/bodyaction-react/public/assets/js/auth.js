// Sistema de Autenticação
const AUTH_KEY = 'bodyaction_user';
// Usar API_BASE global ou definir se não existir
if (typeof window.API_BASE === 'undefined') {
    window.API_BASE = 'http://localhost:5001';
}

// Verificar se usuário está logado
function isLoggedIn() {
    return localStorage.getItem(AUTH_KEY) !== null;
}

// Obter dados do usuário logado
function getLoggedUser() {
    const userData = localStorage.getItem(AUTH_KEY);
    return userData ? JSON.parse(userData) : null;
}

// Salvar dados do usuário
function setLoggedUser(userData) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
}

// Fazer logout
function logout() {
    localStorage.removeItem(AUTH_KEY);
    window.location.href = '/';
}

// Validar CPF (básico)
function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, '');
    return cpf.length === 11;
}

// Validar Email
function validarEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validar Telefone
function validarTelefone(telefone) {
    const telefoneRegex = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;
    return telefoneRegex.test(telefone);
}

// Atualizar header com informações do usuário
function updateHeader() {
    const user = getLoggedUser();
    const headerSlot = document.getElementById('header-slot');
    
    if (!headerSlot) return;
    
    // Limpar header anterior
    headerSlot.innerHTML = '';
    
    if (user) {
        // Usuário logado - mostrar boas-vindas
        const welcomeDiv = document.createElement('div');
        welcomeDiv.innerHTML = `
            <div class="user-header-bar">
                <div>
                    <div class="user-info">
                        <span class="user-name">✨ Olá, ${user.Nome}!</span>
                        <span class="user-email">📧 ${user.Email}</span>
                    </div>
                    <div class="user-actions">
                        <a href="/pages/conta.html">👤 Minha Conta</a>
                        <button onclick="logout()">🚪 Sair</button>
                    </div>
                </div>
            </div>
        `;
        headerSlot.appendChild(welcomeDiv);
    } else {
        // Usuário não logado - mostrar opções de login
        const loginDiv = document.createElement('div');
        loginDiv.innerHTML = `
            <div class="guest-header-bar">
                <div>
                    <span>🏠 Acesse sua conta:</span>
                    <div class="guest-actions">
                        <a href="/pages/login.html">🔑 Login</a>
                        <a href="/pages/cadastro.html">➕ Cadastrar</a>
                    </div>
                </div>
            </div>
        `;
        headerSlot.appendChild(loginDiv);
    }
}



// Form de Login
document.addEventListener('DOMContentLoaded', function() {
    // Atualizar header
    updateHeader();
    
    // Verificar mudanças no localStorage (para atualizar header em tempo real)
    window.addEventListener('storage', function(e) {
        if (e.key === AUTH_KEY) {
            updateHeader();
        }
    });
    
    // Atualizar header quando usuário faz login na mesma aba
    window.addEventListener('userLogin', function() {
        updateHeader();
    });
    
    const formLogin = document.getElementById('form-login');
    
    if (formLogin) {
        formLogin.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const identificador = document.getElementById('identificador-login').value;
            const senha = document.getElementById('senha-login').value;
            
            console.log('Tentativa de login:', { identificador, senha: senha ? '***' : 'vazio' });
            
            // Validações
            let hasError = false;
            
            if (!identificador || identificador.trim().length < 2) {
                document.getElementById('identificador-erro-login').style.display = 'block';
                hasError = true;
            } else {
                document.getElementById('identificador-erro-login').style.display = 'none';
            }
            
            if (!senha || senha.length < 6) {
                document.getElementById('senha-erro-login').style.display = 'block';
                hasError = true;
            } else {
                document.getElementById('senha-erro-login').style.display = 'none';
            }
            
            if (hasError) return;
            
            try {
                const response = await fetch(`${window.API_BASE}/api/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        Identificador: identificador, 
                        Email: validarEmail(identificador) ? identificador : '',
                        Nome: !validarEmail(identificador) ? identificador : '',
                        Senha: senha 
                    })
                });
                
                console.log('Status da resposta:', response.status);
                
                let result;
                const contentType = response.headers.get('content-type');
                
                if (contentType && contentType.includes('application/json')) {
                    result = await response.json();
                    console.log('Resposta do login:', result);
                } else {
                    const textResponse = await response.text();
                    console.error('Resposta não-JSON:', textResponse);
                    throw new Error('Resposta inválida do servidor');
                }
                
                if (result.success) {
                    // Backend pode retornar em result.usuario ou result.data
                    const loginUserData = result.usuario || result.data || result;
                    setLoggedUser(loginUserData);
                    
                    // Disparar evento personalizado para atualizar header
                    window.dispatchEvent(new CustomEvent('userLogin'));
                    
                    // Esconder gateway se estiver visível
                    if (typeof window.hideGatewayOnLogin === 'function') {
                        window.hideGatewayOnLogin();
                    }
                    
                    alert(`🎉 Bem-vindo de volta, ${loginUserData.Nome || loginUserData.nome}!\n\nLogin realizado com sucesso!`);
                    
                    // Redirecionar para a área do usuário após o login
                    setTimeout(() => {
                        window.location.href = '/pages/conta.html';
                    }, 1000);
                } else {
                    alert('❌ ' + (result.message || 'Erro no login'));
                }
            } catch (error) {
                console.error('Erro completo no login:', error);
                alert('❌ Erro ao fazer login: ' + error.message);
            }
        });
    }
});

// Verificar se já está logado ao carregar páginas
if (window.location.pathname.includes('login.html') && isLoggedIn()) {
    window.location.href = '/pages/conta.html';
}

// Redirecionar páginas protegidas
if (window.location.pathname.includes('conta.html') && !isLoggedIn()) {
    window.location.href = '/pages/login.html';
}