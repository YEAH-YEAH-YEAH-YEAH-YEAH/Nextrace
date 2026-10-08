// État global
let currentUser = null;
let authToken = null;
let currentChatUser = null;
let currentPostId = null;

// API Base URL
const API_URL = 'http://localhost:3000/api';

// ========== AUTHENTIFICATION ==========
async function login() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    
    if (response.ok) {
      authToken = data.token;
      currentUser = data.user;
      localStorage.setItem('authToken', authToken);
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      showMainPage();
    } else {
      alert(data.error || 'Erreur de connexion');
    }
  } catch (error) {
    alert('Erreur réseau: ' + error.message);
  }
}

async function register() {
  const username = document.getElementById('register-username').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });

    const data = await response.json();
    
    if (response.ok) {
      alert('Inscription réussie ! Vous pouvez vous connecter.');
      switchToLogin();
    } else {
      alert(data.error || 'Erreur d\'inscription');
    }
  } catch (error) {
    alert('Erreur réseau: ' + error.message);
  }
}

function logout() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('currentUser');
  authToken = null;
  currentUser = null;
  document.getElementById('auth-page').classList.add('active');
  document.getElementById('main-page').classList.remove('active');
}

function switchToRegister() {
  document.getElementById('login-form').classList.remove('active');
  document.getElementById('register-form').classList.add('active');
}

function switchToLogin() {
  document.getElementById('register-form').classList.remove('active');
  document.getElementById('login-form').classList.add('active');
}

function showMainPage() {
  document.getElementById('auth-page').classList.remove('active');
  document.getElementById('main-page').classList.add('active');
  
  // Mettre à jour l'interface utilisateur
  document.getElementById('current-username').textContent = currentUser.username;
  document.getElementById('permission-badge').textContent = `Niveau ${currentUser.permission_level}`;
  
  // Afficher le menu admin si permission >= 4
  if (currentUser.permission_level >= 4) {
    document.getElementById('admin-nav').style.display = 'block';
  }
  
  // Charger le feed
  loadPosts();
  
  // Démarrer le polling pour les notifications
  startNotificationPolling();
}

// ========== NAVIGATION ==========
function showSection(section) {
  // Mettre à jour les sections
  document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
  document.getElementById(`${section}-section`).classList.add('active');
  
  // Mettre à jour la navigation
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
  document.querySelector(`[data-section="${section}"]`).classList.add('active');
  
  // Charger les données selon la section
  if (section === 'feed') {
    loadPosts();
  } else if (section === 'messages') {
    loadConversations();
  } else if (section === 'admin') {
    loadUsers();
  }
}

// ========== POSTS ==========
async function loadPosts() {
  try {
    const response = await fetch(`${API_URL}/posts`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    const posts = await response.json();
    displayPosts(posts);
  } catch (error) {
    console.error('Erreur lors du chargement des posts:', error);
  }
}

function displayPosts(posts) {
  const container = document.getElementById('posts-feed');
  
  if (posts.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 40px;">Aucun post pour le moment. Soyez le premier à publier !</p>';
    return;
  }
  
  container.innerHTML = posts.map(post => {
    const canDelete = currentUser.permission_level >= 3 || post.user_id === currentUser.id;
    const timeAgo = formatTimeAgo(post.created_at);
    const initials = post.username.substring(0, 2).toUpperCase();
    
    return `
      <div class="post-card">
        <div class="post-header">
          <div class="post-avatar">${initials}</div>
          <div class="post-user-info">
            <h4>${post.username}</h4>
            <div class="post-time">${timeAgo}</div>
          </div>
        </div>
        <div class="post-content">${escapeHtml(post.content)}</div>
        <div class="post-footer">
          <button class="post-action ${post.userHasLiked ? 'liked' : ''}" onclick="toggleLike(${post.id})">
            <i class="fas fa-heart"></i>
            <span>${post.likes_count || 0}</span>
          </button>
          <button class="post-action" onclick="showComments(${post.id})">
            <i class="fas fa-comment"></i>
            <span>${post.comments_count || 0}</span>
          </button>
          ${canDelete ? `<button class="post-action delete-btn" onclick="deletePost(${post.id})">
            <i class="fas fa-trash"></i> Supprimer
          </button>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

async function createPost() {
  const content = document.getElementById('new-post-content').value.trim();
  
  if (!content) {
    alert('Veuillez écrire quelque chose !');
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content })
    });

    if (response.ok) {
      document.getElementById('new-post-content').value = '';
      loadPosts();
    } else {
      const data = await response.json();
      alert(data.error || 'Erreur lors de la création du post');
    }
  } catch (error) {
    alert('Erreur réseau: ' + error.message);
  }
}

