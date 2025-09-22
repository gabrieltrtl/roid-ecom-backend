const isSuperAdmin = (req, res, next) => {
  // pega a role de onde o authMiddleware coloca
  const role =
    (req.user && req.user.role) ||   // ✅ usa req.user.role
    req.role ||                      // fallback se existir req.role
    '';

  const normalized = String(role).trim().toLowerCase();

  if (normalized !== 'superadmin') {
    return res.status(403).json({
      message: 'Acesso negado. Apenas superadministradores podem realizar esta ação.'
    });
  }

  next();
};

module.exports = isSuperAdmin;
