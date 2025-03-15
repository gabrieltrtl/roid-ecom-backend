const DiscountRule = require('../models/DiscountRule');

// Criar nova regra de desconto
const createDiscountRule = async (req, res) => {
  try {
    const { name, description, type, value, includedProducts, excludedProducts } = req.body;

    const discountRule = await DiscountRule.create({ 
      name, 
      description,
      type,
      value,
      includedProducts,
      excludedProducts,
      company: req.company._id
    });
    res.status(201).json(discountRule);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao criar regra de desconto', error });
  }
};

// Listar todas as regras de desconto
const getDiscountRules = async (req, res) => {
  try {
    const discountRules = await DiscountRule.find({ company: req.company._id }).populate('includedProducts excludedProducts');
    res.status(200).json(discountRules);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar regras de desconto', error });
  }
};

// Buscar uma regra de desconto por ID
const getDiscountRuleById = async (req, res) => {

  try {
    const discountRule = await DiscountRule.findOne({ _id: req.params.id, company: req.company._id }).populate('includedProducts excludedProducts');

    if (!discountRule) {
      return res.status(404).json({ message: 'Regra de desconto não encontrada' });
    }
    res.status(200).json(discountRule);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar regra de desconto', error });
  }
};

// Atualizar uma regra de desconto
const updateDiscountRule = async (req, res) => {
  try {
    const { name, description, type, value, includedProducts, excludedProducts } = req.body;
    const discountRule = await DiscountRule.findOneAndUpdate(
      { _id: req.params.id, company: req.company._id }, // Filtramos pelo ID e empresa
      { name, description, type, value, includedProducts, excludedProducts },
      { new: true }
    );

    if (!discountRule) {
      // Retorna erro se a regra não for encontrada ou não pertencer à empresa
      return res.status(404).json({ message: 'Regra de desconto não encontrada ou não pertence à empresa.' });
    }

    res.status(200).json(discountRule);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao atualizar regra de desconto', error });
  }
};

// Deletar uma regra de desconto
const deleteDiscountRule = async (req, res) => {
  try {
    const discountRule = await DiscountRule.findOneAndDelete({ _id: req.params.id, company: req.company._id }); 
    
    if (!discountRule) {
      // Retorna erro se a regra não for encontrada ou não pertencer à empresa
      return res.status(404).json({ message: 'Regra de desconto não encontrada ou não pertence à empresa.' });
    }

    res.status(200).json({ message: 'Regra de desconto deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar regra de desconto', error });
  }
};

module.exports = {
  createDiscountRule,
  getDiscountRules,
  getDiscountRuleById,
  updateDiscountRule,
  deleteDiscountRule,
};





