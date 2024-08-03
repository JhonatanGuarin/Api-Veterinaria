const User = require('../models/user');
const TempVerification = require('../models/tempVerification');
const { encrypt, compare } = require('../helpers/handleBcrypt')
const { tokenSign } = require('../helpers/generate-token')

const emailService = require('../services/emailService');
const passwordService = require('../services/passwordService');

module.exports = {
  verifyEmail: async (req, res) => {
    try {
        const { mail } = req.body;

        const existingUser = await User.findOne({ mail });
        if (existingUser) {
            return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
        }

        const verificationCode = passwordService.generateResetCode();
        
        await TempVerification.findOneAndUpdate(
            { mail },
            { verificationCode, expiresAt: Date.now() + 3600000 },
            { upsert: true, new: true }
        );

        await emailService.sendVerifyCode(mail, verificationCode);

        res.status(200).json({ message: 'Código de verificación enviado' });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  verifyCode: async (req, res) => {
    try {
        const { mail, verificationCode } = req.body;

        const verification = await TempVerification.findOne({
            mail,
            verificationCode,
            expiresAt: { $gt: Date.now() }
        });

        if (!verification) {
            return res.status(400).json({ error: 'Código inválido o expirado' });
        }

        verification.isVerified = true;
        await verification.save();

        res.status(200).json({ message: 'Código verificado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  registerUser: async (req, res) => {
    try {
        const { name, lastName, birthdate, documentNumber, phone, mail, password, role } = req.body;

        const verification = await TempVerification.findOne({ mail, isVerified: true });
        if (!verification) {
            return res.status(400).json({ error: 'El correo electrónico no ha sido verificado' });
        }

        const birthDate = new Date(birthdate);
        const currentDate = new Date();
        const minBirthDate = new Date('1930-01-01');
        const eighteenYearsAgo = new Date(currentDate.getFullYear() - 18, currentDate.getMonth(), currentDate.getDate());

        if (birthDate < minBirthDate) {
            return res.status(400).json({ error: 'La fecha de nacimiento no puede ser anterior a 1930' });
        }

        if (birthDate > eighteenYearsAgo) {
            return res.status(400).json({ error: 'El usuario debe ser mayor de 18 años' });
        }

        if (password.length < 8) {
            return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' });
        }

        const defaultRole = 'Usuario';
        const userRole = role || defaultRole;

        const passwordHash = await encrypt(password)

        const user = new User({
            name,
            lastName,
            birthdate,
            documentNumber,
            phone,
            mail,
            password: passwordHash,
            role: userRole
        });

        const result = await user.save();

        await TempVerification.deleteOne({ mail });

        return res.status(201).json({ data: result });
    } catch (err) {
        return res.status(500).json({ error: 'Error al registrar el usuario' });
    }
  },

  loginUser: async (req, res) => {
    try {
        const { mail, password } = req.body;

        if (!mail || !password) {
            return res.status(400).json({ error: 'El correo y la contraseña son requeridos' });
        }

        const user = await User.findOne({ mail });

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const checkPassword = await compare(password, user.password);

        if (!checkPassword) {
            return res.status(401).json({ error: 'Contraseña inválida' });
        }

        const tokenSession = await tokenSign(user);

        const userResponse = user.toObject();
        delete userResponse.password;

        return res.status(200).json({
            message: 'Inicio de sesión exitoso',
            data: userResponse,
            tokenSession
        });

    } catch (err) {
        console.error('Error de inicio de sesión:', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  forgotPassword: async (req, res) => {
    try {
        const { mail } = req.body;
        const user = await User.findOne({ mail });
        if (!user) {
          return res.status(404).json({ message: 'Usuario no encontrado' });
        }
    
        const resetCode = passwordService.generateResetCode();
        user.resetCode = resetCode;
        user.resetCodeExpires = Date.now() + 3600000; // 1 hora
        await user.save();
    
        try {
          await emailService.sendResetCode(mail, resetCode);
          res.status(200).json({ message: 'Código de recuperación enviado' });
        } catch (emailError) {
          console.error('Error al enviar el correo:', emailError);
          res.status(500).json({ message: 'Error al enviar el correo de recuperación' });
        }
      } catch (error) {
        console.error('Error en forgotPassword:', error);
        res.status(500).json({ message: 'Error en el servidor' });
      }
  },

  verifyResetCode: async (req, res) => {
    try {
        const { mail, resetCode } = req.body;
        const user = await User.findOne({
            mail,
            resetCode,
            resetCodeExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Código inválido o expirado' });
        }

        res.status(200).json({ message: 'Código válido', userId: user._id });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
  },

  changePassword: async (req, res) => {
    try {
        const { mail, newPassword } = req.body;
        const user = await User.findOne({ mail });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const passwordHash = await encrypt(newPassword);

        user.password = passwordHash;
        user.resetCode = undefined;
        user.resetCodeExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
  }
};