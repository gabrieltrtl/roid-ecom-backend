const mongoose = require('mongoose');
const { customAlphabet } = require('nanoid');

const generateOrderId = customAlphabet('0123456789', 6);

const OrderSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  orderId: {
    type: String,
    unique: true,
    required: true,
    default: () => generateOrderId(), // Gera o ID aleatório automaticamente
  },
  customer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Customer', 
    required: function() {
      return !this.isTemporary; // 🔥 Só será obrigatório se `isTemporary` for false
    } 
  }, // Cliente que fez o pedido
  products: [
    {
      product: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', 
        required: true 
      }, // Produto comprado
      quantity: { 
        type: Number, 
        required: true, 
        min: 1 
      }, // Quantidade do produto comprado
    }
  ],
  discountRule: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DiscountRule', // ✅ Referência para o model DiscountRule
    default: null,
  },
  totalPrice: { 
    type: Number, 
    required: true 
  }, // Total da compra
  status: { 
    type: String, 
    enum: ['pendente', 'pago', 'enviado', 'cancelado'], 
    default: 'pendente' 
  },
  shippingType: { 
    type: String, 
    enum: ['standard', 'expresso', 'grátis'], 
  }, // Tipo de frete
  isTemporary: { type: Boolean, required: false }, 
  trackingId: { type: String, default: null }, // 🔹 Garante que trackingId pode ser salvo
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
