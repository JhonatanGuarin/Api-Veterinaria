const mongoose = require('mongoose');

const PetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  photo: {
    type: String
  },
  species: {
    type: String,
    required: true,
    trim: true
  },
  breed: {
    type: String,
    trim: true
  },
  birthdate: {
    type: Date
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  gender: {
    type: String,
    enum: ['Macho', 'Hembra', 'Desconocido'],
    default: 'Desconocido'
  },
  weight: {
    type: Number,
    min: 0
  },
  color: {
    type: String,
    trim: true
  },

  allergies: [String],

  dietaryRestrictions: String
}
);

const Pet = mongoose.model('Pets', PetSchema);

module.exports = Pet;