const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Função para logar usuário
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const company = req.company;

  try {

    if (!company) {
      return res.status(400).json({ message: "Empresa não identificada." });
    }

     // Verifica se o usuário existe nessa empresa
     const user = await User.findOne({ email, companyId: company._id });
    // Verifica se o usuário existe
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado para esta empresa." });
    }

    // Compara a senha fornecida com a senha armazenada no banco
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Senha inválida' });
    }

    // Cria o token JWT
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "8h" });

    res.status(200).json({ token });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ message: 'Erro ao fazer login', error });
  }
};

// Função para criar um usuário
const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const company = req.company;

    if (!company) {
      return res.status(400).json({ message: "Empresa não identificada no subdomínio." });
    }

    // Verifica se o usuário já existe nessa empresa
    const existingUser = await User.findOne({ email, companyId: company._id });

    if (existingUser) {
      return res.status(400).json({ message: "Usuário já cadastrado para esta empresa." });
    }

    const newUser = new User({
      name,
      email,
      password,
      role,
      companyId: company._id,
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar usuário', error });
  }
};

// Função para listar todos os usuários
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar usuários', error });
  }
};

// Função para buscar um usuário pelo ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
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

    const updatedUser = await User.findByIdAndUpdate(id, {
      name,
      email,
      password,
      role
    }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
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
    const deletedUser = await User.findByIdAndDelete(id);

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
