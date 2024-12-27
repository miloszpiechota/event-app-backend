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
const checkPermission = require('../middlewares/checkPermission');
import { UserTypesModels } from "../models/Models";

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
users_controllers.post("/read", authCheck, checkPermission('users', 'read'), UsersRead); 
users_controllers.post("/read/:id", authCheck, checkPermission('users', 'read_self'), UserRead);
users_controllers.post("/admin/read/:id", authCheck, checkPermission('users', 'read'), UserRead);

users_controllers.put("/update/:id", authCheck, checkPermission('users', 'update_self'), UsersUpdate);
users_controllers.delete("/delete/:id", authCheck, checkPermission('users', 'delete'), UsersDelete);




users_controllers.get("/auth", authCheck, UserAuth);

users_controllers.get("/types/read", authCheck, async (req, res) =>{
  try {
    const user_types = await UserTypesModels.findMany();

    if (!user_types) {
       
        return res.status(404).json({ success: false, error: "user_types not found" });
    }

   
    res.status(200).json({ success: true, data: { user_types: user_types } });  
} catch (error) {
  
    res.status(500).json({ success: false, error: "Internal server error" });
}
})
export default users_controllers;
