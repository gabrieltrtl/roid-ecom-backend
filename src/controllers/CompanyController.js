const Company = require('../models/Company');

// Criar nova empresa
const createCompany = async (req, res) => {
  try { 
    const { name, domain, email, password } = req.body;

     // Verificar se o domínio já existe
     const existingCompany = await Company.findOne({ domain });
     if (existingCompany) {
       return res.status(400).json({ message: "Empresa com esse domínio já existe!" });
     }

     // Criar e salvar a nova empresa
    const company = new Company({ name, domain, email, password });
    await company.save();

    res.status(201).json({ message: "Empresa criada com sucesso!", company })
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar empresa", error });
  }
};

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
  getAllCompanies // ✅ Exportação correta
};