const SibApiV3Sdk = require('@getbrevo/brevo');
const fs = require('fs');
const path = require('path');

let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

let apiKey = apiInstance.authentications['apiKey'];
apiKey.apiKey = process.env.BREVO_API_KEY;

exports.sendResetCode = async (mail, resetCode) => {
    let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.subject = "Código de recuperación de contraseña - Veterinaria El Doctor Doolittle";
    sendSmtpEmail.htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: 'Trebuchet MS', sans-serif; line-height: 1.6; color: #333; background-color: #f0f8ff; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: white; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
            h1 { color: #4682b4; text-align: center; }
            .code { font-size: 28px; font-weight: bold; text-align: center; padding: 15px; background-color: #20b2aa; color: white; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #778899; }
            .logo { text-align: center; margin-bottom: 20px; }
            .logo img { max-width: 150px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">
              <img src="https://static.vecteezy.com/system/resources/previews/005/601/780/non_2x/veterinary-clinic-logo-vector.jpg" alt="Logo El Doctor Doolittle">
            </div>
            <h1>Recuperación de Contraseña</h1>
            <p>Estimado amigo de las mascotas,</p>
            <p>Has solicitado un código para recuperar tu contraseña en la Veterinaria El Doctor Doolittle. Por favor, utiliza el siguiente código:</p>
            <div class="code">${resetCode}</div>
            <p>Si no has solicitado este código, por favor ignora este mensaje o contacta con nuestro equipo de atención al cliente.</p>
            <p>Recuerda que la seguridad de tu cuenta es importante para nosotros, tanto como la salud de tus mascotas.</p>
            <p>Atentamente,<br>El equipo de El Doctor Doolittle</p>
            <div class="footer">
              Este es un mensaje automático, por favor no responda a este correo. Si necesitas ayuda adicional, no dudes en visitarnos en nuestra clínica.
            </div>
          </div>
        </body>
      </html>
    `;
    sendSmtpEmail.sender = { name: "Veterinaria El Doctor Doolittle", email: process.env.FROM_EMAIL };
    sendSmtpEmail.to = [{ email: mail }];
    
    try {
      const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log('Email enviado correctamente. ID:', data.messageId);
      return data;
    } catch (error) {
      console.error('Error al enviar email:', error);
      throw new Error('Error al enviar el correo de recuperación de contraseña');
    }
  };

exports.sendVerifyCode = async (mail, resetCode) => {
    let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.subject = "Código de verificación - Veterinaria El Doctor Doolittle";
    sendSmtpEmail.htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: 'Trebuchet MS', sans-serif; line-height: 1.6; color: #333; background-color: #f0f8ff; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: white; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
            h1 { color: #4682b4; text-align: center; }
            .code { font-size: 28px; font-weight: bold; text-align: center; padding: 15px; background-color: #20b2aa; color: white; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #778899; }
            .logo { text-align: center; margin-bottom: 20px; }
            .logo img { max-width: 150px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">
              <img src="https://static.vecteezy.com/system/resources/previews/005/601/780/non_2x/veterinary-clinic-logo-vector.jpg" alt="Logo El Doctor Doolittle">
            </div>
            <h1>Verificación de Correo</h1>
            <p>Estimado amigo de las mascotas,</p>
            <p>Has solicitado un código para registrar una cuenta en la Veterinaria El Doctor Doolittle. Por favor, utiliza el siguiente código:</p>
            <div class="code">${resetCode}</div>
            <p>Si no has solicitado este código, por favor ignora este mensaje o contacta con nuestro equipo de atención al cliente.</p>
            <p>¡Gracias por confiar en nosotros para el cuidado de tus amigos peludos!</p>
            <p>Atentamente,<br>El equipo de El Doctor Doolittle</p>
            <div class="footer">
              Este es un mensaje automático, por favor no responda a este correo. Si necesitas ayuda, visítanos en nuestra clínica.
            </div>
          </div>
        </body>
      </html>
    `;
    sendSmtpEmail.sender = { name: "Veterinaria El Doctor Doolittle", email: process.env.FROM_EMAIL };
    sendSmtpEmail.to = [{ email: mail }];
    
    try {
      const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log('Email enviado correctamente. ID:', data.messageId);
      return data;
    } catch (error) {
      console.error('Error al enviar email:', error);
      throw new Error('Error al enviar el correo de verificación');
    }
  };

