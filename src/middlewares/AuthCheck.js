import jwt from "jsonwebtoken";
import env from "dotenv";
import cryptoJs from "crypto-js";
env.config();

export const authCheck = async (req, res, next) => {
  try {
    const token = req.headers["authorization"];

    if (!token || !token.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        msg: "Login first to get tokens.",
      });
    }

    const tokenValue = token.split(" ")[1];
    const decToken = cryptoJs.AES.decrypt(tokenValue, process.env.API_SECRET).toString(cryptoJs.enc.Utf8);

    const verify = jwt.verify(decToken, process.env.API_SECRET);

    if (!verify) {
      return res.status(401).json({
        success: false,
        msg: "Invalid token. Please log in.",
      });
    }

    if (verify.exp < Math.floor(Date.now() / 1000)) {
      return res.status(401).json({
        success: false,
        msg: "Token expired. Please log in again.",
      });
    }

    req.user = verify; // Attach verified user data to request
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({
      success: false,
      msg: "An error occurred. Please log in.",
    });
  }
};
