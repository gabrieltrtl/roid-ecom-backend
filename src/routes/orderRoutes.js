const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  createTemporaryOrder
} = require('../controllers/orderController');

// Rota para criar pedido
router.post('/orders', createOrder);     

// Rota para criar pedido temporário
router.post('/orders/temporary', createTemporaryOrder);

// Listar todos os pedidos
router.get('/orders', getOrders);       

// Obter pedido específico
router.get('/orders/:id', getOrderById);     

// Atualizar status do pedido
router.put('/orders/:id', updateOrderStatus); 

// Deletar pedido
router.delete('/orders/:id', deleteOrder);   



module.exports = router;