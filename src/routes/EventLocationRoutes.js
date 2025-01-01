import express from "express";
import {EventLocationRead, EventLocationReadById, EventLocationReadByName, EventLocationCreate} from "../controllers/EventLocationControllers";
const event_locations_routes = express.Router();

// CREATE COMMENTS ROUTES

event_locations_routes.get("/read", EventLocationRead);
event_locations_routes.get("/read/:id", EventLocationReadById);
event_locations_routes.get("/read-by-name", EventLocationReadByName);
event_locations_routes.post("/create", EventLocationCreate);

export default event_locations_routes;