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
  }, // Status do pedido
  paymentMethod: { 
    type: String, 
    enum: ['pix', 'cartao', 'dinheiro'], 
    required: true 
  }, // Forma de pagamento
  paymentStatus: { 
    type: String, 
    enum: ['pendente', 'confirmado', 'falhou'], 
    default: 'pendente' 
  }, // Status do pagamento
  shippingType: { 
    type: String, 
    enum: ['standard', 'expresso', 'grátis'], 
    required: true 
  }, // Tipo de frete
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
