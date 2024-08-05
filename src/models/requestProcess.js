const mongoose = require('mongoose');

const requestProcessSchema = new mongoose.Schema({
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

    pet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pets',
        required: true
      },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users', 
        required: true
    },
    
    status: {
        type: String,
        default: 'Pendiente'
    }
});

const requestProcess = mongoose.model('RequestProcess', requestProcessSchema);

module.exports = requestProcess;
