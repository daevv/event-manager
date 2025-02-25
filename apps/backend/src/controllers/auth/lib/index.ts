import crypto from 'crypto';
import nodemailer from 'nodemailer';

export const generateConfirmationCode = () => {
  return crypto.randomBytes(20).toString('hex');
};

export const sendConfirmationEmail = async (email: string, code: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'lessie.torp@ethereal.email',
      pass: 'CkW7nhvQ23xgM3k3Vj'
    }
  });

  const mailOptions = {
    from: 'your-email@gmail.com',
    to: email,
    subject: 'Email Confirmation Code',
    text: `Your confirmation code is: ${code}`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
