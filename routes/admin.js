const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken, requirePermission } = require('../middleware/auth');
const { PERMISSIONS } = require('../config');
const {
  getAllUsers,
  getUserById,
  updateUserPermission,
  getPermissionHistory
} = require('../database/queries');

const router = express.Router();

// Toutes les routes nécessitent l'authentification
router.use(authenticateToken);

// Récupérer tous les utilisateurs (Admin niveau 4+)
router.get('/users', requirePermission(PERMISSIONS.ADMIN), (req, res) => {
  try {
    const users = getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Récupérer l'historique des permissions d'un utilisateur (Admin niveau 4+)
router.get('/users/:userId/permission-history', requirePermission(PERMISSIONS.ADMIN), (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const user = getUserById(userId);

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur introuvable' });
    }

    const history = getPermissionHistory(userId);
    res.json(history);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'historique:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Mettre à jour les permissions d'un utilisateur (Super Admin niveau 5 pour tout, Admin niveau 4 pour niveaux inférieurs)
router.put('/users/:userId/permission', [
  body('permission_level').isInt({ min: 1, max: 5 }).withMessage('Niveau de permission invalide (1-5)'),
  body('reason').optional().trim()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  try {
    const userId = parseInt(req.params.userId);
    const { permission_level, reason } = req.body;

    // Vérifier que l'utilisateur cible existe
    const targetUser = getUserById(userId);
    if (!targetUser) {
      return res.status(404).json({ error: 'Utilisateur introuvable' });
    }

    // Ne pas pouvoir modifier ses propres permissions
    if (userId === req.user.id) {
      return res.status(403).json({ error: 'Vous ne pouvez pas modifier vos propres permissions' });
    }

    // Vérifications de sécurité :
    // 1. Seul un niveau 5 peut attribuer le niveau 5
    if (permission_level === PERMISSIONS.SUPER_ADMIN && req.user.permission_level < PERMISSIONS.SUPER_ADMIN) {
      return res.status(403).json({ 
        error: 'Seul un Super Admin (niveau 5) peut attribuer le niveau 5',
        your_level: req.user.permission_level
      });
    }

    // 2. Seul un niveau 5 peut modifier un autre niveau 5
    if (targetUser.permission_level === PERMISSIONS.SUPER_ADMIN && req.user.permission_level < PERMISSIONS.SUPER_ADMIN) {
      return res.status(403).json({ 
        error: 'Seul un Super Admin (niveau 5) peut modifier un autre Super Admin',
        your_level: req.user.permission_level
      });
    }

    // 3. Un admin niveau 4 peut modifier les niveaux 1-4 uniquement
    if (req.user.permission_level === PERMISSIONS.ADMIN && permission_level >= PERMISSIONS.SUPER_ADMIN) {
      return res.status(403).json({ 
        error: 'Un Admin niveau 4 ne peut attribuer que les niveaux 1-4',
        your_level: req.user.permission_level
      });
    }

    // 4. Un admin niveau 4 ne peut pas modifier un autre admin niveau 4 (sauf si super admin)
    if (targetUser.permission_level === PERMISSIONS.ADMIN && 
        req.user.permission_level === PERMISSIONS.ADMIN) {
      return res.status(403).json({ 
        error: 'Vous ne pouvez pas modifier les permissions d\'un autre Admin niveau 4',
        your_level: req.user.permission_level
      });
    }

    // Tout est bon, on peut mettre à jour
    const updatedUser = updateUserPermission(userId, permission_level, req.user.id, reason || 'Aucune raison fournie');

    res.json({ 
      message: 'Permissions mises à jour avec succès',
      user: updatedUser
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des permissions:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Récupérer les statistiques du réseau (Admin niveau 4+)
router.get('/stats', requirePermission(PERMISSIONS.ADMIN), (req, res) => {
  try {
    const { getDatabase } = require('../database/init');
    const db = getDatabase();

    const stats = {
      total_users: db.prepare('SELECT COUNT(*) as count FROM users').get().count,
      total_posts: db.prepare('SELECT COUNT(*) as count FROM posts').get().count,
      total_comments: db.prepare('SELECT COUNT(*) as count FROM comments').get().count,
      total_messages: db.prepare('SELECT COUNT(*) as count FROM messages').get().count,
      users_by_permission: db.prepare(`
        SELECT permission_level, COUNT(*) as count 
        FROM users 
        GROUP BY permission_level 
        ORDER BY permission_level
      `).all(),
      recent_activity: {
        posts_today: db.prepare('SELECT COUNT(*) as count FROM posts WHERE DATE(created_at) = DATE("now")').get().count,
        messages_today: db.prepare('SELECT COUNT(*) as count FROM messages WHERE DATE(created_at) = DATE("now")').get().count
      }
    };

    res.json(stats);
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
