import { PrismaClient } from "@prisma/client"

export const UsersModels = new PrismaClient().Users
export const BiodataModels = new PrismaClient().biodata
export const AvatarModels = new PrismaClient().avatar