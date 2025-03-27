const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');
const cron = require('node-cron');
const cleanOldTemporaryOrders = require('./utils/cleanTemporaryOrders');
require('dotenv').config();
const identifyCompany = require('./middlewares/identifyCompany');
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
app.use(express.json());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || /.*\.bulkcrm\.com$/.test(origin)) {
      callback(null, true); // Permite a requisição
    } else {
      callback(new Error('Not allowed by CORS')); // Bloqueia requisição de domínios não permitidos
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Adiciona OPTIONS
  allowedHeaders: ['Content-Type', 'Authorization'], // Permite os cabeçalhos necessários
  credentials: true,
}));

app.options('*', cors());


// Rota de Teste
app.get('/', (req, res) => {
  res.send('Api Rodando!')
});

app.use('/companies', companyRoutes);

app.use(identifyCompany);

// Usando as rotas
app.use('/api', customerRoutes);  // Integrando as rotas de clientes
app.use('/api', orderRoutes); // Integrando as rotas de pedidos
app.use('/api', productRoutes);  // Usa as rotas de produtos sob o prefixo /api
app.use('/api', userRoutes);
app.use('/api', trackingRoutes);
app.use('/api', discountRulesRoutes);
app.use('/api', shippingPoliciesRoutes);


// Iniciar o Servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});