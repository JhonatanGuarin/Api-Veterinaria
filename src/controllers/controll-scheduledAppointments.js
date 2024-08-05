const ScheduledAppointments = require('../models/scheduledAppointments');
const VeterinarySchedule = require('../models/veterinarySchedule');
const User = require('../models/user');
const { verifyToken } = require('../helpers/generate-token');

module.exports = {
    createAppointment: async (req, res) => {
        try {

            // Verificar disponibilidad del horario y obtener el veterinario
            const schedule = await VeterinarySchedule.findOne({
                date: new Date(date).toISOString().split('T')[0],
                'timeSlots.time': time,
                'timeSlots.status': 'Libre'
            });

            if (!schedule) {
                return res.status(400).json({ error: 'El horario seleccionado no está disponible' });
            }

            // Crear la cita
            const newAppointment = new ScheduledAppointments({
                date: new Date(date),
                time,
                process,
                pet,
                veterinarian: schedule.veterinarian,
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
                        'timeSlots.$.status': 'Ocupado',
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