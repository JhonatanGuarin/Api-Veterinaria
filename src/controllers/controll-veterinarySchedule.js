const VeterinarySchedule = require('../models/veterinarySchedule');
const User = require('../models/user'); 
const { verifyToken } = require('../helpers/generate-token');

module.exports = {
    createveterinarySchedule: async (req, res) => {
        try {
            const { date, timeSlots } = req.body;
            const token = req.headers.authorization?.split(' ')[1]; // Cambiado de .pop() a [1]

            if (!token) {
                return res.status(401).json({ error: 'No se proporcionó token de autorización' });
            }

            let tokenData;
            try {
                tokenData = await verifyToken(token);
            } catch (error) {
                console.error('Error verifying token:', error);
                return res.status(401).json({ error: 'Token inválido o expirado' });
            }

            const userData = await User.findById(tokenData._id);

            if (!userData || userData.role !== 'Admin') {
                return res.status(403).json({ error: 'No autorizado para crear horarios' });
            }

            const selectedDate = new Date(date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (selectedDate < today) {
                return res.status(400).json({ message: 'No se pueden crear horarios para fechas pasadas' });
            }

            let schedule = await VeterinarySchedule.findOne({ 
                date: selectedDate.toISOString().split('T')[0],
                veterinarian: userData._id
            });

            if (schedule) {
                // Si existe, agregamos los nuevos horarios
                schedule.timeSlots.push(...timeSlots.map(slot => ({
                    time: slot,
                    available: true,
                    status: "Libre"
                })));
            } else {
                // Si no existe, crear un nuevo registro
                schedule = new VeterinarySchedule({
                    date: selectedDate,
                    veterinarian: userData._id,
                    timeSlots: timeSlots.map(slot => ({
                        time: slot,
                        available: true,
                        status: "Libre"
                    }))
                });
            }

            const savedSchedule = await schedule.save();
            console.log('Horario guardado:', savedSchedule);
            res.status(201).json(savedSchedule);
        } catch (error) {
            console.error('Error al guardar el horario:', error);
            res.status(400).json({ message: error.message });
        }
    },

    getTimeSlots: async (req, res) => {
        const { date } = req.query;
    
        try {
            const schedule = await VeterinarySchedule.findOne({ date: new Date(date).toISOString().split('T')[0] });
    
            if (!schedule) {
                return res.status(404).json({ message: 'No se encontraron horarios para esta fecha' });
            }
    
            const availableTimeSlots = schedule.timeSlots.filter(slot => slot.status === "Libre");
            res.status(200).json({ timeSlots: availableTimeSlots });
        } catch (error) {
            console.error('Error al obtener los horarios:', error);
            res.status(500).json({ message: 'Error al obtener los horarios', error });
        }
    },

    getAllVeterinarianTimeSlots: async (req, res) => {
        const { date } = req.query;
        const token = req.headers.authorization?.split(' ')[1];
    
        if (!token) {
            return res.status(401).json({ error: 'No se proporcionó token de autorización' });
        }
    
        try {
            const tokenData = await verifyToken(token);
            const userData = await User.findById(tokenData._id);
    
            if (!userData || userData.role !== 'Admin') {
                return res.status(403).json({ error: 'No autorizado para ver todos los horarios' });
            }
    
            const schedules = await VeterinarySchedule.find({ 
                date: new Date(date).toISOString().split('T')[0],
                veterinarian: userData._id  // Filtramos por el ID del usuario (veterinario)
            });
    
            if (!schedules || schedules.length === 0) {
                return res.status(404).json({ message: 'No se encontraron horarios para esta fecha y este veterinario' });
            }
    
            const formattedSchedules = schedules.map(schedule => ({
                timeSlots: schedule.timeSlots
            }));
    
            res.status(200).json({ schedules: formattedSchedules });
        } catch (error) {
            console.error('Error al obtener los horarios:', error);
            res.status(500).json({ message: 'Error al obtener los horarios', error: error.message });
        }
    },

    removeTimeSlots: async (req, res) => {
        const { date, timeSlots } = req.body;
        const token = req.headers.authorization?.split(' ')[1]; // Cambiado de .pop() a [1]

        if (!token) {
            return res.status(401).json({ error: 'No se proporcionó token de autorización' });
        }

        try {
            const tokenData = await verifyToken(token);
            const userData = await User.findById(tokenData._id);

            if (!userData || userData.role !== 'Admin') {
                return res.status(403).json({ error: 'No autorizado para modificar horarios' });
            }

            const schedule = await VeterinarySchedule.findOne({ 
                date: new Date(date).toISOString().split('T')[0],
                veterinarian: userData._id
            });

            if (!schedule) {
                return res.status(404).json({ message: 'Horario no encontrado' });
            }

            const updatedTimeSlots = schedule.timeSlots.filter(slot => !timeSlots.includes(slot.time));
            schedule.timeSlots = updatedTimeSlots;
            await schedule.save();

            res.status(200).json({ message: 'Time slots removed', schedule });
        } catch (error) {
            console.error('Error updating time slots:', error);
            res.status(500).json({ message: 'Error updating time slots', error });
        }
    }
};