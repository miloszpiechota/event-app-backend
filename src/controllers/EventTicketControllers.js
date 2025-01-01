import { response, request, query } from "express";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import env from "dotenv";
import cryptoJs from "crypto-js";
import { EventTicketsModels, EventsModels } from "../models/Models";
env.config();
const salt = bcryptjs.genSaltSync(10);

// Get all categories

export const EventTicketRead = async (req = request, res = response) =>{
    //console.log("Fetching event tickets...");
    try {
        const event_tickets = await EventTicketsModels.findMany();
        //console.log("Event tickets found:", event_tickets);
        res.status(200).json(event_tickets);
    } catch (error) {
        //console.error("Error fetching event tickets:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};


export const EventTicketReadById = async (req = request, res = response) => {
    try {
        const { id } = req.params;

        // Pobranie danych z tabeli event
        const event = await EventsModels.findUnique({
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
        const eventTickets = await EventTicketsModels.findMany({
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
};

