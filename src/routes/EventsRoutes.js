import express from "express"
import { GetEventsByDateRange, EventReadIdCity, EventCreate, EventRead, EventUpdate, EventDelete, EventSearch, EventReadDetails} from "../controllers/EventsControllers"
const event_routes = express.Router()
import { authCheck } from "../middlewares/AuthCheck"
const checkPermission = require('../middlewares/checkPermission');



//      CREATE EVENT ROUTES
//event_routes.post("/create", authCheck, checkPermission('events', 'create'), EventCreate)
event_routes.post("/create", EventCreate)
event_routes.put("/update/:id",authCheck, checkPermission('events', 'update'), EventUpdate)
event_routes.delete("/delete/:id",authCheck, checkPermission('events', 'delete'), EventDelete)
event_routes.get("/read", EventRead)
event_routes.get("/read/:id", EventRead);
event_routes.get("/readDetails/:id", EventReadDetails);

event_routes.get("/search", EventSearch);
event_routes.get("/read/city/:idCity", EventReadIdCity);
event_routes.get("/dates", GetEventsByDateRange);

export default event_routes 