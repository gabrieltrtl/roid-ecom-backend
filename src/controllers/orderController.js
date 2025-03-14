const Order = require("../models/Order");
const Product = require("../models/Product"); // Adicionando a importação do modelo Product
const Customer = require("../models/Customer");
const DiscountRule = require("../models/DiscountRule");

// Função para criar um novo pedido
const createOrder = async (req, res) => {
  try {
    const {
      customer,
      products,
      discountRule: discountRuleId,
      status,
      paymentMethod,
      paymentStatus,
      shippingType,
      company
    } = req.body;

    // Verificando se o cliente existe
    const customerExists = await Customer.findById(customer);
    if (!customerExists) {
      return res.status(400).json({ message: "Cliente não encontrado!" });
    }

    // Verificando se os produtos existem
    const productIds = products.map((p) => p.product);
    const productsExist = await Product.find({ _id: { $in: productIds }, company });
    if (productsExist.length !== products.length) {
      return res
        .status(400)
        .json({ message: "Um ou mais produtos não encontrados!" });
    }

    // Buscar regra de desconto, se existir.
    let discountRule = null;
    if (discountRuleId) {
      discountRule = await DiscountRule.findOne({ _id: discountRuleId, company }); // ✅ Garantia que a regra pertence à empresa
    }

    let totalPrice = 0;
    const updatedProducts = products.map((p) => {
      const product = productsExist.find((prod) => prod._id.toString() === p.product.toString());
      let productPrice = product.price;

      // aplicar desconto , se aplicável
      if (discountRule) {
        const isIncluded = discountRule.includedProducts.includes(product._id);
        const isExcluded = discountRule.excludedProducts.includes(product._id);

        if ((isIncluded || discountRule.includedProducts.length === 0) && !isExcluded) {
          if (discountRule.type === 'percentage') {
            productPrice -= (productPrice * discountRule.value) / 100;
          } else if (discountRule.type === 'fixed') {
            productPrice -= discountRule.value;
          }

          if (productPrice < 0) productPrice = 0;
        }
      }

      const productTotalPrice = productPrice * p.quantity; // Preço do produto * quantidade
      totalPrice += productTotalPrice; // Somando ao totalPrice
      return {
        product: p.product, // Mantendo o ID do produto
        quantity: p.quantity, // Mantendo a quantidade
        price: productPrice, // ✅ Preço com desconto aplicado
        subtotal: productTotalPrice, //
      };
    });

    const newOrder = new Order({
      company,
      customer,
      products: updatedProducts,
      discountRule: discountRuleId,
      totalPrice,
      status,
      paymentMethod,
      paymentStatus,
      shippingType,
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar pedido", error });
  }
};

// Função para listar todos os pedidos
const getOrders = async (req, res) => {
  try {
    const { company } = req.query;
    const orders = await Order.find({ company }).populate("customer", "name surname email");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar pedidos", error });
  }
};

// Função para obter um pedido específico
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).populate("customer").populate("discountRule");

    if (!order) {
      return res.status(404).json({ message: "Pedido não encontrado" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar pedido", error });
  }
};

// Função para atualizar status do pedido
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Pedido não encontrado" });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar pedido", error });
  }
};

// Função para deletar pedido
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Pedido não encontrado" });
    }

    res.status(200).json({ message: "Pedido deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar pedido", error });
  }
};

