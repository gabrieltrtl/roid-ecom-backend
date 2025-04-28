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
    } = req.body;

    // Verificando se o cliente existe
    const customerExists = await Customer.findOne({ _id: customer, company: req.companyId });
    if (!customerExists) {
      return res.status(400).json({ message: "Cliente não encontrado!" });
    }

    // Verificando se os produtos existem
    const productIds = products.map((p) => p.product);
    const productsExist = await Product.find({ _id: { $in: productIds }, company: req.companyId });
    if (productsExist.length !== products.length) {
      return res
        .status(400)
        .json({ message: "Um ou mais produtos não encontrados!" });
    }

    // Buscar regra de desconto, se existir.
    let discountRule = null;
    if (discountRuleId) {
      discountRule = await DiscountRule.findOne({ _id: discountRuleId, company: req.companyId }); // ✅ Garantia que a regra pertence à empresa
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
      company: req.companyId,
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
// Função para listar todos os pedidos com suporte a filtro de data
const getOrders = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const filter = {
      company: req.companyId
    };

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate + 'T00:00:00.000Z'),
        $lte: new Date(endDate + 'T23:59:59.999Z'),
      };
    }

    const orders = await Order.find(filter).populate("customer", "name surname email");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar pedidos", error });
  }
};


// Função para obter um pedido específico
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id)
      .populate('customer')
      .populate('discountRule')
      .populate({
        path: 'products.product',   // 🔥 popula o campo correto
        model: 'Product'            // 💡 certifique-se que o model realmente se chama 'Product'
      });

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
    const { products, discountRule: discountRuleId } = req.body;
    console.log("🏢 Empresa identificada:", req.companyId);

    if (!req.companyId) {
      console.error("❌ Empresa não identificada.");
      return res.status(400).json({ message: "Empresa não identificada!" });
    }

    if (!products || products.length === 0) {
      console.error("❌ Nenhum produto fornecido.");
      return res.status(400).json({ message: "Produtos obrigatórios." });
    }

    const productIds = products.map((p) => p.product);
    const productsData = await Product.find({ _id: { $in: productIds }, company: req.companyId });

    if (productsData.length !== products.length) {
      console.error("❌ Produtos não encontrados:", productIds);
      return res.status(400).json({ message: "Um ou mais produtos não encontrados!" });
    }

    let discountRule = null;
    if (discountRuleId) {
      discountRule = await DiscountRule.findOne({ _id: discountRuleId, company: req.companyId });
      if (!discountRule) {
        console.error(`❌ Regra de desconto com ID ${discountRuleId} não encontrada.`);
        return res.status(404).json({ message: "Regra de desconto não encontrada!" });
      }
    }

    let totalPrice = 0;
    const formattedProducts = products.map((p) => {
      const product = productsData.find((prod) => prod._id.toString() === p.product.toString());

      if (!product) {
        console.error(`❌ Produto com ID ${p.product} não encontrado.`);
        throw new Error(`Produto com ID ${p.product} não encontrado.`);
      }

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
          } else if (discountRule.type === 'override') {
            productPrice = discountRule.value;
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

    console.log("📝 Criando novo pedido temporário com os dados:", {
      company: req.companyId,
      products: formattedProducts,
      discountRule: discountRuleId,
      totalPrice,
    });



    // criar novo pedido temporário no banco de dados
    const newOrder = new Order({
      company: req.companyId,
      products: formattedProducts,
      discountRule: discountRuleId,
      totalPrice,
      status: "PENDENTE",
      isTemporary: true,
    });

    await newOrder.save();

    // Gerar link do pedido
    const subdomain = req.company?.domain || 'localhost';
    const port = 5173; // Use variável de ambiente se quiser
    const orderLink = `http://${subdomain}.localhost:${port}/pedido/${newOrder._id}`;


    res.json({ orderId: newOrder._id, orderLink });
  } catch (error) {
    console.error("❌ Erro ao criar pedido temporário:", error);
    res.status(500).json({ message: "Erro ao criar pedido temporário", error });
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
    console.log(order);

    if (!order) {
      return res.status(404).json({ message: "Pedido não encontrado!" });
    }

    if (!order.isTemporary || order.status == "CONFIRMADO") {
      console.warn("⚠️ Este pedido já foi confirmado.");
      return res.status(400).json({ message: "Este pedido já foi confirmado." });
    }

    const existingOrders = await Order.findOne({
      customer,
      isTemporary: false,
    });

    console.log(existingOrders);

    if (!existingOrders) {
      order.trackingId = trackingId;
      console.log("✅ Primeira compra detectada! Associando trackingId:",trackingId);
    } else {
      order.trackingId = null;
      console.log(
        "⚠️ Cliente já tem pedidos anteriores. Ignorando trackingId."
      );
    }

     // Atualizando o estoque
     for (const item of order.products) {
      const product = await Product.findById(item.product); // Encontre o produto no banco
      if (product) {
        if (product.stock >= item.quantity) {
          product.stock -= item.quantity; // Diminui a quantidade do produto
          await product.save(); // Salva a alteração no banco
          console.log(`✅ Estoque do produto ${product.name} atualizado: ${product.stock}`);
        } else {
          return res.status(400).json({ message: `Estoque insuficiente para o produto ${product.name}.` });
        }
      } else {
        return res.status(404).json({ message: `Produto com ID ${item.product} não encontrado.` });
      }
    }

    order.isTemporary = false; // Marca como confirmado
    order.status = "CONFIRMADO"; // atualiza o status
    order.address = address; // Atualiza o endereço
    order.customer = customer;

    await order.save();

    res.status(200).json({ message: "Pedido confirmado com sucesso!" });
  } catch (error) {
    console.error("Erro ao confirmar pedido:", error);
    res.status(500).json({ message: "Erro ao confirmar pedido" });
  }
};

