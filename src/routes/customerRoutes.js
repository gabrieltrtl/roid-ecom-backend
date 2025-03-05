const express = require('express');
const router = express.Router();
const { 
  createCustomer,
  getAllCustomers, 
  getCustomerById,
  updateCustomer,
  deleteCustomer, 
  getCustomersByIds
} = require('../controllers/customerController');

// Rota para criar um cliente
router.post('/customers', createCustomer);

// Rota para listar todos os clientes
router.get('/customers', getAllCustomers);

// Rota para buscar um cliente pelo ID
router.get('/customers/:id', getCustomerById);

// Rota pra buscar vários clientes pelos ids
router.get('/customers/multiple/:ids', getCustomersByIds);

// Rota para atualizar os dados de um cliente
router.put('/customers/:id', updateCustomer);

// Rota para deletar um cliente
router.delete('/customers/:id', deleteCustomer);

module.exports = router;