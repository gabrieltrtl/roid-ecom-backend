const Company = require('../models/Company');

const identifyCompany = async (req, res, next) => {
  try {
    console.log('🛡️ Middleware identifyCompany executado para:', req.headers.host);
    const host = req.headers.host; // Exemplo: empresa1.bulkcrm.com

    if (!host) {
      console.log(`❌ Host não encontrado na requisição.`);
      return res.status(400).json({ message: "Host não encontrado na requisição." });
    }

    // Permitir acesso sem subdomínio em dev (localhost:3000)
    if (process.env.NODE_ENV === 'development' && host.includes('localhost')) {
      console.log('⚙️ Ambiente dev - ignorando subdomínio.');
      return next();
    }

    const domain = 'bulkcrm.com'; // 🛑 Altere para seu domínio real
    const subdomain = host.replace(`.${domain}`, '').split(':')[0]; // Remove domínio e porta

    // Se o resultado for igual ao domínio, é acesso direto (sem subdomínio)
    if (!subdomain || subdomain === domain) {
      console.log(`❌ Subdomínio inválido ou ausente: ${host}`);
      return res.status(400).json({ message: "Subdomínio ausente ou inválido." });
    }

    console.log(`🔍 Subdomínio identificado: ${subdomain}`);

    const company = await Company.findOne({ domain: subdomain });

    if (!company) {
      console.log(`🚫 Subdomínio ${subdomain} não autorizado.`);
      return res.status(403).json({ message: "Subdomínio não autorizado." });
    }

    req.company = company;
    console.log("🏢 Empresa identificada no middleware:", req.company.name);
    next();
  } catch (error) {
    console.error("❌ Erro ao identificar empresa:", error);
    res.status(500).json({ message: "Erro ao identificar empresa", error });
  }
};

module.exports = identifyCompany;
