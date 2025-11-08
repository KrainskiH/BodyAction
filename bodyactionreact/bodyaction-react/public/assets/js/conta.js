// Gerenciamento de Conta
if (typeof window.API_BASE === 'undefined') {
    window.API_BASE = 'http://localhost:5001';
}

document.addEventListener('DOMContentLoaded', function() {
    const user = getLoggedUser();
    
    if (!user) {
        // Mostrar área de não logado
        document.getElementById('minha-conta').style.display = 'none';
        document.getElementById('area-nao-logado').style.display = 'block';
        return;
    }
    
    // Usuário logado - mostrar área da conta
    document.getElementById('minha-conta').style.display = 'block';
    document.getElementById('area-nao-logado').style.display = 'none';
    
    // Atualizar mensagem de boas-vindas
    document.getElementById('welcome-message').textContent = `Bem-vindo, ${user.Nome}!`;
    
    // Botões de ação
    document.getElementById('btn-editar-dados').addEventListener('click', function() {
        document.getElementById('form-editar').style.display = 'block';
        preencherFormularioEdicao(user);
    });
    
    document.getElementById('btn-logout').addEventListener('click', logout);
    
    document.getElementById('btn-excluir-conta').addEventListener('click', async function() {
        if (confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.')) {
            try {
                const response = await fetch(`${window.API_BASE}/api/cadastro/${user.Id}`, {
                    method: 'DELETE'
                });
                
                const result = await response.json();
                
                if (result.success) {
                    alert('Conta excluída com sucesso!');
                    logout();
                } else {
                    alert(result.message || 'Erro ao excluir conta');
                }
            } catch (error) {
                console.error('Erro ao excluir conta:', error);
                alert('Erro ao excluir conta. Tente novamente.');
            }
        }
    });
    
    document.getElementById('btn-cancelar-edit').addEventListener('click', function() {
        document.getElementById('form-editar').style.display = 'none';
    });
    
    // Form de alteração de dados
    document.getElementById('form-alterar-dados').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = {
            Nome: document.getElementById('nome-edit').value,
            Email: document.getElementById('email-edit').value,
            Telefone: document.getElementById('telefone-edit').value,
            PlanoId: parseInt(document.getElementById('plano-edit').value),
            Cpf: user.Cpf, // Manter CPF original
            DataNascimento: user.DataNascimento // Manter data original
        };
        
        // Validações
        if (!validarEmail(formData.Email)) {
            alert('Email inválido!');
            return;
        }
        
        if (!validarTelefone(formData.Telefone)) {
            alert('Telefone inválido!');
            return;
        }
        
        try {
            const response = await fetch(`${window.API_BASE}/api/cadastro/${user.Id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Atualizar dados locais
                const updatedUser = { ...user, ...formData };
                setLoggedUser(updatedUser);
                
                alert('Dados atualizados com sucesso!');
                document.getElementById('form-editar').style.display = 'none';
                document.getElementById('welcome-message').textContent = `Bem-vindo, ${formData.Nome}!`;
                updateHeader(); // Atualizar header
            } else {
                alert(result.message || 'Erro ao atualizar dados');
            }
        } catch (error) {
            console.error('Erro ao atualizar dados:', error);
            alert('Erro ao atualizar dados. Tente novamente.');
        }
    });
});

function preencherFormularioEdicao(user) {
    console.log('📝 Preenchendo formulário com dados do usuário:', user);
    
    const nomeEdit = document.getElementById('nome-edit');
    const emailEdit = document.getElementById('email-edit');
    const telefoneEdit = document.getElementById('telefone-edit');
    const planoEdit = document.getElementById('plano-edit');
    
    if (nomeEdit) {
        nomeEdit.value = user.Nome || '';
        console.log('   - Nome preenchido:', nomeEdit.value);
    }
    
    if (emailEdit) {
        emailEdit.value = user.Email || '';
        console.log('   - Email preenchido:', emailEdit.value);
    }
    
    if (telefoneEdit) {
        telefoneEdit.value = user.Telefone || '';
        console.log('   - Telefone preenchido:', telefoneEdit.value);
    }
    
    if (planoEdit) {
        planoEdit.value = user.PlanoId || '';
        console.log('   - Plano preenchido:', planoEdit.value);
    }
    
    console.log('✅ Formulário preenchido com sucesso');
}

