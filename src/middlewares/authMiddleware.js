const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.log("❌ Sem token");
    return res.status(401).json({ message: 'Token não fornecido.' });
  }

  const token = authHeader.split(' ')[1]; // Pega o token depois do "Bearer"


  try {
    // verifica se o token é válido
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifica a assinatura do token
    
    // Atribui os dados do usuário ao objeto `req`
    req.user = {
      id: decoded.userId,
      role: String(decoded.role || '').trim().toLowerCase(),
      companyId: decoded.companyId || null
    };
    
    console.log('auth payload =>', req.user);
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido ou expirado' });
  }
};

module.exports = authMiddleware;