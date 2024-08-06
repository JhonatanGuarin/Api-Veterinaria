const express = require('express');
const router = express.Router();

const {
    createAppointment,
    getClinicalProcess,
    getVaccination,
    deleteAppointment
} = require('../controllers/controll-scheduledAppointments');

router.post('/', createAppointment);


router.get('/ClinicalProcess', getClinicalProcess);
router.get('/Vaccination', getVaccination);
router.delete('/:id', deleteAppointment);


module.exports = router;