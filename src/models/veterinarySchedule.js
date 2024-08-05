const mongoose = require('mongoose');

const veterinaryScheduleSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },

  veterinarian: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users'
  },

  timeSlots: [
    {
      time: {
        type: String,  // Puedes cambiar esto a Date si prefieres almacenar la hora completa
        required: true
      },
      available: {
        type: Boolean,
        default: true
      },
      status: {
        type: String,
        default: "Libre"
      }
    }
  ]
});

const veterinarySchedule = mongoose.model('VeterinarySchedule', veterinaryScheduleSchema);

module.exports = veterinarySchedule;
