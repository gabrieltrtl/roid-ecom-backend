const Order = require('../models/Order');
const Product = require('../models/Product'); // Adicionando a importação do modelo Product
const Customer = require('../models/Customer');


// Função para criar um novo pedido
const createOrder = async (req, res) => {
  try {
    const { customer, products, status, paymentMethod, paymentStatus, shippingType } = req.body;

    // Verificando se o cliente existe
    const customerExists = await Customer.findById(customer);
    if (!customerExists) {
      return res.status(400).json({ message: 'Cliente não encontrado!' });
    }

    // Verificando se os produtos existem
    const productIds = products.map(p => p.product);
    const productsExist = await Product.find({ '_id': { $in: productIds } });
    if (productsExist.length !== products.length) {
      return res.status(400).json({ message: 'Um ou mais produtos não encontrados!' });
    }

    let totalPrice = 0;
    const updatedProducts = products.map(p => {
      const product = productsExist.find(prod => prod._id.toString() === p.product.toString());
      const productTotalPrice = product.price * p.quantity; // Preço do produto * quantidade
      totalPrice += productTotalPrice; // Somando ao totalPrice
      return {
        product: p.product, // Mantendo o ID do produto
        quantity: p.quantity, // Mantendo a quantidade
      };
    });

    const newOrder = new Order({
      customer,
      products: updatedProducts,
      totalPrice,
      status,
      paymentMethod,
      paymentStatus,
      shippingType
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar pedido', error });
  }
};

// Função para listar todos os pedidos
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('customer', 'name email');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar pedidos', error });
  }
};

// Função para obter um pedido específico
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).populate('customer', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }
    
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar pedido', error });
  }
};

// Função para atualizar status do pedido
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(id, { status }, { new: true });

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }

    res.status(200).json(updatedOrder);

  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar pedido', error });
  }
};

// Função para deletar pedido
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await Order.findByIdAndDelete(id);
    
    if (!deletedOrder) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }

    res.status(200).json({ message: 'Pedido deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar pedido', error });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder
};