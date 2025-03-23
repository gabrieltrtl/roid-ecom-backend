const express = require('express');
const router = express.Router();

const {
  getAllShippingPolicies,
  createShippingPolicy,
  updateShippingPolicy,
  deleteShippingPolicy
} = require('../controllers/ShippingPolicyController');

router.get('/shipping', getAllShippingPolicies);
router.post('/shipping', createShippingPolicy);
router.put('/shipping/:id', updateShippingPolicy);
router.delete('/shipping/:id', deleteShippingPolicy);

module.exports = router; // ✅ importante!
