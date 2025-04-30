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
const trackingRoutes = require('./routes/trackingRoutes');
const discountRulesRoutes = require('./routes/discountRulesRoutes');
const companyRoutes = require('./routes/companyRoutes');
const shippingPoliciesRoutes = require('./routes/shippingPoliciesRoutes');

const app = express();

// Conectar ao MongoDB
conectarDB();

// Middlewares 
app.use(cors({
  origin: 'http://localhost:5173', // ou use process.env.FRONTEND_URL se preferir
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'tracking-id'],
  credentials: true,
}));



// Adicionar este middleware para garantir que OPTIONS seja tratado antes de todas as rotas
app.options('*', (req, res) => {
  console.log("❓ Preflight OPTIONS recebido: ", req.headers); 
  res.setHeader('Access-Control-Allow-Origin', '*'); // Substitua '*' pelo seu domínio específico
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.status(204).end(); // 204 é o status adequado para resposta OPTIONS
});


app.use(express.json());

// Rota de Teste
app.get('/', (req, res) => {
  res.send('Api Rodando!')
});


// Usando as rotas
app.use('/api/companies', companyRoutes);
app.use('/api/customers', customerRoutes);  // Integrando as rotas de clientes
app.use('/api/orders', orderRoutes); // Integrando as rotas de pedidos
app.use('/api/products', productRoutes);  // Usa as rotas de produtos sob o prefixo /api
app.use('/api/users', userRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/discounts', discountRulesRoutes);
app.use('/api/shipping', shippingPoliciesRoutes);


// Iniciar o Servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});