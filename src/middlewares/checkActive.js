const User = require('../models/User');

const checkActive = async(req, res, next) => {
  try {
    const userId = req.user.id;
    console.log(userId);
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Conta bloqueada. Pagamento pendente." });
    }

    next();
  } catch (err) {
    console.error("Erro no middleware checkActive:", err);
    res.status(500).json({ message: "Erro interno" });
  }
}

module.exports = checkActive;