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
    appointmentType: {
        type: String,
        enum: ['Proceso Clínico', 'Vacunación'],
        required: true
    },
    specificProcess: {
        type: String,
        required: true
    },
    observations: {
        type: String,
        default: ''
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