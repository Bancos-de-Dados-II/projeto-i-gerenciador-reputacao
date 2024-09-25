const mongoose = require('../database/mongoose');
const {Schema} = mongoose;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
  codinome: {
    type: String,
    required: true,
    unique: true
  },
  afiliacao: {
    type: String,
    enum: ['Império', 'Cartel Hutt', 'Aurora Escarlate', 'Sindicato Pyke'], 
    required: true,
  },
  senha: {
    type: String,
    required: true
  }
});

userSchema.pre('save', async function(next) {
  try {
    if (!this.isModified('senha')) return next();
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.senha, salt);
    this.senha = hash;
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function(senha) {
  return bcrypt.compare(senha, this.senha);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
