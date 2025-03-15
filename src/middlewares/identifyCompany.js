const Company = require('../models/Company');

const identifyCompany = async (req, res, next) => {

  try {
    const host = req.headers.host // exemplo empresa1.localhost:3000

    if (!host) {
      console.log(`❌ Host não encontrado na requisição.`);
      return res.status(400).json({ message: "Host não encontrado na requisição." });
    }

     // Verifica se o host tem pelo menos dois pontos (ex: empresa1.localhost)
     const hostParts = host.split('.');
     if (hostParts.length < 2) {
       console.log(`❌ Subdomínio inválido: ${host}`);
       return res.status(400).json({ message: "Subdomínio inválido." });
     }
     
     const subdomain = hostParts[0]; // Captura o 'empresa1'

     console.log(`🔍 Subdomínio identificado: ${subdomain}`);

    const company = await Company.findOne({ domain: subdomain });

    if (!company) {
      return res.status(404).json({ message: "Empresa não encontrada!" });
    }

    req.company = company; // 🔥 Armazena a empresa na requisição para usar nos controllers
    console.log("🏢 Empresa identificada no middleware:", req.company);
    next();
  } catch (error) {
    console.error("Erro ao identificar empresa:", error);
    res.status(500).json({ message: "Erro ao identificar empresa", error });
  }
};

module.exports = identifyCompany;