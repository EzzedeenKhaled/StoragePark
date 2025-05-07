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
async function sendVerificationEmail(email, token, isCode, isPartner, noPartner) {
  let subject = "";
  let htmlContent = "";

  if (isCode) {
    // Password reset email
    subject = "Password Reset Request - Action Required";
    htmlContent = `
      <div style="font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 24px; border-radius: 12px; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <!-- Logo -->
        <div style="text-align: center; margin-bottom: 24px;">
          <img src="${process.env.LOGO_URL}" alt="Company Logo" style="max-width: 180px; height: auto;" />
        </div>

        <!-- Header -->
        <h1 style="font-size: 28px; font-weight: 700; text-align: center; color: #2196f3; margin-bottom: 16px;">Reset Your Password</h1>
        <p style="font-size: 16px; text-align: center; color: #555; margin-bottom: 24px;">Use the following 6-digit code to reset your password:</p>

        <!-- Reset Code -->
        <div style="background-color: #f4f4f4; padding: 20px; text-align: center; border-radius: 8px; font-size: 32px; font-weight: bold; color: #2196f3; margin: 24px 0; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
          ${token}
        </div>
        <p style="text-align: center; font-size: 14px; color: #666; margin-bottom: 24px;">Enter this code in the password reset form.</p>

        <!-- Footer -->
        <p style="text-align: center; font-size: 12px; color: #999; margin-top: 24px;">
          If you did not request a password reset, you can safely ignore this email.
        </p>
      </div>
    `;
  } else if (isPartner) {
    // Partner documents reviewed and approved
    subject = "You're Approved! Partner Access Granted";
    htmlContent = `
      <div style="font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 24px; border-radius: 12px; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <!-- Logo -->
        <div style="text-align: center; margin-bottom: 24px;">
          <img src="${process.env.LOGO_URL}" alt="Company Logo" style="max-width: 180px; height: auto;" />
        </div>

        <!-- Header -->
        <h1 style="font-size: 26px; font-weight: bold; text-align: center; color: #4caf50; margin-bottom: 16px;">Documents Reviewed – Welcome Onboard!</h1>

        <!-- Message -->
        <p style="font-size: 16px; text-align: center; color: #555; margin-bottom: 24px;">
          Your submitted documents have been reviewed and your partner account has been approved.
        </p>

        <!-- Credentials -->
        <div style="background-color: #f4f4f4; padding: 16px; border-radius: 8px; text-align: center; margin: 16px 0;">
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Password:</strong> ${token}</p>
        </div>

        <p style="font-size: 14px; text-align: center; color: #777; margin-bottom: 24px;">
          For security, please change this password after logging in by using the <strong>Forgot Password</strong> option.
        </p>

        <!-- Footer -->
        <p style="text-align: center; font-size: 12px; color: #999; margin-top: 24px;">
          This is an automated email. If you have questions, feel free to reach out to our support.
        </p>
      </div>
    `;
  } else if (noPartner) {
    // Rejection email for no partner status
    subject = "Partner Request Denied";
    htmlContent = `
      <div style="font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 24px; border-radius: 12px; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <!-- Logo -->
        <div style="text-align: center; margin-bottom: 24px;">
          <img src="${process.env.LOGO_URL}" alt="Company Logo" style="max-width: 180px; height: auto;" />
        </div>

        <!-- Header -->
        <h1 style="font-size: 26px; font-weight: bold; text-align: center; color: #f44336; margin-bottom: 16px;">Partner Request Denied</h1>

        <!-- Message -->
        <p style="font-size: 16px; text-align: center; color: #555; margin-bottom: 24px;">
          We regret to inform you that your partner application has been rejected. If you have any questions, feel free to contact us for further clarification.
        </p>

        <!-- Footer -->
        <p style="text-align: center; font-size: 12px; color: #999; margin-top: 24px;">
          This is an automated email. If you have any questions, feel free to reach out to our support team.
        </p>
      </div>
    `;
  } else {
    // Normal email verification
    subject = "Action Required: Verify Your Email Address";
    htmlContent = `
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
    `;
  }

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: subject,
    html: htmlContent,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error)
      console.error("Error sending email:", error);
    else
      console.log("Email sent:", info.response);
  });
}

