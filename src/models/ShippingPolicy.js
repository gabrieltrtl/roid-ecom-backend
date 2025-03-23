const mongoose = require('mongoose');

const shippingPolicySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true // ✅ Garante que toda política de frete esteja vinculada a uma empresa
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ShippingPolicy', shippingPolicySchema); 



