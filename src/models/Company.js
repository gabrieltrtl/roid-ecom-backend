const mongoose = require('mongoose');

const WhatsappSenderSchema = new mongoose.Schema({
  name: String,
  instanceId: { type: String, required: true },
  token: { type: String, required: true },
  clientToken: { type: String, required: true },
}, { _id: false });

const CompanySchema = new mongoose.Schema({
  name: { type: String, required: true },

  // 🔁 Lista de números conectados via Z-API
  whatsappSenders: [WhatsappSenderSchema],
}, { timestamps: true });

module.exports = mongoose.model('Company', CompanySchema);
