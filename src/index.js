import express from "express"
import cors from "cors"
import env from "dotenv"
import path from "path"
import helmet from "helmet"
import "core-js/stable/atob";

env.config()
require('dotenv').config();

const app = express()
const PORT = process.env.PORT;
import users_controllers from "./routes/UsersRoutes"
import paymentmethod_controllers from "./routes/PaymentMethodRoutes"
import comments_controllers  from "./routes/CommentsRoutes"
import events_controllers from "./routes/EventsRoutes"
import { rateLimit } from "express-rate-limit"

import orders_controllers from "./routes/OrdersRoures"
import order_tickets_controllers from "./routes/OrderTicketsRoutes"
import payments_controllers from "./routes/PaymentsRoutes"
import favourite_events_controllers from "./routes/FavouriteEventsRoutes"
import user_types_controllers from "./routes/UserTypesRoutes"

import categoryRoutes from "./routes/category";
import CitiesRoutes from "./routes/CitiesRoutes"; 
import LocationsRoutes from "./routes/LocationsRoutes";
import EventTickets from "./routes/EventTicketRoutes";
import usersRouter from "./routes/UsersRoutes";
import orderRouter from "./routes/OrderRoutes"; 
import router from "./routes/EventTicketRoutes";
import SendTicketInfo from "./routes/SendTicketInfo";
import { authorizeRole } from "./middlewares/roleMiddleware";
// RATE LIMIT, THE PROCESS OF LIMITING THE NUMBER OF USER/CLIENT REQUSET ON CERTAIN RESOURCES
const limiter = rateLimit({
 windowMs: 15 * 60 * 1000, //15 minutes
 max: 200,
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
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend URL
  credentials: true,  // Allow sending credentials like cookies or Authorization headers
}));

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
app.use("/api/order_tickets", order_tickets_controllers);
app.use("/api/payments", payments_controllers);
app.use("/api/favourite_events", favourite_events_controllers);
app.use("/api/user_types", user_types_controllers);

app.use("/api/categories", categoryRoutes);
app.use("/api/cities", CitiesRoutes);
app.use("/api/locations", LocationsRoutes);
app.use("/api/event_tickets", EventTickets);
app.use("/api/users", usersRouter);
app.use("/api/orders", orderRouter);
app.use("/api/send-ticket-info", SendTicketInfo)

//  LISTENER
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is up and running on port ${PORT}`);
});
