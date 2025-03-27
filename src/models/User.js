const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: {  
    type: String,
    enum: ['admin', 'gerente', 'atendente'],
    default: 'atendente'
  },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true }
}, { timestamps: true });

// Hash da senha antes de salvar
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    // 🔐 Força a conversão para string e valida
    const rawPassword = String(this.password).trim();

    if (!rawPassword || rawPassword.length < 6) {
      return next(new Error('Senha inválida. Deve ser uma string com no mínimo 6 caracteres.'));
    }

    this.password = await bcrypt.hash(rawPassword, 10);
    next();
  } catch (err) {
    next(err);
  }
});

// Método para comparar senhas
UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// 🔹 Adicionamos um índice para impedir e-mails duplicados dentro da mesma empresa
UserSchema.index({ email: 1, companyId: 1 }, { unique: true });

module.exports = mongoose.model('User', UserSchema);