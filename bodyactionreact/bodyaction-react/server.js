const express = require('express');
const path = require('path');
const helmet = require('helmet');
const { createProxyMiddleware } = require('http-proxy-middleware');
const compression = require('compression');

const app = express();
const port = process.env.PORT || 5000;
const host = process.env.HOST || '127.0.0.1'; // por padrão, somente máquina local
const apiPort = process.env.API_PORT || 5001; // porta da API C#

// Segurança básica com headers (relaxar CSP para permitir API)
app.use(helmet({
  contentSecurityPolicy: false, // Desabilitar CSP para permitir requests à API
}));

// Compressão gzip para respostas (HTML/CSS/JS/JSON)
app.use(compression());

// Proxy para API C# - todas as rotas /api/* vão para http://localhost:5001
app.use('/api', createProxyMiddleware({
  target: `http://localhost:${apiPort}`,
  changeOrigin: true,
  pathRewrite: {
    '^/api': '', // remove /api do caminho ao encaminhar para a API
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[Proxy] ${req.method} ${req.url} -> http://localhost:${apiPort}${req.url.replace('/api', '')}`);
  },
  onError: (err, req, res) => {
    console.error('[Proxy Error]', err.message);
    res.status(502).json({ 
      error: 'API C# não está disponível',
      message: 'Certifique-se que a API está rodando em http://localhost:' + apiPort,
      hint: 'Execute: dotnet run --urls http://localhost:' + apiPort
    });
  }
}));

// Serve specific mock API endpoints from build/api if present
app.get('/api/produtos', (req, res) => {
  const file = path.join(__dirname, 'build', 'api', 'produtos.json');
  res.sendFile(file, (err) => {
    if (err) {
      // If the file is not found or other error, return a useful message
      console.error('Erro ao enviar produtos.json:', err && err.message);
      return res.status(500).json({ error: 'Erro ao carregar produtos' });
    }
  });
});

// Serve static files from the build directory com cache inteligente
app.use(express.static(path.join(__dirname, 'build'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    } else {
      // 7 dias para assets, com immutable
      res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
    }
  }
}));

// For SPA, serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, host, () => {
  console.log(`\n========================================`);
  console.log(`  BodyAction - Servidor Unificado`);
  console.log(`========================================`);
  console.log(`  Frontend: http://${host}:${port}`);
  console.log(`  API Proxy: http://${host}:${port}/api/*`);
  console.log(`  -> Encaminha para: http://localhost:${apiPort}`);
  console.log(`========================================\n`);
  
  if (host === '0.0.0.0') {
    console.log(`Disponível na rede local via http://<SEU_IP_LOCAL>:${port}`);
  } else {
    console.log('Apenas acessível localmente (localhost).');
    console.log('Defina HOST=0.0.0.0 para permitir acesso na rede.\n');
  }
  
  console.log('⚠️  IMPORTANTE: Certifique-se que a API C# está rodando:');
  console.log(`   dotnet run --urls http://localhost:${apiPort}\n`);
});
