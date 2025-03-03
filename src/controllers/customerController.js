const Customer = require('../models/Customer');

// Função para criar um cliente
const createCustomer = async (req, res) => {
  try {
    console.log("Requisição recebida:", req.body); // ✅ Verifica se o corpo da requisição chega
    const { name, surname, email, password, phone, cpf, address  } = req.body;

    if (!name || !surname || !email || !password || !phone || !cpf) {
      console.log("❌ Campos ausentes:", { name, surname, email, password, phone, cpf }); // 🔥 VEJA O QUE ESTÁ FALTANDO
      return res.status(400).json({ message: "Todos os campos são obrigatórios!" });
    }

    // Verificar se o cliente já existe pelo CPF ou email
    const existingCustomer = await Customer.findOne({ $or: [{ cpf }, { email }] });
    if (existingCustomer) {
      console.log("❌ Cliente já existe:", existingCustomer); // 🔥 LOGA CLIENTE DUPLICADO
      return res.status(400).json({ message: 'Cliente já cadastrado!' });
    }

    const customer = new Customer({
      name,
      surname,
      email,
      password,
      phone,
      cpf,
      address: {
        cep: address.cep,
        street: address.street,
        neighborhood: address.neighborhood,
        number: address.number,
        complement: address.complement,
        city: address.city,
        state: address.state
      }
    });

    await customer.save();
    res.status(201).json({ message: 'Cliente criado com sucesso!', customer });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar cliente', error });
  }
};

// Função para listar todos os clientes
const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar clientes', error });
  }
};

// Função para puxar um cliente em específico
const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({ message: 'Cliente não encontrado!' });
    }
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar cliente', error });
  }
};

// Função para atualizar dados de um cliente
const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, cpf } = req.body;

    const updatedCustomer = await Customer.findByIdAndUpdate(id, {
      name,
      email,
      phone,
      cpf
    }, { new: true });

    if (!updatedCustomer) {
      return res.status(404).json({ message: 'Cliente não encontrado!' });
    }

    res.status(200).json({ message: 'Cliente atualizado com sucesso!', updatedCustomer });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar cliente', error });
  }
};

// Função para deletar um cliente
const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCustomer = await Customer.findByIdAndDelete(id);

    if (!deletedCustomer) {
      return res.status(404).json({ message: 'Cliente não encontrado!' });
    }

    res.status(200).json({ message: 'Cliente deletado com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar cliente', error });
  }
};

module.exports = {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer
};