const express = require('express');
const router = express.Router();
const identifyCompany = require('../middlewares/identifyCompany');

const {
  getAllShippingPolicies,
  createShippingPolicy,
  updateShippingPolicy,
  deleteShippingPolicy
} = require('../controllers/ShippingPolicyController');

// Criar política de frete
router.post('/', identifyCompany, createShippingPolicy);

// Lista todas as políticas de frete
router.get('/', identifyCompany, getAllShippingPolicies);

// Edita uma política de frete
router.put('/:id', identifyCompany, updateShippingPolicy);

// Deleta uma política de frete
router.delete('/:id', identifyCompany, deleteShippingPolicy);

module.exports = router; // 
