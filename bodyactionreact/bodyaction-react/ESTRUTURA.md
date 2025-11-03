# BodyAction - Estrutura do Projeto

## 📁 Estrutura de Pastas Organizada

```
bodyaction-react/
│
├── public/                      # Arquivos estáticos (copiados para build/)
│   ├── assets/                  # Recursos compartilhados
│   │   ├── css/                 # CSS para páginas HTML estáticas (MODULAR)
│   │   │   ├── main.css         # Importa todos os módulos CSS
│   │   │   ├── base/            # Estilos base
│   │   │   │   ├── reset.css    # Reset CSS
│   │   │   │   ├── variables.css # Variáveis globais
│   │   │   │   └── typography.css # Tipografia
│   │   │   ├── layout/          # Estilos de layout
│   │   │   │   ├── header.css   # Cabeçalho e navegação
│   │   │   │   └── footer.css   # Rodapé
│   │   │   ├── components/      # Componentes reutilizáveis
│   │   │   │   ├── preloader.css # Animação de carregamento
│   │   │   │   └── map.css      # Estilos do mapa
│   │   │   └── pages/           # Estilos específicos de página
│   │   │       ├── contato.css  # Página de contato
│   │   │       ├── sobre.css    # Página sobre
│   │   │       ├── planos.css   # Página de planos
│   │   │       └── services.css # Página de serviços
│   │   │
│   │   └── js/                  # Scripts para páginas HTML estáticas
│   │       ├── main.js          # Script principal (header scroll, carousel, mapa)
│   │       ├── footer.js        # Injeta footer.html em todas as páginas
│   │       └── contato.js       # Validação do formulário de contato
│   │
│   ├── includes/                # Componentes HTML reutilizáveis
│   │   ├── footer.html          # Rodapé compartilhado
│   │   └── template.html        # Template base (referência)
│   │
│   └── pages/                   # Páginas HTML estáticas
│       ├── contato.html         # Página de contato
│       ├── sobre.html           # (futuro)
│       ├── planos.html          # (futuro)
│       └── services.html        # (futuro)
│
├── src/                         # Código React/TypeScript
│   ├── components/              # Componentes React
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── ContactForm.tsx
│   │   └── ...
│   │
│   ├── styles/                  # CSS usado pelo React (processado pelo bundler)
│   │   ├── main.css             # Importações dos módulos
│   │   ├── base/
│   │   ├── layout/
│   │   ├── components/
│   │   └── pages/
│   │
│   ├── App.tsx                  # Componente principal React
│   └── index.tsx                # Entry point React
│
├── build/                       # Build de produção (gerado automaticamente)
│   ├── assets/                  # Cópia de public/assets/
│   ├── includes/                # Cópia de public/includes/
│   ├── pages/                   # Cópia de public/pages/
│   ├── static/                  # Assets do React (JS/CSS bundleados)
│   └── index.html               # SPA React
│
├── server.js                    # Servidor Express para produção
├── package.json
└── README.md
```

## 🎯 Como Funciona

### Para React/TypeScript (SPA)
- Código em `src/`
- CSS em `src/styles/` (processado pelo Webpack)
- Build gera `build/static/` com JS/CSS otimizados
- Acesso via `/` (raiz do site)

### Para Páginas HTML Estáticas
- Páginas em `public/pages/`
- CSS em `public/assets/css/`
- JS em `public/assets/js/`
- Acesso via `/pages/contato.html`, `/pages/sobre.html`, etc.

### Footer Compartilhado
- Arquivo: `public/includes/footer.html`
- Injetado automaticamente via `assets/js/footer.js`
- Adicione `<div id="footer-slot"></div>` antes do `</body>` em cada página HTML

## 🚀 Comandos

```bash
# Desenvolvimento
npm start                    # Inicia dev server (React) em http://localhost:3000

# Produção
npm run build               # Gera build em build/
npm run start:prod          # Serve build/ com 'serve'
node server.js              # Serve build/ com Express

# PM2 (produção persistente)
pm2 start server.js --name bodyaction
pm2 restart bodyaction
pm2 logs bodyaction
pm2 save
```

## 📝 Adicionando Nova Página HTML

1. Crie a página em `public/pages/nome.html`
2. Use esta estrutura base:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BodyAction | Título da Página</title>
  
  <link rel="icon" type="image/png" href="/assets/img/bodyaction_logo.png">
  <link rel="stylesheet" href="/assets/css/main.css">
  <link rel="stylesheet" href="/assets/css/layout/header.css">
  <link rel="stylesheet" href="/assets/css/layout/footer.css">
  <link rel="stylesheet" href="/assets/css/pages/sua-pagina.css">
  
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet">
</head>
<body>
  <div id="preloader">
    <img src="/assets/img/bodyaction_logo.png" alt="Body Action" class="loader-logo">
    <div class="loader"></div>
    <div class="loader-text">CARREGANDO</div>
  </div>

  <header>
    <!-- Copie o header de contato.html -->
  </header>

  <main>
    <!-- Seu conteúdo aqui -->
  </main>

  <div id="footer-slot"></div>

  <script src="/assets/js/footer.js"></script>
  <script src="/assets/js/main.js"></script>
</body>
</html>
```

3. Crie CSS específico em `public/assets/css/pages/sua-pagina.css` (se necessário)
4. Execute `npm run build` para atualizar `build/`
5. Reinicie o servidor: `pm2 restart bodyaction`

## ✅ Benefícios da Nova Estrutura

- ✅ **Sem duplicação**: Um lugar para cada tipo de arquivo
- ✅ **React e HTML convivem**: Cada um usa seus próprios assets
- ✅ **Footer automático**: Incluído via JS em todas as páginas
- ✅ **Organização clara**: CSS separado por tipo (layout, pages, components)
- ✅ **Fácil manutenção**: Mudanças no footer refletem em todas as páginas
- ✅ **Build otimizado**: CRA copia public/ automaticamente para build/

## 🔧 Manutenção

### Atualizar Footer
- Edite `public/includes/footer.html`
- Execute `npm run build`
- Reinicie: `pm2 restart bodyaction`

### Atualizar CSS Global
- Edite `public/assets/css/main.css`
- Execute `npm run build`
- Reinicie: `pm2 restart bodyaction`

### Atualizar React
- Edite arquivos em `src/`
- Execute `npm run build`
- Reinicie: `pm2 restart bodyaction`

---

**Nota**: A pasta `build/` é gerada automaticamente. Não edite arquivos dentro dela diretamente!
