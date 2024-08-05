const mongoose = require('mongoose');

const scheduledAppointmentsSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    process: {
        type: String,
        required: true
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users', 
        required: true
    },

    pet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pets',
        required: true
    },

    veterinarian: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
      },
    
    status: {
        type: String,
        default: 'Pendiente'
    }
});

const ScheduledAppointments = mongoose.model('scheduledAppointments', scheduledAppointmentsSchema);

module.exports = ScheduledAppointments;
