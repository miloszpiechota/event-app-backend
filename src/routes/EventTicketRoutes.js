// routes/category.js
import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// Get all categories
router.get("/read", async (req, res) => {
    console.log("Fetching event tickets...");
    try {
        const event_tickets = await prisma.event_tickets.findMany();
        console.log("Event tickets found:", event_tickets);
        res.status(200).json(event_tickets);
    } catch (error) {
        console.error("Error fetching event tickets:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
