const express = require('express');
const router = express.Router();
const identifyCompany = require('../middlewares/identifyCompany');

const {
  getAllShippingPolicies,
  createShippingPolicy,
  updateShippingPolicy,
  deleteShippingPolicy
} = require('../controllers/ShippingPolicyController');

router.get('/', identifyCompany, getAllShippingPolicies);
router.post('/', identifyCompany, createShippingPolicy);
router.put('/:id', identifyCompany, updateShippingPolicy);
router.delete('/:id', identifyCompany, deleteShippingPolicy);

module.exports = router; // ✅ importante!
