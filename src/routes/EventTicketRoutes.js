import express from "express"
import {EventTicketRead, EventTicketReadById } from "../controllers/EventTicketControllers"
const event_ticket_routes = express.Router()
import { authCheck } from "../middlewares/AuthCheck"
const checkPermission = require('../middlewares/checkPermission');

event_ticket_routes.get("/read", EventTicketRead)
event_ticket_routes.get("/read/:id", EventTicketReadById)

export default event_ticket_routes
