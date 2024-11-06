import express from "express";
import { UserTypeCreate, UserTypeRead, UserTypeUpdate, UserTypeDelete } from "../controllers/UserTypesController";

const user_types_controllers = express.Router();

// CREATE User Type
user_types_controllers.post("/create", UserTypeCreate);
// READ User Types
user_types_controllers.get("/read", UserTypeRead);
// UPDATE User Type
user_types_controllers.put("/update/:iduser_type", UserTypeUpdate);
// DELETE User Type
user_types_controllers.delete("/delete/:iduser_type", UserTypeDelete);

export default user_types_controllers;
