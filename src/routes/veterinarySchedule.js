const express = require('express');
const router = express.Router();

const {
    createveterinarySchedule,
    removeTimeSlots,
    getTimeSlots
} = require('../controllers/controll-veterinarySchedule');

router.post('/', createveterinarySchedule);

// Ruta para eliminar un horario disponible
router.post('/remove-time-slots', removeTimeSlots);

// Ruta para obtener los horarios
router.get('/time-slots', getTimeSlots);  
module.exports = router;