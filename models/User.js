const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // Unicité du pseudo
    minlength: 3,
    maxlength: 32
  },
  email: {
    type: String,
    required: true,
    unique: true, // Unicité de l'email
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/] // Validation email simple
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  isActive: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Debug : log avant la sauvegarde
userSchema.pre('save', function(next) {
  console.log('[DEBUG][User] Avant save:', {
    username: this.username,
    email: this.email,
    isActive: this.isActive
  });
  next();
});

// Debug : log après la sauvegarde
userSchema.post('save', function(doc, next) {
  console.log('[DEBUG][User] Après save:', doc);
  next();
});

// Debug : log si erreur de validation
userSchema.post('validate', function(doc, next) {
  console.log('[DEBUG][User] Validation OK:', doc);
  next();
});

userSchema.post('error', function(error, doc, next) {
  console.error('[DEBUG][User] Erreur Mongoose:', error.message);
  next(error);
});

module.exports = mongoose.model('User', userSchema);