import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import env from "dotenv";
env.config();

const prisma = new PrismaClient();

export const authorizeRole = (requiredRoles) => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Access token required" });
      }

      const decoded = jwt.verify(token, process.env.API_SECRET);
      const user = await prisma.users.findUnique({
        where: { iduser: decoded.id },
        include: { user_type: true },
      });

      if (!user || !requiredRoles.includes(user.user_type.name_type)) {
        return res.status(403).json({ message: "Access denied" });
      }

      req.user = user;
      next();
    } catch (error) {
      res.status(403).json({ message: "Forbidden" });
    }
  };
};

