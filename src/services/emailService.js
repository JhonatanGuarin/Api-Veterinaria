const SibApiV3Sdk = require('@getbrevo/brevo');
const fs = require('fs');
const path = require('path');

let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

let apiKey = apiInstance.authentications['apiKey'];
apiKey.apiKey = process.env.BREVO_API_KEY;

exports.sendResetCode = async (mail, resetCode) => {
  let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  sendSmtpEmail.subject = "Código de recuperación de contraseña";
  sendSmtpEmail.htmlContent = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
          h1 { color: #2c3e50; text-align: center; }
          .code { font-size: 24px; font-weight: bold; text-align: center; padding: 10px; background-color: #e74c3c; color: white; border-radius: 5px; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #7f8c8d; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Recuperación de Contraseña</h1>
          <p>Estimado usuario,</p>
          <p>Has solicitado un código para recuperar tu contraseña. Por favor, utiliza el siguiente código:</p>
          <div class="code">${resetCode}</div>
          <p>Si no has solicitado este código, por favor ignora este mensaje o contacta con nuestro soporte técnico.</p>
          <p>Gracias,<br>Equipo de Parroquia de Santa Maria</p>
          <div class="footer">
            Este es un mensaje automático, por favor no responda a este correo.
          </div>
        </div>
      </body>
    </html>
  `;
  sendSmtpEmail.sender = { name: "Parroquia de Santa Maria", email: process.env.FROM_EMAIL };
  sendSmtpEmail.to = [{ email: mail }];
  
  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Email enviado correctamente. ID:', data.messageId);
    return data;
  } catch (error) {
    console.error('Error al enviar email:', error);
    throw new Error('Error al enviar el correo de recuperación');
  }
};

exports.sendVerifyCode = async (mail, resetCode) => {
  let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  sendSmtpEmail.subject = "Código de verificación de correo";
  sendSmtpEmail.htmlContent = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
          h1 { color: #2c3e50; text-align: center; }
          .code { font-size: 24px; font-weight: bold; text-align: center; padding: 10px; background-color: #e74c3c; color: white; border-radius: 5px; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #7f8c8d; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Verificación de Correo</h1>
          <p>Estimado usuario,</p>
          <p>Has solicitado un código para registrar una cuenta en la Parroquia Santa Maria. Por favor, utiliza el siguiente código:</p>
          <div class="code">${resetCode}</div>
          <p>Si no has solicitado este código, por favor ignora este mensaje o contacta con nuestro soporte técnico.</p>
          <p>Gracias,<br>Equipo de Parroquia de Santa Maria</p>
          <div class="footer">
            Este es un mensaje automático, por favor no responda a este correo.
          </div>
        </div>
      </body>
    </html>
  `;
  sendSmtpEmail.sender = { name: "Parroquia de Santa Maria", email: process.env.FROM_EMAIL };
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

