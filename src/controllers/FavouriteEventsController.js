import { response, request } from "express";
import { PrismaClient } from "@prisma/client";
import env from "dotenv";

env.config();

const prisma = new PrismaClient(); // Initialize Prisma Client

// CREATE Favourite Event
export const FavouriteEventCreate = async (req = request, res = response) => {
    try {
        const { idevent, iduser } = req.body;

        const newFavouriteEvent = await prisma.favourite_events.create({
            data: {
                idevent,
                iduser
            }
        });

        return res.status(201).json({
            success: true,
            msg: "Favourite event added",
            data: newFavouriteEvent,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error",
            error: error.message,
        });
    }
};

// READ Favourite Events
export const FavouriteEventRead = async (req = request, res = response) => {
    try {
        const favouriteEvents = await prisma.favourite_events.findMany(); // Fetch all Favourite Events
        return res.status(200).json({
            success: true,
            msg: "Favourite events retrieved",
            data: favouriteEvents,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error",
            error: error.message,
        });
    }
};

// UPDATE Favourite Event
export const FavouriteEventUpdate = async (req = request, res = response) => {
    try {
        const { idevent, iduser } = req.body;
        const { idfavourite_event } = req.params;

        const updatedFavouriteEvent = await prisma.favourite_events.update({
            where: {
                idfavourite_event: parseInt(idfavourite_event),
            },
            data: {
                idevent,
                iduser
            },
        });

        return res.status(200).json({
            success: true,
            msg: "Favourite event updated",
            data: updatedFavouriteEvent,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error",
            error: error.message,
        });
    }
};

// DELETE Favourite Event
export const FavouriteEventDelete = async (req = request, res = response) => {
    try {
        const { idfavourite_event } = req.params;

        const favouriteEvent = await prisma.favourite_events.findUnique({
            where: {
                idfavourite_event: parseInt(idfavourite_event),
            }
        });

        if (!favouriteEvent) {
            return res.status(404).json({
                success: false,
                message: 'Favourite event not found!',
            });
        }

        const deletedFavouriteEvent = await prisma.favourite_events.delete({
            where: {
                idfavourite_event: parseInt(idfavourite_event),
            },
        });

        res.status(200).json({
            success: true,
            msg: "Favourite event deleted",
            data: deletedFavouriteEvent,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};
