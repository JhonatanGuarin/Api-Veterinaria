const express = require('express');
const router = express.Router();

const { 
    createVaccine
} = require('../controllers/controll-vaccinations')


router.post('/', createVaccine);

module.exports = router;