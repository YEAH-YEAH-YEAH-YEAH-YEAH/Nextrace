const { getDatabase } = require('./init');

const db = getDatabase();

// ========== USERS ==========
const createUser = (username, email, hashedPassword) => {
  const stmt = db.prepare('INSERT INTO users (username, email, password) VALUES (?, ?, ?)');
  return stmt.run(username, email, hashedPassword);
};

const getUserByEmail = (email) => {
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
};

const getUserByUsername = (username) => {
  return db.prepare('SELECT * FROM users WHERE username = ?').get(username);
};

const getUserById = (id) => {
  return db.prepare('SELECT id, username, email, permission_level, bio, avatar_url, created_at FROM users WHERE id = ?').get(id);
};

const getAllUsers = () => {
  return db.prepare('SELECT id, username, email, permission_level, bio, avatar_url, created_at FROM users ORDER BY created_at DESC').all();
};

const updateUserPermission = (userId, newLevel, changedBy, reason) => {
  const user = getUserById(userId);
  if (!user) return null;

  // Enregistrer dans l'historique
  db.prepare('INSERT INTO permission_history (user_id, changed_by, old_level, new_level, reason) VALUES (?, ?, ?, ?, ?)')
    .run(userId, changedBy, user.permission_level, newLevel, reason);

  // Mettre à jour la permission
  db.prepare('UPDATE users SET permission_level = ? WHERE id = ?').run(newLevel, userId);
  return getUserById(userId);
};

const updateLastLogin = (userId) => {
  db.prepare('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?').run(userId);
};

// ========== POSTS ==========
const createPost = (userId, content, imageUrl = null) => {
  const stmt = db.prepare('INSERT INTO posts (user_id, content, image_url) VALUES (?, ?, ?)');
  const result = stmt.run(userId, content, imageUrl);
  return getPostById(result.lastInsertRowid);
};

const getPostById = (postId) => {
  return db.prepare(`
    SELECT p.*, u.username, u.avatar_url,
           (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) as likes_count,
           (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count
    FROM posts p
    JOIN users u ON p.user_id = u.id
    WHERE p.id = ?
  `).get(postId);
};

const getAllPosts = (limit = 50, offset = 0) => {
  return db.prepare(`
    SELECT p.*, u.username, u.avatar_url,
           (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) as likes_count,
           (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count
    FROM posts p
    JOIN users u ON p.user_id = u.id
    ORDER BY p.created_at DESC
    LIMIT ? OFFSET ?
  `).all(limit, offset);
};

const deletePost = (postId) => {
  return db.prepare('DELETE FROM posts WHERE id = ?').run(postId);
};

// ========== LIKES ==========
const likePost = (postId, userId) => {
  try {
    db.prepare('INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)').run(postId, userId);
    return true;
  } catch (err) {
    return false; // Déjà liké
  }
};

const unlikePost = (postId, userId) => {
  return db.prepare('DELETE FROM post_likes WHERE post_id = ? AND user_id = ?').run(postId, userId);
};

const hasUserLikedPost = (postId, userId) => {
  const result = db.prepare('SELECT 1 FROM post_likes WHERE post_id = ? AND user_id = ?').get(postId, userId);
  return !!result;
};

// ========== COMMENTS ==========
const createComment = (postId, userId, content) => {
  const stmt = db.prepare('INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)');
  const result = stmt.run(postId, userId, content);
  return db.prepare(`
    SELECT c.*, u.username, u.avatar_url
    FROM comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.id = ?
  `).get(result.lastInsertRowid);
};

const getCommentsByPost = (postId) => {
  return db.prepare(`
    SELECT c.*, u.username, u.avatar_url
    FROM comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.post_id = ?
    ORDER BY c.created_at ASC
  `).all(postId);
};

const deleteComment = (commentId) => {
  return db.prepare('DELETE FROM comments WHERE id = ?').run(commentId);
};

// ========== MESSAGES ==========
const sendMessage = (senderId, receiverId, content) => {
  const stmt = db.prepare('INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)');
  const result = stmt.run(senderId, receiverId, content);

  // Créer ou mettre à jour la conversation
  const user1 = Math.min(senderId, receiverId);
  const user2 = Math.max(senderId, receiverId);
  
  db.prepare(`
    INSERT INTO conversations (user1_id, user2_id, last_message_at)
    VALUES (?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(user1_id, user2_id) 
    DO UPDATE SET last_message_at = CURRENT_TIMESTAMP
  `).run(user1, user2);

  return db.prepare('SELECT * FROM messages WHERE id = ?').get(result.lastInsertRowid);
};

const getMessagesBetween = (userId1, userId2, limit = 50) => {
  return db.prepare(`
    SELECT m.*, 
           s.username as sender_username, s.avatar_url as sender_avatar,
           r.username as receiver_username
    FROM messages m
    JOIN users s ON m.sender_id = s.id
    JOIN users r ON m.receiver_id = r.id
    WHERE (m.sender_id = ? AND m.receiver_id = ?)
       OR (m.sender_id = ? AND m.receiver_id = ?)
    ORDER BY m.created_at DESC
    LIMIT ?
  `).all(userId1, userId2, userId2, userId1, limit);
};

const getConversations = (userId) => {
  return db.prepare(`
    SELECT 
      CASE WHEN c.user1_id = ? THEN c.user2_id ELSE c.user1_id END as other_user_id,
      CASE WHEN c.user1_id = ? THEN u2.username ELSE u1.username END as other_username,
      CASE WHEN c.user1_id = ? THEN u2.avatar_url ELSE u1.avatar_url END as other_avatar,
      c.last_message_at,
      (SELECT COUNT(*) FROM messages WHERE receiver_id = ? AND sender_id = other_user_id AND is_read = 0) as unread_count,
      (SELECT content FROM messages 
       WHERE (sender_id = ? AND receiver_id = other_user_id) 
          OR (sender_id = other_user_id AND receiver_id = ?)
       ORDER BY created_at DESC LIMIT 1) as last_message
    FROM conversations c
    JOIN users u1 ON c.user1_id = u1.id
    JOIN users u2 ON c.user2_id = u2.id
    WHERE c.user1_id = ? OR c.user2_id = ?
    ORDER BY c.last_message_at DESC
  `).all(userId, userId, userId, userId, userId, userId, userId, userId);
};

const markMessagesAsRead = (senderId, receiverId) => {
  return db.prepare('UPDATE messages SET is_read = 1 WHERE sender_id = ? AND receiver_id = ?').run(senderId, receiverId);
};

// ========== PERMISSION HISTORY ==========
const getPermissionHistory = (userId) => {
  return db.prepare(`
    SELECT ph.*, u.username as changed_by_username
    FROM permission_history ph
    JOIN users u ON ph.changed_by = u.id
    WHERE ph.user_id = ?
    ORDER BY ph.changed_at DESC
  `).all(userId);
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserByUsername,
  getUserById,
  getAllUsers,
  updateUserPermission,
  updateLastLogin,
  createPost,
  getPostById,
  getAllPosts,
  deletePost,
  likePost,
  unlikePost,
  hasUserLikedPost,
  createComment,
  getCommentsByPost,
  deleteComment,
  sendMessage,
  getMessagesBetween,
  getConversations,
  markMessagesAsRead,
  getPermissionHistory
};
