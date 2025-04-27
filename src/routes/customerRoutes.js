const express = require('express');
const router = express.Router();
const identifyCompany = require('../middlewares/identifyCompany')
const { 
  createCustomer,
  getAllCustomers, 
  getCustomerById,
  updateCustomer,
  deleteCustomer, 
  getCustomersByIds,
  getCustomerByCpf
} = require('../controllers/customerController');

// Rota para criar um cliente
router.post('/', identifyCompany, createCustomer);

// Rota para listar todos os clientes
router.get('/', identifyCompany, getAllCustomers);

// Rota para buscar cliente por CPF
router.get('/cpf/:cpf', identifyCompany, getCustomerByCpf); // ✅ ESTA LINHA!

// Rota para buscar um cliente pelo ID
router.get('/:id', identifyCompany, getCustomerById);

// Rota pra buscar vários clientes pelos ids
router.get('/multiple/:ids', identifyCompany, getCustomersByIds);

// Rota para atualizar os dados de um cliente
router.put('/:id', identifyCompany, updateCustomer);

// Rota para deletar um cliente
router.delete('/:id', identifyCompany, deleteCustomer);


module.exports = router;