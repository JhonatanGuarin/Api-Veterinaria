const Pet = require('../models/pet');
const User = require('../models/user');
const { verifyToken } = require('../helpers/generate-token')

module.exports = {

    createPet : async (req, res) => {
        try {
            const { name, species, breed, birthdate, gender, weight, color, allergies, dietaryRestrictions } = req.body;
            const token = req.headers.authorization?.split(' ').pop();
    
            if (!token) {
                return res.status(401).json({ error: 'No se proporcionó token de autorización' });
            }
    
            const tokenData = await verifyToken(token);
            const userData = await User.findById(tokenData._id);
    
            if (!userData) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
    
            // Verificar campos requeridos
            if (!name || !species) {
                return res.status(400).json({ error: 'Nombre y especie son campos obligatorios' });
            }
    
            // Crear objeto con los campos proporcionados
            const petData = {
                name,
                species,
                owner: userData._id,
                ...(breed && { breed }),
                ...(birthdate && { birthdate }),
                ...(gender && { gender }),
                ...(weight && { weight }),
                ...(color && { color }),
                ...(allergies && { allergies }),
                ...(dietaryRestrictions && { dietaryRestrictions })
            };
    
            const newPet = new Pet(petData);
    
            const savedPet = await newPet.save();
    
            res.status(201).json({
                message: 'Mascota creada exitosamente',
                pet: savedPet
            });
        } catch (error) {
            console.error('Error al crear la mascota:', error);
            res.status(500).json({ error: 'Error al crear la mascota' });
        }
    },
    
    getPets : async (req, res) => {
        try {
            const pets = await Pet.find();
            res.status(200).json(pets);
        } catch (error) {
            console.error('Error al obtener las mascotas:', error);
            res.status(500).json({ error: 'Error al obtener las mascotas' });
        }
    },
    
    getPet : async (req, res) => {
        try {
            const { id } = req.params;
            const pet = await Pet.findById(id);
    
            if (!pet) {
                return res.status(404).json({ error: 'Mascota no encontrada' });
            }
    
            res.status(200).json(pet);
        } catch (error) {
            console.error('Error al obtener la mascota:', error);
            res.status(500).json({ error: 'Error al obtener la mascota' });
        }
    },
    
    updatePet : async (req, res) => {
        try {
            const { id } = req.params;
            const updates = req.body;
            const pet = await Pet.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    
            if (!pet) {
                return res.status(404).json({ error: 'Mascota no encontrada' });
            }
    
            res.status(200).json({
                message: 'Mascota actualizada exitosamente',
                pet
            });
        } catch (error) {
            console.error('Error al actualizar la mascota:', error);
            res.status(500).json({ error: 'Error al actualizar la mascota' });
        }
    },
    
    deletePet : async (req, res) => {
        try {
            const { id } = req.params;
            const pet = await Pet.findByIdAndDelete(id);
    
            if (!pet) {
                return res.status(404).json({ error: 'Mascota no encontrada' });
            }
    
            res.status(200).json({
                message: 'Mascota eliminada exitosamente',
                pet
            });
        } catch (error) {
            console.error('Error al eliminar la mascota:', error);
            res.status(500).json({ error: 'Error al eliminar la mascota' });
        }
    }
}
