// OrderRoutes.js
import express from "express";
import { createOrder } from "../controllers/OrderControllers"; // Adjust the path accordingly
import { authCheck } from "../middlewares/AuthCheck"; // Ensure the user is authenticated

const orderRouter = express.Router();

// POST route for creating an orders
orderRouter.post("/", authCheck, createOrder);

export default orderRouter;
