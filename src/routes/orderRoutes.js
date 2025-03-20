const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  createTemporaryOrder,
  confirmOrder,
  getAverageTimeBetweenPurchases,
  getOrderStatuses
} = require('../controllers/orderController');

// Rota para criar pedido
router.post('/orders', createOrder);     

router.get('/orders/average-time-between-purchases', getAverageTimeBetweenPurchases)

// Rota para criar pedido temporário
router.post('/orders/temporary', createTemporaryOrder);

router.put("/orders/confirm/:orderId", confirmOrder);

// Listar todos os pedidos
router.get('/orders', getOrders);       

// Listar status disponíveis para pedidos
router.get('/orders/statuses', getOrderStatuses);

// Obter pedido específico
router.get('/orders/:id', getOrderById);     

// Atualizar status do pedido
router.put('/orders/:id', updateOrderStatus); 

// Deletar pedido
router.delete('/orders/:id', deleteOrder);   


module.exports = router;