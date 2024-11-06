import { response, request } from "express";
import { PrismaClient } from "@prisma/client";
import env from "dotenv";

env.config();

const prisma = new PrismaClient(); // Initialize Prisma Client

// CREATE User Type
export const UserTypeCreate = async (req = request, res = response) => {
    try {
        const { iduser_type, name_type } = req.body;

        const newUserType = await prisma.user_types.create({
            data: {
                iduser_type,
                name_type,
            },
        });

        return res.status(201).json({
            success: true,
            msg: "User type created",
            data: newUserType,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error",
            error: error.message,
        });
    }
};

// READ User Types
export const UserTypeRead = async (req = request, res = response) => {
    try {
        const userTypes = await prisma.user_types.findMany(); // Fetch all User Types
        return res.status(200).json({
            success: true,
            msg: "User types retrieved",
            data: userTypes,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error",
            error: error.message,
        });
    }
};

// UPDATE User Type
export const UserTypeUpdate = async (req = request, res = response) => {
    try {
        const { name_type } = req.body;
        const { iduser_type } = req.params;

        const updatedUserType = await prisma.user_types.update({
            where: {
                iduser_type: parseInt(iduser_type),
            },
            data: {
                name_type,
            },
        });

        return res.status(200).json({
            success: true,
            msg: "User type updated",
            data: updatedUserType,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error",
            error: error.message,
        });
    }
};

// DELETE User Type
export const UserTypeDelete = async (req = request, res = response) => {
    try {
        const { iduser_type } = req.params;

        const userType = await prisma.user_types.findUnique({
            where: {
                iduser_type: parseInt(iduser_type),
            }
        });

        if (!userType) {
            return res.status(404).json({
                success: false,
                message: 'User type not found!',
            });
        }

        const deletedUserType = await prisma.user_types.delete({
            where: {
                iduser_type: parseInt(iduser_type),
            },
        });

        res.status(200).json({
            success: true,
            msg: "User type deleted",
            data: deletedUserType,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};
