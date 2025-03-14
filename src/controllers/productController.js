const Product = require('../models/Product');

// Função para criar um produto
const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, images, company } = req.body; // Recebe os dados do produto

    const newProduct = new Product({
      name,
      description,
      price,
      stock,
      images,
      company
    });

    await newProduct.save();  // Salva o novo produto no banco de dados
    res.status(201).json(newProduct);  // Retorna o produto criado
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar produto', error });
  }
};

// Função para listar todos os produtos
const getAllProducts = async (req, res) => {
  const { company } = req.query;

  if (!company) {
    // Validação para garantir que o campo 'company' seja informado
    return res.status(400).json({ message: 'Empresa (company) é obrigatória na consulta.' });
  }

  try {
    const products = await Product.find({ company });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar produtos', error });
  }
};

// Função para buscar um produto pelo ID 
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const { company } = req.query;

    if (!company) {
      // Validação para garantir que o campo 'company' seja informado
      return res.status(400).json({ message: 'Empresa (company) é obrigatória na consulta.' });
    }

    const product = await Product.findOne({ _id: id, company });

    if (!product) {
      // Retorna erro se o produto não for encontrado ou não pertencer à empresa
      return res.status(404).json({ message: 'Produto não encontrado ou não pertence à empresa.' });
    }

    res.status(200).json(product);  // Retorna o produto encontrado
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar produto', error });
  }
};

// Função para atualizar um produto
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;  // Pega o ID do produto da URL
    const { name, description, price, images, stock, company } = req.body;  // Pega os dados do produto

    if (!company) {
      // Validação para garantir que o campo 'company' seja informado
      return res.status(400).json({ message: 'Empresa (company) é obrigatória.' });
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { _id: id, company},
      { name, description, price, stock, images },
      { new: true }
    );  // Atualiza o produto e retorna a versão mais recente

    if (!updatedProduct) {
      // Retorna erro se o produto não for encontrado ou não pertencer à empresa
      return res.status(404).json({ message: 'Produto não encontrado ou não pertence à empresa.' });
    }

    res.status(200).json(updatedProduct);  // Retorna o produto atualizado
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar produto', error });
  }
};

// Função para deletar um produto
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;  // Pega o ID do produto da URL
    const { company } = req.body;

    const deletedProduct = await Product.findOneAndDelete({ _id: id, company });  // Deleta o produto

    if (!deletedProduct) {
      // Retorna erro se o produto não for encontrado ou não pertencer à empresa
      return res.status(404).json({ message: 'Produto não encontrado ou não pertence à empresa.' });
    }

    res.status(200).json({ message: 'Produto deletado com sucesso' });  // Retorna uma mensagem de sucesso
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar produto', error });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
};