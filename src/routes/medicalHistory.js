const express = require('express');
const router = express.Router();

const { 
    createMedicalHistory,
    getMedicalHistoryByPetId
} = require('../controllers/controll-medicalHistory')


router.post('/', createMedicalHistory);

router.get('/:petId', getMedicalHistoryByPetId);

module.exports = router;