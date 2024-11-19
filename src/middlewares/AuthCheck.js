import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

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

    // Usuń dekrpycję tokena
    // const decToken = cryptoJs.AES.decrypt(tokenValue, process.env.API_SECRET).toString(cryptoJs.enc.Utf8);

    // Zweryfikuj token bezpośrednio
    const verify = jwt.verify(tokenValue, process.env.API_SECRET);

    if (!verify || verify.exp < Math.floor(Date.now() / 1000)) {
      return res.status(401).json({
        success: false,
        msg: "Token expired or invalid. Please log in again.",
      });
    }

    req.user = verify;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({
      success: false,
      msg: "An error occurred. Please log in.",
    });
  }
};
