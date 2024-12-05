import express from "express";
import { authCheck } from "../middlewares/AuthCheck"; // Import your auth middleware
const checkPrivilege = require('../middlewares/checkPrivilege');
import { GetEventsByDateRange, EventReadIdCity, EventCreate, EventRead, EventUpdate, EventDelete, EventSearch} from "../controllers/EventsControllers"

const rbac_routes = express.Router();


// rbac_routes.get("/checkPrivliges/:privlige", authCheck,console.log("test") , checkPrivilege);
rbac_routes.get("/auth/", authCheck);
rbac_routes.get("/checkPrivliges/:privilege", authCheck, (req, res, next) => {
    console.log("test");  // Teraz to będzie middleware, który wykona logowanie
    next();  // Ważne, aby kontynuować do następnego middleware
}, checkPrivilege);

export default rbac_routes