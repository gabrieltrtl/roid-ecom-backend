const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user.role;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: 'Acesso negado: você não tem permissão para acessar esse recurso.' });
    }

    next(); // Permite o acesso se o usuário tiver a permissão necessária
  };
};

module.exports = roleMiddleware;