// Criar um pedido temporário e gerar link para o cliente
const createTemporaryOrder = async (req, res) => {
  try {
    const { products, discountRule: discountRuleId, company } = req.body;

    const productIds = products.map((p) => p.product);
    const productsData = await Product.find({ _id: { $in: productIds }, company });

    if (productsData.length !== products.length) {
      return res.status(400).json({ message: "Um ou mais produtos não encontrados!" });
    }

    let discountRule = null;
    if (discountRuleId) {
      discountRule = await DiscountRule.findOne({ _id: discountRuleId, company }); // ✅ Garantia que a regra pertence à empresa
    }

    let totalPrice = 0;
    const formattedProducts = products.map((p) => {
      const product = productsData.find((prod) => prod._id.toString() === p.product.toString());
      let productPrice = product.price;

      // ✅ Aplicar o desconto, se aplicável
      if (discountRule) {
        const isIncluded = discountRule.includedProducts.includes(product._id);
        const isExcluded = discountRule.excludedProducts.includes(product._id);

        if ((isIncluded || discountRule.includedProducts.length === 0) && !isExcluded) {
          if (discountRule.type === 'percentage') {
            productPrice -= (productPrice * discountRule.value) / 100;
          } else if (discountRule.type === 'fixed') {
            productPrice -= discountRule.value;
          }

          if (productPrice < 0) productPrice = 0;
        }
      }

      const productTotal = productPrice * p.quantity;
      totalPrice += productTotal;

      return {
        product: product._id,
        name: product.name,
        price: productPrice, // ✅ Preço com desconto aplicado
        quantity: p.quantity,
        subtotal: productTotal, // ✅ Subtotal armazenado
      };
    });

    // criar novo pedido temporário no banco de dados
    const newOrder = new Order({
      company,
      products: formattedProducts,
      discountRule: discountRuleId,
      totalPrice,
      status: "pendente",
      isTemporary: true,
    });

    await newOrder.save();

    // Gerar link do pedido
    const orderLink = `http://localhost:5173/pedido/${newOrder._id}`;

    res.json({ orderId: newOrder._id, orderLink });
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    res.status(500).json({ message: "Erro ao criar pedido" });
  }
};

// Confirma uma ordem temporária
const confirmOrder = async (req, res) => {
  try {
    console.log("🔍 Headers recebidos:", req.headers);

    const { orderId } = req.params;
    const { address, customer } = req.body;
    const trackingId = req.headers["tracking-id"] || null; // Obtém o trackingId do cabeçalho da requisição

    console.log("🛠️ Recebendo requisição de confirmação...");
    console.log("🔹 orderId recebido:", orderId);
    console.log("🔹 address recebido:", address);
    console.log("🔹 customer recebido:", customer);
    console.log("🔹 trackingId recebido:", trackingId);

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Pedido não encontrado!" });
    }

    if (!order.isTemporary) {
      console.warn("⚠️ Este pedido já foi confirmado.");
      return res
        .status(200)
        .json({ message: "Este pedido já foi confirmado." });
    }

    const existingOrders = await Order.findOne({
      customer,
      isTemporary: false,
    });

    if (!existingOrders) {
      order.trackingId = trackingId;
      console.log("✅ Primeira compra detectada! Associando trackingId:",trackingId);
    } else {
      order.trackingId = null;
      console.log(
        "⚠️ Cliente já tem pedidos anteriores. Ignorando trackingId."
      );
    }

    order.isTemporary = false; // Marca como confirmado
    order.status = "confirmado"; // atualiza o status
    order.address = address; // Atualiza o endereço
    order.customer = customer;

    await order.save();

    res.status(200).json({ message: "Pedido confirmado com sucesso!" });
  } catch (error) {
    console.error("Erro ao confirmar pedido:", error);
    res.status(500).json({ message: "Erro ao confirmar pedido" });
  }
};

const getAverageTimeBetweenPurchases = async (req, res) => {
  try {
      const customers = await Order.aggregate([
          {
              $group: {
                  _id: "$customer",
                  orders: { $push: "$createdAt" } // Agrupa as datas de pedidos por cliente
              }
          }
      ]);

      let totalDays = 0;
      let totalIntervals = 0;

      customers.forEach((customer) => {
          // Filtra clientes com pelo menos duas compras
          if (customer.orders.length > 1) {
              const sortedOrders = customer.orders.sort((a, b) => new Date(a) - new Date(b));

              for (let i = 1; i < sortedOrders.length; i++) {
                  const date1 = new Date(sortedOrders[i - 1]);
                  const date2 = new Date(sortedOrders[i]);

                  if (!isNaN(date1) && !isNaN(date2)) {
                      const diffInMs = date2 - date1;
                      const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
                      totalDays += diffInDays;
                      totalIntervals++;
                  }
              }
          }
      });

      const averageTime = totalIntervals === 0 ? 0 : (totalDays / totalIntervals).toFixed(2);

      res.json({ averageTimeBetweenPurchases: `${averageTime} dias` });
  } catch (error) {
      console.error("Erro ao calcular o tempo médio entre compras:", error);
      res.status(500).json({ message: "Erro ao calcular o tempo médio entre compras" });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  createTemporaryOrder,
  confirmOrder,
  getAverageTimeBetweenPurchases
};
