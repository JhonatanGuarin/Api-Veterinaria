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

      // Obtener un usuario por ID
    getUserProfile : async (req, res) => {
        try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json(user);
        } catch (error) {
        res.status(500).json({ message: error.message });
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


