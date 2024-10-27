import jwt from "jsonwebtoken";
import env from "dotenv";
import cryptoJs from "crypto-js";
env.config();



// const userTypeCheck = (requiredType) => (req, res, next) => {
//   authCheck(req, res, () => {
//       if (req.user.iduser_type !== requiredType) {
//           res.status(403).json({
//               success: false,
//               msg: "Access Denied",
//           });
//           return;
//       }
//       next();
//   });
// };
export const authCheck = async (req = request, res = response, next) => {
  try {
    const token = await req.headers["authorization"];

    if (!token) {
      res.status(401).json({
        success: false,
        msg: "Login first to get tokens ?",
      });
      return;
    }

    const decToken = await cryptoJs.AES.decrypt(
      token.split(" ")[1],
      process.env.API_SECRET
    ).toString(cryptoJs.enc.Utf8);

    const verify = await jwt.verify(decToken, process.env.API_SECRET);

    if (!verify) {
      res.status(401).json({
        success: false,
        msg: "Login first to get tokens ?",
      });
      return;
    }

    if (verify.exp < Date.now() / 1000) {
      res.status(401).json({
        success: false,
        msg: "Token Expirited",
      });
      return;
    }
    req.user = verify;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      msg: "Login first to get tokens ?",
    });
  }
};
// export const userTypeCheckMiddleware = userTypeCheck(TypeUser);
// export const adminTypeCheckMiddleware = userTypeCheck(TypeAdmin);
// export const eventsCreatorTypeCheckMiddleware = userTypeCheck(TypeEventsCreator);
// export const eventsTicketValidatorTypeCheckMiddleware = userTypeCheck(TypeEventsTicketValidator);
// export const moderatorTypeCheckMiddleware = userTypeCheck(TypeModerator);