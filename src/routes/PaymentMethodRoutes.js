import express from "express"
import {PaymentMethodCreate, PaymentMethodRead, PaymentMethodReadById, PaymentMethodUpdate, PaymentMethodDelete} from "../controllers/PaymentMethodControllers"
const paymentmethod_routes = express.Router()

//      CREATE PAYMENT ROUTES
paymentmethod_routes.post("/create", PaymentMethodCreate)
paymentmethod_routes.get("/read", PaymentMethodRead)
paymentmethod_routes.get("/read/:id", PaymentMethodReadById)
paymentmethod_routes.put("/update/:id", PaymentMethodUpdate)
paymentmethod_routes.delete("/delete/:id", PaymentMethodDelete)

export default paymentmethod_routes