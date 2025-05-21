import jwt from "jsonwebtoken";

// const authMiddleware = async (req, res, next) => {
//   const { token } = req.headers;
//   console.log(token);
//   if (!token) {
//     return res.json({ success: false, message: "Not Authorized Login Again" });
//   }
//   try {
//     const token_decode = jwt.verify(token, process.env.JWT_SECRET);
//     req.body.userId = token_decode.id;
//     next();
//   } catch (error) {
//     return res.json({ success: false, message: error.message });
//   }
// };

const authMiddleware = (req, res, next) => {
  console.log("Request Headers:", req.headers["token"]); // Log all headers for debugging
  const token = req.headers["authorization"]?.split(" ")[1]; // Extract token from "Authorization: Bearer <token>"

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }

  try {
    // Assuming JWT verification with your secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT Error:", err);
    res.status(403).json({ success: false, message: "Invalid token" });
  }
};

export default authMiddleware;
