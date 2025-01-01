import express from "express";
import { CitiesRead, CitiesReadById } from "../controllers/CitiesControllers";
const cities_routes = express.Router();

// CREATE CITIES ROUTES
cities_routes.get("/read", CitiesRead);
cities_routes.get("/read/:id", CitiesReadById);

export default cities_routes;

