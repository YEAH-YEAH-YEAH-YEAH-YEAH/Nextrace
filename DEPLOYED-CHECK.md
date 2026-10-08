# ✅ Checklist après déploiement Render

## 🔍 Vérifications à faire après le premier déploiement

### 1. ✅ Le service est déployé
- [ ] Render affiche "Live" en vert
- [ ] Aucune erreur dans les logs de build
- [ ] Le service est en état "Active"

### 2. 🌐 L'API répond
Testez ces URLs dans votre navigateur :

```
https://VOTRE-APP.onrender.com/health
```
Devrait retourner :
```json
{
  "status": "OK",
  "timestamp": "2024-...",
  "environment": "production"
}
```

```
https://VOTRE-APP.onrender.com/api
```
Devrait retourner :
```json
{
  "name": "Social Network API",
  "version": "1.0.0",
  "endpoints": { ... }
}
```

### 3. 🎨 Le frontend se charge
- [ ] Page d'accueil s'affiche (https://VOTRE-APP.onrender.com)
- [ ] Animation de loading apparaît
- [ ] Formulaire de connexion/inscription visible
- [ ] Console du navigateur (F12) sans erreurs rouges

### 4. 📝 Créer un compte
- [ ] Cliquez sur "S'inscrire"
- [ ] Remplissez : username, email, password
- [ ] Inscription réussie
- [ ] Message "Inscription réussie" apparaît
- [ ] Redirection vers la connexion

### 5. 🔐 Se connecter
- [ ] Utilisez l'email et mot de passe créés
- [ ] Connexion réussie
- [ ] Redirection vers le feed
- [ ] Votre username apparaît en haut à droite
- [ ] Badge "Niveau 1" visible

### 6. 📝 Créer un post
- [ ] Écrivez quelque chose dans "Quoi de neuf ?"
- [ ] Cliquez sur "Publier"
- [ ] Le post apparaît dans le feed
- [ ] Likes et commentaires fonctionnent

### 7. 💬 Messages privés
- [ ] Cliquez sur "Messages" dans le menu
- [ ] La section messages s'affiche
- [ ] Recherchez votre propre username (pour tester)

### 8. ⚙️ Paramètres
- [ ] Cliquez sur l'icône ⚙️ en haut à droite
- [ ] Modal des paramètres s'ouvre
- [ ] Vos infos s'affichent correctement
- [ ] Toggle Dark/Light mode fonctionne
- [ ] Animation Soleil ↔ Lune fonctionne

### 9. 🔄 Persistance
- [ ] Rafraîchissez la page (F5)
- [ ] Vous restez connecté
- [ ] Le thème choisi persiste
- [ ] Vos posts sont toujours là

### 10. 🚪 Déconnexion
- [ ] Cliquez sur "Déconnexion"
- [ ] Retour à la page de connexion
- [ ] Plus de token dans localStorage

## 🔧 Variables d'environnement Render

Vérifiez que ces variables sont bien définies dans Render :

| Variable | Valeur attendue | Statut |
|----------|----------------|--------|
| `NODE_VERSION` | `20.11.1` | [ ] OK |
| `JWT_SECRET` | Généré automatiquement | [ ] OK |
| `NODE_ENV` | `production` | [ ] OK |

## 🎯 Si tout fonctionne

✅ **Félicitations !** Votre réseau social est en ligne !

Partagez votre URL : `https://VOTRE-APP.onrender.com`

## ❌ En cas de problème

### Le site ne charge pas
1. Vérifiez les **logs** dans Render
2. Cherchez les erreurs en rouge
3. Consultez **TROUBLESHOOTING.md**

### "Failed to fetch" dans la console
```javascript
// Ouvrez la console (F12) et vérifiez API_URL
console.log(API_URL);
// Devrait afficher : https://VOTRE-APP.onrender.com/api
```

Si c'est `http://localhost:3000/api`, videz le cache :
- **Chrome/Edge** : Ctrl+Shift+Delete → Cochez tout → Effacer
- **Firefox** : Ctrl+Shift+Delete → Tout effacer

### "Internal Server Error"
Consultez les **logs Render** :
1. Allez sur votre dashboard Render
2. Cliquez sur votre service
3. Onglet **Logs**
4. Cherchez les erreurs

Erreurs courantes :
- `JWT_SECRET is not defined` → Ajoutez la variable
- `Cannot find module` → Build raté, redéployez
- `SQLITE_CANTOPEN` → Permissions, utilisez PostgreSQL

## 📞 Support

- **Logs Render** : Toujours la première étape
- **TROUBLESHOOTING.md** : Solutions détaillées
- **FIX-RENDER.md** : Fix rapide Node.js
- **GitHub Issues** : Ouvrez une issue avec les logs

## 🎉 Prochaines étapes

Une fois que tout fonctionne :

1. **Créez un Super Admin** (voir README.md)
2. **Personnalisez** : couleurs, logo, nom
3. **Partagez** avec vos amis !
4. **Améliorez** : ajoutez de nouvelles fonctionnalités

---

**Profitez de votre réseau social !** 🌐✨
