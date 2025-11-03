const express = require('express');
const path = require('path');
const helmet = require('helmet');

const app = express();
const port = process.env.PORT || 5000;
const host = process.env.HOST || '127.0.0.1'; // por padrão, somente máquina local

// Segurança básica com headers
app.use(helmet());

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

// Serve static files from the build directory
app.use(express.static(path.join(__dirname, 'build')));

// For SPA, serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, host, () => {
  console.log(`BodyAction server escutando em http://${host}:${port}`);
  if (host === '0.0.0.0') {
    console.log(`Disponível na rede local via http://<SEU_IP_LOCAL>:${port}`);
  } else {
    console.log('Apenas acessível localmente (localhost). Defina HOST=0.0.0.0 para permitir na rede.');
  }
});
