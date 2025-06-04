const mongoose = require('mongoose');

const WhatsappSenderSchema = new mongoose.Schema({
  name: String,
  apiUrl: { type: String, required: true },
  instanceId: { type: String, required: true },
  token: { type: String, required: true },
  clientToken: { type: String, required: true },
}, { _id: false });

const MelhorEnvioSchema = new mongoose.Schema({
  clientId: String,
  clientSecret: String,
  redirectUri: String,
  accessToken: String,
  refreshToken: String,
  tokenExpiresAt: Date,
}, { _id: false });

const CompanySchema = new mongoose.Schema({
  name: { type: String, required: true },

  // 🔁 Lista de números conectados via Z-API
  whatsappSenders: [WhatsappSenderSchema],

  // Credenciais melhor envio
  melhorEnvio: MelhorEnvioSchema,
}, { timestamps: true });

module.exports = mongoose.model('Company', CompanySchema);
