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