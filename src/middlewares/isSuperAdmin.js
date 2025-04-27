const isSuperAdmin = (req, res, next) => {
  if (req.role !== 'superadmin') {
    return res.status(403).json({ message: 'Acesso negado. Apenas superadministradores podem realizar esta ação.' });
  }
  next();
};

module.exports = isSuperAdmin;
