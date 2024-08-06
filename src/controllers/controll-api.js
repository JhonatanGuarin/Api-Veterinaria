const User = require('../models/user'); // Asegúrate de que la ruta al modelo sea correcta


module.exports = {

    getUserData: async (req, res) => {
        try {
            // Asumiendo que checkAuth añade el ID del usuario a req.userId
            const userData = await User.findById(req.userId).select('-password');
            if (!userData) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            res.json(userData);
        } catch (error) {
            console.error('Error fetching user data:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },

    getAdminData: async (req, res) => {
        try {
            const allUsers = await User.find().select('-password');
            res.json({ adminData: 'Datos confidenciales', users: allUsers });
        } catch (error) {
            console.error('Error fetching admin data:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
}
