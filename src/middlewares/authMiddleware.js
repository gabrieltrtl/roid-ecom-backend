const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorzation.split(' ')[1]; // obtendo o token

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  try {
    // verifica se o token é válido
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifica a assinatura do token
    req.user = decoded;
    // Atribui os dados do usuário ao objeto `req`
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido ou expirado' });
  }
};

module.exports = authMiddleware;