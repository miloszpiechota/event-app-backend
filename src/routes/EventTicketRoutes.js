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


//for webapp (read event ticket by id)
router.get("/read/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Pobranie danych z tabeli event
        const event = await prisma.events.findUnique({
            where: {
                idevent: parseInt(id),
            },
        });

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found.",
            });
        }

        // Pobranie biletów dla tego wydarzenia, jeśli istnieją
        const eventTickets = await prisma.event_tickets.findMany({
            where: {
                idevent: parseInt(id),
            },
        });

        // Sprawdzenie, czy istnieją bilety, i zwrócenie odpowiednich danych
        if (eventTickets.length === 0) {
            return res.status(200).json({
                is_seat_categorized: event.is_seat_categorized,
                price: null, // Brak biletów
            });
        }

        // Jeśli istnieją bilety, zwrócenie ceny pierwszego biletu (lub odpowiedniej logiki)
        const price = eventTickets[0].price; // Możesz dostosować, co dokładnie chcesz zwrócić
        res.status(200).json({
            is_seat_categorized: event.is_seat_categorized,
            price: price,
        });

    } catch (error) {
        console.error("Error fetching event ticket and event data:", error);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});
export default router;
