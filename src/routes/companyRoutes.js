const express = require('express');
const { createCompany, getAllCompanies, updateZapiConfig } = require('../controllers/CompanyController')
const router = express.Router();
const isSuperAdmin = require('../middlewares/isSuperAdmin');
const authMiddleware = require('../middlewares/authMiddleware');
const identifyCompany = require('../middlewares/identifyCompany')
const { getZapiConfig } = require('../controllers/CompanyController');

// ✅ Rota para criar uma empresa
router.post('/', authMiddleware, isSuperAdmin, createCompany);

// ✅ Rota para listar empresas (opcional para teste)
router.get('/', authMiddleware, isSuperAdmin, getAllCompanies);

// ✅ Rota para salvar config Z-API
router.post('/zapi-config', identifyCompany, updateZapiConfig);

router.get('/zapi-config', identifyCompany, getZapiConfig);

module.exports = router;
