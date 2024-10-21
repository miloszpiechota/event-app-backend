import express from "express"
import { EventCreate, EventRead, EventUpdate, EventDelete} from "../controllers/EventsControllers"
const event_controllers = express.Router()

//      CREATE EVENT ROUTES
event_controllers.post("/create", EventCreate)
event_controllers.get("/read", EventRead)
event_controllers.put("/update/:id", EventUpdate)
event_controllers.delete("/delete/:id", EventDelete)


export default event_controllers 