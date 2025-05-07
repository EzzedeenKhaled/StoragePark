
import { redis } from "../lib/redis.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { sendCustomerCredentials, sendEmployeeCredentials,sendVerificationEmail } from "../lib/mail.js";



export const getCustomers = async (req, res) => {
  try {
    const { search, verificationStatus } = req.query;
    let query = { role: "customer" };

    // Add verification status filter
    if (verificationStatus === 'verified') {
      query.isVerified = true;
    } else if (verificationStatus === 'pending') {
      query.isVerified = false;
    }

    if (search) {
      query = {
        ...query,
        $or: [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phoneNumber: { $regex: search, $options: 'i' } }
        ]
      };
    }

    console.log('Fetching customers with query:', query);

    const customers = await User.find(query)
      .select('-password -resetPasswordCode -resetPasswordExpires -verificationToken')
      .sort({ createdAt: -1 });

    console.log(`Found ${customers.length} customers`);

    if (!customers || customers.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(customers);
  } catch (error) {
    console.error('Error in getCustomers:', error);
    res.status(500).json({ 
      message: "Error fetching customers",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const addCustomer = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, password } = req.body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !phoneNumber) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Validate phone number format
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({ message: "Invalid phone number format" });
    }

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      phoneNumber,
      password: password,
      role: "customer",
      isVerified: true,
    });

    // Save user
    await newUser.save();

    // Send credentials email
    const emailSent = await sendCustomerCredentials(email, firstName, password);
    
    if (!emailSent) {
      console.warn(`Failed to send credentials email to ${email}. User was still created.`);
      return res.status(201).json({ 
        message: "Customer added successfully but failed to send credentials email",
        emailSent: false,
        customer: {
          id: newUser._id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName
        }
      });
    }

    res.status(201).json({ 
      message: "Customer added successfully",
      emailSent: true,
      customer: {
        id: newUser._id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName
      }
    });
  } catch (error) {
    console.error('Error adding customer:', error);
    res.status(500).json({ 
      message: "Error adding customer",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, phoneNumber, password } = req.body;

    const updateData = {
      firstName,
      lastName,
      email,
      phoneNumber,
    };

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const updatedCustomer = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({ message: "Customer updated successfully", customer: updatedCustomer });
  } catch (error) {
    res.status(500).json({ message: "Error updating customer" });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCustomer = await User.findByIdAndDelete(id);

    if (!deletedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting customer" });
  }
};


export const getEmployees = async (req, res) => {
  try {
    const { search, verificationStatus } = req.query;
    let query = { role: { $in: ['manager', 'employee'] } };

    // Add verification status filter
    if (verificationStatus === 'verified') {
      query.isVerified = true;
    } else if (verificationStatus === 'pending') {
      query.isVerified = false;
    }

    if (search) {
      query = {
        ...query,
        $or: [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phoneNumber: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const employees = await User.find(query)
      .select('-password -resetPasswordCode -resetPasswordExpires -verificationToken')
      .sort({ createdAt: -1 });

    res.status(200).json(employees);
  } catch (error) {
    console.error('Error in getEmployees:', error);
    res.status(500).json({ message: "Error fetching employees" });
  }
};

export const addEmployee = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, password, role } = req.body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !phoneNumber || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Validate phone number format
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({ message: "Invalid phone number format" });
    }

    // Validate role
    if (!['manager', 'employee'].includes(role)) {
      return res.status(400).json({ message: "Invalid role. Must be either 'manager' or 'employee'" });
    }

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      isVerified: true,
    }); 

    // Save user
    await newUser.save();

    // Send credentials email
    const emailSent = await sendEmployeeCredentials(email, firstName, password, role);
    
    if (!emailSent) {
      console.warn(`Failed to send credentials email to ${email}. User was still created.`);
      return res.status(201).json({ 
        message: "Employee added successfully but failed to send credentials email",
        emailSent: false,
        employee: {
          id: newUser._id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          role: newUser.role
        }
      });
    }

    res.status(201).json({ 
      message: "Employee added successfully",
      emailSent: true,
      employee: {
        id: newUser._id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Error adding employee:', error);
    res.status(500).json({ 
      message: "Error adding employee",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, phoneNumber, password, role } = req.body;

    // Validate role if provided
    if (role && !['manager', 'employee'].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const updateData = {
      firstName,
      lastName,
      email,
      phoneNumber,
      role
    };

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const updatedEmployee = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({ 
      message: "Employee updated successfully", 
      employee: {
        id: updatedEmployee._id,
        email: updatedEmployee.email,
        firstName: updatedEmployee.firstName,
        lastName: updatedEmployee.lastName,
        role: updatedEmployee.role
      }
    });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ 
      message: "Error updating employee",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEmployee = await User.findByIdAndDelete(id);

    if (!deletedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ 
      message: "Error deleting employee",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}; 

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
