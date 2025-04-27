const express = require('express');
const router = express.Router();
const identifyCompany = require('../middlewares/identifyCompany');
const { createDiscountRule, getDiscountRules, getDiscountRuleById, updateDiscountRule, deleteDiscountRule } = require('../controllers/discountRulesController')

// Criar uma nova regra de desconto
router.post('/', identifyCompany, createDiscountRule);

// Listar todas as regras de desconto
router.get('/', identifyCompany, getDiscountRules);

// Listar uma regra pelo ID
router.get('/:id', identifyCompany, getDiscountRuleById);

// Atualizar uma regra de desconto
router.put('/:id', identifyCompany, updateDiscountRule);

// Deletar uma regra de desconto
router.delete('/:id', identifyCompany, deleteDiscountRule);

module.exports = router;