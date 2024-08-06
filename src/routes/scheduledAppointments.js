const express = require('express');
const router = express.Router();

const {
    createAppointment,
    getClinicalProcess,
    getVaccination
} = require('../controllers/controll-scheduledAppointments');

router.post('/', createAppointment);


router.get('/ClinicalProcess', getClinicalProcess);
router.get('/Vaccination', getVaccination);
module.exports = router;