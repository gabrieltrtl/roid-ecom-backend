const mongoose = require('mongoose');
const Order = require('./Order');
const { customAlphabet } = require('nanoid');
require('dotenv').config();

// Conecte-se ao MongoDB
mongoose.connect(process.env.MONGO_URI);

// Função para gerar um ID aleatório de 6 caracteres
const generateOrderId = customAlphabet('0123456789', 6);

const updateOrderIds = async () => {
  try {
    const orders = await Order.find();

    for (const order of orders) {
      order.orderId = generateOrderId(); // Atualiza o ID
      await order.save(); // Salva a alteração
    }

    console.log('Todos os pedidos foram atualizados com novos orderId!');
    mongoose.disconnect();
  } catch (error) {
    console.error('Erro ao atualizar pedidos:', error);
    mongoose.disconnect();
  }
};

updateOrderIds();
