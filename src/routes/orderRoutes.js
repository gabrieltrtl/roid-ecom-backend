const express = require('express');
const router = express.Router();
const identifyCompany = require('../middlewares/identifyCompany');
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  createTemporaryOrder,
  confirmOrder,
  getAverageTimeBetweenPurchases,
  getOrderStatuses,
  updateTrackingCode,
  cancelOrder,
  updateConfirmedOrdersStatus
} = require('../controllers/orderController');

// Rota para criar pedido
router.post('/', identifyCompany, createOrder);     

// Rota para criar pedido temporário
router.post('/temporary', identifyCompany, createTemporaryOrder);

// Rota para confirmar pedido
router.put('/confirm/:orderId', confirmOrder);

// Listar todos os pedidos
router.get('/', identifyCompany, getOrders);       

// Listar status disponíveis para pedidos
router.get('/statuses', identifyCompany, getOrderStatuses);

// Obter pedido específico
router.get('/:id', getOrderById);     

// Atualizar status do pedido
router.put('/:id', identifyCompany, updateOrderStatus); 

// Atualizar código de rastreio
router.patch('/:id/tracking-code', identifyCompany, updateTrackingCode); 

// Atualizar pedido de confirmado para 'EM PROCESSAMENTO' (EM lotes).
router.put("/update-status/processing", identifyCompany, updateConfirmedOrdersStatus);

// Deletar pedido
router.delete('/:id', identifyCompany, deleteOrder);  

// Cancelar pedido
router.put('/cancel/:id', identifyCompany, cancelOrder);

// Tempo médio entre compras
router.get('/average-time-between-purchases', identifyCompany, getAverageTimeBetweenPurchases);

module.exports = router;