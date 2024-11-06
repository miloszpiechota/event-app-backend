import express from "express";
import { PaymentCreate, PaymentRead, PaymentUpdate, PaymentDelete } from "../controllers/PaymentsController";

const payments_controllers = express.Router();

// CREATE Payment
payments_controllers.post("/create", PaymentCreate);
// READ Payments
payments_controllers.get("/read", PaymentRead);
// UPDATE Payment
payments_controllers.put("/update/:idpayment", PaymentUpdate);
// DELETE Payment
payments_controllers.delete("/delete/:idpayment", PaymentDelete);

export default payments_controllers;
