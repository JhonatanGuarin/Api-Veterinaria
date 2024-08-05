const express = require('express');
const router = express.Router();

const { 
    createPet, 
    getPets, 
    getPetsByUser,
    getPetsByUserDocument,
    updatePet, 
    deletePet 
} = require('../controllers/controll-pet')



router.post('/', createPet);
router.get('/', getPets);
router.get('/data', getPetsByUser);
router.get('/documentNumber:', getPetsByUserDocument);
router.put('/:id', updatePet);
router.delete('/:id', deletePet);

module.exports = router;