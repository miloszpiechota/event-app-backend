import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// Get all cities
router.get("/read", async (req, res) => {
    //console.log("Fetching cities...");
    try {
        const cities = await prisma.cities.findMany({
            include: {
                country: true, // Opcjonalnie, jeśli chcesz dołączyć informacje o kraju
            },
        });
        //console.log("Cities found:", cities);
        res.status(200).json(cities);
    } catch (error) {
        //console.error("Error fetching cities:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
