# 🔧 Dépannage Render

## ❌ Erreur : better-sqlite3 build failed

Si vous voyez cette erreur lors du déploiement sur Render, voici les solutions :

### ✅ Solution 1 : Forcer Node.js 20.x (Recommandée)

Dans votre dashboard Render, vérifiez les **Environment Variables** :
```
NODE_VERSION = 20.11.1
```

Puis **redéployez** manuellement.

### ✅ Solution 2 : Utiliser PostgreSQL au lieu de SQLite

Si le problème persiste, utilisez PostgreSQL (gratuit sur Render) :

1. **Installer les dépendances PostgreSQL** :
```bash
npm install pg pg-hstore
npm uninstall better-sqlite3
```

2. **Modifier `database/init.js`** pour utiliser PostgreSQL au lieu de SQLite

3. **Créer une base PostgreSQL** sur Render (gratuit)

### ✅ Solution 3 : Déployer sur un autre service

Si Render pose problème, ces alternatives fonctionnent aussi :

#### **Railway.app** (Recommandé)
- Plus simple que Render
- Support natif de SQLite
- Gratuit pour commencer
- URL : https://railway.app

Déploiement :
```bash
# Installer Railway CLI
npm i -g @railway/cli

# Se connecter
railway login

# Déployer
railway up
```

#### **Fly.io**
- Excellent support pour SQLite
- Stockage persistant gratuit
- URL : https://fly.io

```bash
# Installer Fly CLI
curl -L https://fly.io/install.sh | sh

# Se connecter
fly auth login

# Lancer le déploiement
fly launch
```

#### **Glitch.com**
- Le plus simple pour débuter
- Éditeur en ligne
- URL : https://glitch.com

1. Allez sur Glitch
2. Cliquez sur "New Project" → "Import from GitHub"
3. Collez l'URL de votre repo
4. C'est déployé ! ✨

### ✅ Solution 4 : Build en local et commit le binaire

⚠️ **Non recommandé mais fonctionne**

```bash
# En local
npm install
git add node_modules/better-sqlite3/build
git commit -m "Add prebuilt binary"
git push
```

Render utilisera le binaire pré-compilé.

## 🐛 Autres erreurs courantes

### Port déjà utilisé en local
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Ou changez le port dans server.js
const PORT = process.env.PORT || 3001;
```

### Base de données verrouillée
```bash
# Supprimez le fichier
rm database/social.db
npm start
```

### JWT_SECRET manquant sur Render
1. Allez dans **Environment** de votre service
2. Ajoutez `JWT_SECRET` avec une valeur aléatoire longue
3. **Redéployez**

### Cannot find module 'express'
```bash
npm install
```

## 📚 Ressources

- [Documentation Render](https://render.com/docs/native-environments)
- [better-sqlite3 Issues](https://github.com/WiseLibs/better-sqlite3/issues)
- [Railway Docs](https://docs.railway.app)
- [Fly.io Docs](https://fly.io/docs)

## 💡 Besoin d'aide ?

1. Vérifiez les **logs** dans votre dashboard Render
2. Recherchez l'erreur exacte sur Google
3. Ouvrez une issue sur GitHub avec les logs complets

---

**90% du temps, la Solution 1 (Node 20.x) résout le problème** ✅
