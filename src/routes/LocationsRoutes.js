// LocationsRoutes.js
import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.get("/read", async (req, res) => {
    console.log("Fetching locations...");
    try {
        // Pobieramy lokalizacje wraz z miastami i krajami
        const event_locations = await prisma.event_locations.findMany({
            include: {
                city: {
                    include: {
                        country: true // Dołączamy kraj
                    }
                }
            }
        });

        console.log("event_locations found:", event_locations);
        res.status(200).json(event_locations);
    } catch (error) {
        console.error("Error fetching event_locations:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
