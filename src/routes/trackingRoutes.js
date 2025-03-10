// backend/src/routes/trackingRoutes.js
const express = require("express");
const router = express.Router();
const { createTracking, getTracking, getSalesByTrackingId } = require('../controllers/trackingController');

// Criar um novo trackingId
router.post("/", createTracking);

// Buscar trackingId específico
router.get("/:trackingId", getTracking);

// Buscar vendas por trackingId
router.get("/:trackingId/sales", getSalesByTrackingId);

module.exports = router;
