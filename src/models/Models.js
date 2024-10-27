import { PrismaClient } from "@prisma/client"

export const UsersModels = new PrismaClient().users
export const EventsModels = new PrismaClient().events
export const PaymentMethodModels = new PrismaClient().payment_methods
export const CommentsModels = new PrismaClient().comments
export const UserTypesModels = new PrismaClient().user_types