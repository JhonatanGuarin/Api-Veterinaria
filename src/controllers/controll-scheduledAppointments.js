const ScheduledAppointments = require('../models/scheduledAppointments');
const VeterinarySchedule = require('../models/veterinarySchedule');
const User = require('../models/user');
const Pet = require('../models/pet');
const { verifyToken } = require('../helpers/generate-token');

module.exports = {
    createAppointment: async (req, res) => {
        try {
            const { date, time, appointmentType, specificProcess, observations, petId, veterinarian } = req.body;

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

            // Verificar si la mascota existe y pertenece al usuario
            const pet = await Pet.findOne({ _id: petId, owner: userData._id });
            if (!pet) {
                return res.status(400).json({ error: 'Mascota no encontrada o no pertenece al usuario' });
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
                appointmentType,
                specificProcess,
                observations,
                owner: userData._id, // Agregar el ID del dueño obtenido del token
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
    },

    getClinicalProcess: async (req, res) => {
        try {
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

            // Buscar citas de Proceso Clínico para este veterinario
            const appointments = await ScheduledAppointments.find({
                appointmentType: 'Proceso Clínico',
                veterinarian: userData._id
            }).populate('owner', 'name email')
              .populate('pet', 'name species');

            res.status(200).json(appointments);
        } catch (error) {
            console.error('Error al obtener citas de Proceso Clínico:', error);
            res.status(500).json({ message: 'Error al obtener citas', error: error.message });
        }
    },

    getVaccination: async (req, res) => {
        try {
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

            // Buscar citas de Vacunación para este veterinario
            const appointments = await ScheduledAppointments.find({
                appointmentType: 'Vacunación',
                veterinarian: userData._id
            }).populate('owner', 'name email')
              .populate('pet', 'name species');

            res.status(200).json(appointments);
        } catch (error) {
            console.error('Error al obtener citas de Vacunación:', error);
            res.status(500).json({ message: 'Error al obtener citas', error: error.message });
        }
    },

    deleteAppointment : async (req, res) => {
        try {
            const { id } = req.params;
            const result = await ScheduledAppointments.findByIdAndDelete(id);
    
            if (!result) {
                return res.status(404).json({ message: 'Cita no encontrada' });
            }
    
            res.status(200).json({ message: 'Cita eliminada con éxito' });
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar la cita', error: error.message });
        }
    }



};