// Function to send customer credentials
async function sendCustomerCredentials(email, firstName, password) {
  const subject = "Welcome to StoragePark - Your Account Details";
  const htmlContent = `
    <div style="font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 24px; border-radius: 12px; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
      <!-- Logo -->
      <div style="text-align: center; margin-bottom: 24px;">
        <img src="${process.env.LOGO_URL}" alt="Company Logo" style="max-width: 180px; height: auto;" />
      </div>

      <!-- Header -->
      <h1 style="font-size: 28px; font-weight: 700; text-align: center; color: #ff9800; margin-bottom: 16px;">Welcome to StoragePark!</h1>
      <p style="font-size: 16px; text-align: center; color: #555; margin-bottom: 24px;">
        Hello ${firstName},<br>
        Your account has been created successfully. Here are your login credentials:
      </p>

      <!-- Credentials -->
      <div style="background-color: #f4f4f4; padding: 20px; border-radius: 8px; margin: 24px 0; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
        <p style="margin: 8px 0;"><strong>Email:</strong> ${email}</p>
        <p style="margin: 8px 0;"><strong>Password:</strong> ${password}</p>
      </div>

      <!-- Instructions -->
      <div style="background-color: #fff3e0; padding: 16px; border-radius: 8px; margin: 24px 0;">
        <h2 style="color: #ff9800; font-size: 18px; margin-bottom: 12px;">Important Security Notice</h2>
        <p style="font-size: 14px; color: #666; margin-bottom: 12px;">
          For security reasons, please change your password after your first login using the "Forgot Password" option.
        </p>
        <p style="font-size: 14px; color: #666;">
          If you have any questions or need assistance, please contact our support team.
        </p>
      </div>

      <!-- Features -->
      <div style="background-color: #f8f9fa; padding: 16px; border-radius: 8px; margin: 24px 0;">
        <h2 style="color: #ff9800; font-size: 18px; margin-bottom: 12px;">What You Can Do</h2>
        <ul style="list-style: none; padding: 0; margin: 0;">
          <li style="margin-bottom: 8px;">✓ Book storage units online</li>
          <li style="margin-bottom: 8px;">✓ Manage your reservations</li>
          <li style="margin-bottom: 8px;">✓ View your storage history</li>
          <li style="margin-bottom: 8px;">✓ Update your profile information</li>
        </ul>
      </div>

      <!-- Footer -->
      <p style="text-align: center; font-size: 12px; color: #999; margin-top: 24px;">
        This is an automated email. Please do not reply to this message.
      </p>
    </div>
  `;

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: subject,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Customer credentials email sent:", info.response);
    return true;
  } catch (error) {
    console.error("Error sending customer credentials email:", error);
    return false;
  }
}

// Function to send employee credentials
async function sendEmployeeCredentials(email, firstName, password, role) {
  const subject = "Welcome to StoragePark - Your Employee Account Details";
  const htmlContent = `
    <div style="font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 24px; border-radius: 12px; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
      <!-- Logo -->
      <div style="text-align: center; margin-bottom: 24px;">
        <img src="${process.env.LOGO_URL}" alt="Company Logo" style="max-width: 180px; height: auto;" />
      </div>

      <!-- Header -->
      <h1 style="font-size: 28px; font-weight: 700; text-align: center; color: #ff9800; margin-bottom: 16px;">Welcome to StoragePark!</h1>
      <p style="font-size: 16px; text-align: center; color: #555; margin-bottom: 24px;">
        Hello ${firstName},<br>
        Your employee account has been created successfully. Here are your login credentials:
      </p>

      <!-- Credentials -->
      <div style="background-color: #f4f4f4; padding: 20px; border-radius: 8px; margin: 24px 0; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
        <p style="margin: 8px 0;"><strong>Role:</strong> ${role.charAt(0).toUpperCase() + role.slice(1)}</p>
        <p style="margin: 8px 0;"><strong>Email:</strong> ${email}</p>
        <p style="margin: 8px 0;"><strong>Password:</strong> ${password}</p>
      </div>

      <!-- Instructions -->
      <div style="background-color: #fff3e0; padding: 16px; border-radius: 8px; margin: 24px 0;">
        <h2 style="color: #ff9800; font-size: 18px; margin-bottom: 12px;">Important Security Notice</h2>
        <p style="font-size: 14px; color: #666; margin-bottom: 12px;">
          For security reasons, please change your password after your first login using the "Forgot Password" option.
        </p>
        <p style="font-size: 14px; color: #666;">
          If you have any questions or need assistance, please contact your administrator.
        </p>
      </div>

      <!-- Footer -->
      <p style="text-align: center; font-size: 12px; color: #999; margin-top: 24px;">
        This is an automated email. Please do not reply to this message.
      </p>
    </div>
  `;

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: subject,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Employee credentials email sent:", info.response);
    return true;
  } catch (error) {
    console.error("Error sending employee credentials email:", error);
    return false;
  }
}

export { sendVerificationEmail, sendEmployeeCredentials, sendCustomerCredentials };
