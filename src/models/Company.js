const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
name: { type: String, required: true },

// 📦 Integração com Z-API
  zapiInstanceId: { type: String, default: null }, // ID da instância logada via QR Code
  zapiToken: { type: String, default: null } 
},  { timestamps: true } );

module.exports = mongoose.model('Company', CompanySchema);
