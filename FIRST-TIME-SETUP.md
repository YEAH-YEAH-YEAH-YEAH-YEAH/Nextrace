# 🎉 Premier Déploiement - Guide Complet

## 👋 Bienvenue !

Vous êtes sur le point de déployer votre réseau social. Ce guide vous accompagne étape par étape.

---

## ⏱️ Temps estimé : 10 minutes

---

## 📋 Checklist Avant de Commencer

- [ ] Node.js 20.x installé ([télécharger](https://nodejs.org))
- [ ] Git installé ([télécharger](https://git-scm.com))
- [ ] Compte GitHub créé ([s'inscrire](https://github.com))
- [ ] Compte Render créé ([s'inscrire](https://render.com))

---

## 🚀 Étape 1 : Tester en local (5 min)

### Option A : Script automatique (Windows)
Double-cliquez sur **`test-before-deploy.bat`**

### Option B : Manuel
```bash
cd "c:\Users\nolwe\Desktop\Projet\Nextrace\Site"

# Installer
npm install

# Lancer
npm start

# Ouvrir http://localhost:3000
```

### ✅ Vérifications :
- [ ] Le serveur démarre sans erreur
- [ ] La page s'affiche dans le navigateur
- [ ] Vous pouvez créer un compte
- [ ] Vous pouvez poster un message
- [ ] Le dark mode fonctionne (⚙️ en haut)

**✨ Tout fonctionne ? Passez à l'étape 2 !**

---

## 📤 Étape 2 : Pousser sur GitHub (2 min)

### Option A : Script automatique (Windows)
Double-cliquez sur **`deploy-github.bat`**

### Option B : Manuel

1. **Créer un repo sur GitHub**
   - Allez sur https://github.com/new
   - Nom : `social-network`
   - Public ou Privé (au choix)
   - **NE PAS** initialiser avec README
   - Cliquez sur "Create repository"

2. **Pousser le code**
```bash
cd "c:\Users\nolwe\Desktop\Projet\Nextrace\Site"

git init
git add .
git commit -m "Initial commit - Réseau social complet"

# Remplacez YOUR_USERNAME par votre username GitHub
git remote add origin https://github.com/YOUR_USERNAME/social-network.git
git branch -M main
git push -u origin main
```

### ✅ Vérification :
- [ ] Votre code est visible sur GitHub
- [ ] Tous les fichiers sont présents
- [ ] Le fichier `.gitignore` a bien exclu `node_modules/`

---

## 🌐 Étape 3 : Déployer sur Render (3 min)

1. **Allez sur Render**
   - https://dashboard.render.com
   - Connectez-vous (ou créez un compte)

2. **Nouveau service**
   - Cliquez sur **"New +"** → **"Web Service"**
   - Connectez votre compte GitHub si demandé

3. **Sélectionner le repo**
   - Cherchez `social-network` dans la liste
   - Cliquez sur **"Connect"**

4. **Configuration**
   ```
   Name: social-network (ou ce que vous voulez)
   Region: Frankfurt (ou le plus proche de vous)
   Branch: main
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free
   ```

5. **Variables d'environnement** ⚠️ **IMPORTANT**
   
   Cliquez sur **"Advanced"** puis ajoutez :
   
   | Key | Value |
   |-----|-------|
   | `NODE_VERSION` | `20.11.1` |
   | `JWT_SECRET` | (Cliquez sur "Generate") |
   | `NODE_ENV` | `production` |

6. **Déployer**
   - Cliquez sur **"Create Web Service"**
   - ⏱️ Attendez 2-3 minutes...
   - ✅ "Your service is live" devrait apparaître

### ✅ Vérification :
- [ ] Le service affiche "Live" en vert
- [ ] Aucune erreur dans les logs
- [ ] Vous avez une URL (ex: `https://social-network-xyz.onrender.com`)

---

## 🎯 Étape 4 : Tester votre site en ligne (2 min)

Ouvrez l'URL donnée par Render et suivez **[DEPLOYED-CHECK.md](DEPLOYED-CHECK.md)**

### Tests rapides :
1. [ ] La page se charge
2. [ ] Animation de loading apparaît
3. [ ] Vous pouvez créer un compte
4. [ ] Vous pouvez vous connecter
5. [ ] Vous pouvez poster
6. [ ] Dark mode fonctionne

---

## 🎊 Étape 5 : Créer un Super Admin

Sur Render, allez dans **"Shell"** (onglet à gauche) et tapez :

```bash
npm run create-admin admin@monsite.com MonNom motdepasse123
```

Ou créez-le via l'interface après avoir créé un compte normal, puis modifiez la base de données.

---

## ❌ Problèmes courants

### "Build failed" avec better-sqlite3
→ **[FIX-RENDER.md](FIX-RENDER.md)** (30 secondes)

Solution : `NODE_VERSION` doit être `20.11.1`

### "Failed to fetch" dans le navigateur
1. Ouvrez la console (F12)
2. Videz le cache (Ctrl+Shift+Delete)
3. Rechargez la page (F5)

### "Internal Server Error"
Consultez les **logs** dans Render et **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)**

---

## ✅ Checklist Finale

- [ ] Site en ligne sur Render
- [ ] Compte créé et connexion fonctionne
- [ ] Posts fonctionnent
- [ ] Messages privés fonctionnent
- [ ] Dark mode fonctionne
- [ ] Super Admin créé
- [ ] URL partagée avec vos amis ! 🎉

---

## 🎯 Prochaines étapes

### Personnalisation
1. Changez les couleurs dans `public/styles.css`
2. Modifiez le logo dans `public/index.html`
3. Ajoutez votre nom de site

### Promotion
1. Partagez l'URL sur les réseaux sociaux
2. Invitez vos amis à s'inscrire
3. Créez des modérateurs (niveau 3-4)

### Amélioration
Consultez **[SUMMARY.md](SUMMARY.md)** pour les idées de fonctionnalités futures.

---

## 📞 Besoin d'aide ?

- 🔧 **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Solutions détaillées
- ⚡ **[FIX-RENDER.md](FIX-RENDER.md)** - Fix rapide
- ✅ **[DEPLOYED-CHECK.md](DEPLOYED-CHECK.md)** - Checklist de vérification
- 📖 **[README.md](README.md)** - Documentation complète

---

## 🎉 Félicitations !

Votre réseau social est maintenant **EN LIGNE** ! 🌐✨

**Partagez votre création avec le monde !**

---

**Fait avec ❤️**
