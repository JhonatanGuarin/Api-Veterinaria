const express = require('express');
const router = express.Router();

const {
    createAppointment
} = require('../controllers/controll-scheduledAppointments');

router.post('/', createAppointment);

module.exports = router;