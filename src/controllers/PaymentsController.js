import { response, request } from "express";
import { PrismaClient } from "@prisma/client"; // Import PrismaClient
import env from "dotenv";

env.config();

const prisma = new PrismaClient(); // Initialize Prisma Client

// CREATE Payment
export const PaymentCreate = async (req = request, res = response) => {
    try {
        // Logujemy dane wejściowe z żądania
        console.log("PaymentCreate - Request body:", req.body);

        const { idorder, idpayment_method, payment_status } = req.body;

        // Sprawdzamy, czy wymagane pola są obecne
        if (!idorder || !idpayment_method || !payment_status) {
            console.warn("PaymentCreate - Missing required fields", {
                idorder,
                idpayment_method,
                payment_status,
            });
            return res.status(400).json({
                success: false,
                msg: "Missing required fields",
            });
        }

        // Logujemy dane przed zapisaniem
        console.log("PaymentCreate - Data to save:", {
            idorder,
            idpayment_method,
            payment_status,
        });

        // Tworzymy nową płatność w bazie danych
        const newPayment = await prisma.payments.create({
            data: {
                idorder,
                idpayment_method,
                payment_status,
            },
        });

        // Logujemy pomyślną odpowiedź
        console.log("PaymentCreate - Payment created:", newPayment);

        return res.status(201).json({
            success: true,
            msg: "Payment created",
            data: newPayment,
        });
    } catch (error) {
        // Logujemy szczegóły błędu
        console.error("PaymentCreate - Error:", {
            message: error.message,
            stack: error.stack,
        });

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
