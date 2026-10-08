# 🔥 FIX RAPIDE - Erreur Render

## ⚡ Vous avez l'erreur better-sqlite3 sur Render ?

### Solution en 30 secondes :

1. **Allez dans votre service Render**
2. Cliquez sur **"Environment"** dans le menu de gauche
3. **Modifiez ou ajoutez** cette variable :

```
NODE_VERSION = 20.11.1
```

4. Cliquez sur **"Save Changes"**
5. Le déploiement **redémarre automatiquement**
6. ✅ **Ça fonctionne !**

---

## 🎯 Capture d'écran de ce qu'il faut faire :

Dans Render Dashboard :
```
┌─────────────────────────────────────────┐
│ Environment Variables                   │
├─────────────────────────────────────────┤
│ Key             │ Value                 │
├─────────────────┼───────────────────────┤
│ NODE_VERSION    │ 20.11.1              │← Changez ici !
│ JWT_SECRET      │ (auto-generated)      │
│ NODE_ENV        │ production            │
└─────────────────────────────────────────┘
```

---

## ❓ Pourquoi ça marche ?

- Node.js 26.x est **trop récent** pour better-sqlite3
- Node.js 20.x est la version **LTS stable**
- Render utilisera automatiquement la bonne version

---

## 🚀 Ça marche toujours pas ?

👉 Consultez **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** pour d'autres solutions :
- Utiliser PostgreSQL
- Déployer sur Railway ou Fly.io (plus simple)
- Autres alternatives

---

**99% du temps, changer NODE_VERSION suffit** ✅
