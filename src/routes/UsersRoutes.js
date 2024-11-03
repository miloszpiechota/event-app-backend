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
} from "../controllers/UsersControllers";
import { authCheck } from "../middlewares/AuthCheck"; // Import your auth middleware
import { checkPermission } from "../middlewares/rbacMiddleware"; // Adjust the path as necessary

const users_controllers = express.Router();

const LimitLogin = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Pressing the screen too much, please wait a little longer up to 15 minutes !!",
});

//  Apply authCheck middleware to all routes that require authentication
users_controllers.post("/create", UsersCreate);
users_controllers.post("/login", UsersLogin, LimitLogin);

// Protect the following routes with authCheck middleware
users_controllers.post("/read", authCheck, checkPermission('users', 'read'), UsersRead); // Read all users
users_controllers.post("/read/:id", authCheck, checkPermission('users', 'read_self'), UserRead); // Read specific user
users_controllers.post("/admin/read/:id", authCheck, checkPermission('users', 'read'), UserRead); // Read specific user

users_controllers.put("/update/:id", authCheck, checkPermission('users', 'update_self'), UsersUpdate);
users_controllers.delete("/delete/:id", authCheck, checkPermission('users', 'delete'), UsersDelete);
users_controllers.get("/auth", authCheck, UserAuth);

// Sample hello world route
users_controllers.get("/hello", authCheck, (req, res) => {
  res.send("Hello World");
});

// Sample lorem route
users_controllers.get("/lorem", authCheck, (req, res) => {
  res.send("Lorem ipsum dolor sit amet...");
});

export default users_controllers;
