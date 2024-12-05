import express from "express";
import { rateLimit } from "express-rate-limit";
import {
  UsersCreate,
  UsersRead,
  UserRead,
  UsersLogin,
  UsersUpdate,
  UsersDelete,
  UserAuth,
  UserTypesRead,
} from "../controllers/UsersControllers";
import { authCheck } from "../middlewares/AuthCheck"; // Import your auth middleware
const checkPermission = require('../middlewares/checkPermission');

const users_routes = express.Router();

const LimitLogin = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Pressing the screen too much, please wait a little longer up to 15 minutes !!",
});

//  Apply authCheck middleware to all routes that require authentication
users_routes.post("/create", UsersCreate);
users_routes.post("/login", UsersLogin, LimitLogin);

// Protect the following routes with authCheck middleware
users_routes.post("/read", authCheck, checkPermission('users', 'read'), UsersRead); // Read all users
users_routes.post("/read/:id", authCheck, checkPermission('users', 'read_self'), UserRead); // Read specific user
users_routes.post("/admin/read/:id", authCheck, checkPermission('users', 'read'), UserRead); // Read specific user
users_routes.put("/update/:id", authCheck, checkPermission('users', 'update_self'), UsersUpdate);
users_routes.delete("/delete/:id", authCheck, checkPermission('users', 'delete'), UsersDelete);
users_routes.get("/auth", authCheck, UserAuth);
users_routes.get("/types/read", authCheck, UserTypesRead)
export default users_routes;
