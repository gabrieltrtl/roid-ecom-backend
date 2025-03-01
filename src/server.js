const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');
const cron = require('node-cron');
const cleanOldTemporaryOrders = require('./utils/cleanTemporaryOrders');
require('dotenv').config();
const customerRoutes = require('./routes/customerRoutes'); // Importando rotas de clientes
const orderRoutes = require('./routes/orderRoutes'); // Importando rotas de pedidos
const productRoutes = require('./routes/productRoutes'); // Importando rotas de produtos
const userRoutes = require('./routes/userRoutes');

const app = express();

// Conectar ao MongoDB
conectarDB();

// ✅ Agendar a limpeza de pedidos temporários
cron.schedule('0 0 * * *', async () => {
  console.log('🕛 Iniciando limpeza de pedidos temporários...');
  await cleanOldTemporaryOrders();
});

// Middlewares 
app.use(express.json());
app.use(cors());

// Rota de Teste
app.get('/', (req, res) => {
  res.send('Api Rodando!')
});

// Usando as rotas
app.use('/api', customerRoutes);  // Integrando as rotas de clientes
app.use('/api', orderRoutes); // Integrando as rotas de pedidos
app.use('/api', productRoutes);  // Usa as rotas de produtos sob o prefixo /api
app.use('/api', userRoutes);

// Iniciar o Servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});