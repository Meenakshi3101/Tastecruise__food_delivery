import Food from "../models/foodModel.js";
import fs from "fs";

// List all foods
const listFood = async (req, res) => {
  try {
    const foods = await Food.findAll();
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Add a food item
const addFood = async (req, res) => {
  try {
    const image_filename = `${req.file.filename}`;

    await Food.create({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: image_filename,
    });

    res.json({ success: true, message: "Food Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Remove a food item
const removeFood = async (req, res) => {
  try {
    const food = await Food.findByPk(req.body.id);

    if (!food) {
      return res.json({ success: false, message: "Food not found" });
    }

    fs.unlink(`uploads/${food.image}`, () => {});

    await food.destroy();
    res.json({ success: true, message: "Food Removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { listFood, addFood, removeFood };
