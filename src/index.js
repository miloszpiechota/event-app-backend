import express from "express"
import cors from "cors"
import env from "dotenv"
import path from "path"
import helmet from "helmet"
env.config()
require('dotenv').config();

const app = express()
const PORT = process.env.PORT;
import users_controllers from "./routes/UsersRoutes"
import paymentmethod_controllers from "./routes/PaymentMethodRoutes"
import  comments_controllers  from "./routes/CommentsRoutes"
import events_controllers from "./routes/EventsRoutes"
import { rateLimit } from "express-rate-limit"
import orders_controllers from "./routes/OrdersRoures"

// RATE LIMIT, THE PROCESS OF LIMITING THE NUMBER OF USER/CLIENT REQUSET ON CERTAIN RESOURCES
const limiter = rateLimit({
 windowMs: 15 * 60 * 1000, //15 minutes
 max: 100,
 standardHeaders: true,
 legacyHeaders: false,
 message: "Too much pressing the screen please wait a while longer !!",
})

//  MIDDLEWARE
app.use((req, res, next) => {
 // WEBSITE YOU WISH TO ALLOW TO CONNECT
 req.headers["Access-control-allow-origin"] = "*"

 // REQUEST METHOD YOU WISH TO ALLOW
 req.headers["Access-control-allow-methods"] = "GET, POST, PUT, DELETE, OPTIONS, PATCH"

 // REQUEST HEADERS YOU WISH TO ALLOW
 req.headers["Access-control-allow-headers"] = "Content-Type, Authorization"

 // PASS TO NEXT LAYER OF MIDDLEWARE
 next()
})

app.use(
 cors({
  origin: "*",
 })
)

app.use(
 helmet({
  crossOriginResourcePolicy: false,
 })
)

app.use(limiter)
app.use(express.json({ limit: "100mb" }))
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, "../static")))

//  ROUTES
app.use("/api", users_controllers)
app.use("/api/payment", paymentmethod_controllers);
app.use("/api/comments", comments_controllers);
app.use("/api/users", users_controllers)
app.use("/api/events", events_controllers)
app.use("/api/orders",orders_controllers)

//  LISTENER
app.listen(PORT, () => {
    console.log(`Server is up and running on port ${PORT}`);
  });