const express = require('express');
const router = express.Router();
const { createDiscountRule, getDiscountRules, getDiscountRuleById, updateDiscountRule, deleteDiscountRule } = require('../controllers/discountRulesController')

// Criar uma nova regra de desconto
router.post('/discounts', createDiscountRule);

// Listar todas as regras de desconto
router.get('/discounts', getDiscountRules);

// Listar uma regra pelo ID
router.get('/discounts/:id', getDiscountRuleById);

// Atualizar uma regra de desconto
router.put('/discounts/:id', updateDiscountRule);

// Deletar uma regra de desconto
router.delete('/discounts/:id', deleteDiscountRule);

module.exports = router;