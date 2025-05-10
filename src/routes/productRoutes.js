const express = require('express');
const router = express.Router();
const identifyCompany = require('../middlewares/identifyCompany');
const authMiddleware = require('../middlewares/authMiddleware');
const { 
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct, 
  deleteProduct,
  addProductToStock,
  removeProductFromStock
} = require('../controllers/productController');

// Rota para criar um produto
router.post('/', identifyCompany, createProduct);

// Rota para listar todos os produtos
router.get('/', identifyCompany, getAllProducts);

// Rota para buscar um produto pelo ID
router.get('/:id', identifyCompany, getProductById);

// Rota para atualizar um produto
router.put('/:id', identifyCompany, updateProduct);

// Rota para remover um produto do estoque
router.post('/stock/remove', authMiddleware, removeProductFromStock);

// Rota para adicionar um produto no estoque
router.post('/stock/add', authMiddleware, addProductToStock);

// Rota para deletar um produto
router.delete('/:id', identifyCompany, deleteProduct);

module.exports = router;
