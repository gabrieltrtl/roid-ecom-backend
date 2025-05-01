const mongoose = require('mongoose');

const conditionsSchema = new mongoose.Schema({
  field: { type: String, required: true }, // Name, Price, Stock, Sku, etc...
  operator: {
    type: String,
    enum: ['equals', 'contains', 'gt', 'lt', 'gte', 'lte'],
    required: true
  },
  value: { type: mongoose.Schema.Types.Mixed, required: true }

}, { _id: false });

const ruleSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['percentage', 'fixed', 'override'],
    required: true
  },
  value: { type: Number, required: true },
  logic: {
    type: String,
    enum: ['and', 'or', 'none'],
    default: 'none'
  },
  conditions: [conditionsSchema]
}, { _id: false })

const discountRuleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String
  },
  rules: [ruleSchema],
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true }, // ✅ Produtos excluídos
}, { timestamps: true });

module.exports = mongoose.model('DiscountRule', discountRuleSchema);