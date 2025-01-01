import express from "express";
import { StatusReadById, StatusReadAll} from "../controllers/StatusControllers";

const status_routes = express.Router();


// Status routes
status_routes.get("/read/:id", StatusReadById);
status_routes.get("/read", StatusReadAll);

export default status_routes
