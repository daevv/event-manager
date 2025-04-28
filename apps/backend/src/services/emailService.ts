import nodemailer from 'nodemailer';

// const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST,
//   port: Number(process.env.EMAIL_PORT),
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   }
// });

// export const sendVerificationEmail = async (email: string, token: string) => {
//   const verificationUrl = `${process.env.APP_URL}/auth/verify?token=${token}`;
//   await transporter.sendMail({
//     to: email,
//     subject: 'Подтверждение email',
//     html: `Перейдите по ссылке для подтверждения: <a href="${verificationUrl}">${verificationUrl}</a>`
//   });
// };

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'erika.gleason@ethereal.email',
    pass: 'cekq25YPq2aBJfp1pg'
  }
});

export const sendVerificationEmail = async (email: string, token: string) => {
  const info = await transporter.sendMail({
    from: '"My App" <no-reply@myapp.com>',
    to: email,
    subject: 'Подтверждение Email',
    html: `<p>Нажмите <a href="http://localhost:2000/auth/verify?token=${token}">здесь</a>, чтобы подтвердить email</p>`
  });

  console.log('📧 Test email sent: %s', info.messageId);
  console.log('🔗 Preview URL: %s', nodemailer.getTestMessageUrl(info));
};
