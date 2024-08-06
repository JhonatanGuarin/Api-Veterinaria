const express = require('express');
const router = express.Router();

const { 
    createVaccine,
    getVaccinesByPetId
} = require('../controllers/controll-vaccinations')


router.post('/', createVaccine);
router.get('/:petId', getVaccinesByPetId);

module.exports = router;