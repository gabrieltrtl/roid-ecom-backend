const Product = require('../models/Product');

// Função para criar um produto
const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, images } = req.body; // Recebe os dados do produto

    const newProduct = new Product({
      name,
      description,
      price,
      stock,
      images
    });

    await newProduct.save();  // Salva o novo produto no banco de dados
    res.status(201).json(newProduct);  // Retorna o produto criado
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar produto', error });
  }
};

// Função para listar todos os produtos
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar produtos', error });
  }
};

// Função para buscar um produto pelo ID 
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
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
    const { name, description, price, images } = req.body;  // Pega os dados do produto

    const updatedProduct = await Product.findByIdAndUpdate(id, {
      name,
      description,
      price,
      images
    }, { new: true });  // Atualiza o produto e retorna a versão mais recente

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Produto não encontrado' });
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

    const deletedProduct = await Product.findByIdAndDelete(id);  // Deleta o produto

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Produto não encontrado' });
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