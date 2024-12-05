import express from "express"
import cities_routes from "./CitiesRoutes"; 
import comments_routes from "./CommentsRoutes"
import category_routes from "./CategoryRoutes";
import event_locations_routes from "./EventLocationRoutes";
import event_ticket_routes from "./EventTicketRoutes";
import events_routes from "./EventsRoutes"
import orderRouter from "./OrderRoutes"; 
import paymentmethod_routes from "./PaymentMethodRoutes"
import status_routes from "./StatusRoutes";
import users_routes from "./UsersRoutes"
import rbac_routes from "./RBAC";

const router = express.Router();

router.use("/cities", cities_routes);
router.use("/comments", comments_routes);
router.use("/categories", category_routes);
router.use("/locations", event_locations_routes);
router.use("/event_tickets", event_ticket_routes);
router.use("/events", events_routes)
router.use("/orders", orderRouter);
router.use("/payment", paymentmethod_routes);
router.use("/status", status_routes);
router.use("/users", users_routes)
router.use("/rbac", rbac_routes);

export default router;