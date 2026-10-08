const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken, requirePermission } = require('../middleware/auth');
const {
  createPost,
  getPostById,
  getAllPosts,
  deletePost,
  likePost,
  unlikePost,
  hasUserLikedPost,
  createComment,
  getCommentsByPost,
  deleteComment
} = require('../database/queries');

const router = express.Router();

// Toutes les routes nécessitent l'authentification
router.use(authenticateToken);

// Récupérer tous les posts
router.get('/', (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    const posts = getAllPosts(parseInt(limit), parseInt(offset));

    // Ajouter l'info si l'utilisateur a liké chaque post
    const postsWithLikes = posts.map(post => ({
      ...post,
      userHasLiked: hasUserLikedPost(post.id, req.user.id)
    }));

    res.json(postsWithLikes);
  } catch (error) {
    console.error('Erreur lors de la récupération des posts:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Récupérer un post spécifique
router.get('/:id', (req, res) => {
  try {
    const post = getPostById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post introuvable' });
    }

    post.userHasLiked = hasUserLikedPost(post.id, req.user.id);

    res.json(post);
  } catch (error) {
    console.error('Erreur lors de la récupération du post:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Créer un post
router.post('/', [
  body('content').trim().isLength({ min: 1, max: 5000 }).withMessage('Le contenu doit contenir entre 1 et 5000 caractères')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  try {
    const { content, image_url } = req.body;
    const post = createPost(req.user.id, content, image_url);

    res.status(201).json(post);
  } catch (error) {
    console.error('Erreur lors de la création du post:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Supprimer un post
router.delete('/:id', (req, res) => {
  try {
    const post = getPostById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post introuvable' });
    }

    // Vérifier les permissions
    // Niveau 1-2 : peut supprimer ses propres posts
    // Niveau 3+ : peut supprimer tous les posts
    const canDelete = req.user.permission_level >= 3 || post.user_id === req.user.id;

    if (!canDelete) {
      return res.status(403).json({ 
        error: 'Permission insuffisante pour supprimer ce post',
        required_level: 3,
        your_level: req.user.permission_level
      });
    }

    deletePost(req.params.id);

    res.json({ message: 'Post supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du post:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ========== LIKES ==========

// Liker/Unliker un post
router.post('/:id/like', (req, res) => {
  try {
    const post = getPostById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post introuvable' });
    }

    const hasLiked = hasUserLikedPost(req.params.id, req.user.id);

    if (hasLiked) {
      // Retirer le like
      unlikePost(req.params.id, req.user.id);
      res.json({ message: 'Like retiré', liked: false });
    } else {
      // Ajouter le like
      likePost(req.params.id, req.user.id);
      res.json({ message: 'Post liké', liked: true });
    }
  } catch (error) {
    console.error('Erreur lors du like:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ========== COMMENTAIRES ==========

// Récupérer les commentaires d'un post
router.get('/:id/comments', (req, res) => {
  try {
    const post = getPostById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post introuvable' });
    }

    const comments = getCommentsByPost(req.params.id);

    res.json(comments);
  } catch (error) {
    console.error('Erreur lors de la récupération des commentaires:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Ajouter un commentaire
router.post('/:id/comments', [
  body('content').trim().isLength({ min: 1, max: 1000 }).withMessage('Le commentaire doit contenir entre 1 et 1000 caractères')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  try {
    const post = getPostById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post introuvable' });
    }

    const { content } = req.body;
    const comment = createComment(req.params.id, req.user.id, content);

    res.status(201).json(comment);
  } catch (error) {
    console.error('Erreur lors de la création du commentaire:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Supprimer un commentaire
router.delete('/comments/:commentId', (req, res) => {
  try {
    // Pour l'instant, seuls les niveaux 3+ peuvent supprimer des commentaires
    if (req.user.permission_level < 3) {
      return res.status(403).json({ error: 'Permission insuffisante' });
    }

    deleteComment(req.params.commentId);

    res.json({ message: 'Commentaire supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du commentaire:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
