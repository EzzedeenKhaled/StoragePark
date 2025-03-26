import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
// Configure Mailtrap transporter
const transporter = nodemailer.createTransport({
  secure: true,
  host: 'smtp.gmail.com',
  port: 465,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// Function to send verification email
async function sendVerificationEmail(email, token) {
  const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: "Verify Your Email",
    html: `
      <p>Thank you for registering! Please verify your email by clicking the link below:</p>
      <a href="${verificationLink}">${verificationLink}</a>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error)
      console.error("Error sending email:", error);
     else 
      console.log("Email sent:", info.response);
  });
}

export default sendVerificationEmail;
