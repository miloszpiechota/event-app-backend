import { PrismaClient } from "@prisma/client"

export const CitiesModels = new PrismaClient().cities
export const CommentsModels = new PrismaClient().comments
export const CategoryModels = new PrismaClient().event_categories
export const EventLocationsModels = new PrismaClient().event_locations
export const EventTicketsModels = new PrismaClient().event_tickets
export const EventsModels = new PrismaClient().events
export const OrderTicketModels = new PrismaClient().order_tickets
export const OrdersModelss = new PrismaClient().orders
export const PaymentMethodModels = new PrismaClient().payment_methods
export const StatusModels = new PrismaClient().status_type
export const UserTypesModels = new PrismaClient().user_types
export const UsersModels = new PrismaClient().users




