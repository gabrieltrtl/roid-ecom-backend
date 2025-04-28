const express = require('express');
const { createCompany, getAllCompanies } = require('../controllers/CompanyController')
const router = express.Router();
const isSuperAdmin = require('../middlewares/isSuperAdmin');
const authMiddleware = require('../middlewares/authMiddleware');

// ✅ Rota para criar uma empresa
router.post('/', authMiddleware, isSuperAdmin, createCompany);

// ✅ Rota para listar empresas (opcional para teste)
router.get('/', authMiddleware, isSuperAdmin, getAllCompanies);

module.exports = router;
