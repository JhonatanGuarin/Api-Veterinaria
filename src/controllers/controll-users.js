const User = require('../models/user'); // Asegúrate de tener este modelo definido


module.exports = {
    // Crear un nuevo usuario
    createUser: async (req, res) => {
        try {
          const newUser = new User(req.body);
          const savedUser = await newUser.save();
          res.status(201).json(savedUser);
        } catch (error) {
          res.status(400).json({ message: error.message });
        }
      },

    // Obtener todos los usuarios
    getAllUsers: async (req, res) => {
        try {
          const users = await User.find();
          res.status(200).json(users);
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      },

    // Controlador para obtener el usuario autenticado
    getUserProfile: async (req, res) => {
      try {
        const token = req.headers.authorization?.split(' ').pop();

        if (!token) {
          return res.status(401).json({ error: 'No se proporcionó token de autorización' });
        }

        const tokenData = await verifyToken(token);
        const user = await User.findById(tokenData._id).populate('typeDocument');

        if (!user) {
          return res.status(404).send({ error: 'Usuario no encontrado' });
        }

        console.log('Usuario encontrado:', user); // Log para depuración
        res.status(200).send(user);
      } catch (err) {
        console.error('Error al obtener perfil de usuario:', err); // Log para depuración
        res.status(500).send({ error: 'Error al obtener perfil de usuario', details: err.message });
      }
    },
  
  // Actualizar un usuario por ID
  updateUserById : async (req, res) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedUser) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  
  // Eliminar un usuario por ID
  deleteUserById : async (req, res) => {
    try {
      const deletedUser = await User.findByIdAndDelete(req.params.id);
      if (!deletedUser) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      res.status(200).json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}


