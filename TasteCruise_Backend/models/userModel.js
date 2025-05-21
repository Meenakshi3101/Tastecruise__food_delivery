import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const User = sequelize.define(
  "User",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
    },
    cartData: {
      type: DataTypes.JSON,
      defaultValue: {},
    },
  },
  {
    tableName: "users",
    timestamps: false,
  }
);

export default User;
