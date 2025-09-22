const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Função para logar usuário
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Senha inválida.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Conta bloqueada. Pagamento pendente." });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        companyId: user.companyId,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );
    
    res.status(200).json({ token });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ message: 'Erro ao fazer login', error });
  }
};

// Função para criar um usuário
const createUser = async (req, res) => {
  try {
    const { name, email, password, role, companyId: bodyCompanyId } = req.body;

    if (!role) {
      return res.status(400).json({ message: "O campo role é obrigatório." });
    }

    let companyId = req.companyId; // padrão: companyId do token

    // 🚨 Se o novo usuário for superadmin, não precisa de companyId
    if (role === 'superadmin') {
      companyId = undefined;
    }
    
    // 🚨 Se quem está criando é superadmin e criando um usuário normal (não superadmin),
    // companyId deve vir no body obrigatoriamente
    if (req.role === 'superadmin' && role !== 'superadmin') {
      if (!bodyCompanyId) {
        return res.status(400).json({ message: "Superadmin criando usuário comum precisa informar companyId." });
      }
      companyId = bodyCompanyId;
    }

    // Se não tem companyId e não é superadmin, erro
    if (!companyId && role !== 'superadmin') {
      return res.status(400).json({ message: "Empresa não identificada. companyId obrigatório para este tipo de usuário." });
    }

    // 🔐 Validação da senha
    const stringPassword = String(password).trim();
    if (!stringPassword || stringPassword.length < 6) {
      return res.status(400).json({ message: "Senha inválida. Deve ter pelo menos 6 caracteres." });
    }

    // Verifica se o e-mail já existe (considerando companyId se não for superadmin)
    const existingQuery = { email };
    if (role !== 'superadmin') {
      existingQuery.companyId = companyId;
    }

    const existingUser = await User.findOne(existingQuery);
    if (existingUser) {
      return res.status(400).json({ message: "Usuário já cadastrado." });
    }

    const newUser = new User({
      name,
      email,
      password: stringPassword,
      role,
      companyId: companyId || undefined, // companyId só se tiver
    });

    await newUser.save();
    res.status(201).json(newUser);

  } catch (error) {
    console.error("❌ Erro ao criar usuário:", error);

    if (error.code === 11000) {
      return res.status(400).json({ message: "E-mail já cadastrado para esta empresa." });
    }

    res.status(500).json({
      message: 'Erro ao criar usuário',
      error: error.message,
      stack: error.stack,
    });
  }
};


// Função para listar todos os usuários
const getAllUsers = async (req, res) => {
  try {
    if (!req.companyId) {
      return res.status(400).json({ message: "Empresa não identificada."} );
    }

    const users = await User.find({ companyId: req.companyId })

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar usuários', error });
  }
};

// Função para buscar um usuário pelo ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!req.companyId) {
      return res.status(400).json({ message: "Empresa não identificada." });
    }

    const user = await User.findOne({ _id: id, companyId: req.companyId });

    if (!user) {
      return res.status(400).json({ message: "Usuário não encontrado." });
    }


    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuário', error });
  }
};

// Função para atualizar um usuário
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;
    

    if (!req.companyId) {
      return res.status(400).json({ message: "Empresa não identificada." });
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: id, companyId: req.companyId },
      { name, email, password, role },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuário não encontrado nesta empresa.' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar usuário', error });
  }
};

// Função para deletar um usuário
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!req.companyId) {
      return res.status(400).json({ message: "Empresa não identificada." });
    }
    
    const deletedUser = await User.findOneAndDelete({ _id: id, companyId: req.companyId });

    if (!deletedUser) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.status(200).json({ message: 'Usuário deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar usuário', error });
  }
};

module.exports = {
  loginUser,
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};
