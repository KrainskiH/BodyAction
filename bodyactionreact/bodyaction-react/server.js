const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

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

app.listen(port, () => {
  console.log(`BodyAction production server listening on port ${port}`);
});
