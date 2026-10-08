const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const { getUserById } = require('../database/queries');

// Vérifier le token JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token manquant' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Token invalide' });
    }

    const user = getUserById(decoded.userId);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur introuvable' });
    }

    req.user = user;
    next();
  });
};

// Vérifier le niveau de permission
const requirePermission = (requiredLevel) => {
  return (req, res, next) => {
    if (req.user.permission_level < requiredLevel) {
      return res.status(403).json({ 
        error: 'Permission insuffisante',
        required: requiredLevel,
        current: req.user.permission_level
      });
    }
    next();
  };
};

module.exports = {
  authenticateToken,
  requirePermission
};
