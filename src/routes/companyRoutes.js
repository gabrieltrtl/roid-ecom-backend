const express = require('express');
const { createCompany, getAllCompanies } = require('../controllers/CompanyController')
const router = express.Router();
const isSuperAdmin = require('../middlewares/isSuperAdmin');

// ✅ Rota para criar uma empresa
router.post('/', createCompany);

// ✅ Rota para listar empresas (opcional para teste)
router.get('/', getAllCompanies);

module.exports = router;
