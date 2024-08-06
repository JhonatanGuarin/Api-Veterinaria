const mongoose = require('mongoose');

const vaccineSchema = new mongoose.Schema({
    pet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pets',
      required: true
    },
    vaccineType: {
      type: String,
      required: true
    },
    dateAdministered: {
      type: Date,
      default: Date.now
    },
    nextDueDate: Date,

    veterinarian: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users'
    }
  });
  
  const vaccine = mongoose.model('Vaccine', vaccineSchema);

  module.exports = vaccine;