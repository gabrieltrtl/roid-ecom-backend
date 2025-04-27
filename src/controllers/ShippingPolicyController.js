const ShippingPolicy = require('../models/ShippingPolicy');

const getAllShippingPolicies = async (req, res) => {
  try {
    const policies = await ShippingPolicy.find({ company: req.companyId }).sort({ createdAt: -1 });
    res.json(policies);
  } catch (error) {
    console.error('Erro ao buscar políticas de frete:', error);
    res.status(500).json({ message: 'Erro ao buscar políticas de frete.' });
  }
};

const createShippingPolicy = async (req, res) => {
  try {
    const { name, price } = req.body;
    const policy = new ShippingPolicy({ name, price, company: req.companyId });

    if (!name || price == null) {
      return res.status(400).json({ message: 'Nome e preço são obrigatórios.' });
    }

    await policy.save();
    res.status(201).json(policy);
  } catch (error) {
    console.error('Erro ao criar política de frete:', error);
    res.status(500).json({ message: 'Erro ao criar política de frete.' });
  }
};

const updateShippingPolicy = async (req, res) => {
  try {
    const { name, price } = req.body;

    if (!name || price == null) {
      return res.status(400).json({ message: 'Nome e preço são obrigatórios.' });
    }

   const updatedPolicy = await ShippingPolicy.findOneAndUpdate(
      { _id: req.params.id, company: req.companyId },
      { name, price },
      { new: true }
    );

    if (!updatedPolicy) return res.status(404).json({ message: 'Política não encontrada.' });

    res.json(updatedPolicy);
  } catch (error) {
    console.error('Erro ao atualizar política de frete:', error);
    res.status(500).json({ message: 'Erro ao atualizar política de frete.' });
  }
};

const deleteShippingPolicy = async (req, res) => {
  try {
    const deleted = await ShippingPolicy.findOneAndDelete({
      _id: req.params.id,
      company: req.companyId
    });

    if (!deleted) return res.status(404).json({ message: 'Política não encontrada.' });

    res.json({ message: 'Política de frete deletada com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar política de frete:', error);
    res.status(500).json({ message: 'Erro ao deletar política de frete.' });
  }
};

module.exports = {
  getAllShippingPolicies,
  createShippingPolicy,
  updateShippingPolicy,
  deleteShippingPolicy
};