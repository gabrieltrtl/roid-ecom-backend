const jwt = require("jsonwebtoken");

const identifyCompany = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(400).json({ message: 'Token ausente.' })
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.companyId = decoded.companyId;
    req.userId = decoded.userId;
    req.role = decoded.role;

    

    next();
  } catch (error) {
    console.error("❌ Erro ao verificar token:", error);
    return res.status(401).json({ message: 'Token inválido ou expirado' });
  }
};

module.exports = identifyCompany;