async function toggleLike(postId) {
  try {
    const response = await fetch(`${API_URL}/posts/${postId}/like`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    if (response.ok) {
      loadPosts();
    }
  } catch (error) {
    console.error('Erreur lors du like:', error);
  }
}

async function deletePost(postId) {
  if (!confirm('Êtes-vous sûr de vouloir supprimer ce post ?')) return;
  
  try {
    const response = await fetch(`${API_URL}/posts/${postId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    if (response.ok) {
      loadPosts();
    } else {
      const data = await response.json();
      alert(data.error || 'Erreur lors de la suppression');
    }
  } catch (error) {
    alert('Erreur réseau: ' + error.message);
  }
}

// ========== COMMENTAIRES ==========
async function showComments(postId) {
  currentPostId = postId;
  
  try {
    const response = await fetch(`${API_URL}/posts/${postId}/comments`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    const comments = await response.json();
    displayComments(comments);
    
    document.getElementById('comments-modal').classList.add('active');
  } catch (error) {
    console.error('Erreur lors du chargement des commentaires:', error);
  }
}

function displayComments(comments) {
  const container = document.getElementById('comments-container');
  
  if (comments.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 20px;">Aucun commentaire</p>';
    return;
  }
  
  container.innerHTML = comments.map(comment => {
    const initials = comment.username.substring(0, 2).toUpperCase();
    const timeAgo = formatTimeAgo(comment.created_at);
    
    return `
      <div class="comment-item">
        <div class="comment-header">
          <div class="comment-avatar">${initials}</div>
          <div>
            <strong>${comment.username}</strong>
            <span style="color: var(--text-light); font-size: 12px; margin-left: 10px;">${timeAgo}</span>
          </div>
        </div>
        <p>${escapeHtml(comment.content)}</p>
      </div>
    `;
  }).join('');
}

async function addComment() {
  const content = document.getElementById('comment-input').value.trim();
  
  if (!content) return;
  
  try {
    const response = await fetch(`${API_URL}/posts/${currentPostId}/comments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content })
    });

    if (response.ok) {
      document.getElementById('comment-input').value = '';
      showComments(currentPostId);
      loadPosts(); // Mettre à jour le compteur
    }
  } catch (error) {
    console.error('Erreur lors de l\'ajout du commentaire:', error);
  }
}

function closeCommentsModal() {
  document.getElementById('comments-modal').classList.remove('active');
  currentPostId = null;
}

// ========== PARAMÈTRES ==========
function openSettings() {
  // Remplir les infos utilisateur
  document.getElementById('settings-username').textContent = currentUser.username;
  document.getElementById('settings-email').textContent = currentUser.email;
  document.getElementById('settings-permission').textContent = `Niveau ${currentUser.permission_level}`;
  
  const joined = new Date(currentUser.created_at);
  document.getElementById('settings-joined').textContent = joined.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Charger le thème actuel
  const isDark = localStorage.getItem('darkMode') === 'true';
  document.getElementById('dn').checked = isDark;
  
  document.getElementById('settings-modal').classList.add('active');
}

