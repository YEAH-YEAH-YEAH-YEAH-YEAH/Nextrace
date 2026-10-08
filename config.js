module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'votre_secret_jwt_a_changer_en_production',
  JWT_EXPIRES_IN: '7d',
  
  // Niveaux de permission
  PERMISSIONS: {
    USER: 1,           // Utilisateur basique
    MODERATOR: 2,      // Peut supprimer ses posts et voir les signalements
    ADVANCED_MOD: 3,   // Peut supprimer les posts des autres
    ADMIN: 4,          // Peut gérer les utilisateurs
    SUPER_ADMIN: 5     // Accès complet
  },
  
  // Actions nécessitant des permissions
  PERMISSION_ACTIONS: {
    DELETE_OWN_POST: 1,
    DELETE_ANY_POST: 3,
    BAN_USER: 4,
    CHANGE_PERMISSIONS: 5
  }
};
