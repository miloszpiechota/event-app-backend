// routes/category.js
import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// Get all categories
router.get("/read", async (req, res) => {
    //console.log("Fetching categories...");
    try {
        const categories = await prisma.event_categories.findMany();
        //console.log("Categories found:", categories);
        res.status(200).json(categories);
    } catch (error) {
       // console.error("Error fetching categories:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});


// get a single category
router.get("/read/:id", async (req, res) => {
    //console.log("Fetching category...");
    const { id } = req.params;

    // Sprawdzenie, czy id jest liczbą
    const categoryId = parseInt(id);
    if (isNaN(categoryId)) {
        //console.error("Invalid category ID");
        return res.status(400).json({ success: false, error: "Invalid category ID" });
    }

    try {
        const category = await prisma.event_categories.findUnique({
            where: {
                idevent_category: categoryId,  // Wyszukuje po `idevent_category`
            },
        });

        if (!category) {
            //console.log("Category not found");
            return res.status(404).json({ success: false, error: "Category not found" });
        }

        //console.log("Category found:", category);
        res.status(200).json({ success: true, data: { category_type: category.category_type } });  // Zwraca `category_type`
    } catch (error) {
        //console.error("Error fetching category:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});

export default router;