function closeSettings() {
  document.getElementById('settings-modal').classList.remove('active');
}

// Toggle Dark Mode
document.addEventListener('DOMContentLoaded', () => {
  const toggleCheckbox = document.getElementById('dn');
  
  // Charger le thème sauvegardé
  const savedTheme = localStorage.getItem('darkMode');
  if (savedTheme === 'true') {
    document.body.classList.add('dark-mode');
    if (toggleCheckbox) toggleCheckbox.checked = true;
  }
  
  // Écouter les changements
  if (toggleCheckbox) {
    toggleCheckbox.addEventListener('change', function() {
      if (this.checked) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'true');
      } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'false');
      }
    });
  }
});

// ========== MESSAGES ==========
async function loadConversations() {
  try {
    const response = await fetch(`${API_URL}/messages/conversations`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    const conversations = await response.json();
    displayConversations(conversations);
  } catch (error) {
    console.error('Erreur lors du chargement des conversations:', error);
  }
}

function displayConversations(conversations) {
  const container = document.getElementById('conversations-container');
  
  if (conversations.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 20px;">Aucune conversation</p>';
    return;
  }
  
  container.innerHTML = conversations.map(conv => `
    <div class="conversation-item" onclick="openChat(${conv.other_user_id}, '${conv.other_username}')">
      <div class="conversation-name">${conv.other_username}</div>
      <div class="conversation-preview">${conv.last_message || 'Nouvelle conversation'}</div>
      ${conv.unread_count > 0 ? `<span class="badge">${conv.unread_count}</span>` : ''}
    </div>
  `).join('');
}

async function openChat(userId, username) {
  currentChatUser = { id: userId, username };
  
  // Mettre à jour l'interface
  document.getElementById('chat-header').style.display = 'block';
  document.getElementById('chat-user-name').textContent = username;
  document.getElementById('chat-input-container').style.display = 'flex';
  
  // Marquer les messages comme lus
  await fetch(`${API_URL}/messages/read/${userId}`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${authToken}` }
  });
  
  // Charger les messages
  loadMessages(userId);
  
  // Mettre à jour les conversations
  loadConversations();
}

async function loadMessages(otherUserId) {
  try {
    const response = await fetch(`${API_URL}/messages/${otherUserId}`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    const messages = await response.json();
    displayMessages(messages);
  } catch (error) {
    console.error('Erreur lors du chargement des messages:', error);
  }
}

function displayMessages(messages) {
  const container = document.getElementById('chat-messages');
  
  if (messages.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: var(--text-light);">Aucun message. Commencez la conversation !</p>';
    return;
  }
  
  container.innerHTML = messages.reverse().map(msg => {
    const isSent = msg.sender_id === currentUser.id;
    const timeAgo = formatTimeAgo(msg.created_at);
    
    return `
      <div class="message ${isSent ? 'sent' : 'received'}">
        <div class="message-bubble">${escapeHtml(msg.content)}</div>
        <div class="message-time">${timeAgo}</div>
      </div>
    `;
  }).join('');
  
  // Scroll vers le bas
  container.scrollTop = container.scrollHeight;
}

async function sendMessage() {
  const input = document.getElementById('chat-message-input');
  const content = input.value.trim();
  
  if (!content || !currentChatUser) return;
  
  try {
    const response = await fetch(`${API_URL}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        receiver_id: currentChatUser.id,
        content
      })
    });

    if (response.ok) {
      input.value = '';
      loadMessages(currentChatUser.id);
      loadConversations();
    }
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error);
  }
}

