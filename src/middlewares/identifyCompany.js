const Company = require('../models/Company');

const identifyCompany = async (req, res, next) => {
  try {
    const host = req.headers.host; // Exemplo: empresa1.bulkcrm.com ou bulkcrm.com

    if (!host) {
      console.log(`❌ Host não encontrado na requisição.`);
      return res.status(400).json({ message: "Host não encontrado na requisição." });
    }

    // Ignora verificação de subdomínio em ambiente de dev local (opcional)
    if (process.env.NODE_ENV === 'development' && host.startsWith('localhost')) {
      console.log('⚙️ Ambiente de desenvolvimento - ignorando subdomínio.');
      return next();
    }

    const hostParts = host.split('.');

    // 💡 NOVO: Caso o host seja o domínio principal (bulkcrm.com)
    if (hostParts.length === 2 && hostParts[1] === 'com' && hostParts[0] === 'bulkcrm') {
      console.log(`🔍 Dominio principal identificado: ${host}`);
      // Trate como o domínio principal
      return next(); // ✅ Permite seguir sem validar o subdomínio
    }

    // ⚠️ SE NÃO HOUVER SUBDOMÍNIO VÁLIDO: Se o host não tiver um subdomínio válido
    if (hostParts.length < 2) {
      console.log(`❌ Subdomínio inválido: ${host}`);
      return res.status(400).json({ message: "Subdomínio inválido." });
    }

    const subdomain = hostParts[0]; // Ex: empresa1
    console.log(`🔍 Subdomínio identificado: ${subdomain}`);

    // 💡 NOVO: Verifique a empresa com o subdomínio
    const company = await Company.findOne({ domain: subdomain });

    if (!company) {
      console.log(`🚫 Subdomínio ${subdomain} não autorizado.`);
      return res.status(403).json({ message: "Subdomínio não autorizado." });
    }

    req.company = company; // 🔥 Empresa disponível nos controllers
    console.log("🏢 Empresa identificada no middleware:", req.company);
    next();
  } catch (error) {
    console.error("❌ Erro ao identificar empresa:", error);
    res.status(500).json({ message: "Erro ao identificar empresa", error });
  }
};

module.exports = identifyCompany;
