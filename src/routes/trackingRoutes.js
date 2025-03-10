// backend/src/routes/trackingRoutes.js
const express = require("express");
const router = express.Router();
const { createTracking, getTracking, getSalesByTrackingId, getAllTrackings, deleteTracking } = require('../controllers/trackingController');

// Criar um novo trackingId
router.post("/tracking", createTracking);

// buscar todos os trackings
router.get("/tracking", getAllTrackings);

// Deletar um trackingId específico
router.delete("/tracking/:id", deleteTracking);

// Buscar trackingId específico
router.get("/tracking/:trackingId", getTracking);

// Buscar vendas por trackingId
router.get("/tracking/:trackingId/sales", getSalesByTrackingId);

module.exports = router;
