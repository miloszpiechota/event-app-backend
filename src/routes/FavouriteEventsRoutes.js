import express from "express";
import { FavouriteEventCreate, FavouriteEventRead, FavouriteEventUpdate, FavouriteEventDelete } from "../controllers/FavouriteEventsController";

const favourite_events_controllers = express.Router();

// CREATE Favourite Event
favourite_events_controllers.post("/create", FavouriteEventCreate);
// READ Favourite Events
favourite_events_controllers.get("/read", FavouriteEventRead);
// UPDATE Favourite Event
favourite_events_controllers.put("/update/:idfavourite_event", FavouriteEventUpdate);
// DELETE Favourite Event
favourite_events_controllers.delete("/delete/:idfavourite_event", FavouriteEventDelete);

export default favourite_events_controllers;
