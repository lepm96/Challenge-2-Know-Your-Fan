const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');  // Deixe apenas esta linha
const connectDB = require('./src/config/db');

// Carregar variáveis de ambiente
dotenv.config();

// Conectar ao banco de dados
connectDB();

// Inicializar Express
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001']  // Allow frontend ports 3000 and 3001
}));

// Rotas
app.use('/api/users', require('./src/routes/userRoutes'));
app.use('/api/chat', require('./src/routes/chatRoutes'));

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'API da FURIA Fan Portal está funcionando!' });
});

// Middleware para tratamento de erros
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Endpoint não encontrado' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Erro no servidor' });
});

// Definir porta
const PORT = process.env.PORT || 5000;

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

