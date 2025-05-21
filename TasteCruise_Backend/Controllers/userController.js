import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import User from "../models/userModel.js"; // Assuming you have a Sequelize model for User

// Helper to create JWT token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Register User
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  console.log(email);

  try {
    // Check if user already exists using Sequelize
    console.log(email);
    const exists = await User.findOne({
      where: { email: email.toLowerCase() },
    });

    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    // Validate email & password
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    // Hash password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user using Sequelize
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      cartData: JSON.stringify({}), // Assuming cartData is stored as a JSON string
    });

    // Generate JWT token
    const token = createToken(user.id);
    res.json({ success: true, token, userId: user.id });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists using Sequelize
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    // Compare password using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = createToken(user.id);
    res.json({ success: true, token, userId: user.id });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { registerUser, loginUser };
