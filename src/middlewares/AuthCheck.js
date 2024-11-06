import jwt from "jsonwebtoken";
import cryptoJs from "crypto-js";
import dotenv from "dotenv";

dotenv.config();

export const authCheck = async (req, res, next) => {
  try {
    // Extract the authorization header from the request
    const token = req.headers["authorization"];

    // Check if the token exists and starts with "Bearer "
    if (!token || !token.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        msg: "Login first to get tokens.",
      });
    }

    // Get the token value without "Bearer "
    const tokenValue = token.split(" ")[1];

    // Decrypt the token using CryptoJS
    const decToken = cryptoJs.AES.decrypt(tokenValue, process.env.API_SECRET).toString(cryptoJs.enc.Utf8);

    // Verify the decrypted token using JWT
    const verify = jwt.verify(decToken, process.env.API_SECRET); // Changed to use a separate secret for JWT

    // Check if the token has expired
    if (!verify || verify.exp < Math.floor(Date.now() / 1000)) {
      return res.status(401).json({
        success: false,
        msg: "Token expired or invalid. Please log in again.",
      });
    }

    // Attach the verified user data to the request object
    req.user = verify; // You can access user data via req.user in subsequent middlewares/routes
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error(error);
    res.status(401).json({
      success: false,
      msg: "An error occurred. Please log in.",
    });
  }
};
