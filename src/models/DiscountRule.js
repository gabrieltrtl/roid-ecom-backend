const mongoose = require('mongoose');

const discountRuleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String
  },
  type: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  includedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], // ✅ Produtos incluídos
  excludedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true }, // ✅ Produtos excluídos
}, { timestamps: true });

module.exports = mongoose.model('DiscountRule', discountRuleSchema);