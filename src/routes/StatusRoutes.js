import express from "express";
import { StatusReadById, StatusReadAll} from "../controllers/StatusControllers";

const status_controllers = express.Router();


// Status routes
status_controllers.get("/read/:id", StatusReadById);
status_controllers.get("/read", StatusReadAll);

export default status_controllers
