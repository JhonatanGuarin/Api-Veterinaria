const MedicalHistory = require('../models/medicalHistory');
const ScheduledAppointment = require('../models/scheduledAppointments');
const { verifyToken } = require('../helpers/generate-token');
const User = require('../models/user');

module.exports = {
    createMedicalHistory: async (req, res) => {
        try {
            const { petId, reason, diagnosis, treatment, notes, appointmentId } = req.body;

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

            const newMedicalHistory = new MedicalHistory({
                pet: petId,
                reason,
                diagnosis,
                treatment,
                notes,
                veterinarian: userData._id
            });

            const savedMedicalHistory = await newMedicalHistory.save();

            // Actualizar el estado de la cita
            if (appointmentId) {
                await ScheduledAppointment.findByIdAndUpdate(appointmentId, { status: 'Realizado' });
            }

            res.status(201).json(savedMedicalHistory);
        } catch (error) {
            res.status(500).json({ message: 'Error al crear el historial médico', error: error.message });
        }
    }
};