const Company = require('../models/Company');

// Criar nova empresa
const createCompany = async (req, res) => {
  try { 
    const { name } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'O nome da empresa é obrigatório.' });
    }

     // Criar e salvar a nova empresa
    const newCompany = new Company({ name: name.trim() });

    await newCompany.save();

    res.status(201).json({ message: "Empresa criada com sucesso!", company: newCompany })
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar empresa", error });
  }
};

const updateZapiConfig = async (req, res) => {
  console.log("🔍 companyId recebido:", req.companyId);
  console.log("📦 Corpo da requisição:", req.body);
  try {
    const { whatsappSenders  } = req.body;
    
    if (!Array.isArray(whatsappSenders)) {
     res.status(400).json({ message: "Formato inválido. Deve ser um array." });
    }

    const company = await Company.findById(req.companyId);
    if (!company) {
      return res.status(404).json({ message: "Empresa não encontrada." });
    }

    company.whatsappSenders = whatsappSenders;

    await company.save();
    return res.status(200).json({ message: "Configuração Z-API salva com sucesso!" });
  } catch (error) {
    console.error("Erro ao salvar config Z-API:", error);
    return res.status(500).json({ message: "Erro interno ao salvar config." });
  }
}

// ✅ Função para listar todas as empresas (útil para teste)
const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar empresas", error });
  }
};

module.exports = {
  createCompany,
  getAllCompanies,
  updateZapiConfig // ✅ Exportação correta
};