// Recherche d'utilisateurs
document.getElementById('search-users-input')?.addEventListener('input', async (e) => {
  const query = e.target.value.trim();
  
  if (query.length < 2) {
    document.getElementById('users-search-results').innerHTML = '';
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}/auth/users?search=${query}`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    const users = await response.json();
    const resultsContainer = document.getElementById('users-search-results');
    
    resultsContainer.innerHTML = users
      .filter(u => u.id !== currentUser.id)
      .map(user => `
        <div class="search-result-item" onclick="openChat(${user.id}, '${user.username}')">
          ${user.username}
        </div>
      `).join('');
  } catch (error) {
    console.error('Erreur lors de la recherche:', error);
  }
});

// Enter pour envoyer un message
document.getElementById('chat-message-input')?.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});

// ========== ADMIN ==========
async function loadUsers() {
  if (currentUser.permission_level < 4) return;
  
  try {
    const response = await fetch(`${API_URL}/admin/users`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    const users = await response.json();
    displayUsers(users);
  } catch (error) {
    console.error('Erreur lors du chargement des utilisateurs:', error);
  }
}

function displayUsers(users) {
  const container = document.getElementById('users-list');
  
  container.innerHTML = users.map(user => `
    <div class="user-item">
      <div class="user-details">
        <h4>${user.username}</h4>
        <div class="user-email">${user.email}</div>
      </div>
      <div class="permission-controls">
        <select id="perm-${user.id}" ${user.id === currentUser.id ? 'disabled' : ''}>
          <option value="1" ${user.permission_level === 1 ? 'selected' : ''}>Niveau 1 - Utilisateur</option>
          <option value="2" ${user.permission_level === 2 ? 'selected' : ''}>Niveau 2 - Modérateur</option>
          <option value="3" ${user.permission_level === 3 ? 'selected' : ''}>Niveau 3 - Modérateur avancé</option>
          <option value="4" ${user.permission_level === 4 ? 'selected' : ''}>Niveau 4 - Admin</option>
          ${currentUser.permission_level === 5 ? `<option value="5" ${user.permission_level === 5 ? 'selected' : ''}>Niveau 5 - Super Admin</option>` : ''}
        </select>
        ${user.id !== currentUser.id ? `<button class="btn btn-primary btn-sm" onclick="updatePermission(${user.id})">Mettre à jour</button>` : ''}
      </div>
    </div>
  `).join('');
}

async function updatePermission(userId) {
  const newLevel = parseInt(document.getElementById(`perm-${userId}`).value);
  const reason = prompt('Raison du changement (optionnel):');
  
  try {
    const response = await fetch(`${API_URL}/admin/users/${userId}/permission`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ permission_level: newLevel, reason })
    });

    if (response.ok) {
      alert('Permission mise à jour !');
      loadUsers();
    } else {
      const data = await response.json();
      alert(data.error || 'Erreur lors de la mise à jour');
    }
  } catch (error) {
    alert('Erreur réseau: ' + error.message);
  }
}

// ========== NOTIFICATIONS ==========
function startNotificationPolling() {
  // Vérifier les messages non lus toutes les 30 secondes
  setInterval(async () => {
    try {
      const response = await fetch(`${API_URL}/messages/unread-count`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      const data = await response.json();
      const badge = document.getElementById('unread-badge');
      
      if (data.count > 0) {
        badge.textContent = data.count;
        badge.style.display = 'block';
      } else {
        badge.style.display = 'none';
      }
    } catch (error) {
      console.error('Erreur lors de la vérification des notifications:', error);
    }
  }, 30000);
}

// ========== UTILITAIRES ==========
function formatTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 60) return 'À l\'instant';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `Il y a ${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `Il y a ${days}j`;
  return date.toLocaleDateString('fr-FR');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ========== INITIALISATION ==========
window.addEventListener('DOMContentLoaded', () => {
  // Simuler un temps de chargement pour l'animation
  setTimeout(() => {
    document.getElementById('loading-screen').classList.add('hidden');
    
    // Vérifier si l'utilisateur est déjà connecté
    const savedToken = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('currentUser');
    
    if (savedToken && savedUser) {
      authToken = savedToken;
      currentUser = JSON.parse(savedUser);
      showMainPage();
    }
  }, 2000); // 2 secondes de loading
});
