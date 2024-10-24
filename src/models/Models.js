import { PrismaClient } from "@prisma/client"

export const UsersModels = new PrismaClient().users
export const EventsModels = new PrismaClient().events
export const PaymentMethodModels = new PrismaClient().payment_methods