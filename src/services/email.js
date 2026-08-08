require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});


// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Shop It" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};


async function sendForgotPassword(userEmail, name, resetUrl) {
  const subject = "Reset Your Password";

  const text = `Hello ${name},

Click the link below to reset your password.

${resetUrl}

This link expires in 15 minutes.
`;

  const html = `
    <h2>Hello ${name}</h2>
    <p>Click the button below to reset your password.</p>

    <a href="${resetUrl}">
      Reset Password
    </a>

    <p>This link expires in 15 minutes.</p>
  `;

  await sendEmail(userEmail, subject, text, html);
}




module.exports ={ sendEmail,sendForgotPassword};

