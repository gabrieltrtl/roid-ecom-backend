const Customer = require("../models/Customer");

// Função para criar um cliente
const createCustomer = async (req, res) => {
  try {
    let { name, surname, email, password, phone, cpf, address } = req.body;

     // 🔥 Log inicial para depuração
     console.log("📩 Recebendo requisição para criar cliente...");
     console.log("📦 Dados recebidos:", req.body);

    // 🔥 Removemos qualquer caractere especial do CPF ANTES de qualquer operação
    const formattedCpf = cpf.replace(/\D/g, "").trim();
    console.log(`🔍 Buscando cliente com CPF: ${formattedCpf}`);

    if (!name || !surname || !phone || !formattedCpf) {
      return res
        .status(400)
        .json({
          message: "Todos os campos obrigatórios devem ser preenchidos",
        });
    }

    // Verificar se o cliente já existe pelo CPF ou email
    const existingCustomer = await Customer.findOne({ cpf: formattedCpf });

    if (existingCustomer) {
      return res.status(400).json({ message: "Cliente já cadastrado!" });
    }

    const customerData = {
      name,
      surname,
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
    };

    if (email && email.trim() !== "") {
      customerData.email = email;
    }

    if (password) {
      customerData.password = password;
    }

    const customer = new Customer(customerData);

    await customer.save();
    res.status(201).json({ message: "Cliente criado com sucesso!", customer });
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar cliente", error });
  }
};

// Função para listar todos os clientes
const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar clientes", error });
  }
};

// Função para puxar um cliente em específico
const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id);
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
    const customerIds = ids.split(",").map((id) => id.trim());

    const customers = await Customer.find({ _id: { $in: customerIds } });

    if (!customers || customers.length === 0) {
      return res.status(404).json({ message: "Nenhum cliente encontrado!" });
    }

    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar clientes", error });
  }
};

const getCustomerByCpf = async (req, res) => {
  let { cpf } = req.params; // Obtemos CPF da URL

  console.log("🔍 CPF recebido na API:", cpf);
  // 🔥 Remove qualquer caractere especial antes de buscar no banco
  cpf = cpf.replace(/\D/g, "").trim();

  console.log("🔍 CPF formatado para busca:", cpf);

  try {
    const customer = await Customer.findOne({ cpf }).select(
      "_id name surname address"
    ); // 🔥 `.lean()` transforma o retorno em um objeto simples

    if (!customer) {
      return res.status(404).json({ message: "Cliente não encontrado" });
    }

    return res.status(200).json({
      _id: customer._id.toString(),
      name: customer.name,
      surname: customer.surname,
      address: customer.address, // Supondo que o modelo Customer tenha um campo 'address'
    });
  } catch (error) {
    console.error("Erro ao buscar cliente:", error);
    return res.status(500).json({ message: "Erro ao buscar cliente" });
  }
};

// Função para atualizar dados de um cliente
const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, cpf } = req.body;

    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      {
        name,
        email,
        phone,
        cpf,
      },
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
    const deletedCustomer = await Customer.findByIdAndDelete(id);

    if (!deletedCustomer) {
      return res.status(404).json({ message: "Cliente não encontrado!" });
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
