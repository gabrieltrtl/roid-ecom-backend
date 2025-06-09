// backend/src/routes/trackingRoutes.js
const express = require("express");
const router = express.Router();
const identifyCompany = require('../middlewares/identifyCompany');
const { createTracking, getTracking, getSalesByTrackingId, getAllTrackings, deleteTracking } = require('../controllers/trackingController');

// Criar um novo trackingId
router.post("/", identifyCompany, createTracking);

// buscar todos os trackings
router.get("/", identifyCompany, getAllTrackings);

// Buscar trackingId específico
router.get("/:trackingId", getTracking);

// Buscar vendas por trackingId
router.get("/:trackingId/sales", identifyCompany, getSalesByTrackingId);

// Deletar um trackingId específico
router.delete("/:id", identifyCompany, deleteTracking);


module.exports = router;
