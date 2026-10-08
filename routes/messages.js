const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const {
  sendMessage,
  getMessagesBetween,
  getConversations,
  markMessagesAsRead,
  getUserById
} = require('../database/queries');

const router = express.Router();

// Toutes les routes nécessitent l'authentification
router.use(authenticateToken);

// Récupérer toutes les conversations de l'utilisateur
router.get('/conversations', (req, res) => {
  try {
    const conversations = getConversations(req.user.id);
    res.json(conversations);
  } catch (error) {
    console.error('Erreur lors de la récupération des conversations:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Récupérer les messages avec un utilisateur spécifique
router.get('/:userId', (req, res) => {
  try {
    const otherUserId = parseInt(req.params.userId);

    // Vérifier que l'utilisateur existe
    const otherUser = getUserById(otherUserId);
    if (!otherUser) {
      return res.status(404).json({ error: 'Utilisateur introuvable' });
    }

    const { limit = 50 } = req.query;
    const messages = getMessagesBetween(req.user.id, otherUserId, parseInt(limit));

    res.json(messages);
  } catch (error) {
    console.error('Erreur lors de la récupération des messages:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Envoyer un message
router.post('/', [
  body('receiver_id').isInt().withMessage('ID du destinataire invalide'),
  body('content').trim().isLength({ min: 1, max: 2000 }).withMessage('Le message doit contenir entre 1 et 2000 caractères')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  try {
    const { receiver_id, content } = req.body;

    // Vérifier qu'on n'envoie pas un message à soi-même
    if (receiver_id === req.user.id) {
      return res.status(400).json({ error: 'Vous ne pouvez pas vous envoyer un message à vous-même' });
    }

    // Vérifier que le destinataire existe
    const receiver = getUserById(receiver_id);
    if (!receiver) {
      return res.status(404).json({ error: 'Destinataire introuvable' });
    }

    const message = sendMessage(req.user.id, receiver_id, content);

    res.status(201).json(message);
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Marquer les messages d'un utilisateur comme lus
router.post('/read/:userId', (req, res) => {
  try {
    const senderId = parseInt(req.params.userId);

    // Marquer tous les messages de cet utilisateur comme lus
    markMessagesAsRead(senderId, req.user.id);

    res.json({ message: 'Messages marqués comme lus' });
  } catch (error) {
    console.error('Erreur lors du marquage des messages:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Récupérer le nombre de messages non lus
router.get('/unread-count', (req, res) => {
  try {
    const conversations = getConversations(req.user.id);
    const totalUnread = conversations.reduce((sum, conv) => sum + conv.unread_count, 0);

    res.json({ count: totalUnread });
  } catch (error) {
    console.error('Erreur lors du comptage des messages non lus:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
