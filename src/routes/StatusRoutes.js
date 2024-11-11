import express from "express";
import { StatusReadById} from "../controllers/StatusControllers";

const status_controllers = express.Router();


// Status routes
status_controllers.get("/read/:id", StatusReadById);

export default status_controllers
