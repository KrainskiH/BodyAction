# 🚀 Como rodar o projeto BodyAction em outro computador

## 📦 Pré-requisitos
- Node.js instalado (versão 14 ou superior)
- Git instalado (opcional, se for clonar do GitHub)

## 🔧 Instalação

### 1. Clonar o projeto (se estiver no GitHub)
```bash
git clone https://github.com/KrainskiH/BodyAction.git
cd BodyAction/bodyactionreact/bodyaction-react
```

**OU** copiar a pasta do projeto para o outro computador

### 2. Instalar dependências
```bash
npm install
```

### 3. Instalar PM2 globalmente (para gerenciar o servidor)
```bash
npm install -g pm2
```

## ▶️ Rodando o projeto

### Opção 1: Build + PM2 (Produção - Recomendado)
```bash
# Fazer o build do React
npm run build

# Iniciar servidor com PM2
pm2 start server.js --name bodyaction

# Ver status
pm2 status

# Ver logs em tempo real
pm2 logs bodyaction

# Parar o servidor
pm2 stop bodyaction

# Reiniciar o servidor
pm2 restart bodyaction
```

### Opção 2: Modo de desenvolvimento
```bash
npm start
```

## 🌐 Acessar de outro computador na mesma rede

### 1. Descobrir o IP do computador que está rodando o servidor

**Windows:**
```cmd
ipconfig
```
Procure por "Endereço IPv4" (geralmente algo como `192.168.x.x`)

**Linux/Mac:**
```bash
ifconfig
# ou
ip addr show
```

### 2. Tornar o servidor acessível na rede (opcional)

Por padrão, o servidor escuta SOMENTE no próprio computador (host 127.0.0.1). Para permitir acesso pela rede local:

```cmd
set HOST=0.0.0.0 && pm2 restart bodyaction
```

Agora, no navegador do outro computador, digite:
```
http://192.168.x.x:5000
```
(Substitua `192.168.x.x` pelo IP que você encontrou)

### 3. Configurar firewall (se necessário)

**Windows:** Permitir a porta 5000 no firewall
1. Painel de Controle → Firewall do Windows
2. Configurações avançadas → Regras de entrada
3. Nova regra → Porta → TCP → Porta 5000 → Permitir

## 📂 Estrutura de arquivos importantes

```
bodyaction-react/
├── src/                    # Código React (desenvolvimento)
├── build/                  # Build de produção (gerado por npm run build)
├── public/                 # Arquivos estáticos (HTML, CSS, JS)
├── server.js              # Servidor Express
├── package.json           # Dependências do projeto
└── README.md              # Documentação
```

## 🔒 Segurança: isso expõe meu IP?

- O IP mostrado (ex.: `192.168.x.x`) é um IP PRIVADO da sua rede local (LAN). Ele não é acessível pela internet.
- Outros dispositivos na mesma Wi‑Fi poderão acessar enquanto o host estiver configurado como `0.0.0.0` e a porta liberada no firewall.
- Para máxima segurança, mantenha o padrão (host `127.0.0.1`) quando NÃO precisar compartilhar na rede local.
- Seu projeto serve conteúdo estático e um endpoint de mock (`/api/produtos`), sem dados sensíveis.
- Para publicação na internet, use HTTPS atrás de um proxy (Nginx/Cloudflare) e considere autenticação/rate limit.

## 🔄 Atualizando o projeto

Se você fizer alterações no código:

1. **Alterações no React (src/):**
```bash
npm run build
pm2 restart bodyaction
```

2. **Alterações nos arquivos públicos (public/):**
```bash
npm run build
pm2 restart bodyaction
```

3. **Alterações no server.js:**
```bash
pm2 restart bodyaction
```

## 🐛 Resolução de problemas

### O servidor não inicia
- Verifique se a porta 5000 não está em uso
- Rode `pm2 logs bodyaction` para ver os erros

### Não consigo acessar de outro computador
- Verifique se ambos estão na mesma rede Wi-Fi
- Desative temporariamente o firewall para testar
- Confirme que o IP está correto com `ipconfig`

### Erro ao fazer build
- Delete a pasta `node_modules` e `package-lock.json`
- Rode `npm install` novamente
- Tente `npm run build` novamente

## 📝 Comandos úteis do PM2

```bash
pm2 list                    # Listar todos os processos
pm2 logs bodyaction         # Ver logs em tempo real
pm2 stop bodyaction         # Parar o servidor
pm2 restart bodyaction      # Reiniciar o servidor
pm2 delete bodyaction       # Remover do PM2
pm2 save                    # Salvar lista de processos
pm2 startup                 # Configurar PM2 para iniciar com o sistema
```

## 🎯 Porta padrão

O servidor roda na porta **5000** por padrão. Para mudar:

```bash
PORT=3000 pm2 start server.js --name bodyaction
```

## 📱 Testar no celular

Se o celular estiver na mesma rede Wi-Fi, acesse:
```
http://192.168.x.x:5000
```

---

**Desenvolvido por:** Henrique Krainski
**Repositório:** https://github.com/KrainskiH/BodyAction
