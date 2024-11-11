import express from "express"
import {PaymentMethodCreate, PaymentMethodRead, PaymentMethodReadById, PaymentMethodUpdate, PaymentMethodDelete} from "../controllers/PaymentMethodControllers"
const paymentmethod_controllers = express.Router()

//      CREATE PAYMENT ROUTES
paymentmethod_controllers.post("/create", PaymentMethodCreate)
paymentmethod_controllers.get("/read", PaymentMethodRead)
paymentmethod_controllers.get("/read/:id", PaymentMethodReadById)
paymentmethod_controllers.put("/update/:id", PaymentMethodUpdate)
paymentmethod_controllers.delete("/delete/:id", PaymentMethodDelete)

export default paymentmethod_controllers