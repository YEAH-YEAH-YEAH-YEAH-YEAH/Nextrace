# 🚀 Guide de Déploiement sur Render

## 📋 Prérequis
- Compte GitHub
- Compte Render (gratuit sur [render.com](https://render.com))

⚠️ **Important** : Render doit utiliser **Node.js 20.x** pour la compatibilité avec better-sqlite3

## 🔧 Étape 1 : Préparer GitHub

### 1.1 Initialiser Git localement
```bash
cd "c:\Users\nolwe\Desktop\Projet\Nextrace\Site"
git init
git add .
git commit -m "Initial commit - Réseau social complet"
```

### 1.2 Créer un dépôt sur GitHub
1. Allez sur [github.com](https://github.com)
2. Cliquez sur **New repository**
3. Nommez-le : `social-network`
4. Laissez-le **public** ou **private**
5. **NE PAS** initialiser avec README (on a déjà les fichiers)
6. Cliquez sur **Create repository**

### 1.3 Pousser le code sur GitHub
Copiez les commandes affichées par GitHub :
```bash
git remote add origin https://github.com/VOTRE_USERNAME/social-network.git
git branch -M main
git push -u origin main
```

## 🌐 Étape 2 : Déployer sur Render

### 2.1 Créer un nouveau service Web
1. Allez sur [dashboard.render.com](https://dashboard.render.com)
2. Cliquez sur **New +** → **Web Service**
3. Connectez votre compte GitHub si ce n'est pas fait
4. Sélectionnez votre dépôt `social-network`

### 2.2 Configurer le service
Remplissez les champs :

- **Name** : `social-network` (ou votre nom)
- **Region** : Choisissez le plus proche
- **Branch** : `main`
- **Runtime** : `Node`
- **Build Command** : `npm install`
- **Start Command** : `npm start`
- **Instance Type** : `Free` (gratuit)

### 2.3 Variables d'environnement
Ajoutez ces variables dans la section **Environment** :

| Key | Value |
|-----|-------|
| `NODE_VERSION` | `20.11.1` |
| `JWT_SECRET` | Cliquez sur **Generate** (ou entrez une longue chaîne aléatoire) |
| `NODE_ENV` | `production` |

⚠️ **Important** : Utilisez Node.js 20.x pour la compatibilité avec better-sqlite3

### 2.4 Déployer
Cliquez sur **Create Web Service** 

Render va :
1. ✅ Cloner votre code
2. ✅ Installer les dépendances
3. ✅ Démarrer le serveur
4. ✅ Vous donner une URL (ex: `https://social-network-abcd.onrender.com`)

⏱️ **Le premier déploiement prend 2-3 minutes**

## 🎉 Étape 3 : Tester votre application

1. Ouvrez l'URL fournie par Render
2. Créez un compte
3. Testez les fonctionnalités !

## 🔄 Mettre à jour l'application

Pour déployer de nouvelles modifications :

```bash
git add .
git commit -m "Description des changements"
git push origin main
```

Render redéploiera automatiquement ! 🚀

## ⚙️ Configuration avancée (optionnel)

### Utiliser un nom de domaine personnalisé
1. Dans Render, allez dans **Settings** → **Custom Domains**
2. Ajoutez votre domaine
3. Configurez les DNS selon les instructions

### Activer le SSL (HTTPS)
Render active automatiquement HTTPS avec Let's Encrypt ✅

### Logs et monitoring
- **Logs** : Onglet **Logs** dans le dashboard
- **Métriques** : Onglet **Metrics** pour voir l'utilisation

## 🐛 Dépannage

### L'application ne démarre pas
1. Vérifiez les logs dans Render
2. Assurez-vous que `JWT_SECRET` est défini
3. Vérifiez que `node_modules` n'est PAS dans le dépôt Git
4. **Si erreur better-sqlite3** : Consultez [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

### Erreur de compilation better-sqlite3
⚠️ **Solution rapide** : Utilisez Node.js 20.x au lieu de 26.x

Dans Render :
```
NODE_VERSION = 20.11.1
```

👉 **Guide complet** : [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

### La base de données se réinitialise
Sur le plan gratuit de Render, la base de données SQLite peut se réinitialiser lors des redéploiements. Pour une solution permanente :
- Utilisez PostgreSQL (gratuit sur Render)
- Ou passez au plan payant avec disque persistant

### Erreur de build
```bash
# Localement, testez :
npm install
npm start
```

Si ça fonctionne localement, vérifiez :
- La version de Node dans `package.json`
- Les variables d'environnement sur Render

## 💡 Conseils

✅ **À faire :**
- Utilisez des secrets forts pour `JWT_SECRET`
- Surveillez les logs régulièrement
- Sauvegardez la base de données
- Ajoutez un fichier `robots.txt` si besoin

❌ **À éviter :**
- Ne commitez jamais les secrets dans Git
- Ne partagez pas votre `JWT_SECRET`
- N'oubliez pas de mettre à jour les dépendances

## 📚 Ressources

- [Documentation Render](https://render.com/docs)
- [Documentation Node.js](https://nodejs.org/docs)
- [Guide Git](https://git-scm.com/doc)

---

**Besoin d'aide ?** Vérifiez les logs dans Render ou ouvrez une issue sur GitHub ! 🚀
