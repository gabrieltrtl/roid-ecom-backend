const mongoose = require('mongoose');
const Order = require('../models/Order');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/seu_banco"; // Ajuste seu banco aqui

const cleanOldTemporaryOrders = async () => {
    try {

        // 🔄 Conectando ao MongoDB
        await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

        // 🔍 Buscar pedidos temporários antes de excluir
        const oldOrders = await Order.find({ isTemporary: true });

        // Se não houver pedidos, encerra o script
        if (oldOrders.length === 0) {
            await mongoose.connection.close();
            return;
        }

        // 🗑️ Excluir pedidos temporários antigos
        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

        const result = await Order.deleteMany({
            isTemporary: true,
            createdAt: { $lt: twentyFourHoursAgo }
        });

        // ✅ Fechando conexão
        await mongoose.connection.close();
    
    } catch (error) {
        console.error('❌ Erro ao limpar pedidos temporários:', error);
        process.exit(1);
    }
};

// ✅ Permite rodar o script manualmente
if (require.main === module) {
    cleanOldTemporaryOrders();
}

module.exports = cleanOldTemporaryOrders;
