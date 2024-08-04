const express = require('express');
const router = express.Router();

const { 
    createPet, 
    getPets, 
    getPet, 
    updatePet, 
    deletePet 
} = require('../controllers/controll-pet')



router.post('/', createPet);
router.get('/pets', getPets);
router.get('/pets/:id', getPet);
router.put('/pets/:id', updatePet);
router.delete('/pets/:id', deletePet);

module.exports = router;