const mongoose = require('mongoose');
const Order = require('../models/Order');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/seu_banco"; // Ajuste seu banco aqui

const cleanOldTemporaryOrders = async () => {
    try {
        console.log("🚀 Iniciando limpeza de pedidos temporários...");

        // 🔄 Conectando ao MongoDB
        await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("✅ Conectado ao MongoDB!");

        // 🔍 Buscar pedidos temporários antes de excluir
        const oldOrders = await Order.find({ isTemporary: true });
        console.log(`📋 Encontrados ${oldOrders.length} pedidos temporários.`);

        // Se não houver pedidos, encerra o script
        if (oldOrders.length === 0) {
            console.log("✅ Nenhum pedido para excluir.");
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

        console.log(`🗑️ ${result.deletedCount} pedidos temporários removidos.`);
        
        // ✅ Fechando conexão
        await mongoose.connection.close();
        console.log('✅ Conexão com o banco de dados fechada.');
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
