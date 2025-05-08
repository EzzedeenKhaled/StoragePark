import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { sendCustomerCredentials, sendEmployeeCredentials,sendVerificationEmail } from "../lib/mail.js";
import Item from "../models/item.model.js";

export const getOrderSummary = async (req, res) => {
  try {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1); // First day of the current month
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0); // Last day of the current month

    // Aggregate orders to calculate daily ordered and delivered counts
    const orderSummary = await User.aggregate([
      { $unwind: "$orders" }, // Unwind orders array
      {
        $match: {
          "orders.orderDate": { $gte: startOfMonth, $lte: endOfMonth }, // Filter orders for the current month
        },
      },
      {
        $group: {
          _id: { $dayOfMonth: "$orders.orderDate" }, // Group by day of the month
          ordered: { $sum: 1 }, // Count all orders
          delivered: {
            $sum: {
              $cond: [{ $eq: ["$orders.status", "delivered"] }, 1, 0], // Count only delivered orders
            },
          },
        },
      },
      { $sort: { _id: 1 } }, // Sort by day
    ]);

    // Format the result to include day numbers
    const formattedData = orderSummary.map((entry) => ({
      name: `Day ${entry._id}`, // Format day as "Day X"
      Ordered: entry.ordered,
      Delivered: entry.delivered,
    }));

    res.status(200).json(formattedData);
  } catch (error) {
    console.error("Error fetching daily order summary:", error);
    res.status(500).json({ message: "Failed to fetch daily order summary", error: error.message });
  }
};

export const getOrderStatistics = async (req,res) => {
  try {
    // Find all users with customer or partner role who have orders
    const users = await User.find({
      role: { $in: ["customer", "partner"] },
      "orders.0": { $exists: true } // Only users who have at least one order
    });
    let totalOrders = 0;
    let deliveredOrders = 0;
    let pendingOrders = 0;
    let totalAmount = 0;

    // Process each user's orders
    users.forEach(user => {
      if (user.orders && user.orders.length > 0) {
        // Count all orders (already filtered for customers and partners)
        totalOrders += user.orders.length;
        
        // Count delivered orders
        const delivered = user.orders.filter(order => order.status === "delivered").length;
        deliveredOrders += delivered;
        
        // Count pending orders
        const pending = user.orders.filter(order => order.status === "pending").length;
        pendingOrders += pending;
        
        // Sum total amount
        const amount = user.orders.reduce((sum, order) => sum + order.totalAmount, 0);
        totalAmount += amount;
      }
    });
    res.status(200).json({
      totalOrders,
      deliveredOrders,
      pendingOrders,
      totalAmount: `$${totalAmount.toFixed(2)}`
    });
    
  } catch (error) {
    console.error("Error fetching order statistics:", error);
    throw error;
  }
};

export const getLowQuantityStock = async (req, res) => {
  try {
    // Fetch items with quantity less than 10, limit to 3
    const lowQuantityItems = await Item.find({ quantity: { $lt: 10 } })
      .sort({ quantity: 1 }) // Sort by quantity in ascending order
      .limit(3) // Limit to 3 items
      .select("productName quantity imageProduct"); // Select relevant fields

    res.status(200).json(lowQuantityItems);
  } catch (error) {
    console.error("Error fetching low quantity stock:", error);
    res.status(500).json({ message: "Failed to fetch low quantity stock", error: error.message });
  }
};

export const getHighestSellingProducts = async (req, res) => {
  try {
    // Fetch the top 5 highest-selling products based on `timesBought`
    const highestSellingProducts = await Item.find({ timesBought: { $gt: 0 } })
      .sort({ timesBought: -1 }) // Sort by timesBought in descending order
      .limit(4) // Limit to top 5 products
      .select("productName timesBought quantity pricePerUnit imageProduct"); // Select relevant fields

    res.status(200).json(highestSellingProducts);
  } catch (error) {
    console.error("Error fetching highest-selling products:", error);
    res.status(500).json({ message: "Failed to fetch highest-selling products", error: error.message });
  }
};

export const getPartnersAndCategories = async (req, res) => {
  try {
    // Count the number of partners
    const numberOfPartners = await User.countDocuments({ role: "partner" });

    // Get the distinct categories from the Item model
    const categories = await Item.distinct("category");
    const numberOfCategories = categories.length;

    res.status(200).json({
      numberOfPartners,
      numberOfCategories,
    });
  } catch (error) {
    console.error("Error fetching partners and categories:", error);
    res.status(500).json({ message: "Failed to fetch data", error: error.message });
  }
};

export const getAllQuantity = async (req, res) => {
  try {
    // Aggregate the total quantity of all items
    const totalQuantity = await Item.aggregate([
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: "$quantity" }, // Sum up the quantity field
        },
      },
    ]);

    const quantity = totalQuantity[0]?.totalQuantity || 0; // Handle case where no items exist
    res.status(200).json({ totalQuantity: quantity });
  } catch (error) {
    console.error("Error fetching total quantity:", error);
    res.status(500).json({ message: "Failed to fetch total quantity", error: error.message });
  }
};

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
    let emailSent = false;
    try {
      emailSent = await sendCustomerCredentials(email, firstName, password);
    } catch (emailError) {
      console.error('Error sending credentials email:', emailError);
    }
    
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

export const getAllProducts = async (req, res) => {
  try {
    // Fetch all products and populate the partner details
    const products = await Item.find({})
      .populate("partner", "firstName lastName email phoneNumber partner.companyName") // Populate partner details
      .exec();

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching all products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getDataOrders = async (req, res) => {
  try {
    // Find all users with customer or partner roles who have orders
    const users = await User.find({
      role: { $in: ["customer", "partner"] },
      "orders.0": { $exists: true }, // Ensure they have at least one order
    }).populate("orders.items.item", "name imageProduct price"); // Populate item details

    // Combine all orders into a single array with the required fields
    const orders = users.flatMap(user =>
      user.orders.map(order => ({
        orderId: order.orderId,
        name:user.firstName,
        company: user.partner?.companyName, // Use company name for partners or full name for customers
        phone: user.phoneNumber,
        companyPhone:user.partner.phoneNumber,
        price: order.totalAmount,
        status: order.status,
        date: order.orderDate.toISOString().split("T")[0], // Format date as YYYY-MM-DD
        role:user.role
      }))
    );

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal server error" });
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

// Password generator function
const generateStrongPassword = () => {
  const length = 12;
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
  let password = "";
  
  // Ensure at least one of each required character type
  password += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)]; // Uppercase
  password += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)]; // Lowercase
  password += "0123456789"[Math.floor(Math.random() * 10)]; // Number
  password += "!@#$%^&*()_+"[Math.floor(Math.random() * 12)]; // Special char
  
  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

// Password strength checker
const checkPasswordStrength = (password) => {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+]/.test(password);
  const isLongEnough = password.length >= 8;

  return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar && isLongEnough;
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

    // Generate a strong password
    const generatedPassword = generateStrongPassword();

    // Update the user
    user.isVerified = true;
    user.password = generatedPassword;

    // Send verification email
    await sendVerificationEmail(email, generatedPassword, false, true, false);

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
      logo: user.partner.profileImage || null, // Assuming logo is stored in the partner object
    }));

    res.json(formattedPartners);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
