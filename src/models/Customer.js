const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Função para validar CPF
function validarCPF(cpf) {
  if (!cpf || typeof cpf !== 'string') return false;
  cpf = cpf.replace(/[^\d]+/g, ''); // Remove qualquer caractere não numérico

  // Verificar se tem 11 dígitos
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false; // CPF com todos os números iguais é inválido
  }

  // Validação dos dois últimos dígitos
  let soma = 0;
  let resto;

  // Valida primeiro dígito
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }

  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) {
    return false; // Primeiro dígito verificador inválido
  }

  soma = 0;
  // Valida segundo dígito
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }

  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(10))) {
    return false; // Segundo dígito verificador inválido
  }

  return true; // CPF válido
}

const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  phone: { type: String, required: true },
  cpf: { 
    type: String, 
    required: true, 
    unique: true,
    validate: {
      validator: validarCPF,
      message: 'CPF inválido!'
    },
    set: (value) => {
      // Remove traços ao salvar o CPF
      return value.replace(/[^\d]/g, "");
    }
  },
  address: {
    cep: { type: String, required: true },
    street: { type: String, required: true },
    neighborhood: { type: String, required: true },
    number: { type: String, required: true },
    complement: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true }
  }
}, { timestamps: true });

/**
 * Antes de salvar o cliente, criptografa a senha se ela for modificada.
 */
CustomerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

/**
 * Método para comparar senha digitada com a senha salva no banco.
 */
CustomerSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Customer', CustomerSchema);