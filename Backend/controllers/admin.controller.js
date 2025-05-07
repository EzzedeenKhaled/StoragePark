import User from "../models/user.model.js";
import sendVerificationEmail from '../lib/mail.js'
export const partnersUnverified = async (req, res) => {
    try {
        const unverifiedPartners = await User.find({
          role: "partner",
          isVerified: false,
        });
        const formattedPartners = unverifiedPartners.map(user => ({
          email: user.email,
          address: user.partner.address,
          authorizedRepresentative: `${user.firstName} ${user.lastName}`,
          phoneNumber: user.partner.phoneNumber,
          certificateOfIncorporation: user.partner.certificateFile ? "Available" : "Not Provided",
          businessLicense: user.partner.businessLicenseFile ? "Available" : "Not Provided",
          taxComplianceCertificate: user.partner.taxComplianceFile ? "Available" : "Not Provided",
          certificateFileURL: user.partner.certificateFile,
          businessLicenseFileURL: user.partner.businessLicenseFile,
          taxComplianceFileURL: user.partner.taxComplianceFile,
        }));
    
        res.json(formattedPartners);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
      }
};

// Confirm Partner Request
export const confirmPartnerRequest = async (req, res) => {
  const { email } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user is already verified
    if (user.isVerified) {
      return res.status(400).json({ message: "User is already verified" });
    }

    // Generate a default password
    const defaultPassword = "storagePark@2025";

    // // Hash the default password before saving
    // const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    // Update the user
    user.isVerified = true;
    user.password = defaultPassword;

    // Send verification email
    await sendVerificationEmail(email, defaultPassword, false, true, false);

    // Save the updated user
    await user.save();

    res.json({ message: "Partner request confirmed successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const rejectPartnerRequest = async (req, res) => {
  const { email } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: `User not found ${email}` });
    }

    // Delete the user from the database
    await User.deleteOne({ email });
    await sendVerificationEmail(email, 0, false, false, true);
    res.json({ message: "Partner request rejected and user deleted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAcceptedPartners = async (req, res) => {
  try {
    const acceptedPartners = await User.find({
      role: "partner",
      isVerified: true,
    });

    const formattedPartners = acceptedPartners.map((user) => ({
      id: user._id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      logo: user.partner.logo || null, // Assuming logo is stored in the partner object
    }));

    res.json(formattedPartners);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
