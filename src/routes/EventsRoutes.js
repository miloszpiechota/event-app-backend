import express from "express"
import { GetEventsByDateRange, EventReadIdCity, EventCreate, EventRead, EventUpdate, EventDelete, EventSearch} from "../controllers/EventsControllers"
const event_controllers = express.Router()
import { authCheck } from "../middlewares/AuthCheck"
import { checkPermission } from "../middlewares/rbacMiddleware"; // Adjust the path as necessary


//      CREATE EVENT ROUTES
//event_controllers.post("/create", authCheck, checkPermission('events', 'create'), EventCreate)
event_controllers.post("/create", EventCreate)
event_controllers.put("/update/:id",authCheck, checkPermission('events', 'update'), EventUpdate)
event_controllers.delete("/delete/:id",authCheck, checkPermission('events', 'delete'), EventDelete)
event_controllers.get("/read", EventRead)
event_controllers.get("/read/:id", EventRead);
event_controllers.get("/search", EventSearch);
event_controllers.get("/read/city/:idCity", EventReadIdCity);
event_controllers.get("/dates", GetEventsByDateRange);

export default event_controllers 