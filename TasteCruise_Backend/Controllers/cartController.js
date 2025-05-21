import User from "../models/userModel.js"; // Assuming you have a User model defined with Sequelize

// Add to user cart
const addToCart = async (req, res) => {
  try {
    const { userId, itemId } = req.body;
    console.log(req.body);

    // Fetch user data using Sequelize
    const userData = await User.findByPk(userId); // Using findByPk to fetch by primary key
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }
    console.log("Request body:", req.body);
    console.log("Headers:", req.headers);

    // Check if cartData is already an object
    let cartData = userData.cartData;
    if (typeof cartData === "string") {
      cartData = JSON.parse(cartData || "{}"); // Assuming cartData is stored as a JSON string
    }

    // Update cart data
    if (!cartData[itemId]) {
      cartData[itemId] = 1;
    } else {
      cartData[itemId] += 1;
    }

    // Update the user's cart in the database
    userData.cartData = JSON.stringify(cartData); // Ensure it's saved as a JSON string
    await userData.save(); // Using save method to update the record
    res.json({ success: true, message: "Added To Cart" });
  } catch (error) {
    console.log("Catch error: ", error);
    res.json({ success: false, message: "Error" });
  }
};

// Remove food from user cart
const removeFromCart = async (req, res) => {
  try {
    const { userId, itemId } = req.body;

    // Fetch user data using Sequelize
    const userData = await User.findByPk(userId); // Using findByPk to fetch by primary key
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    // Check if cartData is already an object
    let cartData = userData.cartData;
    if (typeof cartData === "string") {
      cartData = JSON.parse(cartData || "{}"); // Assuming cartData is stored as a JSON string
    }

    // Check if item exists in the cart and update quantity
    if (cartData[itemId] && cartData[itemId] > 0) {
      cartData[itemId] -= 1;
    }

    // Update the user's cart in the database
    userData.cartData = JSON.stringify(cartData); // Ensure it's saved as a JSON string
    await userData.save(); // Using save method to update the record
    res.json({ success: true, message: "Removed From Cart" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Get user cart
const getCart = async (req, res) => {
  try {
    const { userId } = req.body;

    // Fetch user data using Sequelize
    const userData = await User.findByPk(userId); // Using findByPk to fetch by primary key
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    // Check if cartData is already an object
    let cartData = userData.cartData;
    if (typeof cartData === "string") {
      cartData = JSON.parse(cartData || "{}"); // Assuming cartData is stored as a JSON string
    }

    res.json({ success: true, cartData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { addToCart, removeFromCart, getCart };
