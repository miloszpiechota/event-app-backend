import express from "express"
import { EventCreate, EventRead, EventUpdate, EventDelete} from "../controllers/EventsControllers"
const event_controllers = express.Router()
import { authCheck } from "../middlewares/AuthCheck"
import { checkPermission } from "../middlewares/rbacMiddleware"; // Adjust the path as necessary


//      CREATE EVENT ROUTES
event_controllers.post("/create",authCheck, checkPermission('events', 'create'), EventCreate)
event_controllers.get("/read",authCheck,checkPermission('events', 'read'), EventRead)
event_controllers.put("/update/:id",authCheck, checkPermission('events', 'update'), EventUpdate)
event_controllers.delete("/delete/:id",authCheck, checkPermission('events', 'delete'), EventDelete)
event_controllers.get("/read/:id", EventRead);

export default event_controllers 