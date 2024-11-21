import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

//Get all cities
// router.get("/read", async (req, res) => {
//     console.log("Fetching cities...");
//     try {
//         const cities = await prisma.cities.findMany({
//             include: {
//                 country: true, // Opcjonalnie, jeśli chcesz dołączyć informacje o kraju
//             },
//         });
//         console.log("Cities found:", cities);
//         res.status(200).json(cities);
//     } catch (error) {
//         console.error("Error fetching cities:", error);
//         res.status(500).json({ success: false, error: error.message });
//     }
// });

router.get("/read", async (req, res) => {
    //console.log("Fetching cities...");
    try {
        const cities = await prisma.cities.findMany({
            include: {
                country: true, // Opcjonalnie, jeśli chcesz dołączyć informacje o kraju
            },
        });

        return res.status(200).json({
            success: true,
            msg: "Cities read",
            data: cities,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error",
            error: error.message,
        });
    }
});

// Get city by ID
// router.get("/read/:id", async (req, res) => {
//     const { id } = req.params;
//     console.log("Fetching city with ID:", id);
//     try {
//         const city = await prisma.cities.findUnique({
//             where: {
//                 idcity: parseInt(id),
//             },
//             include: {
//                 country: true, // Opcjonalnie, jeśli chcesz dołączyć informacje o kraju
//             },
//         });
//         console.log("City found:", city);
//         res.status(200).json(city);
//     } catch (error) {
//         console.error("Error fetching city:", error);
//         res.status(500).json({ success: false, error: error.message });
//     }
// });

router.get("/read/:id", async (req, res) => {
    const { id } = req.params;
    console.log("Fetching city with ID:", id);
    try {
        const city = await prisma.cities.findUnique({
            where: {
                idcity: parseInt(id),
            },
        });

        return res.status(200).json({
            success: true,
            msg: "City read",
            data: city,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error",
            error: error.message,
        });
    }
});
export default router;
