const axios = require('axios');

const sendWhatsappTrackingMessage = async (phone, trackingCode, sendersList, companyName) => {
  if (!sendersList?.length) return;

  // Escolhe um número aleatório da lista
  const sender = sendersList[Math.floor(Math.random() * sendersList.length)];

  try {
    const fullPhone = `55${phone.replace(/\D/g, '')}`;
    const message = `📦 Olá! Seu pedido foi enviado com sucesso. Código de rastreio: *${trackingCode}*.\n\nVocê pode acompanhar a entrega no site dos Correios ou da transportadora.\n\nAtenciosamente, *${companyName}*.`;

    await axios.post(
      `https://api.z-api.io/instances/${sender.instanceId}/token/${sender.token}/send-messages`,
      {
        phone: fullPhone,
        message
      }
    );

    console.log(`✅ Mensagem enviada para: ${fullPhone} via ${sender.name || 'número aleatório'}`);
  } catch (error) {
    console.error("❌ Erro ao enviar mensagem Z-API:", error.response?.data || error.message);  
  }
};

module.exports = {
  sendWhatsappTrackingMessage
};