const Customer = require("../models/Customer");

// Função para criar um cliente
const createCustomer = async (req, res) => {
  try {
    console.log('Empresa identificada no req:', req.company); 
    let { name, surname, email, password, phone, cpf, address } = req.body;

     // 🔥 Log inicial para depuração
     console.log("📩 Recebendo requisição para criar cliente...");
     console.log("📦 Dados recebidos:", req.body);

    // 🔥 Removemos qualquer caractere especial do CPF ANTES de qualquer operação
    const formattedCpf = cpf.replace(/\D/g, "").trim();
    console.log(`🔍 Buscando cliente com CPF: ${formattedCpf}`);

    if (!name || !surname || !phone || !formattedCpf) {
      console.warn("⚠️ Dados obrigatórios ausentes. Cancelando criação...");
      return res.status(400).json({ message: "Todos os campos obrigatórios devem ser preenchidos" });
    }

    // Verificar se o cliente já existe pelo CPF ou email
    const existingCustomer = await Customer.findOne({ cpf: formattedCpf, company: req.companyId });

    if (existingCustomer) {
      return res.status(400).json({ message: "Cliente já cadastrado!" });
    }

    const customerData = {
      name,
      surname,
      email: email && email.trim() !== "" ? email.trim() : undefined, // 🔥 Define `undefined` se o email for vazio
      phone,
      cpf: formattedCpf,
      address: {
        cep: address.cep,
        street: address.street,
        neighborhood: address.neighborhood,
        number: address.number,
        complement: address.complement,
        city: address.city,
        state: address.state,
      },
      company: req.companyId
    };

    
    if (email && email.trim() !== "") {
      customerData.email = email;
    }
    
    if (password) {
      customerData.password = password;
    }
    console.log("💾 Salvando novo cliente no banco...");
    console.log('Customer Data:', customerData);
    const customer = new Customer(customerData);

    await customer.save();
    console.log("✅ Cliente salvo com sucesso!");
    res.status(201).json({ message: "Cliente criado com sucesso!", customer });
  } catch (error) {
    console.error("❌ ERRO AO SALVAR CLIENTE NO BANCO:", error);
    res.status(500).json({ message: "Erro ao criar cliente", error });
  }
};

// Função para listar todos os clientes
const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({ company: req.companyId });
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar clientes", error });
  }
};

// Função para puxar um cliente em específico
const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findOne({ _id: id, company: req.companyId }); // ✅ Usa o company do middleware

    if (!customer) {
      return res.status(404).json({ message: "Cliente não encontrado!" });
    }
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar cliente", error });
  }
};

const getCustomersByIds = async (req, res) => {
  try {
    const { ids } = req.query;

    if (!ids) {
      return res.status(400).json({ message: 'IDs são obrigatórios.' });
    }
    
    const customerIds = ids.split(",").map((id) => id.trim());

    const customers = await Customer.find({ _id: { $in: customerIds }, company: req.companyId });

    if (!customers || customers.length === 0) {
      return res.status(404).json({ message: "Nenhum cliente encontrado!" });
    }

    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar clientes", error });
  }
};

const getCustomerByCpf = async (req, res) => {
  let { cpf } = req.params;
  cpf = cpf.replace(/\D/g, "").trim();

  console.log("🔍 CPF formatado para busca:", cpf);
  console.log("🏢 Empresa identificada no req:", req.company);

  try {
    // 🧪 Teste com regex — insira isso AQUI 👇
    const customers = await Customer.find({
      cpf: { $regex: cpf, $options: "i" }
    });
    console.log("🧪 Clientes encontrados com regex:", customers);

    customers.forEach((c) => {
      console.log("🧪 CPF no banco:", c.cpf, "| typeof:", typeof c.cpf, "| length:", c.cpf.length);
    });

    // (mantenha sua query original aqui embaixo)
    const customer = await Customer.findOne({
      cpf,
      company: req.companyId
    }).select("_id name surname address");

    if (!customer) {
      return res.status(404).json({ message: "Cliente não encontrado" });
    }

    return res.status(200).json(customer);
  } catch (error) {
    console.error("❌ Erro ao buscar cliente:", error);
    return res.status(500).json({ message: "Erro ao buscar cliente", error });
  }
};

// Função para atualizar dados de um cliente
const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { ...updateData } = req.body;

    const updatedCustomer = await Customer.findOneAndUpdate(
      { _id: id, company: req.companyId },
      updateData,
      { new: true }
    );

    if (!updatedCustomer) {
      return res.status(404).json({ message: "Cliente não encontrado!" });
    }

    res
      .status(200)
      .json({ message: "Cliente atualizado com sucesso!", updatedCustomer });
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar cliente", error });
  }
};

// Função para deletar um cliente
const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCustomer = await Customer.findOneAndDelete({ _id: id, company: req.companyId });

    if (!deletedCustomer) {
      return res.status(404).json({ message: "Cliente não encontrado para esta empresa!" });
    }

    res.status(200).json({ message: "Cliente deletado com sucesso!" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar cliente", error });
  }
};

module.exports = {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  getCustomersByIds,
  updateCustomer,
  deleteCustomer,
  getCustomerByCpf,
};
