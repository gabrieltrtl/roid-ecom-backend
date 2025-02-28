const mongoose = require('mongoose');


const OrderSchema = new mongoose.Schema({
  customer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Customer', 
    required: true 
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
    required: true 
  }, // Tipo de frete
  isTemporary: { type: Boolean, required: false }, 
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
