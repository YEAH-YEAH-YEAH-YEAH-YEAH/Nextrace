# 🚀 Démarrage Rapide

## Option 1️⃣ : Déploiement automatique sur Render (Recommandé)

### Étape unique :
1. **Double-cliquez** sur `deploy-github.bat`
2. Suivez les instructions à l'écran
3. Allez sur [render.com](https://render.com) et connectez votre GitHub
4. Votre site sera en ligne en 3 minutes ! ✨

---

## Option 2️⃣ : Test en local

### 1. Installer les dépendances
```bash
npm install
```

### 2. Créer un Super Admin
```bash
npm run create-admin
```
Utilisez : **admin@social.com** / **admin123456**

### 3. Démarrer le serveur
```bash
npm start
```

### 4. Ouvrir dans le navigateur
👉 http://localhost:3000

---

## 🎨 Fonctionnalités

✅ **Inscription/Connexion** sécurisée  
✅ **Posts publics** avec likes et commentaires  
✅ **Messages privés** en temps réel  
✅ **5 niveaux de permissions**  
✅ **Panneau d'administration**  
✅ **Loading animé** moderne  

---

## 🎯 Premiers pas

1. **Créez votre compte** sur la page d'accueil
2. **Publiez votre premier post**
3. **Envoyez des messages** aux autres utilisateurs
4. Si vous êtes Admin, **gérez les permissions** dans le panneau Admin

---

## 🛡️ Niveaux de permission

| Niveau | Rôle | Peut faire |
|--------|------|-----------|
| 1 | Utilisateur | Posts, likes, commentaires, messages |
| 2 | Modérateur | + Supprimer ses posts |
| 3 | Mod Avancé | + Supprimer tous les posts |
| 4 | Admin | + Gérer utilisateurs (niv 1-4) |
| 5 | Super Admin | + Tout gérer |

---

## 📝 Créer un compte Admin après déploiement

### Sur Render :
1. Ouvrez le **Shell** dans votre service Render
2. Tapez :
```bash
npm run create-admin admin@exemple.com MonNom motdepasse123
```

### Ou modifiez manuellement la base de données SQLite

---

## ❓ Besoin d'aide ?

📖 Consultez **DEPLOY.md** pour le guide complet  
📖 Consultez **README.md** pour la documentation technique  

---

**Fait avec ❤️ pour connecter le monde** 🌐
