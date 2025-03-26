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
    subject: "Action Required: Verify Your Email Address", // Updated subject line
    html: `
  <div style="font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 24px; border-radius: 12px; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
    <!-- Logo -->
    <div style="text-align: center; margin-bottom: 24px;">
      <img src="${process.env.LOGO_URL}" alt="Company Logo" style="max-width: 180px; height: auto;" />
    </div>

    <!-- Header -->
    <h1 style="font-size: 28px; font-weight: 700; text-align: center; color: #ff9800; margin-bottom: 16px;">Thank You for Registering!</h1>
    <p style="font-size: 16px; text-align: center; color: #555; margin-bottom: 24px;">To complete your registration, please enter the following 6-digit verification code:</p>

    <!-- Verification Code -->
    <div style="background-color: #f4f4f4; padding: 20px; text-align: center; border-radius: 8px; font-size: 32px; font-weight: bold; color: #ff9800; margin: 24px 0; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
      ${token}
    </div>
    <p style="text-align: center; font-size: 14px; color: #666; margin-bottom: 24px;">Copy and paste this code into the verification form on our website.</p>

    <!-- Footer -->
    <p style="text-align: center; font-size: 12px; color: #999; margin-top: 24px;">
      This email was sent from your email service. If you did not register for this account, please ignore this email.
    </p>
  </div>
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
