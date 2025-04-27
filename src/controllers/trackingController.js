const Tracking = require('../models/Tracking');
const { nanoid } = require('nanoid');

// Criar novo trackingId
const createTracking = async (req, res) => {
  try {
    const { influencerName, sellerPhone} = req.body;

    if (!influencerName || !sellerPhone) {
      return res.status(400).json({ message: "Nome do influenciador é obrigatório." });
    }

    // ✅ Adiciona o código do país se não estiver presente
    const formattedPhone = sellerPhone.startsWith('+') 
      ? sellerPhone 
      : `+55${sellerPhone.replace(/\D/g, '')}`;

    const trackingId = nanoid(8);

    const newTracking = await Tracking.create({ influencerName, sellerPhone: formattedPhone, trackingId, company: req.companyId });

    console.log("✅ Tracking criado com sucesso:", newTracking);

    return res.status(201).json(newTracking);
  } catch (error) {
    console.error("Erro ao criar trackingId:", error);
    return res.status(500).json({ message: "Erro interno ao criar trackingId." });
  }
};

// Listar todos os trackings
const getAllTrackings = async (req, res) => {
  try {
    const trackings = await Tracking.find({ company: req.companyId }); 
    return res.status(200).json(trackings);
  } catch (error) {
    console.error("Erro ao buscar trackingIds:", error);
    return res.status(500).json({ message: "Erro ao buscar trackingIds." });
  }
};

// Buscar um trackingId
const getTracking = async (req, res) => {
  const { trackingId } = req.params;

  try {
    const tracking = await Tracking.findOne({ trackingId, company: req.companyId });

    if (!tracking) {
      return res.status(404).json({ message: "Tracking ID não encontrado ou não pertence à empresa." });
    }

    return res.status(200).json(tracking);
  } catch (error) {
    console.error("Erro ao buscar trackingId:", error);
    return res
      .status(500)
      .json({ message: "Erro interno ao buscar trackingId." });
  }
};

const getSalesByTrackingId = async (req, res) => {
  const { trackingId } = req.params;

  try {
    const orders = await Order.find({ trackingId, company: req.companyId, status: "confirmado" }); // Filtramos também por empresa

    if (!orders.length) {
      return res.status(404).json({ message: "Nenhuma venda encontrada para esse trackingId." });
    }
    
    const totalSales = orders.length;
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

    return res.status(200).json({
      trackingId,
      totalSales,
      totalRevenue,
      orders,
    });
  } catch (error) {
    console.error("Erro ao buscar vendas por trackingId:", error);
    return res.status(500).json({ message: "Erro interno ao buscar vendas." });
  }
};

const deleteTracking = async (req, res) => {
  const { id } = req.params;

  try {
    const tracking = await Tracking.findOneAndDelete({ _id: id, company: req.companyId }); // Garantimos que o tracking pertence à empresa

    if (!tracking) {
      return res.status(404).json({ message: "Tracking ID não encontrado ou não pertence à empresa." });
    }

    return res.status(200).json({ message: "Tracking ID deletado com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar trackingId:", error);
    return res.status(500).json({ message: "Erro ao deletar trackingId." });
  }
};

module.exports = {
  createTracking,
  getTracking,
  getSalesByTrackingId,
  getAllTrackings,
  deleteTracking
};
