const express = require('express');
const router = express.Router();
const identifyCompany = require('../middlewares/identifyCompany');
const { 
  loginUser,
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/userController');

// Rota para login de usuário
router.post('/login', loginUser);

// Rota para criar um usuário
router.post('/', identifyCompany, createUser);

// Rota para listar todos os usuários
router.get('/', identifyCompany, getAllUsers);

// Rota para buscar um usuário pelo ID
router.get('/:id', identifyCompany, getUserById);

// Rota para atualizar os dados de um usuário
router.put('/:id', identifyCompany, updateUser);

// Rota para deletar um usuário
router.delete('/:id', identifyCompany, deleteUser);

module.exports = router;
