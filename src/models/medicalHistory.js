const mongoose = require('mongoose');

const medicalHistorySchema = new mongoose.Schema({
  pet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pets',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  reason: {
    type: String,
    required: true
  },
  diagnosis: String,
  treatment: String,
  notes: String,
  veterinarian: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users'
  }
});

const MedicalHistory = mongoose.model('MedicalHistory', medicalHistorySchema);

module.exports = MedicalHistory;