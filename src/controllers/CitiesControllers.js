import { response, request, query } from "express"
import jwt from "jsonwebtoken"
import bcryptjs from "bcryptjs"
import env from "dotenv"
import cryptoJs from "crypto-js"
import { CitiesModels } from "../models/Models"
env.config()
const salt = bcryptjs.genSaltSync(10)

// Read cities
export const CitiesRead = async (req = request, res = response) => {
    try {
        const cities = await CitiesModels.findMany({
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
};

// Read cities by id
export const CitiesReadById = async (req = request, res = response) =>{
    const { id } = req.params;
    try {
        const city = await CitiesModels.findUnique({
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
};
