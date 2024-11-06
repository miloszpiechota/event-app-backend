import express from "express";
import { OrderTicketCreate, OrderTicketRead, OrderTicketUpdate, OrderTicketDelete } from "../controllers/OrderTicketsController";

const order_tickets_controllers = express.Router();

// CREATE Order_ticket
order_tickets_controllers.post("/create", OrderTicketCreate);
// READ Order_tickets
order_tickets_controllers.get("/read", OrderTicketRead);
// UPDATE Order_ticket
order_tickets_controllers.put("/update/:idorder_ticket", OrderTicketUpdate);
// DELETE Order_ticket
order_tickets_controllers.delete("/delete/:idorder_ticket", OrderTicketDelete);

export default order_tickets_controllers;
