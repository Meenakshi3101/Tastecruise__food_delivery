import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import sequelize from "./config/db.js";
import path from "path";
import orderRouter from "./routes/orderRoutes.js";
import userRouter from "./routes/userRoutes.js";
import foodRouter from "./routes/foodRoutes.js";
import feedbackRouter from "./routes/feedbackRoutes.js";
import cartRouter from "./routes/cartRoutes.js";

dotenv.config();
const app = express();
const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g. mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(
          new Error("CORS not allowed for this origin: " + origin)
        );
      }
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// routes
app.use("/api/user", userRouter);
app.use("/api/order", orderRouter);
app.use("/api/food", foodRouter);
app.use("/api/cart", cartRouter);
app.use("/api/feedback", feedbackRouter);

// sync DB
sequelize
  .sync()
  .then(() => console.log("MySQL DB synced"))
  .catch((err) => console.error("Sync error:", err));

app.listen(process.env.PORT || 3000, () => {
  console.log(
    `Server running on port http://localhost:${process.env.PORT || 3000}`
  );
});
