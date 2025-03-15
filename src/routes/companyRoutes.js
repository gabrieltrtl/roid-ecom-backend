const express = require('express');
const { createCompany, getAllCompanies } = require('../controllers/CompanyController')
const router = express.Router();

// ✅ Rota para criar uma empresa
router.post('/companies', createCompany);

// ✅ Rota para listar empresas (opcional para teste)
router.get('/companies', getAllCompanies);

module.exports = router;
