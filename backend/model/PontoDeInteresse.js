const mongoose = require('../database/mongoose');
const {Schema} = mongoose;
const { randomUUID } = require('crypto');

const pontoDeInteresseSchema = new Schema({
  _id: {
    type: 'UUID',
    default: () => randomUUID()
  },
  titulo: String,
  descricao: String,
  tipo: {
    type: String,
    enum: ['Ponto de Interesse', 'Tesouro', 'Pista', 'Inimigo Imperial', 'Base Imperial', 'Aliado Imperial', 'Inimigo Hutt', 'Base Hutt', 'Aliado Hutt', 'Comerciante', 'Caçador de Recompensas', 'Avistamento de Jedi'], 
    required: true
  },
  data: {
    type: Date,
    default: new Date(), 
    required: true
  },
  pontoDeInteresse: {
    type: {
      type: String, 
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
});

pontoDeInteresseSchema.index(
  {titulo: 'text', descricao:'text'},
  {default_language: 'pt', weights:{titulo:2, descricao:1}}
);

const PontoDeInteresse = mongoose.model('pontosDeInteresse', pontoDeInteresseSchema);

module.exports = PontoDeInteresse;