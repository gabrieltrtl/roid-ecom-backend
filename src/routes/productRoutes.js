const express = require('express');
const router = express.Router();
const { 
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct, 
  deleteProduct
} = require('../controllers/productController');

// Rota para criar um produto
router.post('/products', createProduct);

// Rota para listar todos os produtos
router.get('/products', getAllProducts);

// Rota para buscar um produto pelo ID
router.get('/products/:id', getProductById);

// Rota para atualizar um produto
router.put('/products/:id', updateProduct);

// Rota para deletar um produto
router.delete('/products/:id', deleteProduct);

module.exports = router;
