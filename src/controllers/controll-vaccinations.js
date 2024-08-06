const Vaccine = require('../models/vaccinations');
const ScheduledAppointment = require('../models/scheduledAppointments');
const { verifyToken } = require('../helpers/generate-token');
const User = require('../models/user');
const Pet = require('../models/pet');

module.exports = {
    createVaccine: async (req, res) => {
        try {
            const { petId, vaccineType, nextDueDate, appointmentId } = req.body;

            // Verificar y obtener el usuario del token
            const token = req.headers.authorization?.split(' ').pop();
            if (!token) {
                return res.status(401).json({ error: 'No se proporcionó token de autorización' });
            }

            const tokenData = await verifyToken(token);
            const userData = await User.findById(tokenData._id);

            if (!userData) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            const newVaccine = new Vaccine({
                pet: petId,
                vaccineType,
                nextDueDate,
                veterinarian: userData._id
            });

            const savedVaccine = await newVaccine.save();

            // Actualizar el estado de la cita
            if (appointmentId) {
                await ScheduledAppointment.findByIdAndUpdate(appointmentId, { status: 'Realizado' });
            }

            res.status(201).json(savedVaccine);
        } catch (error) {
            res.status(500).json({ message: 'Error al registrar la vacuna', error: error.message });
        }
    },

    getVaccinesByPetId : async (req, res) => {
        try {
          const petId = req.params.petId;
          console.log('Pet ID:', petId);
      
          const vaccines = await Vaccine.find({ pet: petId }).populate('veterinarian');
          console.log('Vaccines:', vaccines);
      
          if (!vaccines || vaccines.length === 0) {
            return res.status(404).json({ message: 'No se encontraron vacunas para esta mascota.' });
          }
      
          res.status(200).json(vaccines);
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Error al buscar las vacunas.' });
        }
}};