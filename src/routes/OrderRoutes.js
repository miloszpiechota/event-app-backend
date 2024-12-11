// OrderRoutes.js
import express from "express";
import { createOrder, readUserOrders, readOrders, readUserOrder } from "../controllers/OrderControllers"; // Adjust the path accordingly
import { authCheck } from "../middlewares/AuthCheck"; // Ensure the user is authenticated
const checkPermission = require('../middlewares/checkPermission');
const orderRouter = express.Router();

// POST route for creating an orders
orderRouter.post("/", authCheck, createOrder);
orderRouter.get("/read/user/:iduser", authCheck, checkPermission("orders", "read_self"), readUserOrders);
orderRouter.get("/read/:idorder", authCheck, checkPermission("orders", "read_self"), readUserOrder);
orderRouter.get("/read", authCheck, checkPermission("orders", "read"), readOrders)
export default orderRouter;
