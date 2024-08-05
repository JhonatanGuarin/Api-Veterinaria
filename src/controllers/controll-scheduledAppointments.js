const ScheduledAppointments = require('../models/scheduledAppointments');
const VeterinarySchedule = require('../models/veterinarySchedule');
const User = require('../models/user');
const Pet = require('../models/pet');
const { verifyToken } = require('../helpers/generate-token');

module.exports = {
    createAppointment: async (req, res) => {
        try {
            const { date, time, process, petId, veterinarian } = req.body;
    
            // Verificar si la mascota existe
            const pet = await Pet.findById(petId);
            if (!pet) {
                return res.status(400).json({ error: 'Mascota no encontrada' });
            }
    
            // Buscar el veterinario por su nombre
            const veterinarianDoc = await User.findOne({ name: veterinarian });
            if (!veterinarianDoc) {
                return res.status(400).json({ error: 'Veterinario no encontrado' });
            }
    
            const veterinarianId = veterinarianDoc._id;
    
            // Verificar disponibilidad del horario
            const schedule = await VeterinarySchedule.findOne({
                date: new Date(date).toISOString().split('T')[0],
                veterinarian: veterinarianId,
                'timeSlots.time': time,
                'timeSlots.available': true
            });
    
            if (!schedule) {
                return res.status(400).json({ error: 'El horario seleccionado no está disponible' });
            }
    
            // Crear la cita
            const newAppointment = new ScheduledAppointments({
                date: new Date(date),
                time,
                process,
                pet: petId,
                veterinarian: veterinarianId,
                status: 'Pendiente'
            });
    
            const savedAppointment = await newAppointment.save();
    
            // Actualizar el estado del horario a ocupado
            await VeterinarySchedule.updateOne(
                { 
                    _id: schedule._id,
                    'timeSlots.time': time
                },
                {
                    $set: {
                        'timeSlots.$.available': false
                    }
                }
            );
    
            res.status(201).json(savedAppointment);
        } catch (error) {
            console.error('Error al crear la cita:', error);
            res.status(500).json({ message: 'Error al crear la cita', error: error.message });
        }
    }
};