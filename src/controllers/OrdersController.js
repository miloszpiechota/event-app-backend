import { response, request } from "express";
import { PrismaClient } from "@prisma/client"; // Import PrismaClient
import env from "dotenv";

env.config();

const prisma = new PrismaClient(); // Initialize Prisma Client

// CREATE Order
export const OrderCreate = async (req = request, res = response) => {
    try {
        const { data, total_amount, total_tax_amount, iduser } = req.body;

        const newOrder = await prisma.orders.create({
            data: {
                data: new Date(data),
                total_amount,
                total_tax_amount,
                iduser
            }
        });

        return res.status(201).json({
            success: true,
            msg: "Order created",
            data: newOrder,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error",
            error: error.message,
        });
    }
};

// READ Orders
export const OrderRead = async (req = request, res = response) => {
    try {
        const orders = await prisma.orders.findMany(); // Use `prisma.orders.findMany`
        return res.status(200).json({
            success: true,
            msg: "Orders retrieved",
            data: orders,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error",
            error: error.message,
        });
    }
};

// UPDATE Order
export const OrderUpdate = async (req = request, res = response) => {
    try {
        const { data, total_amount, total_tax_amount, iduser } = req.body;
        const { idorder } = req.params;

        const updatedOrder = await prisma.orders.update({
            where: {
                idorder: parseInt(idorder),
            },
            data: {
                data: new Date(data),
                total_amount,
                total_tax_amount,
                iduser,
            },
        });

        return res.status(200).json({
            success: true,
            msg: "Order updated",
            data: updatedOrder,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error",
            error: error.message,
        });
    }
};

// DELETE Order
export const OrderDelete = async (req = request, res = response) => {
    try {
        const { idorder } = req.params;

        const order = await prisma.orders.findUnique({
            where: {
                idorder: parseInt(idorder),
            }
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found!',
            });
        }

        const deletedOrder = await prisma.orders.delete({
            where: {
                idorder: parseInt(idorder),
            },
        });

        res.status(200).json({
            success: true,
            msg: "Order deleted",
            data: deletedOrder,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};
