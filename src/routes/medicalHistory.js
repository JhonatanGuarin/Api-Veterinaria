const express = require('express');
const router = express.Router();

const { 
    createMedicalHistory
} = require('../controllers/controll-medicalHistory')


router.post('/', createMedicalHistory);

module.exports = router;