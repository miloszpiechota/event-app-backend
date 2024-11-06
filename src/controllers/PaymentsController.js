import { response, request } from "express";
import { PrismaClient } from "@prisma/client"; // Import PrismaClient
import env from "dotenv";

env.config();

const prisma = new PrismaClient(); // Initialize Prisma Client

// CREATE Payment
export const PaymentCreate = async (req = request, res = response) => {
    try {
        const { idorder, idpayment_method, payment_status } = req.body;

        const newPayment = await prisma.payments.create({
            data: {
                idorder,
                idpayment_method,
                payment_status
            }
        });

        return res.status(201).json({
            success: true,
            msg: "Payment created",
            data: newPayment,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error",
            error: error.message,
        });
    }
};

// READ Payments
export const PaymentRead = async (req = request, res = response) => {
    try {
        const payments = await prisma.payments.findMany(); // Fetch all Payments
        return res.status(200).json({
            success: true,
            msg: "Payments retrieved",
            data: payments,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error",
            error: error.message,
        });
    }
};

// UPDATE Payment
export const PaymentUpdate = async (req = request, res = response) => {
    try {
        const { idorder, idpayment_method, payment_status } = req.body;
        const { idpayment } = req.params;

        const updatedPayment = await prisma.payments.update({
            where: {
                idpayment: parseInt(idpayment),
            },
            data: {
                idorder,
                idpayment_method,
                payment_status,
            },
        });

        return res.status(200).json({
            success: true,
            msg: "Payment updated",
            data: updatedPayment,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error",
            error: error.message,
        });
    }
};

// DELETE Payment
export const PaymentDelete = async (req = request, res = response) => {
    try {
        const { idpayment } = req.params;

        const payment = await prisma.payments.findUnique({
            where: {
                idpayment: parseInt(idpayment),
            }
        });

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found!',
            });
        }

        const deletedPayment = await prisma.payments.delete({
            where: {
                idpayment: parseInt(idpayment),
            },
        });

        res.status(200).json({
            success: true,
            msg: "Payment deleted",
            data: deletedPayment,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};
