/**
 * Script pour créer un Super Admin (niveau 5)
 * À exécuter après le premier déploiement
 */

const bcrypt = require('bcryptjs');
const { getDatabase } = require('../database/init');
const { initDatabase, getUserByEmail } = require('../database/init');
const { createUser, updateUserPermission } = require('../database/queries');

// Initialiser la base de données
initDatabase();

async function createSuperAdmin() {
  const email = process.argv[2] || 'admin@social.com';
  const username = process.argv[3] || 'SuperAdmin';
  const password = process.argv[4] || 'admin123456';

  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = getUserByEmail(email);
    
    if (existingUser) {
      console.log(`✅ Utilisateur ${email} existe déjà (ID: ${existingUser.id})`);
      console.log(`   Mise à jour vers Super Admin (niveau 5)...`);
      
      // Mettre à jour vers niveau 5
      updateUserPermission(existingUser.id, 5, existingUser.id, 'Promotion Super Admin via script');
      
      console.log(`✅ ${username} est maintenant Super Admin !`);
    } else {
      console.log(`📝 Création d'un nouveau Super Admin...`);
      
      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Créer l'utilisateur
      const result = createUser(username, email, hashedPassword);
      const userId = result.lastInsertRowid;
      
      // Mettre à niveau 5
      updateUserPermission(userId, 5, userId, 'Premier Super Admin');
      
      console.log(`✅ Super Admin créé avec succès !`);
      console.log(`   Email: ${email}`);
      console.log(`   Mot de passe: ${password}`);
      console.log(`   ⚠️  CHANGEZ LE MOT DE PASSE après la première connexion !`);
    }
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

// Afficher l'aide
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
Usage: node scripts/create-admin.js [email] [username] [password]

Exemples:
  node scripts/create-admin.js
  node scripts/create-admin.js admin@example.com AdminUser mySecretPass123

Par défaut:
  Email: admin@social.com
  Username: SuperAdmin
  Password: admin123456
  `);
  process.exit(0);
}

createSuperAdmin();
