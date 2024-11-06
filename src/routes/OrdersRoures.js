import express from "express";
import { OrderCreate, OrderRead, OrderUpdate, OrderDelete } from "../controllers/OrdersController";

const orders_controllers = express.Router();

// CREATE Order
orders_controllers.post("/create", OrderCreate);
// READ Orders
orders_controllers.get("/read", OrderRead);
// UPDATE Order
orders_controllers.put("/update/:idorder", OrderUpdate);
// DELETE Order
orders_controllers.delete("/delete/:idorder", OrderDelete);

export default orders_controllers;