// Puxar status disponívels no banco de dados
const getOrderStatuses = async (req, res) => {
  try {
    // Captura os status diretamente do modelo ENUM
    const statusField = Order.schema.path('status');

    if (!statusField || !statusField.enumValues) {
      throw new Error("Os status do pedido não foram encontrados no Model.");
    }

    // Obtém os valores possíveis do ENUM do Model
    const statuses = statusField.enumValues;

    res.json(statuses);
  } catch (error) {
    console.error("Erro ao buscar os status de pedidos:", error);
    res.status(500).json({ message: "Erro ao buscar status de pedidos" });
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

const updateTrackingCode = async (req, res) => {
  const { id } = req.params;
  const { trackingCode } = req.body;

  if (!trackingCode) {
    return res.status(400).json({ error: "O código de rastreio é obrigatório." });
  }

  try {
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: id, company: req.companyId },
      {
        trackingCode,
        status: "ENVIADO", // ✅ Atualiza o status também
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Pedido não encontrado." });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Erro ao atualizar código de rastreio:", error);
    res.status(500).json({ error: "Erro interno ao atualizar o pedido." });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    console.log("🟡 Cancelando pedido ID:", orderId);
    console.log("Empresa:", req.company?._id); // ← importante no multi-tenant

    const order = await Order.findOne({ _id: orderId, company: req.companyId });

    if (!order) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }

    // 🧹 Limpa os dados do pedido e marca como CANCELADO
    order.status = 'CANCELADO';
    order.totalPrice = 0;
    order.products = [];
    order.discountRule = null;
    order.shippingPolicy = null;
    order.trackingId = null;
    order.trackingCode = null;
    order.orderId = `CANCELADO-${Date.now()}`;; // ou `CANCELADO_123` se quiser manter ID visível

    await order.save();

    return res.status(200).json(order);
  } catch (error) {
    console.error('Erro ao cancelar pedido:', error);
    return res.status(500).json({ message: 'Erro interno ao cancelar o pedido' });
  }
}

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  createTemporaryOrder,
  confirmOrder,
  getOrderStatuses,
  getAverageTimeBetweenPurchases,
  updateTrackingCode,
  cancelOrder
};
