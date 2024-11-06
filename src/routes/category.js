// routes/category.js
import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// Get all categories
router.get("/read", async (req, res) => {
    console.log("Fetching categories...");
    try {
        const categories = await prisma.event_categories.findMany();
        console.log("Categories found:", categories);
        res.status(200).json(categories);
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
