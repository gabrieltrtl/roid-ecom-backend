const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, trim: true, unique: true },
  password: { type: String, required: true },
  role: {  
    type: String,
    enum: ['admin', 'superadmin', 'manager', 'sales', 'logistics'],
    default: 'admin'
  },
  companyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Company', 
    required: function() {
      return this.role !== 'superadmin';
    }
  },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Hash da senha antes de salvar
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    // 🔒 Verifica se a senha existe
    if (!this.password) {
      return next(new Error('Senha não fornecida.'));
    }

    // 🔁 Converte para string, se ainda não for
    if (typeof this.password !== 'string') {
      return next(new Error('Senha inválida. Deve ser uma string.'));
    }
    
    const rawPassword = this.password.trim();

    // ✅ Valida se a string está ok
    if (!rawPassword || rawPassword.trim().length < 6) {
      return next(new Error('Senha inválida. Deve ter pelo menos 6 caracteres.'));
    }

    
    // 🔐 Aplica hash com bcrypt
    this.password = await bcrypt.hash(rawPassword.trim(), 10);
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