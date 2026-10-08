# 🌐 Réseau Social

Un réseau social moderne avec système de permissions avancé, messages privés et posts publics.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

## 🎬 Démo

🚀 **[Guide de démarrage rapide](QUICKSTART.md)** | 📖 **[Guide de déploiement complet](DEPLOY.md)**

![Loading Animation](https://img.shields.io/badge/Loading-Animated-blueviolet?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

## ✨ Fonctionnalités

### 🔐 Authentification
- Inscription et connexion sécurisées
- Tokens JWT avec expiration
- Mots de passe hashés avec bcrypt

### 📝 Posts Publics
- Créer, lire et supprimer des posts
- Système de likes
- Commentaires sur les posts
- Fil d'actualité en temps réel

### 💬 Messages Privés
- Chat 1-à-1 entre utilisateurs
- Historique des conversations
- Notifications de messages non lus
- Marquage automatique des messages comme lus

### 🛡️ Système de Permissions (5 niveaux)
- **Niveau 1 - Utilisateur** : Peut créer des posts, liker, commenter, envoyer des messages
- **Niveau 2 - Modérateur** : Peut supprimer ses propres posts
- **Niveau 3 - Modérateur Avancé** : Peut supprimer tous les posts et commentaires
- **Niveau 4 - Admin** : Peut gérer les utilisateurs et modifier les permissions (niveaux 1-4)
- **Niveau 5 - Super Admin** : Accès complet, peut créer d'autres Super Admins

### 👥 Panneau d'Administration
- Gestion des utilisateurs
- Modification des niveaux de permission
- Historique des modifications de permissions
- Statistiques du réseau

## 🚀 Installation

### Prérequis
- Node.js 14+ et npm

### Étapes d'installation

1. **Installer les dépendances**
```bash
npm install
```

2. **Démarrer le serveur**
```bash
npm start
```

Pour le développement avec rechargement automatique :
```bash
npm run dev
```

3. **Accéder à l'application**
Ouvrez votre navigateur sur : `http://localhost:3000`

## 📁 Structure du projet

```
Site/
├── database/
│   ├── init.js          # Initialisation de la base SQLite
│   └── queries.js       # Requêtes SQL
├── middleware/
│   └── auth.js          # Authentification JWT et permissions
├── routes/
│   ├── auth.js          # Routes d'authentification
│   ├── posts.js         # Routes des posts
│   ├── messages.js      # Routes des messages privés
│   └── admin.js         # Routes d'administration
├── public/
│   ├── index.html       # Interface utilisateur
│   ├── styles.css       # Styles CSS
│   └── app.js           # Logique frontend
├── config.js            # Configuration (JWT, permissions)
├── server.js            # Serveur Express
└── package.json         # Dépendances npm
```

## 🔧 Configuration

### Modifier le secret JWT
Dans `config.js`, changez la valeur de `JWT_SECRET` :
```javascript
JWT_SECRET: 'votre_nouveau_secret_ultra_securise'
```

### Ajuster les niveaux de permission
Dans `config.js`, vous pouvez modifier les seuils :
```javascript
PERMISSION_ACTIONS: {
  DELETE_OWN_POST: 1,
  DELETE_ANY_POST: 3,
  BAN_USER: 4,
  CHANGE_PERMISSIONS: 5
}
```

## 📊 Base de données

SQLite est utilisé par défaut. La base de données `social.db` sera créée automatiquement au premier démarrage dans le dossier `database/`.

### Tables principales :
- **users** - Utilisateurs et leurs permissions
- **posts** - Posts publics
- **comments** - Commentaires sur les posts
- **post_likes** - Likes des posts
- **messages** - Messages privés
- **conversations** - Liste des conversations actives
- **permission_history** - Historique des changements de permissions

## 🎯 Utilisation

### Première connexion
1. Créez un compte avec le formulaire d'inscription
2. Connectez-vous avec vos identifiants
3. Le premier utilisateur sera niveau 1 par défaut

### Créer un Super Admin
Pour créer le premier Super Admin, vous devez modifier manuellement la base de données :

```javascript
// Méthode 1 : Via un script Node.js temporaire
const { updateUserPermission } = require('./database/queries');
updateUserPermission(1, 5, 1, 'Premier Super Admin');
```

Ou utilisez un outil SQLite pour modifier directement :
```sql
UPDATE users SET permission_level = 5 WHERE id = 1;
```

### Gérer les permissions
1. Connectez-vous avec un compte Admin (niveau 4+)
2. Accédez au panneau "Admin" dans le menu
3. Sélectionnez le niveau de permission souhaité
4. Ajoutez une raison (optionnel) et validez

### Envoyer des messages privés
1. Allez dans l'onglet "Messages"
2. Recherchez un utilisateur dans la barre de recherche
3. Cliquez sur l'utilisateur pour ouvrir le chat
4. Tapez votre message et envoyez

## 🔒 Sécurité

### Règles de permission
- Un utilisateur ne peut pas modifier ses propres permissions
- Seul un Super Admin (niveau 5) peut :
  - Créer d'autres Super Admins
  - Modifier les permissions d'un autre Super Admin
- Un Admin (niveau 4) peut uniquement gérer les niveaux 1-4
- Un Admin niveau 4 ne peut pas modifier un autre Admin niveau 4

### Bonnes pratiques
- Changez le `JWT_SECRET` en production
- N'accordez le niveau 5 qu'aux personnes de confiance
- Utilisez HTTPS en production
- Ajoutez une limitation de taux (rate limiting) pour éviter les abus
- Sauvegardez régulièrement la base de données

## 🐛 Dépannage

### Le serveur ne démarre pas
- Vérifiez que le port 3000 n'est pas déjà utilisé
- Assurez-vous que toutes les dépendances sont installées : `npm install`

### Erreur de base de données
- Supprimez le fichier `database/social.db` et relancez le serveur
- Vérifiez les permissions d'écriture dans le dossier `database/`

### Les messages ne s'affichent pas
- Videz le cache de votre navigateur
- Vérifiez la console du navigateur (F12) pour voir les erreurs
- Assurez-vous d'être bien connecté

## 📝 API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/users` - Liste des utilisateurs

### Posts
- `GET /api/posts` - Récupérer tous les posts
- `POST /api/posts` - Créer un post
- `DELETE /api/posts/:id` - Supprimer un post
- `POST /api/posts/:id/like` - Liker/Unliker un post
- `GET /api/posts/:id/comments` - Récupérer les commentaires
- `POST /api/posts/:id/comments` - Ajouter un commentaire

### Messages
- `GET /api/messages/conversations` - Liste des conversations
- `GET /api/messages/:userId` - Messages avec un utilisateur
- `POST /api/messages` - Envoyer un message
- `POST /api/messages/read/:userId` - Marquer comme lu
- `GET /api/messages/unread-count` - Nombre de non-lus

### Administration (niveau 4+)
- `GET /api/admin/users` - Liste tous les utilisateurs
- `PUT /api/admin/users/:userId/permission` - Modifier les permissions
- `GET /api/admin/users/:userId/permission-history` - Historique
- `GET /api/admin/stats` - Statistiques du réseau

## 🎨 Personnalisation

### Modifier les couleurs
Dans `public/styles.css`, ajustez les variables CSS :
```css
:root {
  --primary: #4F46E5;
  --secondary: #10B981;
  --danger: #EF4444;
  /* ... */
}
```

### Ajouter des fonctionnalités
Le code est modulaire et facilement extensible :
- Ajoutez de nouvelles routes dans `routes/`
- Créez de nouvelles queries dans `database/queries.js`
- Étendez l'interface dans `public/`

## 📄 Licence

MIT - Libre d'utilisation et de modification

## 🤝 Contribution

N'hésitez pas à améliorer ce projet !

---

**Fait avec ❤️ pour créer des connections**
