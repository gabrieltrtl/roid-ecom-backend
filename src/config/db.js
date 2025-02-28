const mongoose = require('mongoose');
require('dotenv').config();

const conectarDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
      console.log('🔥 MongoDB Conectado!');
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
    process.exit(1);
  }
};

module.exports = conectarDB;