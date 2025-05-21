import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Feedback = sequelize.define("Feedback", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  feedback: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

export default Feedback;
