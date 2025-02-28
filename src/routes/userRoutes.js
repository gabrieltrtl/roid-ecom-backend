const express = require('express');
const router = express.Router();
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
router.post('/users', createUser);

// Rota para listar todos os usuários
router.get('/users', getAllUsers);

// Rota para buscar um usuário pelo ID
router.get('/users/:id', getUserById);

// Rota para atualizar os dados de um usuário
router.put('/users/:id', updateUser);

// Rota para deletar um usuário
router.delete('/users/:id', deleteUser);

module.exports = router;
