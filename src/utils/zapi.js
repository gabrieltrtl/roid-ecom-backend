const axios = require("axios");

const sendWhatsappTrackingMessage = async (
  phone,
  trackingCode,
  sendersList,
  companyName
) => {
  if (!sendersList?.length) {
    console.warn("⚠️ Lista de remetentes está vazia ou indefinida.");
    return;
  }

  // Escolhe um número aleatório da lista
  const sender = sendersList[Math.floor(Math.random() * sendersList.length)];

  console.log("🔍 Número do cliente:", phone);
  console.log("🔍 Código de rastreio:", trackingCode);
  console.log("🔍 Empresa:", companyName);
  console.log("🔍 Remetente escolhido:", sender?.name || "sem nome");
  console.log("🔐 Instance ID:", sender?.instanceId);
  console.log("🔐 Token:", sender?.token);

  try {
    const fullPhone = `55${phone.replace(/\D/g, "")}`;
    const message = `📦 Olá! Seu pedido foi enviado com sucesso. Código de rastreio: *${trackingCode}*.\n\nVocê pode acompanhar a entrega no site dos Correios ou da transportadora.\n\nAtenciosamente, *${companyName}*.`;

    await axios.post(
      `https://api.z-api.io/instances/${sender.instanceId}/token/${sender.token}/send-text`,
      {
        phone: fullPhone,
        message,
      },
      {
        headers: {
          "Client-Token": sender.clientToken,
        },
      }
    );

    console.log(
      `✅ Mensagem enviada para: ${fullPhone} via ${
        sender.name || "número aleatório"
      }`
    );
  } catch (error) {
    console.error(
      "❌ Erro ao enviar mensagem Z-API:",
      error.response?.data || error.message
    );
  }
};

module.exports = {
  sendWhatsappTrackingMessage,
};
