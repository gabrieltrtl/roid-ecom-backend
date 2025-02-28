const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder
} = require('../controllers/orderController');

// Rota para criar pedido
router.post('/orders', createOrder);     

// Listar todos os pedidos
router.get('/orders', getOrders);       

// Obter pedido específico
router.get('/orders/:id', getOrderById);     

// Atualizar status do pedido
router.put('/orders/:id', updateOrderStatus); 

// Deletar pedido
router.delete('/orders/:id', deleteOrder);   

module.exports = router;