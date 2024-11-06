import { response, request } from "express";
import { PrismaClient } from "@prisma/client"; // Import PrismaClient
import env from "dotenv";

env.config();

const prisma = new PrismaClient(); // Initialize Prisma Client

// CREATE Order_ticket
export const OrderTicketCreate = async (req = request, res = response) => {
    try {
        const { idevent_ticket, idorder, ticket_status } = req.body;

        const newOrderTicket = await prisma.order_tickets.create({
            data: {
                idevent_ticket,
                idorder,
                ticket_status
            }
        });

        return res.status(201).json({
            success: true,
            msg: "Order ticket created",
            data: newOrderTicket,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error",
            error: error.message,
        });
    }
};

// READ Order_tickets
export const OrderTicketRead = async (req = request, res = response) => {
    try {
        const orderTickets = await prisma.order_tickets.findMany(); // Fetch all Order_tickets
        return res.status(200).json({
            success: true,
            msg: "Order tickets retrieved",
            data: orderTickets,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error",
            error: error.message,
        });
    }
};

// UPDATE Order_ticket
export const OrderTicketUpdate = async (req = request, res = response) => {
    try {
        const { idevent_ticket, idorder, ticket_status } = req.body;
        const { idorder_ticket } = req.params;

        const updatedOrderTicket = await prisma.order_tickets.update({
            where: {
                idorder_ticket: parseInt(idorder_ticket),
            },
            data: {
                idevent_ticket,
                idorder,
                ticket_status,
            },
        });

        return res.status(200).json({
            success: true,
            msg: "Order ticket updated",
            data: updatedOrderTicket,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error",
            error: error.message,
        });
    }
};

// DELETE Order_ticket
export const OrderTicketDelete = async (req = request, res = response) => {
    try {
        const { idorder_ticket } = req.params;

        const orderTicket = await prisma.order_tickets.findUnique({
            where: {
                idorder_ticket: parseInt(idorder_ticket),
            }
        });

        if (!orderTicket) {
            return res.status(404).json({
                success: false,
                message: 'Order ticket not found!',
            });
        }

        const deletedOrderTicket = await prisma.order_tickets.delete({
            where: {
                idorder_ticket: parseInt(idorder_ticket),
            },
        });

        res.status(200).json({
            success: true,
            msg: "Order ticket deleted",
            data: deletedOrderTicket,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};
