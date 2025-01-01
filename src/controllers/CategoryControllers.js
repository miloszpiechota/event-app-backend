import { response, request, query } from "express"
import jwt from "jsonwebtoken"
import bcryptjs from "bcryptjs"
import env from "dotenv"
import cryptoJs from "crypto-js"
import { CategoryModels } from "../models/Models"
env.config()

const salt = bcryptjs.genSaltSync(10)


export const CategoryRead = async (req = request, res = response) =>{
    try {
        const categories = await CategoryModels.findMany();

        return res.status(200).json({
            success: true,
            msg: "Categories read",
            data: categories,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error",
            error: error.message,
        });
    }
};

// get a single category
export const CategoryReadById = async (req = request, res = response) =>{
    const { id } = req.params;
    // Sprawdzenie, czy id jest liczbą
    const categoryId = parseInt(id);
    if (isNaN(categoryId)) {
        return res.status(400).json({ success: false, error: "Invalid category ID" });
    }
    try {
        const category = await CategoryModels.findUnique({
            where: {
                idevent_category: categoryId,  
            },
        });
        if (!category) {
            return res.status(404).json({ success: false, error: "Category not found" });
        }
        res.status(200).json({ success: true, data: { category_type: category.category_type } });  // Zwraca `category_type`
    } catch (error) {
        res.status(500).json({ success: false, error: "Internal server error" });
    }
};






